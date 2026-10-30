import { useId } from 'react';

/** Animated amethyst used as the loading indicator. `progress` (0–1) fills it from the bottom; leave it out for a full, shimmering stone. */
export default function GemLoader({ progress = 1, label = 'Loading' }: { progress?: number; label?: string }) {
  const id = useId().replace(/:/g, '');
  const h = Math.max(0.08, Math.min(1, progress)) * 100;
  return (
    <div className="ag-gemload" role="status" aria-live="polite">
      <svg className="ag-gem" viewBox="0 0 100 100" aria-hidden="true">
        <defs>
          <clipPath id={`${id}f`}><rect x="0" y={100 - h} width="100" height={h} /></clipPath>
          <clipPath id={`${id}s`}><polygon points="10,44 32,30 68,30 90,44 50,90" /></clipPath>
          <linearGradient id={`${id}g`} x1="0" x2="1"><stop offset="0" stopColor="#fff" stopOpacity="0" /><stop offset=".5" stopColor="#fff" stopOpacity=".7" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></linearGradient>
        </defs>
        <polygon points="10,44 32,30 68,30 90,44 50,90" fill="none" stroke="currentColor" strokeOpacity=".35" strokeWidth="1.2" strokeLinejoin="round" />
        <g clipPath={`url(#${id}f)`}><g clipPath={`url(#${id}s)`} className="ag-facets">
          <polygon points="10,44 32,30 30,44" fill="#d6b8ff" style={{ animationDelay: '0.00s' }} />
          <polygon points="32,30 50,44 30,44" fill="#9b5cf0" style={{ animationDelay: '0.17s' }} />
          <polygon points="32,30 50,30 50,44" fill="#c49cff" style={{ animationDelay: '0.34s' }} />
          <polygon points="50,30 68,30 50,44" fill="#8a4ae6" style={{ animationDelay: '0.51s' }} />
          <polygon points="68,30 70,44 50,44" fill="#b07cf7" style={{ animationDelay: '0.68s' }} />
          <polygon points="68,30 90,44 70,44" fill="#6f34c9" style={{ animationDelay: '0.85s' }} />
          <polygon points="10,44 30,44 50,90" fill="#7a3ad6" style={{ animationDelay: '1.02s' }} />
          <polygon points="30,44 50,44 50,90" fill="#a467f2" style={{ animationDelay: '1.19s' }} />
          <polygon points="50,44 70,44 50,90" fill="#5c25b0" style={{ animationDelay: '1.36s' }} />
          <polygon points="70,44 90,44 50,90" fill="#4a1b93" style={{ animationDelay: '1.53s' }} />
          <rect className="ag-glint" x="-30" y="0" width="26" height="100" fill={`url(#${id}g)`} />
        </g></g>
      </svg>
      <span className="ag-mono">{label}</span>
    </div>
  );
}
