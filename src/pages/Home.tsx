import { Link } from 'wouter';
import { categoriesWithItems, facetsFor, featuredItems, homeContent, paragraphs, useCatalog, useCmsPage, usePageMeta } from '@/core';
import { useI18n } from '@/i18n';
import { CategoryPanel } from '@/components/CategoryPanel';
import { CmsIcon } from '@/components/CmsIcon';
import { PaintedBand } from '@/components/PaintedBand';
import { PieceCard, PieceCardSkeleton } from '@/components/PieceCard';
import { Placeholder } from '@/components/Placeholder';
import { SectionError } from '@/components/StoreStates';
import { StoreImage } from '@/components/StoreImage';
import { RosetteDivider, Wheel } from '@/components/Wheel';

export default function Home() {
  const { t } = useI18n();
  const cms = useCmsPage('home');
  const home = homeContent(cms.page);
  const catalog = useCatalog();
  usePageMeta(cms.page?.title, cms.page?.metaDescription);

  const featured = featuredItems(catalog.items, 8);
  const panels = categoriesWithItems(catalog.categories, catalog.items);
  const counts = facetsFor(catalog.items).categories;
  const indexOf = (id: string | null) => panels.findIndex((c) => c.id === id);
  const story = paragraphs(home.story.content);

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="page grid items-center gap-x-10 gap-y-10 pb-12 pt-10 md:grid-cols-12 md:pb-16 md:pt-14">
          <div className="md:col-span-6">
            {cms.isLoading ? (
              <div aria-hidden="true" className="flex flex-col gap-4">
                <div className="skeleton h-8 w-40" />
                <div className="skeleton h-16 w-full" />
                <div className="skeleton h-16 w-4/5" />
                <div className="skeleton h-5 w-3/4" />
              </div>
            ) : cms.isError ? (
              <SectionError title={t('state.error.title')} onRetry={cms.refetch} />
            ) : (
              <>
                {home.hero.badge && <p className="mb-5 inline-flex rounded-full bg-[color:var(--ac-sun)] px-4 py-1.5 font-bold text-[color:var(--ac-ink)]">{home.hero.badge}</p>}
                {home.hero.title && <h1 className="text-[clamp(2.7rem,6.5vw,5rem)] text-heading">{home.hero.title}</h1>}
                {home.hero.subtitle && <p className="mt-6 max-w-[36rem] text-xl text-ink-soft">{home.hero.subtitle}</p>}
                <div className="mt-9 flex flex-wrap gap-3">
                  {home.hero.ctaPrimary && (
                    <Link href="/products" className="btn btn-accent">
                      {home.hero.ctaPrimary}
                    </Link>
                  )}
                  {home.hero.ctaSecondary && (
                    <Link href="/contact" className="btn btn-quiet">
                      {home.hero.ctaSecondary}
                    </Link>
                  )}
                </div>
              </>
            )}
          </div>
          <div className="md:col-span-6">
            <Wheel image={home.hero.image} priority sizes="(min-width: 768px) 17rem, 46vw" className="mx-auto w-[min(32rem,88vw)] md:w-full" />
          </div>
        </div>
      </section>

      {(panels.length > 0 || catalog.isLoading) && (
        <section aria-labelledby={home.categories.title ? 'home-panels' : undefined} className="page pt-10">
          {(home.categories.title || home.categories.subtitle) && (
            <div className="mb-7 max-w-2xl">
              {home.categories.title && (
                <h2 id="home-panels" className="text-[clamp(2.1rem,4.5vw,3.25rem)] text-heading">
                  {home.categories.title}
                </h2>
              )}
              {home.categories.subtitle && <p className="mt-2 text-xl text-ink-soft">{home.categories.subtitle}</p>}
            </div>
          )}
          {catalog.isLoading ? (
            <div aria-hidden="true" className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {Array.from({ length: 5 }, (_, i) => (
                <div key={i} className="skeleton h-64 rounded-frame" />
              ))}
            </div>
          ) : (
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 max-sm:[&>li:last-child:nth-child(odd)]:col-span-2">
              {panels.map((category, index) => (
                <li key={category.id}>
                  <CategoryPanel category={category} count={counts.get(category.id) ?? 0} index={index} />
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      <RosetteDivider className="pt-16" />

      <section aria-labelledby={home.featured.title ? 'home-pieces' : undefined} className="page pt-12">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            {home.featured.badge && <p className="mb-2 text-lg font-bold text-accent-text">{home.featured.badge}</p>}
            {home.featured.title && (
              <h2 id="home-pieces" className="text-[clamp(2.1rem,4.5vw,3.25rem)] text-heading">
                {home.featured.title}
              </h2>
            )}
            {home.featured.subtitle && <p className="mt-2 text-xl text-ink-soft">{home.featured.subtitle}</p>}
          </div>
          {catalog.items.length > 0 && (
            <Link href="/products" className="btn btn-quiet">
              {t('catalog.viewAll')}
            </Link>
          )}
        </div>
        {catalog.isLoading ? (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {Array.from({ length: 4 }, (_, i) => (
              <PieceCardSkeleton key={i} />
            ))}
          </div>
        ) : catalog.isError ? (
          <SectionError title={t('catalog.error.title')} onRetry={catalog.refetch} />
        ) : featured.length === 0 ? (
          <p className="piece p-6 text-ink-soft">{t('catalog.empty.store')}</p>
        ) : (
          <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {featured.map((item) => {
              const index = indexOf(item.categoryId);
              return (
                <li key={item.id}>
                  <PieceCard item={item} category={panels[index]} paintIndex={Math.max(index, 0)} />
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {home.benefits.length > 0 && (
        <section className="page pt-20">
          <ul className="grid gap-8 md:grid-cols-3">
            {home.benefits.map((benefit, i) => (
              <li key={benefit.title} className="flex gap-4">
                <span
                  className="grid h-14 w-14 shrink-0 place-items-center rounded-full text-[color:var(--ac-white)]"
                  style={{ background: ['var(--paint-1)', 'var(--paint-3)', 'var(--paint-4)'][i % 3], boxShadow: '0 0 0 4px var(--ac-white), 0 0 0 7px var(--paint-2)' }}
                >
                  <CmsIcon icon={benefit.icon} className="h-6 w-6" strokeWidth={2} />
                </span>
                <div>
                  <h3 className="text-2xl text-heading">{benefit.title}</h3>
                  {benefit.description && <p className="mt-1 text-ink-soft">{benefit.description}</p>}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {(home.story.title || story.length > 0) && (
        <section className="page pt-20">
          <div className="grid gap-8 md:grid-cols-12 md:items-center md:gap-12">
            {home.story.image && (
              <div className="frame overflow-hidden shadow-soft md:col-span-6">
                <PaintedBand className="h-3" />
                <div className="aspect-[4/3] overflow-hidden bg-surface-quiet">
                  <StoreImage src={home.story.image} alt="" sizes="(min-width: 768px) 45vw, 100vw" maxWidth={1280} fallback={<Placeholder />} />
                </div>
                <PaintedBand className="h-3" teeth={['var(--paint-3)', 'var(--paint-4)', 'var(--paint-1)', 'var(--paint-2)']} />
              </div>
            )}
            <div className={home.story.image ? 'md:col-span-6' : 'md:col-span-9'}>
              {home.story.title && <h2 className="text-[clamp(2.1rem,4.5vw,3.25rem)] text-heading">{home.story.title}</h2>}
              <div className="mt-4 flex max-w-[60ch] flex-col gap-3 text-xl text-ink-soft">
                {story.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              <Link href="/about" className="btn btn-quiet mt-7">
                {t('nav.about')}
              </Link>
            </div>
          </div>
        </section>
      )}

      {(home.cta.title || home.cta.description) && (
        <section className="page pt-20">
          <div className="on-deep overflow-hidden rounded-frame bg-surface-deep text-ink-on-deep">
            <PaintedBand className="h-3" base="var(--ac-cobalt)" teeth={['var(--paint-2)', 'var(--paint-1)']} />
            <div className="flex flex-col gap-6 p-8 md:flex-row md:items-center md:justify-between md:p-12">
              <div className="max-w-xl">
                {home.cta.title && <h2 className="text-[clamp(2rem,4vw,2.75rem)]">{home.cta.title}</h2>}
                {home.cta.description && <p className="mt-2 text-xl text-ink-on-deep-soft">{home.cta.description}</p>}
              </div>
              {home.cta.buttonText && (
                <Link href="/contact" className="btn btn-sun shrink-0">
                  {home.cta.buttonText}
                </Link>
              )}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
