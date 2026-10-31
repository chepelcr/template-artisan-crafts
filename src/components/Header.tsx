import * as Dialog from '@radix-ui/react-dialog';
import { Menu, ShoppingBag, X, UserRound } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useCart, useCartTotals, useIsDemo, useStore, useStoreName, useAccountLinks } from '@/core';
import { useI18n } from '@/i18n';
import { BASKET_EVENT } from './AddToCart';
import { PaintedBand } from './PaintedBand';
import { Rosette } from './Wheel';
import { ThemeToggle } from './ThemeToggle';

export const NAV = [
  { href: '/', key: 'nav.home' },
  { href: '/products', key: 'nav.catalog' },
  { href: '/about', key: 'nav.about' },
  { href: '/contact', key: 'nav.contact' },
] as const;

export function useIsActive() {
  const [location] = useLocation();
  return (href: string) => (href === '/' ? location === '/' : location === href || location.startsWith(`${href}/`));
}

function StoreMark() {
  const { organization, theme } = useStore();
  const name = useStoreName();
  const logo = theme?.logoUrl ?? organization?.logoUrl ?? null;
  if (!name) return <span aria-hidden="true" className="skeleton block h-8 w-40" />;
  return (
    <span className="flex w-full min-w-0 items-center gap-2">
      {logo ? <img src={logo} alt="" className="h-8 w-8 shrink-0 rounded-full object-cover" /> : <Rosette className="h-8 w-8 shrink-0" />}
      <span className="font-display font-extrabold sm:text-xl min-w-0 flex-1 break-words [overflow-wrap:anywhere] text-base leading-tight">{name}</span>
    </span>
  );
}

export function Header() {
  const { t, plural } = useI18n();
  const name = useStoreName();
  const isDemo = useIsDemo();
  const { count } = useCartTotals();
  const openCart = useCart((s) => s.open);
  const isActive = useIsActive();
  // Barter and the account live in the store's own menus, not in a bar of their own.
  const { barter, account } = useAccountLinks(t);
  const navLinks = [...NAV, barter];
  const menuLinks = [...navLinks, account];
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const [adds, setAdds] = useState(0);

  useEffect(() => {
    const onAdded = () => setAdds((n) => n + 1);
    window.addEventListener(BASKET_EVENT, onAdded);
    return () => window.removeEventListener(BASKET_EVENT, onAdded);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  return (
    <header ref={headerRef} className="relative z-30 bg-surface">
      {isDemo && <p className="bg-surface-deep px-4 py-1.5 text-center text-sm font-medium text-ink-on-deep">{t('demo.notice')}</p>}
      <div className="page flex min-h-12 items-center gap-1.5 sm:min-h-14 py-0.5">
        <Link href="/" title={name || undefined} aria-label={name || undefined} className="flex min-h-tap items-center min-w-0 flex-1 rounded-full pr-1 text-heading lg:flex-initial lg:max-w-[16rem]">
          <StoreMark />
        </Link>

        <nav aria-label={t('nav.primary')} className="ml-auto hidden lg:block">
          <ul className="flex items-center gap-1">
            {navLinks.map(({ href, key }) => (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={isActive(href) ? 'page' : undefined}
                  className="flex min-h-tap items-center rounded-full px-3 text-base font-bold text-ink-soft transition-colors hover:bg-surface-quiet hover:text-heading aria-[current=page]:bg-[color:var(--ac-sun)] aria-[current=page]:text-[color:var(--ac-ink)]"
                >
                  {t(key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Link href={account.href} aria-label={account.label} title={account.label} aria-current={isActive(account.href) ? 'page' : undefined} className="icon-btn shrink-0 text-heading hover:bg-surface-quiet hidden lg:inline-grid">
          <UserRound aria-hidden="true" className="h-5 w-5" />
        </Link>

        <ThemeToggle />

        <button type="button" onClick={openCart} className="btn btn-strong shrink-0 gap-2 pl-3 pr-2 lg:ml-1">
          <ShoppingBag key={adds} aria-hidden="true" className={`h-5 w-5 ${adds ? 'cart-turn' : ''}`} />
          <span className="hidden sm:inline">{t('nav.cart')}</span>
          <span aria-hidden="true" className="grid h-6 min-w-[1.5rem] place-items-center rounded-full bg-[color:var(--ac-sun)] px-1 text-xs font-extrabold tabular-nums text-[color:var(--ac-ink)]">
            {count}
          </span>
          <span className="sr-only">{plural('nav.cart.count', count)}</span>
        </button>

        <Dialog.Root open={menuOpen} onOpenChange={setMenuOpen}>
          <Dialog.Trigger className="icon-btn shrink-0 text-heading hover:bg-surface-quiet lg:hidden" aria-label={t('nav.menu')}>
            <Menu aria-hidden="true" className="h-6 w-6" />
          </Dialog.Trigger>
          <Dialog.Portal container={headerRef.current}>
            <Dialog.Overlay className="overlay fixed inset-0 z-40 bg-[color:var(--scrim)]" />
            <Dialog.Content className="nav-menu fixed inset-x-0 top-0 z-50 max-h-dvh overflow-y-auto overscroll-contain rounded-b-2xl bg-surface px-3 pb-[max(.5rem,env(safe-area-inset-bottom))] pt-[max(.5rem,env(safe-area-inset-top))] text-ink shadow-lift">
              <div className="flex items-center justify-between">
                <Dialog.Title className="font-display text-lg text-heading">{t('nav.menu')}</Dialog.Title>
                <Dialog.Description className="sr-only">{t('nav.primary')}</Dialog.Description>
                <Dialog.Close className="icon-btn -mr-2 text-heading hover:bg-surface-quiet" aria-label={t('nav.close')}>
                  <X aria-hidden="true" className="h-6 w-6" />
                </Dialog.Close>
              </div>
              <nav aria-label={t('nav.primary')}>
                <ul className="flex flex-col">
                  {menuLinks.map(({ href, key }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        onClick={() => setMenuOpen(false)}
                        aria-current={isActive(href) ? 'page' : undefined}
                        className="flex min-h-tap items-center rounded-xl px-3 font-display text-lg font-bold text-heading aria-[current=page]:bg-[color:var(--ac-sun)] aria-[current=page]:text-[color:var(--ac-ink)]"
                      >
                        {t(key)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
      <PaintedBand base="var(--surface)" className="h-2" />
    </header>
  );
}
