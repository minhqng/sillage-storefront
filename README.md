# Sillage Storefront

Sillage is a static multi-page ecommerce storefront for a premium niche fragrance startup concept. It was built for a university Web Programming project, but the execution is aimed at a commercially believable direct-to-consumer brand experience rather than a default coursework template.

## Project Overview

The site covers a complete browse-to-checkout journey across a tightly curated fragrance catalog:

- home, shop, product detail, and discovery-set landing
- brand and support pages
- persistent cart
- validated checkout with static confirmation

The brand position is quiet luxury: restrained visuals, editorial product storytelling, and low-friction product discovery.

## Stack

- Vite 8
- Bootstrap 5.3.8
- Vanilla JavaScript ES modules
- Static HTML pages
- Local JSON data files
- `localStorage` for cart persistence

## Folder Structure

```text
.
|-- index.html
|-- shop.html
|-- product.html
|-- discovery.html
|-- about.html
|-- guide.html
|-- faq.html
|-- contact.html
|-- cart.html
|-- checkout.html
|-- public/
|   |-- favicon/
|   `-- images/
|-- src/
|   |-- data/
|   |   |-- products.json
|   |   |-- site.json
|   |   |-- guide.json
|   |   `-- faq.json
|   |-- js/
|   |   |-- core/
|   |   |-- entries/
|   |   `-- render/
|   `-- styles/
|       |-- tokens.css
|       |-- bootstrap-overrides.css
|       |-- main.css
|       `-- components/
|-- dist/
|-- package.json
`-- vite.config.js
```

## Setup Instructions

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Feature List

- JSON-driven fragrance catalog with 7 signature scents and 1 Discovery Set
- Multi-page architecture with a dedicated entry module for each page
- Shop filtering by fragrance family and occasion
- Sorting controls with URL query-state persistence
- Product detail routing through `product.html?slug=...`
- Shared page shell with reusable header, footer, and intro patterns
- Persistent cart badge and cross-page cart state
- Add, remove, increment, decrement, and direct quantity editing in cart
- Cart re-hydration against the current catalog to remove stale items and refresh prices
- Client-side checkout validation, shipping selection, and static order confirmation
- Premium editorial support pages for story, guide, FAQ, and contact

## Technical Decisions

- `src/data/products.json` is the main product source of truth for pricing, sizes, notes, imagery, and discovery-set composition.
- JSON loading is centralized in `src/js/core/data-store.js`, which caches requests and keeps page scripts small.
- Rendering is split from business logic: `core/` handles state and data rules, `render/` returns markup, and `entries/` wires each page together.
- Cart logic is normalized in one store so cart, badge, and checkout all read the same state contract.
- Product pages are static-safe: the selected product is resolved from the URL slug, not from server routing.
- Bootstrap is used as a base system, then overridden through custom tokens, `--bs-*` variable remapping, and custom component CSS to remove the default Bootstrap look.

## Limitations

- No backend, database, authentication, or CMS
- No real payment processing or order persistence
- No live inventory, shipping API, or account system
- No reviews, search engine, or personalization layer

## Future Backend-Ready Extensions

- Replace local JSON with a CMS or product API while keeping the same rendering contract
- Persist carts and orders server-side for signed-in users
- Connect checkout to a payment gateway such as Stripe
- Add inventory, promo codes, fulfillment status, and transactional email
- Add an admin workflow for catalog updates and merchandising
