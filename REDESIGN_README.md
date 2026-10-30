# Asian Gemstone redesign: Next.js handoff

The black & green cinematic redesign, as a **separate route** (`/redesign`) so you can try it on a Vercel preview deployment without touching your current pages.

| Route | What it is |
|---|---|
| `/redesign` | 3D home film: a rough beryl crystal laser-cut into an emerald, the exploded anatomy, three benefit scenes (emerald, ruby, sapphire) and the velvet box, then the store sections |
| `/redesign/collection` | Filterable grid (`?category=gemstone|jewelry|carved`) |
| `/redesign/stone/[id]` | Stone page with a draggable 3D viewer and gem data. 8 static pages |
| `/redesign/about` | Story, numbers, values and sourcing, with a turning rough crystal |
| `/redesign/blog` | Redesigned index of your guides. Each card links to your existing `/blog/<slug>` article |
| `/redesign/contact` | Contact details (copy buttons) and a message form that saves to Supabase |
| `/redesign/sign-up`, `/sign-in`, `/forgot-password`, `/reset-password` | Real accounts with Supabase Auth |
| `/redesign/account` | Signed-in page: name, email, member since, sign out |
| `/redesign/auth/confirm` | Where the links in Supabase emails and Google sign-in land |
| `/redesign/products/[slug]` | A real product: photo gallery with zoom, videos, 3D view, description, specs, reviews, Google structured data |
| `/redesign/articles/[slug]` | AI-written article for a product |
| `/redesign/admin` | Owner-only admin panel: products, uploads, AI text, 3D, review approval |
| `/redesign/sitemap.xml` | Sitemap with every page, product and article |

Built and type-checked against your `hariskhan2010/gemstone` repo (Next 16.0.1, React 19.2, TypeScript strict). `next build` and ESLint pass.

## Install

1. Copy into the repo root, keeping the paths: `app/redesign/`, `components/gems/`, `lib/gems/`, `lib/supabase/`, `lib/auth/`, `public/gems/`, `proxy.ts`, `supabase/schema.sql`, `.env.example`.
   - If you already have a `proxy.ts` or `middleware.ts`, don't overwrite it. Call `updateSession(request)` from `lib/supabase/proxy.ts` inside it for `/redesign` paths.
2. Install (versions pinned):
   ```bash
   npm i three@0.169.0 @supabase/ssr@0.12.7 @supabase/supabase-js@2.117.3   # nothing new needed for the admin, AI or 3D features
   npm i -D @types/three@0.169.0
   ```
3. `npm run dev` → `http://localhost:3000/redesign`.

The site builds and runs **without** Supabase. Until the keys are set, the forms answer "not available yet" and the account page says sign-in is coming soon.

## Switch on accounts and the contact inbox (Supabase)

1. Create a project at supabase.com (the free plan is enough to start).
2. **SQL Editor** → paste `supabase/schema.sql` → Run. This creates:
   - `contact_messages`: anyone can add a message, nobody can read them through the API. You read them in **Table Editor**.
   - `profiles`: one row per account (name and newsletter tick), created automatically at sign-up. Each user can only read and update their own.
3. **Project Settings → API**: copy the URL and the publishable key (`sb_publishable_…`; older projects call it the anon key) into `.env.local` locally, and into Vercel → Settings → Environment Variables for Preview and Production:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
   ```
   Never put the secret / service_role key in a `NEXT_PUBLIC_` variable. This code doesn't need it.
4. **Authentication → URL Configuration**:
   - Site URL: your production domain.
   - Redirect URLs: add `https://YOUR-DOMAIN/redesign/auth/confirm`, `http://localhost:3000/redesign/auth/confirm` and your Vercel preview pattern (for example `https://*-YOUR-TEAM.vercel.app/redesign/auth/confirm`).
5. **Authentication → Emails**: the default templates work as they are; the confirm route accepts both `?code=` and `?token_hash=` links. Before launch, set up custom SMTP (Resend, Postmark, SES…). Supabase's built-in mailer is for testing only and sends just a few emails per hour.
6. Redeploy so the new env vars are built in.

### How it works

