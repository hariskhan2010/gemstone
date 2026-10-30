-- Asian Gemstone redesign: database setup.
-- Run once in Supabase → SQL Editor. Safe to re-run.

-- 1. Contact messages ---------------------------------------------------------
-- Anyone can send a message. Nobody can read them through the public API;
-- read them in Supabase → Table Editor (or wire a database webhook to email you).
create table if not exists public.contact_messages (
  id         bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  name       text not null check (char_length(name) between 2 and 120),
  email      text not null check (char_length(email) between 5 and 254 and email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
  subject    text not null check (char_length(subject) between 1 and 160),
  message    text not null check (char_length(message) between 10 and 4000),
  user_id    uuid default auth.uid() references auth.users (id) on delete set null
);
alter table public.contact_messages enable row level security;

drop policy if exists "Anyone can send a contact message" on public.contact_messages;
create policy "Anyone can send a contact message"
  on public.contact_messages for insert
  to anon, authenticated
  with check (user_id is null or user_id = (select auth.uid()));
-- No select, update or delete policies: the API cannot read or change messages.

-- 2. Profiles -----------------------------------------------------------------
-- One row per account, created automatically at sign-up from the form's name and newsletter tick.
create table if not exists public.profiles (
  id               uuid primary key references auth.users (id) on delete cascade,
  full_name        text check (char_length(full_name) <= 120),
  marketing_opt_in boolean not null default false,
  created_at       timestamptz not null default now()
);
alter table public.profiles enable row level security;

drop policy if exists "Read own profile" on public.profiles;
create policy "Read own profile" on public.profiles for select to authenticated
  using ((select auth.uid()) = id);
drop policy if exists "Update own profile" on public.profiles;
create policy "Update own profile" on public.profiles for update to authenticated
  using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, marketing_opt_in)
  values (
    new.id,
    left(new.raw_user_meta_data ->> 'full_name', 120),
    coalesce((new.raw_user_meta_data ->> 'marketing_opt_in')::boolean, false)
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 3. Owner / admin ----------------------------------------------------------
-- Only addresses listed here (with a confirmed email) can use the admin panel.
-- IMPORTANT: create the owner account (sign up or Continue with Google) before going live.
create table if not exists public.admins (email text primary key);
alter table public.admins enable row level security;  -- no policies: invisible through the API
insert into public.admins (email) values ('asiangemstone@gmail.com') on conflict do nothing;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from auth.users u
    join public.admins a on lower(a.email) = lower(u.email)
    where u.id = auth.uid() and u.email_confirmed_at is not null
  );
$$;
grant execute on function public.is_admin() to anon, authenticated;

-- 4. Products ----------------------------------------------------------------
create table if not exists public.products (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  slug            text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name            text not null check (char_length(name) between 2 and 120),
  kind            text not null check (kind in ('gemstone', 'jewelry', 'carved')),
  status          text not null default 'published' check (status in ('published', 'hidden')),
  -- facts typed by the owner; the AI may only use these
  details         text not null default '' check (char_length(details) <= 6000),
  carat           numeric(8,2),
  origin          text,
  treatment       text,
  dimensions      text,
  price           numeric(12,2),
  currency        text not null default 'USD',
  -- AI-written (published automatically, editable in the admin panel)
  description     text,
  seo_title       text,
  seo_description text,
  keywords        text[] not null default '{}',
  ai_status       text not null default 'pending' check (ai_status in ('pending', 'working', 'done', 'failed', 'off')),
  ai_error        text,
  -- 3D
  model_kind      text not null default 'none' check (model_kind in ('gem', 'mesh', 'none')),
  gem_cut         text check (gem_cut in ('round', 'oval', 'emerald', 'emeraldLong', 'cushion')),
  gem_color       text check (gem_color ~ '^#[0-9a-fA-F]{6}$'),
  meshy_task_id   text,
  model_path      text,
  model_status    text not null default 'none' check (model_status in ('none', 'working', 'done', 'failed'))
);
alter table public.products enable row level security;
drop policy if exists "Published products are public" on public.products;
create policy "Published products are public" on public.products for select to anon, authenticated using (status = 'published' or public.is_admin());
drop policy if exists "Admin manages products" on public.products;
create policy "Admin manages products" on public.products for all to authenticated using (public.is_admin()) with check (public.is_admin());

create table if not exists public.product_media (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references public.products (id) on delete cascade,
  kind        text not null check (kind in ('image', 'video')),
  path        text not null,           -- path inside the product-media bucket
  position    int not null default 0,
  alt         text,
  created_at  timestamptz not null default now()
);
create index if not exists product_media_product on public.product_media (product_id, position);
alter table public.product_media enable row level security;
drop policy if exists "Media of visible products is public" on public.product_media;
create policy "Media of visible products is public" on public.product_media for select to anon, authenticated
  using (exists (select 1 from public.products p where p.id = product_id and (p.status = 'published' or public.is_admin())));
