import { aboutContent, paragraphs, useCmsPage, usePageMeta } from '@/core';
import { useI18n } from '@/i18n';
import { CmsIcon } from '@/components/CmsIcon';
import { PaintedBand } from '@/components/PaintedBand';
import { Placeholder } from '@/components/Placeholder';
import { SectionError } from '@/components/StoreStates';
import { StoreImage } from '@/components/StoreImage';
import { RosetteDivider, Wheel } from '@/components/Wheel';

export default function About() {
  const { t } = useI18n();
  const cms = useCmsPage('about');
  const about = aboutContent(cms.page);
  usePageMeta(cms.page?.title ?? t('nav.about'), cms.page?.metaDescription);
  const story = paragraphs(about.story.content);

  return (
    <>
      <section className="page grid items-center gap-10 pt-10 md:grid-cols-12 md:pt-14">
        <div className="md:col-span-7">
          {cms.isLoading ? (
            <div aria-hidden="true" className="flex flex-col gap-3">
              <div className="skeleton h-14 w-64" />
              <div className="skeleton h-5 w-80 max-w-full" />
            </div>
          ) : cms.isError ? (
            <SectionError title={t('state.error.title')} onRetry={cms.refetch} />
          ) : (
            <>
              <h1 className="text-[clamp(2.7rem,7vw,5rem)] text-heading">{about.hero.title ?? t('nav.about')}</h1>
              {about.hero.subtitle && <p className="mt-5 max-w-xl text-xl text-ink-soft">{about.hero.subtitle}</p>}
            </>
          )}
        </div>
        <div className="md:col-span-5">
          <Wheel image={about.hero.image} priority sizes="(min-width: 768px) 14rem, 46vw" className="mx-auto w-[min(26rem,80vw)] md:w-full" />
        </div>
      </section>

      {(about.story.title || story.length > 0) && (
        <section className="page grid gap-10 pt-16 md:grid-cols-12 md:items-center">
          <div className={about.story.image ? 'md:col-span-7' : 'md:col-span-9'}>
            {about.story.title && <h2 className="text-[clamp(2.1rem,4.5vw,3.25rem)] text-heading">{about.story.title}</h2>}
            <div className="mt-4 flex max-w-[62ch] flex-col gap-3 text-xl text-ink-soft">
              {story.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
          {about.story.image && (
            <div className="frame overflow-hidden shadow-soft md:col-span-5">
              <PaintedBand className="h-3" />
              <div className="aspect-[4/5] overflow-hidden bg-surface-quiet">
                <StoreImage src={about.story.image} alt="" sizes="(min-width: 768px) 35vw, 100vw" maxWidth={960} fallback={<Placeholder />} />
              </div>
            </div>
          )}
        </section>
      )}

      {about.values.items.length > 0 && (
        <>
          <RosetteDivider className="pt-16" />
          <section className="page pt-12">
            {about.values.title && <h2 className="mb-8 text-[clamp(2.1rem,4.5vw,3.25rem)] text-heading">{about.values.title}</h2>}
            <ul className="grid gap-8 md:grid-cols-3">
              {about.values.items.map((value, i) => (
                <li key={value.title} className="flex flex-col gap-3">
                  <span
                    className="grid h-14 w-14 place-items-center rounded-full text-[color:var(--ac-white)]"
                    style={{ background: ['var(--paint-1)', 'var(--paint-3)', 'var(--paint-4)'][i % 3], boxShadow: '0 0 0 4px var(--ac-white), 0 0 0 7px var(--paint-2)' }}
                  >
                    <CmsIcon icon={value.icon} className="h-6 w-6" strokeWidth={2} />
                  </span>
                  <h3 className="text-2xl text-heading">{value.title}</h3>
                  {value.description && <p className="text-ink-soft">{value.description}</p>}
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </>
  );
}