- `proxy.ts` (Next 16's name for middleware) runs on `/redesign/*`. It refreshes the session cookie, sends signed-out visitors from `/account` and `/reset-password` to sign-in, and sends signed-in users away from sign-in and sign-up.
- Forms are client components using `useActionState`. They check input in the browser for instant feedback. The server actions in `lib/auth/actions.ts` check again: the server's answer is the one that counts.
- Sign-up stores the name and newsletter tick in user metadata. The database trigger copies them into `profiles`.
- With email confirmation on (Supabase default), the user sees "Check your email". The link signs them in and lands on `/redesign/account`. With confirmation off, they go straight to the account page.
- Password reset: email link → `/redesign/auth/confirm` → `/redesign/reset-password` → new password → account.
- Wrong password and unknown email get the same message, and "forgot password" always says a link is on its way, so nobody can test which emails have accounts.
- Redirects after sign-in only go to `/redesign/...` paths, never to another site.
- The contact form has a hidden honeypot field for bots.

### Admin, AI, 3D and reviews: what was tested

These were tested end to end against fake Supabase, Claude and Meshy servers:
- the owner opens the admin panel, and a customer is sent away;
- creating a product with 2 photos: upload, media rows, 3 AI calls, saved description and SEO, article published, Meshy started with both photos, finished model saved into storage;
- the product page: JSON-LD with price, rating and images; hover zoom; full-screen zoom; 3D view;
- a customer writes a review: it is pending, the owner approves it, then it shows;
- one review per customer is enforced;
- Continue with Google redirects to Supabase's Google sign-in with the right return address.

**Not tested here:** real Supabase, Google, Claude/OpenAI and Meshy (no access from the build workspace), and real uploads of large videos. After setup, run the checklist in PRODUCTION_CHECKLIST.md.

### What was tested, and what wasn't

- Tested here: production build, lint, and every page on desktop and phone width. Each form was checked with no Supabase keys and against a mock Supabase server. The checks covered field errors, the "check your email" screen, the wrong-password message, a saved contact message, the account-page redirect, and an expired-link redirect. The requests matched Supabase's API, including PKCE and the email redirect URL.
- **Not tested**: a real Supabase project (no network access from the build workspace). After step 6, sign up with a real address, click the email link, sign out, sign in, reset the password, and send a contact message. Check that it appears in Table Editor.

## Continue with Google

1. Google Cloud Console → APIs & Services → Credentials → **Create OAuth client ID** → Web application.
   - Authorized JavaScript origins: your domain (and `http://localhost:3000` for testing).
   - Authorized redirect URI: `https://YOUR-PROJECT.supabase.co/auth/v1/callback` (Supabase shows the exact URL on the Google provider page).
2. Supabase → Authentication → Sign In / Providers → **Google** → paste the Client ID and Client Secret → Enable.
3. Make sure `/redesign/auth/confirm` is in the Redirect URLs (step 4 above). The button is on Sign in and Create account.

## Owner and admin panel

- Only **asiangemstone@gmail.com** can open `/redesign/admin`. The rule lives in the database (`public.admins` + `public.is_admin()`), so it also protects the API and uploads, not just the page.
- The email must be **confirmed**. Create the owner account **before** launch (sign up with that email and click the confirmation link, or use Continue with Google with that Gmail). Then the account page shows **Open admin panel**.
- To add another admin later, run in the SQL editor: `insert into public.admins (email) values ('someone@example.com');`

### Adding a product
1. Admin → **+ New product**. Fill in the name, type, the facts you know (carat, origin, treatment, size, price if you want it shown) and **Details for the AI writer**.
2. Pick photos and videos: as many as you like, up to 50 MB each on the free Supabase plan. They upload straight from your browser to Supabase Storage. The first photo becomes the cover; reorder or delete them on the edit page.
3. Press **Create product**. The panel then shows each step: details saved → files uploaded → AI writes the description, SEO title and description, keywords and an article, **published automatically** → 3D model started (rings and carvings).
4. On the edit page, you can change any AI text and press **Save text**, or tick **Rewrite … with AI**.

### AI writer (Claude or OpenAI, your choice)
- Set `AI_PROVIDER` and its key (see `.env.example`). Until then, products save normally and the panel shows "AI writing is off".
- How it writes: the first pass drafts the copy **only from your facts and the store facts**. It never invents price, origin, treatment, certificates or claims. The second pass edits the description and article for a natural, plain human voice without changing facts.
- AI text goes live without review (your choice), so check new products now and then, especially that the facts are right.
- Cost: each product is 3 AI calls (one draft, two edits), roughly a few cents with Claude Sonnet. Check your provider's current prices.

### 3D models
- **Gemstones:** you pick the cut and body colour, and the built-in ray-traced gem engine draws it, with a live preview in the form. This is free and looks like the stones on the home page. Photo-to-3D can't rebuild clear faceted stones, which is why gems use the engine.
- **Rings and carvings:** tick "Build a 3D model from the photos". The first 4 photos go to Meshy (multi-image to 3D). The panel checks progress every 8 seconds, then saves the finished `.glb` into your storage (Meshy's links expire). Set `MESHY_API_KEY`. Each build uses Meshy credits; results are best with 2–4 angles on a plain background, front view first.

### Reviews
- Customers must be signed in, can review each product once, and pick 1–5 stars.
- New reviews wait in **Admin → Reviews** until you press Approve. Only approved reviews show on the site and in Google's rating data.

### SEO
- Every product page gets its own title, description, keywords, canonical URL, Open Graph image, and `Product` structured data (price only if you entered one; rating only from approved reviews). Articles get `Article` structured data.
- Submit `https://YOUR-DOMAIN/redesign/sitemap.xml` in Google Search Console. When you move the redesign to the main routes, move the sitemap too.
- Nobody can promise first-page rankings. These pages give Google clean, unique text and data; ranking also depends on links, competition and time.

## How the 3D is built

- **Vanilla three.js inside client components**, not React Three Fiber. The film updates DOM styles and the WebGL scene every frame. Doing that through React state would re-render 60 times a second, so `lib/gems/homeFilm.ts` and `lib/gems/viewer.ts` drive the DOM directly. The components only render markup, then mount and dispose the engines in `useEffect`.
- `lib/gems/core.ts` holds:
  - the facet geometry (round brilliant 73 facets, emerald cut 57, and oval and cushion variants);
  - the ray-traced stone shader;
  - the black & green studio lighting;
  - the rough-crystal material;
  - the quality tiers.
- `lib/gems/stones.ts` holds the 8 categories, written in your site's own words, plus standard gem data. **No prices or products were invented.**
- `StoneViewer` takes `fit`, `fitPhone` and `offsetY`, so the same viewer works on stone pages, About (rough crystal) and the account pages.

## Quality tiers (automatic)

| Tier | When | What renders |
|---|---|---|
| A | desktop | ray-traced stones, 5/4/3 bounces, pixel ratio up to 1.75 |
| B | phone or ≤ 4 CPU cores | ray-traced, 4/3/2 bounces, pixel ratio up to 1.5, fewer particles |
| C | slow frames for 45 frames in a row, or shader compile over 3 s | glossy tinted stand-in stones, no particles |
| D | no WebGL2, lost GPU context, or `prefers-reduced-data` | still posters (`public/gems/posters`) and thumbnail images |

Force a tier for testing with `#tier-A`, `#tier-B`, `#tier-C` or `#tier-D` on the URL.

## Real-device test (please do this)

All 3D testing here used software rendering (no GPU). That proves layout and correctness, not real GPU speed.

1. Open `https://<your-preview>.vercel.app/redesign#debug`.
2. Press **Scroll test (20 s)**.
3. Screenshot the panel.

Do this on:
- Windows Chrome
- Safari (Mac or iPhone)
- a mid-range Android phone

The panel shows frame rate per scene, the tier, the GPU name and the shader compile time. Targets are 60 fps on tier A, 45+ on tier B and 50+ on tier C.

## Wiring to your cart later

`app/redesign/stone/[id]/page.tsx` has a comment at the request button. When a real product exists, render a small client button that calls your existing `useCart().addToCart(product)` with the real product. Keep "Request this stone" for made-to-order items. Accounts are ready for order history once orders are stored in Supabase.

## Known gaps

- The blog articles (`/blog/<slug>`) are on your live site but not in this repo snapshot, so their prefetches 404 locally. They resolve on the live site.
- There is no cart, checkout or payment in this redesign. Product pages use "Ask about this piece".
- Supabase free plan: 1 GB storage and 50 MB per file. Many videos will need the Pro plan, or video hosting such as Cloudflare Stream or Mux.
- Photos are served at full size from storage. For faster pages, turn on Supabase image transformations (paid plans), or resize photos before upload.
- The contact form saves messages but doesn't email you. To get emails, add a Supabase Database Webhook (or an Edge Function) on `contact_messages` inserts.
