# Production checklist: Asian Gemstone redesign

Run this on a Vercel **preview** deployment before promoting `/redesign` to your home page.

## 1. Security headers
Add to `next.config.ts` and adjust the hosts to what you actually use:

```ts
const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
  { key: 'X-Frame-Options', value: 'DENY' },
  // Next.js needs inline scripts unless you add nonces; tighten later with a nonce-based CSP.
  { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://YOUR-PROJECT.supabase.co; font-src 'self'; connect-src 'self' https://YOUR-PROJECT.supabase.co; media-src 'self' https://YOUR-PROJECT.supabase.co; frame-ancestors 'none'; base-uri 'self'; form-action 'self'" },
];
const nextConfig: NextConfig = {
  async headers() { return [{ source: '/(.*)', headers: securityHeaders }]; },
};
```
- [ ] Replace `YOUR-PROJECT` with your Supabase project URL (the nav checks the session from the browser).
- [ ] Add analytics, payment or chat hosts to `script-src` and `connect-src` only if you use them.
- [ ] Check https://securityheaders.com on the preview URL.

## 2. No secrets in client code
- [ ] Only `NEXT_PUBLIC_SUPABASE_URL` and the publishable (anon) key reach the browser. That is by design: row level security protects the data.
- [ ] The Supabase secret / service_role key is not used anywhere. Never add it to a `NEXT_PUBLIC_` variable.
- [ ] API keys, payment keys and database URLs stay in server-only env vars (no `NEXT_PUBLIC_` prefix).

## 3. Accounts and contact form (Supabase)
- [ ] `supabase/schema.sql` has been run. In Table Editor, RLS shows as enabled on `contact_messages` and `profiles`.
- [ ] As a signed-out visitor, the API cannot read `contact_messages`. Check in the SQL editor with `set role anon; select * from contact_messages;`: it should return no rows.
- [ ] Redirect URLs include `/redesign/auth/confirm` for production, previews and localhost.
- [ ] Custom SMTP is set up (the built-in mailer is for testing only).
- [ ] Auth rate limits and CAPTCHA (Authentication → Attack Protection) are switched on if bots start signing up. The contact form has a honeypot only.
- [ ] Minimum password length in Supabase is 8 or more, to match the form.
- [ ] End-to-end on the preview: sign up → email link → account → sign out → sign in → forgot password → new password → contact message appears in Table Editor.
- [ ] Google: Continue with Google works on the preview domain and production domain.
- [ ] Owner account created and confirmed with asiangemstone@gmail.com; `/redesign/admin` opens for it and redirects any other account.
- [ ] Storage: as a normal signed-in customer, uploading to the `product-media` bucket is refused.
- [ ] Add a test product with 2 photos and 1 video → AI text appears → article page opens → 3D shows (gem) or builds (ring).
- [ ] Review: post as a customer → shows nowhere → approve in admin → appears on the product page.
- [ ] AI keys (`ANTHROPIC_API_KEY` / `OPENAI_API_KEY`) and `MESHY_API_KEY` are set only as server env vars, never `NEXT_PUBLIC_`.
- [ ] Set spending limits in the Anthropic/OpenAI and Meshy dashboards.
- [ ] Test the product page in Google's Rich Results Test; submit `/redesign/sitemap.xml` in Search Console.

## 4. Assets and caching
- [ ] three.js comes from npm and is bundled; there is no CDN dependency.
- [ ] `public/gems/**` (thumbnails about 15–25 KB each, posters) gets long cache headers. Vercel does this for `public/`; rename files if you replace them.
- [ ] Total WebGL payload: no models or HDR files are loaded; all geometry is generated in code.

## 5. SEO
- [ ] Each route has `metadata` (title, description). Add an Open Graph image: use a reel frame at 1200×630 in `app/redesign/opengraph-image.png`.
- [ ] Real text is in the DOM (headings, specs, FAQ). The 3D is decoration.
- [ ] Add the stone pages, About, Blog and Contact to your sitemap. Sign-in, sign-up and account pages are already marked `noindex`.
- [ ] Only add Product structured data once real listings with real prices exist.

## 6. Accessibility
- [ ] Keyboard: every link and button is reachable, and focus rings are visible.
- [ ] `prefers-reduced-motion`: no falling intro, slower spin, no kinetic headline.
- [ ] Posters and thumbnails have alt text.
- [ ] Form errors are announced (`role="alert"`) and focus moves to the first bad field. Test with VoiceOver or NVDA.
- [ ] Check contrast of the green gradient text on black with a contrast checker.

## 7. Performance
- [ ] Lighthouse on the preview (mobile): performance 80+, accessibility 95+, no console errors.
- [ ] Real-device `#debug` scroll test on Windows Chrome, Safari and a mid-range Android phone (see REDESIGN_README.md).

## 8. Monitoring
- [ ] Log tier changes and WebGL context losses (for example `console.warn` → your log drain or Sentry) to see how many visitors fall back to tiers C and D.

## 9. Store boundary
- [ ] This redesign adds accounts and a contact inbox, but no cart, checkout or payments. "Request" buttons go to `/redesign/contact`.
- [ ] When listings exist, connect "Add to cart" to your existing cart context with real product ids.
- [ ] Never collect payment details inside the 3D pages.
