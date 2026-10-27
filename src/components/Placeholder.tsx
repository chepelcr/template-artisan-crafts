import { ProductFallbackIcon } from './CmsIcon';

/** Identity placeholder: sand with painted petals and the store's fallback icon. */
export function Placeholder({ label, tone = 'light' }: { label?: string; tone?: 'light' | 'deep' }) {
  const deep = tone === 'deep';
  return (
    <div
      className={`relative flex h-full w-full items-center justify-center overflow-hidden ${deep ? 'bg-surface-deep-raised text-ink-on-deep' : 'bg-surface-quiet text-heading'}`}
      role={label ? 'img' : undefined}
      aria-label={label}
    >
      <svg aria-hidden="true" viewBox="-50 -50 100 100" className="absolute h-[70%] w-[70%] opacity-25">
        {Array.from({ length: 8 }, (_, i) => (
          <path key={i} d="M0 -14Q7 -28 0 -44Q-7 -28 0 -14Z" transform={`rotate(${i * 45})`} style={{ fill: i % 2 ? 'var(--paint-3)' : 'var(--paint-1)' }} />
        ))}
      </svg>
      <span className="relative grid h-16 w-16 place-items-center rounded-full bg-surface-raised shadow-soft">
        <ProductFallbackIcon className="h-8 w-8" strokeWidth={1.5} />
      </span>
    </div>
  );
}
