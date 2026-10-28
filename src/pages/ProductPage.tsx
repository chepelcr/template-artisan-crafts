import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'wouter';
import { catalogHref, categoriesWithItems, paragraphs, usePageMeta, useProductView } from '@/core';
import { useI18n } from '@/i18n';
import { AddToCart } from '@/components/AddToCart';
import { PaintedBand } from '@/components/PaintedBand';
import { categoryPaint } from '@/components/paint';
import { PieceCard } from '@/components/PieceCard';
import { Placeholder } from '@/components/Placeholder';
import { Price } from '@/components/Price';
import { QuantityStepper } from '@/components/QuantityStepper';
import { StoreImage } from '@/components/StoreImage';
import { SectionError } from '@/components/StoreStates';

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { t, plural } = useI18n();
  const { item, catalog, category, related, max, quantity, setQuantity } = useProductView(id);
  usePageMeta(item?.name, item?.description);

  if (catalog.isLoading) {
    return (
      <div aria-hidden="true" className="page grid gap-10 pt-10 md:grid-cols-12">
        <div className="skeleton aspect-square rounded-frame md:col-span-6" />
        <div className="flex flex-col gap-4 md:col-span-6">
          <div className="skeleton h-5 w-32" />
          <div className="skeleton h-14 w-3/4" />
          <div className="skeleton h-9 w-36" />
          <div className="skeleton h-40 w-full" />
        </div>
      </div>
    );
  }

  if (catalog.isError) {
    return (
      <div className="page pt-16">
        <SectionError title={t('catalog.error.title')} onRetry={catalog.refetch} />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="page pt-16">
        <div className="piece flex flex-col items-start gap-4 p-8 md:p-10">
          <h1 className="text-[clamp(2.2rem,5vw,3.25rem)] text-heading">{t('product.notFound.title')}</h1>
          <p className="max-w-xl text-xl text-ink-soft">{t('product.notFound.body')}</p>
          <Link href="/products" className="btn btn-strong">
            {t('product.back')}
          </Link>
        </div>
      </div>
    );
  }

  const groups = categoriesWithItems(catalog.categories, catalog.items);
  const paintIndex = Math.max(groups.findIndex((c) => c.id === category?.id), 0);
  const paint = categoryPaint(category, paintIndex);
  const text = paragraphs(item.description);
  const stock = item.availability;
  const stockText =
    stock.state === 'sold_out'
      ? t('product.soldOut')
      : stock.state === 'low'
        ? plural('product.low', stock.quantity)
        : stock.state === 'in_stock'
          ? t('product.spec.inStock')
          : null;
  const facts = [
    category && { label: t('product.spec.category'), value: category.name },
    item.kind === 'service' && { label: t('product.spec.type'), value: t('product.service') },
    item.duration && { label: t('product.spec.duration'), value: item.duration },
    item.difficulty && { label: t('product.spec.level'), value: item.difficulty },
    stockText && { label: t('product.spec.availability'), value: stockText, alert: stock.state !== 'in_stock' },
  ].filter(Boolean) as Array<{ label: string; value: string; alert?: boolean }>;

  return (
    <>
      <div className="page pt-6">
        <Link href={category ? catalogHref({ category: category.key }) : '/products'} className="inline-flex min-h-tap items-center gap-2 text-lg font-bold text-heading hover:underline">
          <ArrowLeft aria-hidden="true" className="h-5 w-5" />
          {category ? category.name : t('product.back')}
        </Link>

        <div className="mt-6 grid gap-10 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-6">
            <div className="piece">
              <PaintedBand base={paint.fill} teeth={[paint.tooth]} dot={paint.tooth} className="h-3" />
              <div className="aspect-square overflow-hidden bg-surface-quiet">
                <StoreImage src={item.imageUrl} alt={item.name} priority sizes="(min-width: 768px) 36rem, 100vw" maxWidth={1200} fallback={<Placeholder label={t('product.imageMissing')} />} />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5 md:col-span-6 md:pt-4">
            <h1 className="text-[clamp(2.3rem,5vw,3.75rem)] text-heading">{item.name}</h1>
            <Price item={item} size="lg" />
            {text.length > 0 && (
              <div className="flex max-w-[60ch] flex-col gap-3 text-xl text-ink-soft">
                {text.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            )}

            {facts.length > 0 && (
              <section aria-labelledby="piece-facts" className="rounded-frame bg-surface-quiet px-6 py-5">
                <h2 id="piece-facts" className="text-xl text-heading">
                  {t('product.specs')}
                </h2>
                <dl className="mt-2 divide-y divide-[color:var(--rule)]">
                  {facts.map((fact) => (
                    <div key={fact.label} className="flex items-baseline justify-between gap-4 py-2.5">
                      <dt className="text-ink-soft">{fact.label}</dt>
                      <dd className={`text-right font-bold ${fact.alert ? 'text-offer' : 'text-heading'}`}>{fact.value}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}

            <div className="flex flex-wrap items-center gap-3 pt-1">
              {item.availability.state !== 'sold_out' && <QuantityStepper value={quantity} max={max} onChange={setQuantity} label={item.name} />}
              <AddToCart item={item} quantity={quantity} />
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related" className="page pt-20">
          <h2 id="related" className="mb-6 text-[clamp(1.9rem,4vw,2.6rem)] text-heading">
            {t('product.related')}
          </h2>
          <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {related.map((r) => {
              const index = groups.findIndex((c) => c.id === r.categoryId);
              return (
                <li key={r.id}>
                  <PieceCard item={r} category={groups[index]} paintIndex={Math.max(index, 0)} />
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </>
  );
}
