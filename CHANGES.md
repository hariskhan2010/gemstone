# v2 changes

## Files changed / added
- `components/gems/gems.css`: semantic tokens `--s1/--s2/--s3`, `--t1/--t2`, `--ok/--warn/--info/--danger` on `.ag-root`, light overrides via `data-theme="light"`, `.ag-status` badge styles.
- `components/gems/StatusBadge.tsx` (new): In stock = ok, Reserved = warn, Sold = danger, Made to order = info.
- `lib/products/types.ts`: `StockStatus`, `STOCK_STATUS`, `family`, `stock_status`, `Post`.
- `lib/products/actions.ts`, `components/gems/admin/ProductEditor.tsx`: family, stock status, "Weight (carat)" fields.
- `lib/posts/actions.ts`, `components/gems/admin/PostEditor.tsx` (new): create/edit/delete posts, cover upload to `post-media`, linked stock item, draft/published.
- `app/redesign/admin/posts/{page,new/page,[id]/page}.tsx` (new), `app/redesign/admin/layout.tsx` (server-side `requireAdmin()` + `connection()`, Blog posts links), `app/redesign/admin/page.tsx` (stock badge column).
- `app/redesign/blog/page.tsx` (lists published posts), `app/redesign/blog/[slug]/page.tsx` (new, post detail).
- `app/redesign/products/[slug]/page.tsx`, `components/gems/ProductCard.tsx`: status badge, family.
- `app/redesign/admin-check/route.ts` (new) and `components/gems/RedesignNav.tsx`: Admin link rendered only when the server says `is_admin()` is true. Cosmetic only; the admin routes enforce access on the server.
- `lib/products/queries.ts`, `lib/supabase/public.ts`, `app/redesign/sitemap.ts`: post queries, `post-media` URL helper, posts in sitemap.
- `supabase/schema.sql`: sections 8-10 (below).

## SQL to run
Run the whole updated `supabase/schema.sql` in Supabase SQL Editor (safe to re-run). New parts are sections 8-10:
- `products.family`, `products.stock_status` (`in|res|sold|mto`, default `in`)
- table `public.posts` with RLS: public can read `status = 'published'`; insert/update/delete only when `public.is_admin()`
- storage bucket `post-media` (public read, 10 MB, images) with insert/update/delete policies for `public.is_admin()`

## Notes
- Stock = the existing products table (photos go to the `product-media` bucket). Price stays optional; nothing is invented.
- Existing products default to "In stock"; set the real status in the admin panel.
- Verified: `npx tsc --noEmit` clean; `next build --webpack` passes (Google Fonts mocked in the sandbox). Not tested against a live Supabase project.
