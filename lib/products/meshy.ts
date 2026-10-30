/**
 * Meshy photo-to-3D (https://docs.meshy.ai/api/multi-image-to-3d). Server-only: uses MESHY_API_KEY.
 * Used for rings and carvings. Clear gemstones use the built-in gem engine instead,
 * because photo-to-3D cannot reconstruct transparent, faceted stones.
 */
const BASE = `${process.env.MESHY_BASE_URL || 'https://api.meshy.ai'}/openapi/v1/multi-image-to-3d`;
export const meshyConfigured = () => Boolean(process.env.MESHY_API_KEY);
const headers = () => ({ authorization: `Bearer ${process.env.MESHY_API_KEY}`, 'content-type': 'application/json' });

/** Starts a task from 1 to 4 public image URLs (the first is treated as the front view). Returns the task id. */
export async function startMeshy(imageUrls: string[]): Promise<string> {
  const r = await fetch(BASE, {
    method: 'POST', headers: headers(),
    body: JSON.stringify({ image_urls: imageUrls.slice(0, 4), ai_model: 'latest', should_texture: true, enable_pbr: true, target_formats: ['glb'], origin_at: 'center' }),
  });
  const j = await r.json();
  if (!r.ok || !j.result) throw new Error(`Meshy ${r.status}: ${j?.message ?? 'could not start'}`);
  return j.result as string;
}

export interface MeshyTask { status: 'PENDING' | 'IN_PROGRESS' | 'SUCCEEDED' | 'FAILED' | 'CANCELED'; progress: number; model_urls?: { glb?: string }; task_error?: { message?: string } }
export async function getMeshy(id: string): Promise<MeshyTask> {
  const r = await fetch(`${BASE}/${encodeURIComponent(id)}`, { headers: headers(), cache: 'no-store' });
  const j = await r.json();
  if (!r.ok) throw new Error(`Meshy ${r.status}: ${j?.message ?? 'error'}`);
  return j as MeshyTask;
}
