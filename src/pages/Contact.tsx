import { MessageCircle } from 'lucide-react';
import { contactContent, orderPhone, useCmsPage, usePageMeta, useStore, whatsappHref } from '@/core';
import { useI18n } from '@/i18n';
import { ContactDetails } from '@/components/ContactDetails';
import { PaintedBand } from '@/components/PaintedBand';
import { SectionError } from '@/components/StoreStates';

export default function Contact() {
  const { t } = useI18n();
  const { contact, isDemo } = useStore();
  const cms = useCmsPage('contact');
  const content = contactContent(cms.page);
  usePageMeta(cms.page?.title ?? t('contact.title'), cms.page?.metaDescription);
  const phone = orderPhone(contact);

  return (
    <div className="page pt-10">
      {cms.isLoading ? (
        <div aria-hidden="true" className="flex flex-col gap-3">
          <div className="skeleton h-14 w-64" />
          <div className="skeleton h-5 w-80 max-w-full" />
        </div>
      ) : cms.isError ? (
        <SectionError title={t('state.error.title')} onRetry={cms.refetch} />
      ) : (
        <header className="max-w-3xl">
          <h1 className="text-[clamp(2.6rem,6.5vw,4.5rem)] text-heading">{content.hero.title ?? t('contact.title')}</h1>
          {content.hero.subtitle && <p className="mt-3 text-xl text-ink-soft">{content.hero.subtitle}</p>}
        </header>
      )}
      <div className="mt-10 grid gap-6 md:grid-cols-12">
        <section className="piece md:col-span-7" aria-label={t('contact.title')}>
          <PaintedBand className="h-3" />
          <div className="px-7 py-8 md:px-10">
            <ContactDetails />
            {phone && !isDemo && (
              <a href={whatsappHref(phone)} target="_blank" rel="noopener noreferrer" className="btn btn-accent mt-8">
                <MessageCircle aria-hidden="true" className="h-4 w-4" />
                {t('contact.whatsapp.cta')}
              </a>
            )}
          </div>
        </section>
        {(content.visit.title || content.visit.note) && (
          <aside className="on-deep h-fit overflow-hidden rounded-frame bg-surface-deep text-ink-on-deep md:col-span-5">
            <PaintedBand className="h-3" base="var(--ac-cobalt)" teeth={['var(--paint-2)', 'var(--paint-1)']} />
            <div className="p-7 md:p-8">
              {content.visit.title && <h2 className="text-3xl">{content.visit.title}</h2>}
              {content.visit.note && <p className="mt-3 text-lg text-ink-on-deep-soft">{content.visit.note}</p>}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
