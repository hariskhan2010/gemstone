import GemLoader from '@/components/gems/GemLoader';

/** Shown by Next.js while a /redesign page is loading. */
export default function Loading() {
  return <div className="ag-loading"><GemLoader /></div>;
}