drop policy if exists "Admin manages media" on public.product_media;
create policy "Admin manages media" on public.product_media for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- 5. Articles (written by the AI from a product, published automatically) ----
create table if not exists public.articles (
  id              uuid primary key default gen_random_uuid(),
  product_id      uuid references public.products (id) on delete set null,
  slug            text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title           text not null,
  excerpt         text not null default '',
  body            text not null,         -- markdown
  seo_title       text,
  seo_description text,
  status          text not null default 'published' check (status in ('published', 'hidden')),
  published_at    timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
alter table public.articles enable row level security;
drop policy if exists "Published articles are public" on public.articles;
create policy "Published articles are public" on public.articles for select to anon, authenticated using (status = 'published' or public.is_admin());
drop policy if exists "Admin manages articles" on public.articles;
create policy "Admin manages articles" on public.articles for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- 6. Reviews (signed-in customers; shown after the owner approves) ----------
create table if not exists public.reviews (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  product_id  uuid not null references public.products (id) on delete cascade,
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  author_name text not null check (char_length(author_name) between 1 and 60),
  rating      int not null check (rating between 1 and 5),
  title       text check (char_length(title) <= 100),
  body        text not null check (char_length(body) between 10 and 2000),
  status      text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  unique (product_id, user_id)
);
alter table public.reviews enable row level security;
drop policy if exists "Approved reviews are public" on public.reviews;
create policy "Approved reviews are public" on public.reviews for select to anon, authenticated
  using (status = 'approved' or user_id = (select auth.uid()) or public.is_admin());
drop policy if exists "Customers write one pending review" on public.reviews;
create policy "Customers write one pending review" on public.reviews for insert to authenticated
  with check (user_id = (select auth.uid()) and status = 'pending');
drop policy if exists "Admin moderates reviews" on public.reviews;
create policy "Admin moderates reviews" on public.reviews for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Admin deletes reviews" on public.reviews;
create policy "Admin deletes reviews" on public.reviews for delete to authenticated using (public.is_admin());

-- 7. Storage: photos, videos and 3D models -----------------------------------
-- Public to read; only the owner can upload, replace or delete.
-- 50 MB per file is the free-plan ceiling; raise it in Storage settings on a paid plan.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-media', 'product-media', true, 52428800,
        array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'video/mp4', 'video/webm', 'video/quicktime', 'model/gltf-binary', 'application/octet-stream'])
on conflict (id) do nothing;

drop policy if exists "Owner uploads product media" on storage.objects;
create policy "Owner uploads product media" on storage.objects for insert to authenticated
  with check (bucket_id = 'product-media' and public.is_admin());
drop policy if exists "Owner updates product media" on storage.objects;
create policy "Owner updates product media" on storage.objects for update to authenticated
  using (bucket_id = 'product-media' and public.is_admin());
drop policy if exists "Owner deletes product media" on storage.objects;
create policy "Owner deletes product media" on storage.objects for delete to authenticated
  using (bucket_id = 'product-media' and public.is_admin());

-- 8. v2: stock fields on products ----------------------------------------------
-- family = gem family (beryl, corundum...); stock_status drives the status badge.
alter table public.products add column if not exists family text check (char_length(family) <= 80);
alter table public.products add column if not exists stock_status text not null default 'in'
  check (stock_status in ('in', 'res', 'sold', 'mto'));   -- in = In stock, res = Reserved, sold = Sold, mto = Made to order

-- 9. v2: blog posts written by hand in the admin panel -----------------------------
-- Public can read published rows only; only the admin role (public.is_admin()) can insert, update or delete.
create table if not exists public.posts (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  published_at  timestamptz,
  slug          text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title         text not null check (char_length(title) between 3 and 160),
  topic         text check (char_length(topic) <= 60),
  summary       text not null default '' check (char_length(summary) <= 400),
  body          text not null default '' check (char_length(body) <= 60000),   -- markdown
  cover_path    text,                                                          -- path inside the post-media bucket
  product_id    uuid references public.products (id) on delete set null,      -- linked stock item
  status        text not null default 'draft' check (status in ('draft', 'published'))
);
create index if not exists posts_status_published on public.posts (status, published_at desc);
alter table public.posts enable row level security;
drop policy if exists "Published posts are public" on public.posts;
create policy "Published posts are public" on public.posts for select to anon, authenticated
  using (status = 'published' or public.is_admin());
drop policy if exists "Admin inserts posts" on public.posts;
create policy "Admin inserts posts" on public.posts for insert to authenticated with check (public.is_admin());
drop policy if exists "Admin updates posts" on public.posts;
create policy "Admin updates posts" on public.posts for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Admin deletes posts" on public.posts;
create policy "Admin deletes posts" on public.posts for delete to authenticated using (public.is_admin());

-- 10. v2: storage bucket for blog cover photos ---------------------------------------
-- Public to read; only the admin role can upload, replace or delete.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('post-media', 'post-media', true, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do nothing;
drop policy if exists "Admin uploads post media" on storage.objects;
create policy "Admin uploads post media" on storage.objects for insert to authenticated
  with check (bucket_id = 'post-media' and public.is_admin());
drop policy if exists "Admin updates post media" on storage.objects;
create policy "Admin updates post media" on storage.objects for update to authenticated
  using (bucket_id = 'post-media' and public.is_admin());
drop policy if exists "Admin deletes post media" on storage.objects;
create policy "Admin deletes post media" on storage.objects for delete to authenticated
  using (bucket_id = 'post-media' and public.is_admin());
