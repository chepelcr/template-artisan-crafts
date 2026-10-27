import { Link } from 'wouter';
import { catalogHref, type CatalogCategory } from '@/core';
import { useI18n } from '@/i18n';
import { PaintedBand } from './PaintedBand';
import { categoryPaint } from './paint';
import { StoreImage } from './StoreImage';

/** A category as a painted panel of the cart: its colour, its photo in a medallion, its name. */
export function CategoryPanel({ category, count, index }: { category: CatalogCategory; count: number; index: number }) {
  const { plural } = useI18n();
  const paint = categoryPaint(category, index);
  return (
    <Link
      href={catalogHref({ category: category.key })}
      className="group flex h-full flex-col items-center overflow-hidden rounded-frame pb-5 text-center shadow-soft transition-transform hover:-translate-y-1"
      style={{ background: paint.fill, color: paint.ink }}
    >
      <PaintedBand base={paint.fill} teeth={[paint.tooth]} dot={paint.tooth} className="h-3" />
      <span className="relative mt-5 block aspect-square w-[62%] max-w-[8.5rem] overflow-hidden rounded-full shadow-[0_0_0_4px_var(--ac-white)]">
        <StoreImage
          src={category.imageUrl}
          alt=""
          sizes="8.5rem"
          maxWidth={400}
          fallback={<span className="grid h-full w-full place-items-center bg-[color:var(--ac-white)] font-display text-4xl text-heading">{category.name.slice(0, 1)}</span>}
        />
      </span>
      <span className="mt-4 px-3 font-display text-[1.35rem] font-extrabold leading-tight group-hover:underline">{category.name}</span>
      <span className="mt-2 rounded-full bg-[color:var(--ac-white)] px-2.5 py-0.5 text-sm font-bold text-[color:var(--ac-ink)]">{plural('category.count', count)}</span>
    </Link>
  );
}
