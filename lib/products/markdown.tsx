import { Fragment } from 'react';

/** Small, safe markdown renderer for AI articles: ## headings, paragraphs, - lists, **bold**, *italic*, [links](https://…). No raw HTML. */
function inline(text: string, key: string) {
  const out: React.ReactNode[] = []; const re = /\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]\(((?:https?:\/\/|\/)[^)\s]+)\)/g;
  let last = 0, m: RegExpExecArray | null, n = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1]) out.push(<strong key={`${key}b${n++}`}>{m[1]}</strong>);
    else if (m[2]) out.push(<em key={`${key}i${n++}`}>{m[2]}</em>);
    else out.push(<a key={`${key}a${n++}`} href={m[4]} rel={m[4].startsWith('/') ? undefined : 'noopener nofollow'}>{m[3]}</a>);
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}
export function Markdown({ text }: { text: string }) {
  const blocks = text.replace(/\r/g, '').split(/\n{2,}/).map(b => b.trim()).filter(Boolean);
  return (
    <>
      {blocks.map((b, i) => {
        const k = `m${i}`;
        const h = b.match(/^(#{1,4})\s+(.*)$/);
        if (h && !b.includes('\n')) { const L = Math.min(4, Math.max(2, h[1].length)); const T = `h${L}` as 'h2' | 'h3' | 'h4'; return <T key={k}>{inline(h[2], k)}</T>; }
        const lines = b.split('\n');
        if (lines.every(l => /^\s*[-*]\s+/.test(l))) return <ul key={k}>{lines.map((l, j) => <li key={j}>{inline(l.replace(/^\s*[-*]\s+/, ''), `${k}${j}`)}</li>)}</ul>;
        if (lines.every(l => /^\s*\d+[.)]\s+/.test(l))) return <ol key={k}>{lines.map((l, j) => <li key={j}>{inline(l.replace(/^\s*\d+[.)]\s+/, ''), `${k}${j}`)}</li>)}</ol>;
        return <p key={k}>{lines.map((l, j) => <Fragment key={j}>{j > 0 && <br />}{inline(l, `${k}${j}`)}</Fragment>)}</p>;
      })}
    </>
  );
}
