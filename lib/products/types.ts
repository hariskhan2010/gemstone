export type Kind = 'gemstone' | 'jewelry' | 'carved';
export type GemCut = 'round' | 'oval' | 'emerald' | 'emeraldLong' | 'cushion';
export const GEM_CUTS: [GemCut, string][] = [['round', 'Round brilliant'], ['oval', 'Oval'], ['cushion', 'Cushion'], ['emerald', 'Emerald cut'], ['emeraldLong', 'Long emerald cut']];
export type StockStatus = 'in' | 'res' | 'sold' | 'mto';
export const STOCK_STATUS: Record<StockStatus, { label: string; tone: 'ok' | 'warn' | 'danger' | 'info' }> = {
  in: { label: 'In stock', tone: 'ok' }, res: { label: 'Reserved', tone: 'warn' }, sold: { label: 'Sold', tone: 'danger' }, mto: { label: 'Made to order', tone: 'info' },
};
export const KIND_LABEL: Record<Kind, string> = { gemstone: 'Gemstone', jewelry: 'Jewelry', carved: 'Carved stone' };

export interface Product {
  id: string; slug: string; name: string; kind: Kind; status: 'published' | 'hidden'; family: string | null; stock_status: StockStatus;
  details: string; carat: number | null; origin: string | null; treatment: string | null; dimensions: string | null;
  price: number | null; currency: string;
  description: string | null; seo_title: string | null; seo_description: string | null; keywords: string[];
  ai_status: 'pending' | 'working' | 'done' | 'failed' | 'off'; ai_error: string | null;
  model_kind: 'gem' | 'mesh' | 'none'; gem_cut: GemCut | null; gem_color: string | null;
  meshy_task_id: string | null; model_path: string | null; model_status: 'none' | 'working' | 'done' | 'failed';
  created_at: string; updated_at: string;
}
export interface Media { id: string; product_id: string; kind: 'image' | 'video'; path: string; position: number; alt: string | null }
export interface Article { id: string; product_id: string | null; slug: string; title: string; excerpt: string; body: string; seo_title: string | null; seo_description: string | null; status: string; published_at: string; updated_at: string }
export interface Review { id: string; product_id: string; author_name: string; rating: number; title: string | null; body: string; status: 'pending' | 'approved' | 'rejected'; created_at: string }

export const slugify = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80) || 'item';

export interface Post { id: string; slug: string; title: string; topic: string | null; summary: string; body: string; cover_path: string | null; product_id: string | null; status: 'draft' | 'published'; published_at: string | null; created_at: string; updated_at: string }
