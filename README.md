# Artisan Crafts — storefront template

The colours of a painted Sarchí oxcart for artisans, souvenir shops and
workshops: a painted wheel whose ring turns as you scroll, category panels in
each category's own colours, and pieces under bands of painted teeth. Design
plan: [`DESIGN.md`](DESIGN.md).

## How it works

React 18 + Vite + Tailwind. Everything the store shows is data — branding,
CMS copy (`home`, `about`, `products`, `contact`), products and services,
categories, contact — read through `src/core/`, vendored from the monorepo's
`templates/_core` (do not edit it here). Template code is the design:
`src/components`, `src/pages`, `src/theme`, `src/i18n`.

`/config.json`: `{ "mode": "demo", "templateId": … }` shows the template's demo
rows; a provisioned store gets `{ "mode": "live", "orgId": … }`.

## Pages

`/` · `/products` (`?type=`, `?category=`, `?sale=1`, `?q=`, `?sort=`) ·
`/products/:id` · `/about` · `/contact` · 404. Old URLs (`/deals`,
`/services`, `/category/:slug`…) redirect into the catalog.

## Effects

The wheel turns with the scroll only while it is on screen; reduced motion
(the system setting or `?motion=reduce`) keeps it still. Nothing depends on it.

## Development

```bash
pnpm install
pnpm dev        # http://localhost:5173
pnpm build      # tsc + vite build → dist/
```

Against a local management-be: `TSURU_DEV_API=http://localhost:5000
VITE_PUBLIC_API_URL=http://localhost:5173 pnpm dev`.

## Deployment

`.github/workflows/deploy.yml`: `develop` → GitHub Pages
(`artisan-crafts.examples.tsuru.jcampos.dev`, staging); `main` → production
example hosting; each deploy notifies the provisioner to refresh stores using
this template.
