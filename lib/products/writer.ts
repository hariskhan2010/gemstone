import { generateJSON, generate } from '@/lib/ai';
import { KIND_LABEL, type Product } from './types';

/**
 * Writes the product description, SEO fields and one article from the owner's details.
 * Rule one: use only the facts the owner typed. Nothing about price, certificates, origin,
 * treatment or quality is invented. Pass two edits for a natural, plain human voice.
 */
const STORE = `Asian Gemstone is a family gemstone business founded in 2003 in Peshawar, Pakistan. It sells natural gemstones hand-selected from mines and licensed dealers in Pakistan, Thailand and India, handmade jewelry set in silver, gold and brass, and stones carved by hand to order. Tracked worldwide shipping, usually 7 to 14 days. GIA/IGI certificates are available on request for an extra fee.`;

const RULES = `Rules:
- Use ONLY facts given in "Product facts" and "Store facts". Never invent carat, origin, treatment, certification, price, rarity, investment value or healing/metaphysical claims.
- If a fact is missing, leave it out. Do not guess.
- Plain, warm, specific English. Short paragraphs. No hype words (stunning, exquisite, unparalleled, elevate, delve, testament, tapestry, journey, realm), no exclamation marks, no emoji.
- Write for a buyer deciding whether to ask about this piece, and for Google: say clearly what it is in the first sentence.`;

function facts(p: Product) {
  const rows: [string, string | number | null][] = [
    ['Name', p.name], ['Type', KIND_LABEL[p.kind]], ['Carat', p.carat], ['Origin', p.origin], ['Treatment', p.treatment],
    ['Dimensions', p.dimensions], ['Price', p.price != null ? `${p.price} ${p.currency}` : null],
    ['Cut', p.gem_cut], ['Owner notes', p.details || null],
  ];
  return rows.filter(([, v]) => v !== null && v !== '').map(([k, v]) => `${k}: ${v}`).join('\n');
}

export interface WrittenCopy {
  description: string; seo_title: string; seo_description: string; keywords: string[];
  article: { title: string; slug_hint: string; excerpt: string; body: string; seo_title: string; seo_description: string };
}

export async function writeProductCopy(p: Product): Promise<WrittenCopy> {
  const system = `You write product copy and helpful articles for a small gemstone shop.\n${RULES}`;
  const draft = await generateJSON<WrittenCopy>({
    system, maxTokens: 4000,
    prompt: `Store facts:\n${STORE}\n\nProduct facts:\n${facts(p)}\n\nReturn JSON with:
- "description": 120-200 words, 2-3 short paragraphs, for the product page.
- "seo_title": max 60 characters, includes the product name and "Asian Gemstone".
- "seo_description": 140-155 characters.
- "keywords": 5-8 search phrases a buyer would type.
- "article": { "title", "slug_hint" (3-6 lowercase words with hyphens), "excerpt" (max 160 characters), "body" (600-900 words of markdown with ## headings: what this stone or piece is, how to choose one, care, how to order from Asian Gemstone; mention the product by name once or twice, never invent facts), "seo_title" (max 60 characters), "seo_description" (140-155 characters) }`,
  });

  // Pass two: natural, human voice. Same facts, nothing added.
  const humanize = (text: string) => generate({
    system: `You are a careful human editor.\n${RULES}\nKeep every fact exactly as it is and add none. Keep markdown headings if present. Return only the edited text.`,
    prompt: `Edit this so it reads like an experienced gemstone seller wrote it by hand: vary sentence length, cut filler and clichés, prefer concrete words, keep it honest and calm.\n\n${text}`,
    maxTokens: 3000,
  });
  const [description, body] = await Promise.all([humanize(draft.description), humanize(draft.article.body)]);

  const clip = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…' : s);
  return {
    description: description.trim(),
    seo_title: clip(draft.seo_title.trim(), 60),
    seo_description: clip(draft.seo_description.trim(), 160),
    keywords: (draft.keywords ?? []).map(k => String(k).trim()).filter(Boolean).slice(0, 8),
    article: {
      ...draft.article, body: body.trim(),
      title: draft.article.title.trim(), excerpt: clip(draft.article.excerpt.trim(), 170),
      seo_title: clip(draft.article.seo_title.trim(), 60), seo_description: clip(draft.article.seo_description.trim(), 160),
    },
  };
}
