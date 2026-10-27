import { Link } from 'wouter';
import { isPurchasable, type CatalogCategory, type CatalogItem } from '@/core';
import { useI18n } from '@/i18n';
import { AddToCart } from './AddToCart';
import { Availability } from './Availability';
import { PaintedBand } from './PaintedBand';
import { categoryPaint } from './paint';
import { Placeholder } from './Placeholder';
import { Price } from './Price';
import { StoreImage } from './StoreImage';

/** A piece on the workshop table: a white board under a band in its category's colours. */
export function PieceCard({
  item,
  category,
  paintIndex = 0,
  showCategory = true,
  sizes = '(min-width: 1024px) 18rem, (min-width: 640px) 30vw, 46vw',
  headingLevel = 'h3',
}: {
  item: CatalogItem;
  category?: CatalogCategory;
  paintIndex?: number;
  showCategory?: boolean;
  sizes?: string;
  headingLevel?: 'h2' | 'h3';
}) {
  const { t } = useI18n();
  const Heading = headingLevel;
  const paint = categoryPaint(category, paintIndex);
  return (
    <article className="piece group relative flex h-full flex-col has-[a:focus-visible]:outline has-[a:focus-visible]:outline-[3px] has-[a:focus-visible]:outline-offset-4 has-[a:focus-visible]:outline-[color:var(--focus)]">
      <PaintedBand base={paint.fill} teeth={[paint.tooth]} className="h-3" />
      <div className={`relative aspect-square overflow-hidden bg-surface-quiet ${isPurchasable(item) ? '' : 'grayscale-[0.6]'}`}>
        <StoreImage src={item.imageUrl} alt="" sizes={sizes} maxWidth={800} fallback={<Placeholder />} />
        {item.kind === 'service' && (
          <span className="absolute left-3 top-3 rounded-full bg-surface-deep px-2.5 py-1 text-sm font-bold text-ink-on-deep">{t('product.service')}</span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        {showCategory && category && <p className="text-sm font-medium text-ink-soft">{category.name}</p>}
        <Heading className="text-xl leading-tight text-heading">
          <Link href={`/products/${item.id}`} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none group-hover:underline">
            {item.name}
          </Link>
        </Heading>
        {item.duration && <p className="text-ink-soft">{t('product.duration', { duration: item.duration })}</p>}
        <div className="mt-auto flex flex-col gap-1 pt-2">
          <Price item={item} />
          <div className="flex flex-wrap gap-x-3">
            <Availability item={item} showDuration={false} />
          </div>
        </div>
        <div className="relative z-10 pt-2">
          <AddToCart item={item} variant="compact" tone="quiet" className="w-full" />
        </div>
      </div>
    </article>
  );
}

export function PieceCardSkeleton() {
  return (
    <div aria-hidden="true" className="piece flex flex-col">
      <div className="skeleton h-3 rounded-none" />
      <div className="skeleton aspect-square rounded-none" />
      <div className="flex flex-col gap-2 p-4">
        <div className="skeleton h-4 w-1/3" />
        <div className="skeleton h-6 w-3/4" />
        <div className="skeleton mt-2 h-7 w-24" />
      </div>
    </div>
  );
}
