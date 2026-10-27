import { useId } from 'react';

const TOOTH = 16;

/**
 * A strip of painted teeth, like the trim of an oxcart. Colours come from the
 * caller: the store palette, or a category's own colours.
 */
export function PaintedBand({
  base = 'var(--ac-white)',
  teeth = ['var(--paint-1)', 'var(--paint-2)', 'var(--paint-3)', 'var(--paint-4)'],
  dot,
  className = 'h-3',
}: {
  base?: string;
  teeth?: string[];
  dot?: string;
  className?: string;
}) {
  const id = `band-${useId().replace(/:/g, '')}`;
  const width = TOOTH * teeth.length;
  return (
    <svg aria-hidden="true" className={`block w-full shrink-0 ${className}`}>
      <defs>
        <pattern id={id} width={width} height="12" patternUnits="userSpaceOnUse">
          <rect width={width} height="12" style={{ fill: base }} />
          {teeth.map((color, i) => (
            <polygon key={i} points={`${i * TOOTH},12 ${i * TOOTH + 8},3.5 ${i * TOOTH + TOOTH},12`} style={{ fill: color }} />
          ))}
          {dot &&
            teeth.map((_, i) => <circle key={`d${i}`} cx={i * TOOTH} cy="4" r="1.7" style={{ fill: dot }} />)}
        </pattern>
      </defs>
      <rect width="100%" height="100%" style={{ fill: `url(#${id})` }} />
    </svg>
  );
}
