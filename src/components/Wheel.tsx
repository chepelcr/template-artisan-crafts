import { useEffect, useRef, type RefObject } from 'react';
import { useReducedMotion } from '@/core';
import { Placeholder } from './Placeholder';
import { StoreImage } from './StoreImage';

const PETALS = 16;
const TEETH = 32;
const STEP = 360 / PETALS;

const petal = (r1: number, r2: number, w: number) => {
  const mid = (r1 + r2) / 2;
  return `M0 ${-r1}Q${w} ${-mid} 0 ${-r2}Q${-w} ${-mid} 0 ${-r1}Z`;
};

/**
 * Turns the painted ring with the page's scroll, only while it is on screen
 * and motion is allowed. One rAF per scroll burst; nothing runs at rest.
 */
function useScrollTurn(ring: RefObject<SVGGElement>, enabled: boolean) {
  useEffect(() => {
    const node = ring.current;
    if (!node) return;
    if (!enabled) {
      node.removeAttribute('transform');
      return;
    }
    let raf = 0;
    let visible = false;
    const apply = () => {
      raf = 0;
      node.setAttribute('transform', `rotate(${((window.scrollY * 0.16) % 360).toFixed(2)})`);
    };
    const onScroll = () => {
      if (visible && !raf) raf = requestAnimationFrame(apply);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      onScroll();
    });
    observer.observe(node);
    window.addEventListener('scroll', onScroll, { passive: true });
    apply();
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [ring, enabled]);
}

/** The painted rings of a Sarchí oxcart wheel, drawn once and shared by Wheel and Rosette. */
function WheelRings() {
  return (
    <>
      <circle r="97" style={{ fill: 'var(--paint-1)' }} />
      <circle r="91" style={{ fill: 'var(--paint-2)' }} />
      {Array.from({ length: TEETH }, (_, i) => (
        <polygon key={`t${i}`} points="-8.6,-90.6 8.6,-90.6 0,-85" transform={`rotate(${(i * 360) / TEETH})`} style={{ fill: 'var(--paint-1)' }} />
      ))}
      <circle r="85" style={{ fill: 'var(--ac-white)' }} />
      {Array.from({ length: PETALS }, (_, i) => (
        <g key={`p${i}`} transform={`rotate(${i * STEP})`}>
          <path d={petal(59.5, 83, 10.5)} style={{ fill: i % 2 ? 'var(--paint-3)' : 'var(--paint-1)' }} />
          <path d="M0 -63V-79" style={{ stroke: 'var(--paint-2)', strokeWidth: 1.4, strokeLinecap: 'round' }} />
        </g>
      ))}
      {Array.from({ length: PETALS }, (_, i) => (
        <polygon key={`d${i}`} points="0,-78 3.2,-72 0,-66 -3.2,-72" transform={`rotate(${i * STEP + STEP / 2})`} style={{ fill: 'var(--paint-4)' }} />
      ))}
      <circle r="58.5" style={{ fill: 'var(--paint-3)' }} />
      {Array.from({ length: 24 }, (_, i) => (
        <circle key={`o${i}`} cx="0" cy="-55.7" r="1.5" transform={`rotate(${i * 15})`} style={{ fill: 'var(--ac-white)' }} />
      ))}
      <circle r="53" style={{ fill: 'var(--paint-2)' }} />
    </>
  );
}

function Star() {
  return (
    <>
      {Array.from({ length: 8 }, (_, i) => (
        <path key={i} d={petal(10, 46, 9)} transform={`rotate(${i * 45})`} style={{ fill: i % 2 ? 'var(--paint-3)' : 'var(--paint-1)' }} />
      ))}
      <circle r="12" style={{ fill: 'var(--ac-white)' }} />
      <circle r="6" style={{ fill: 'var(--paint-1)' }} />
    </>
  );
}

/**
 * The template's signature: a painted oxcart wheel. With an image, the photo
 * sits still in the hub while the painted ring turns with the scroll.
 */
export function Wheel({ image, priority = false, sizes, className = '' }: { image?: string | null; priority?: boolean; sizes?: string; className?: string }) {
  const ring = useRef<SVGGElement>(null);
  const reduced = useReducedMotion();
  useScrollTurn(ring, !reduced);
  return (
    <div className={`relative aspect-square ${className}`}>
      <svg aria-hidden="true" viewBox="-100 -100 200 200" className="absolute inset-0 h-full w-full drop-shadow-[0_18px_30px_rgb(29_27_25/0.18)]">
        <g ref={ring}>
          <WheelRings />
          {!image && <Star />}
        </g>
      </svg>
      {image && (
        <div className="absolute left-1/2 top-1/2 aspect-square w-[53%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full bg-surface-quiet">
          <StoreImage src={image} alt="" priority={priority} sizes={sizes ?? '(min-width: 768px) 16rem, 46vw'} maxWidth={800} fallback={<Placeholder />} />
        </div>
      )}
    </div>
  );
}

/** A small, still wheel: the default mark and the section divider. */
export function Rosette({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="-100 -100 200 200" className={className}>
      <WheelRings />
      <Star />
    </svg>
  );
}

export function RosetteDivider({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`page flex items-center gap-4 ${className}`}>
      <span className="h-px flex-1 bg-[color:var(--rule)]" />
      <Rosette className="h-7 w-7" />
      <span className="h-px flex-1 bg-[color:var(--rule)]" />
    </div>
  );
}
