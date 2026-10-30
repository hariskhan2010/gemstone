import { connection } from 'next/server';
import { requireAdmin } from '@/lib/auth/admin';
import PostEditor from '@/components/gems/admin/PostEditor';

export default async function NewPost() {
  await connection();
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from('products').select('id, name').order('name');
  return <PostEditor products={data ?? []} />;
}
