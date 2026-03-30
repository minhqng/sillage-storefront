# PROJECT_BRIEF

## Metadata
- project_name: Sillage
- project_type: Static multi-page ecommerce storefront
- category: Modern niche fragrance
- brand_positioning: A quiet-luxury fragrance house translating atmosphere into wearable scent through a restrained D2C shopping experience
- stack: Vite, Bootstrap 5.3.x, vanilla JavaScript ES modules, JSON data files, localStorage cart persistence

## Product Vision
- Build a startup-grade ecommerce website for Sillage, a premium niche fragrance brand.
- Deliver a commercially believable shopping experience centered on scent storytelling, discovery, gifting, and elegant product presentation.
- Make the static architecture feel intentional by focusing on a curated catalog, editorial content, and polished UX instead of backend-dependent features.

## Target User
- primary_user: Design-conscious urban professionals aged 24-38 who buy fragrance for identity, mood, and self-expression
- secondary_user: Gift shoppers seeking a refined premium product with low decision friction
- user_expectations: Clear scent information, polished visuals, easy navigation, trustworthy cart behavior, and a checkout flow that feels complete

## Goals
- Present a strong, premium brand identity with no student-project cues.
- Render shop listing and product detail views from JSON-driven product data.
- Support a complete browse-to-cart-to-checkout flow with persistent cart state.
- Maintain a responsive multi-page experience suitable for live demo evaluation.
- Keep data, UI, and behavior cleanly separated for maintainability.

## Non-Goals
- Real payments, order processing, shipment tracking, or account systems
- Backend services, databases, CMS integration, or authentication
- Live inventory, user reviews, personalization, or recommendation engines
- Overly complex ecommerce behaviors that are not credible in a static site

## Scope
- In scope: 6-8 signature fragrances plus discovery set, travel formats, gift set, and 1-2 accessories
- In scope: Multi-page storefront with brand, catalog, product detail, cart, checkout, support, and editorial pages
- In scope: Client-side filtering and sorting using local JSON data
- In scope: Static-safe product detail routing via URL parameter or equivalent
- Out of scope: Real commerce infrastructure, admin tools, and external service integrations

## Constraints
- Must use Vite
- Must use Bootstrap 5.3.x, fully customized to remove default Bootstrap visual identity
- Must use vanilla JavaScript ES modules
- `products.json` must be the main product data source
- Cart state must persist in localStorage across reloads
- Architecture must remain static and multi-page
- No database, backend, jQuery, or frontend frameworks
- No placeholder copy, broken links, empty pages, or fake dynamic behavior that fails on reload

## Required Pages
- Home
- Shop / All Fragrances
- Product Detail
- Discovery Set or Gift Set landing page
- About / Brand Story
- Scent Guide or Journal
- Cart
- Checkout
- FAQ / Shipping / Returns
- Contact

## Feature List
- JSON-driven product catalog with fields for fragrance family, notes, mood, size, price, imagery, and descriptive copy
- Shop listing with filter and sort controls based on local catalog data
- Product detail page resolved from URL state and populated from JSON
- Add-to-cart, quantity update, remove-item, and empty-cart states using localStorage
- Persistent cart count and totals across pages
- Checkout form with client-side validation and static confirmation behavior
- Discovery set and gift merchandising to support fragrance selection confidence
- Shared navigation, footer, and cross-page UI consistency
- Graceful handling for invalid product URLs and empty data states
- Editorial content that reinforces brand identity and improves perceived product quality

## Acceptance Criteria
- All required pages exist and are reachable through navigation or footer links
- The storefront consistently represents one brand: Sillage, a premium niche fragrance house
- The shop page renders catalog content from `products.json` rather than hardcoded repeated product markup
- The product detail page loads the correct product from URL state and handles invalid identifiers with a branded fallback
- Users can add items from listing and detail pages, update quantities, remove items, and view accurate totals
- Cart contents persist after reload and remain consistent across browsing, cart, and checkout flows
- Checkout validates required fields and shows a believable static success state
- Responsive layouts remain acceptable on mobile, tablet, and desktop
- No obvious console errors appear during the main demo path
- No placeholder text, broken links, empty sections, or default Bootstrap styling remain visible

## Success Criteria

### Design
- The site feels premium, restrained, and specific to fragrance rather than generic luxury ecommerce
- Typography, spacing, palette, imagery treatment, and component styling remain consistent across all pages
- Visual hierarchy is clean and spacious, with strong whitespace and minimal clutter

### Architecture
- Product data, rendering logic, and shared UI behavior are separated into maintainable modules
- Catalog and product detail views are data-driven from JSON
- Shared components and cart state handling avoid brittle duplication
- The implementation remains fully static-safe and reliable after reload

### UX
- Navigation is clear and consistent on first use
- Product discovery is supported through scent families, notes, mood, and discovery-set pathways
- The core journey is friction-light: browse, inspect, add to cart, review cart, complete checkout
- Empty, invalid, and edge states feel intentional rather than broken

### Demo Quality
- The site is credible as a startup product during professor evaluation
- The main demo flow works smoothly without needing verbal excuses for missing behavior
- The experience feels commercially believable, not like a default Bootstrap coursework template
- Manual verification shows acceptable responsiveness, no broken states, and no obvious polish gaps

## Build Specification

### Shared Data Sources
- `src/data/products.json`: source of truth for catalog items, fragrance metadata, pricing, imagery, related-product logic, and discovery set contents
- `src/data/site.json`: brand metadata, primary navigation, footer groups, featured product IDs, support-strip content, and shared CTAs
- `src/data/guide.json`: scent-guide sections, scent-family definitions, and recommended product links
- `src/data/faq.json`: grouped FAQ content for support and checkout reassurance
- `localStorage["sillage-cart"]`: cart line items with product id and quantity

### Complete Sitemap

| page | path | purpose |
| --- | --- | --- |
| Home | `index.html` | Brand entry, featured shopping pathways, hero storytelling |
| Shop | `shop.html` | Full catalog browsing, filter, sort, add-to-cart entry point |
| Product Detail | `product.html?slug={product-slug}` | Product storytelling, product data, add-to-cart |
| Discovery Set | `discovery.html` | Low-friction first purchase and gifting entry point |
| About | `about.html` | Brand story, philosophy, and trust building |
| Scent Guide | `guide.html` | Fragrance education, scent-family navigation, guided product discovery |
| FAQ | `faq.html` | Shipping, returns, sampling, and support answers |
| Contact | `contact.html` | Support contact details and service expectations |
| Cart | `cart.html` | Cart review, quantity updates, order summary |
| Checkout | `checkout.html` | Static checkout form, validation, order summary, confirmation state |

### Shared Layout Components
- Global header with wordmark, primary navigation, cart count, and mobile navigation trigger
- Global footer with brand block, navigation links, support links, and contact details
- Shared page intro block for non-home pages: eyebrow, title, short supporting copy
- Shared section header pattern: small label, heading, short paragraph, optional CTA
- Shared support strip: shipping, discovery, or returns reassurance
- Shared empty-state pattern for invalid product, empty cart, and no-results states
- Shared CTA band for moving users from editorial/support pages back into commerce

### Reusable UI Patterns
- Product card
- Product meta row: name, scent family, size, price
- Filter bar with chips, select control, and results summary
- Editorial split section: text plus image
- Feature tiles for scent families, gifting, or support promises
- Breadcrumbs on all non-home commerce pages
- Quantity stepper
- Order summary card
- Accordion group for FAQ and support content
- Form field group with label, helper text, error message, and validation state
- Branded fallback state for invalid slug, empty cart, and empty filter results

### Page-by-Page Specification

#### Home
- Content hierarchy:
  1. Hero with brand statement, primary CTA to Shop, secondary CTA to Discovery Set
  2. Featured fragrance row
  3. Discovery Set value proposition
  4. Scent-family pathways or curated collection tiles
  5. Brand-story split section
  6. Ritual or gifting support strip
- Component inventory:
  - Global header
  - Hero section
  - Featured product grid
  - Discovery promo block
  - Collection tiles
  - Editorial split section
  - Support strip
  - Global footer
- Data dependencies:
  - `site.json` for hero copy, featured IDs, nav, footer, support strip
  - `products.json` for featured product cards
  - `localStorage["sillage-cart"]` for cart count
- Navigation flow:
  - Outbound to `shop.html`, `discovery.html`, `product.html`, `about.html`, `guide.html`
  - Global cart access to `cart.html`

#### Shop
- Content hierarchy:
  1. Page intro
  2. Filter and sort controls
  3. Active filter state and results summary
  4. Product grid
  5. Empty-results fallback
  6. Support or discovery CTA band
- Component inventory:
  - Global header
  - Page intro
  - Filter bar
  - Product card grid
  - Empty-state block
  - CTA band
  - Global footer
- Data dependencies:
  - `products.json` for full catalog render
  - URL query state for filter or sort persistence
  - `localStorage["sillage-cart"]` for cart count and add-to-cart behavior
- Navigation flow:
  - Inbound from Home, Guide, About, Discovery
  - Outbound to `product.html`, `cart.html`, `discovery.html`, `guide.html`

#### Product Detail
- Content hierarchy:
  1. Breadcrumbs
  2. Product media and product header
  3. Price, size, quantity, add-to-cart
  4. Fragrance notes and scent profile
  5. Product story or mood narrative
  6. Related products
  7. Support microcopy for discovery, shipping, and returns
- Component inventory:
  - Global header
  - Breadcrumbs
  - Product media block
  - Product purchase panel
  - Notes/specification list
  - Editorial story block
  - Related product row
  - Support strip
  - Global footer
- Data dependencies:
  - `products.json` resolved by `slug` query param
  - Derived related items from `products.json` using scent family or tags
  - `localStorage["sillage-cart"]` for cart count and add-to-cart
- Navigation flow:
  - Inbound from Shop, Home, Guide, Discovery related links
  - Outbound to `cart.html`, `shop.html`, other `product.html` items, `guide.html`
  - Invalid slug must route to branded fallback state with links to `shop.html` and `discovery.html`

#### Discovery Set
- Content hierarchy:
  1. Page intro with low-risk purchase framing
  2. Discovery Set product block and add-to-cart
  3. Included fragrances overview
  4. How-to-use or how-to-choose section
  5. Full-size conversion CTA
- Component inventory:
  - Global header
  - Page intro
  - Product feature block
  - Included-items grid
  - Step or info strip
  - CTA band
  - Global footer
- Data dependencies:
  - Discovery Set entry from `products.json`
  - Included-product references from `products.json`
  - `site.json` for shared CTA and support copy
  - `localStorage["sillage-cart"]` for cart behavior
- Navigation flow:
  - Inbound from Home, Shop, Product, About
  - Outbound to `cart.html`, `shop.html`, linked `product.html` items

#### About
- Content hierarchy:
  1. Page intro
  2. Brand story
  3. Design philosophy and product point of view
  4. Material, ritual, or packaging values
  5. CTA back into catalog
- Component inventory:
  - Global header
  - Page intro
  - Editorial split sections
  - Values or principles grid
  - CTA band
  - Global footer
- Data dependencies:
  - `site.json` for brand summary, nav, footer, CTA copy
  - Static page content for long-form story
  - `localStorage["sillage-cart"]` for cart count
- Navigation flow:
  - Inbound from Home and footer
  - Outbound to `shop.html`, `discovery.html`, `guide.html`

#### Scent Guide
- Content hierarchy:
  1. Page intro
  2. Scent-family overview
  3. Notes decoding section
  4. How to choose fragrance section
  5. Recommended products grouped by family or mood
- Component inventory:
  - Global header
  - Page intro
  - Editorial content blocks
  - Scent-family tiles
  - Recommendation product row
  - FAQ teaser or support strip
  - Global footer
- Data dependencies:
  - `guide.json` for content sections and family definitions
  - `products.json` for linked recommendations
  - `site.json` for shared nav and footer
  - `localStorage["sillage-cart"]` for cart count
- Navigation flow:
  - Inbound from Home, Product, About, FAQ
  - Outbound to `shop.html`, filtered browsing intent, and individual `product.html` pages

#### FAQ
- Content hierarchy:
  1. Page intro
  2. Shipping and delivery group
  3. Discovery and returns group
  4. Ordering and checkout group
  5. Contact CTA
- Component inventory:
  - Global header
  - Page intro
  - Accordion groups
  - Support strip
  - CTA band
  - Global footer
- Data dependencies:
  - `faq.json` grouped by topic
  - `site.json` for contact CTA and shared navigation
  - `localStorage["sillage-cart"]` for cart count
- Navigation flow:
  - Inbound from footer, Product, Checkout
  - Outbound to `contact.html`, `cart.html`, `checkout.html`, `shop.html`

#### Contact
- Content hierarchy:
  1. Page intro
  2. Support contact methods
  3. Response-time expectations
  4. FAQ shortcut links
  5. CTA back to shopping
- Component inventory:
  - Global header
  - Page intro
  - Contact information cards
  - Support detail block
  - CTA band
  - Global footer
- Data dependencies:
  - `site.json` for support email, response window, nav, footer
  - `localStorage["sillage-cart"]` for cart count
- Navigation flow:
  - Inbound from footer and FAQ
  - Outbound to `faq.html`, `shop.html`, `about.html`

#### Cart
- Content hierarchy:
  1. Page intro
  2. Cart line items
  3. Order summary
  4. Discovery or support reassurance
  5. Empty-cart fallback when no items exist
- Component inventory:
  - Global header
  - Page intro
  - Cart item list
  - Quantity steppers
  - Order summary card
  - Empty-state block
  - Support strip
  - Global footer
- Data dependencies:
  - `localStorage["sillage-cart"]` for current cart state
  - `products.json` for product details and pricing lookup
  - `site.json` for support strip and nav
- Navigation flow:
  - Inbound from any page via cart icon and from Product or Discovery add-to-cart CTA
  - Outbound to `checkout.html`, `shop.html`, and linked `product.html` items

#### Checkout
- Content hierarchy:
  1. Page intro
  2. Customer details form
  3. Shipping details form
  4. Order summary
  5. Submit action
  6. Static success state after valid submission
- Component inventory:
  - Global header
  - Page intro
  - Checkout form groups
  - Order summary card
  - Inline validation states
  - Success confirmation panel
  - Global footer
- Data dependencies:
  - `localStorage["sillage-cart"]` for line items
  - `products.json` for pricing and order summary
  - `faq.json` or `site.json` for reassurance copy
- Navigation flow:
  - Inbound from `cart.html`
  - Outbound to success state within `checkout.html`, `faq.html`, `shop.html`
  - Empty-cart access must show branded empty-checkout state with link back to `shop.html` and `cart.html`

### Navigation Flow Between Pages
- Primary commerce path: `Home -> Shop -> Product Detail -> Cart -> Checkout`
- Discovery-led path: `Home -> Discovery Set -> Cart -> Checkout`
- Trust-building path: `Product Detail -> Scent Guide -> Product Detail or Shop`
- Brand path: `Home -> About -> Shop or Discovery Set`
- Support path: `Footer or Checkout -> FAQ -> Contact`
- Global navigation available on every page: `Home`, `Shop`, `Discovery Set`, `About`, `Scent Guide`, `FAQ`, `Cart`
- Footer navigation available on every page: `Shop`, `About`, `Guide`, `FAQ`, `Contact`
- Cart icon in header must be the universal shortcut into `cart.html` from all pages

## Technical Architecture

### Architecture Summary
- Use Vite in multi-page mode with one HTML entry per page at repo root.
- Keep `products.json` as the authoritative catalog source for shop listing, product detail, related products, pricing, and discovery-set composition.
- Use URL query state for static-safe product detail and shop filter persistence:
  - Product detail: `product.html?slug={product-slug}`
  - Shop state: `shop.html?family={family}&mood={mood}&sort={sortKey}`
- Use localStorage as the only client-side state layer for the cart:
  - key: `sillage-cart`
- Split code into page entry modules, domain modules, render modules, and utility modules.

### Repo Tree
```text
sillage-storefront/
├─ index.html
├─ shop.html
├─ product.html
├─ discovery.html
├─ about.html
├─ guide.html
├─ faq.html
├─ contact.html
├─ cart.html
├─ checkout.html
├─ package.json
├─ vite.config.js
├─ PROJECT_BRIEF.md
├─ DESIGN_SYSTEM.md
├─ PLANS.md
├─ AGENTS.md
├─ code_review.md
├─ public/
│  ├─ images/
│  │  ├─ products/
│  │  ├─ editorial/
│  │  └─ icons/
│  └─ favicon/
└─ src/
   ├─ data/
   │  ├─ products.json
   │  ├─ site.json
   │  ├─ guide.json
   │  └─ faq.json
   ├─ js/
   │  ├─ entries/
   │  │  ├─ home.js
   │  │  ├─ shop.js
   │  │  ├─ product.js
   │  │  ├─ discovery.js
   │  │  ├─ about.js
   │  │  ├─ guide.js
   │  │  ├─ faq.js
   │  │  ├─ contact.js
   │  │  ├─ cart.js
   │  │  └─ checkout.js
   │  ├─ core/
   │  │  ├─ app-shell.js
   │  │  ├─ data-store.js
   │  │  ├─ product-service.js
   │  │  ├─ related-service.js
   │  │  ├─ cart-store.js
   │  │  ├─ filter-state.js
   │  │  ├─ sort-state.js
   │  │  ├─ query-state.js
   │  │  └─ checkout-service.js
   │  ├─ render/
   │  │  ├─ header.js
   │  │  ├─ footer.js
   │  │  ├─ page-intro.js
   │  │  ├─ product-card.js
   │  │  ├─ product-grid.js
   │  │  ├─ product-detail.js
   │  │  ├─ related-products.js
   │  │  ├─ cart-view.js
   │  │  ├─ checkout-view.js
   │  │  ├─ faq-view.js
   │  │  ├─ guide-view.js
   │  │  └─ empty-state.js
   │  └─ utils/
   │     ├─ dom.js
   │     ├─ storage.js
   │     ├─ format.js
   │     ├─ validate.js
   │     ├─ collection.js
   │     └─ guards.js
   └─ styles/
      ├─ main.css
      ├─ tokens.css
      ├─ bootstrap-overrides.css
      ├─ utilities.css
      └─ components/
         ├─ header.css
         ├─ footer.css
         ├─ product-card.css
         ├─ product-detail.css
         ├─ forms.css
         ├─ cart.css
         └─ checkout.css
```

### Module Responsibilities

| module | responsibility |
| --- | --- |
| `entries/*.js` | Page-specific bootstrapping, page-level data loading, page render orchestration |
| `core/app-shell.js` | Render shared header/footer, sync cart badge, initialize shared UI behavior |
| `core/data-store.js` | Fetch JSON once, cache in memory, expose `getProducts()`, `getSite()`, `getGuide()`, `getFaq()` |
| `core/product-service.js` | Normalize product data, resolve product by slug/id, expose listing-ready products |
| `core/related-service.js` | Compute related products from `relatedIds` first, then fallback to same family/tags |
| `core/cart-store.js` | Read/write `sillage-cart`, add/update/remove items, compute totals, emit cart update events |
| `core/filter-state.js` | Parse and apply shop filters from URL state and UI controls |
| `core/sort-state.js` | Validate sort key and return sorted product arrays |
| `core/query-state.js` | Read/write query params without breaking static routing |
| `core/checkout-service.js` | Validate checkout form payload and manage success-state transition |
| `render/header.js` | Render global navbar and cart count placeholder |
| `render/footer.js` | Render shared footer links and support content |
| `render/page-intro.js` | Render consistent internal page hero/title block |
| `render/product-card.js` | Render reusable catalog card markup |
| `render/product-grid.js` | Render product lists and no-results state |
| `render/product-detail.js` | Render product page media, metadata, notes, purchase controls |
| `render/related-products.js` | Render related product row from service output |
| `render/cart-view.js` | Render cart lines, summary, totals, and empty-cart state |
| `render/checkout-view.js` | Render checkout summary, validation feedback, and success panel |
| `render/faq-view.js` | Render grouped FAQ accordion |
| `render/guide-view.js` | Render scent guide sections and recommended product groups |
| `render/empty-state.js` | Render branded invalid slug, empty cart, and empty filter states |
| `utils/dom.js` | Query helpers, mount helpers, delegation helpers |
| `utils/storage.js` | Safe localStorage read/write with version fallback |
| `utils/format.js` | Currency formatting, quantity labels, note-list formatting |
| `utils/validate.js` | Email, required field, and checkout form validation helpers |
| `utils/collection.js` | Grouping, dedupe, mapping, sorting helpers |
| `utils/guards.js` | Runtime guards for missing selectors, invalid data, and unsupported state |

### Schemas

#### Product Schema
- `products.json` is the main product data source and must support all commerce rendering.
- Each product object must follow this shape:

```json
{
  "id": "ambre-veil",
  "slug": "ambre-veil",
  "type": "fragrance",
  "status": "active",
  "name": "Ambre Veil",
  "subtitle": "Amber, iris, cedar smoke",
  "family": "amber-woods",
  "tags": ["warm", "evening", "resinous"],
  "price": 128,
  "currency": "USD",
  "sizes": [
    {
      "id": "50ml",
      "label": "50 ml",
      "volumeMl": 50,
      "price": 128,
      "default": true
    },
    {
      "id": "100ml",
      "label": "100 ml",
      "volumeMl": 100,
      "price": 188,
      "default": false
    }
  ],
  "images": {
    "card": "/images/products/ambre-veil/card.jpg",
    "primary": "/images/products/ambre-veil/primary.jpg",
    "gallery": [
      "/images/products/ambre-veil/detail-1.jpg",
      "/images/products/ambre-veil/detail-2.jpg"
    ]
  },
  "notes": {
    "top": ["bergamot", "pink pepper"],
    "heart": ["iris", "amber resin"],
    "base": ["cedar", "musk"]
  },
  "mood": ["quiet", "textural", "evening"],
  "intensity": "medium",
  "description": "A warm, dry amber with soft smoke and polished woods.",
  "story": [
    "Editorial product story paragraph one.",
    "Editorial product story paragraph two."
  ],
  "includedProductIds": [],
  "relatedIds": ["bois-blanc", "vetiver-form"],
  "featured": {
    "home": true,
    "shop": true
  },
  "sortOrder": 10
}
```

#### Product Schema Rules
- `id` must be unique across the catalog.
- `slug` must be unique and is the only key used for static-safe product detail URLs.
- `type` values: `fragrance`, `discovery-set`, `gift-set`, `accessory`.
- `status` values: `active`, `hidden`.
- `price` is the base display price for listing cards.
- `sizes` is required for products with selectable volume; use a single default item for fixed-size products.
- `includedProductIds` is only populated for discovery sets or bundles.
- `relatedIds` is optional; when absent, related products are derived from family and tags.
- Shop listing uses only products where `status === "active"` and `type !== "gift-set"` only if intentionally excluded by merchandising rules.
- Discovery page pulls the primary discovery-set product from `products.json`, not from a separate product source.

#### Cart Schema
- localStorage key: `sillage-cart`

```json
{
  "version": 1,
  "updatedAt": "2026-03-29T10:30:00.000Z",
  "items": [
    {
      "productId": "ambre-veil",
      "sizeId": "50ml",
      "quantity": 2,
      "unitPrice": 128,
      "addedAt": "2026-03-29T10:20:00.000Z"
    }
  ]
}
```

#### Cart Schema Rules
- `version` supports future schema migration.
- `items` is the only persisted cart payload.
- `productId` maps back to `products.json`.
- `sizeId` maps to a product size entry; for fixed-size products, store the default size id.
- `unitPrice` is stored as a snapshot for resilience, but current product data remains the preferred display source when available.
- Quantity must be an integer greater than `0`.
- Missing or invalid cart data must fail safely to an empty cart state.

### Rendering Flow

#### Shared Boot Flow
1. Each HTML page mounts a page-specific entry module from `src/js/entries/`.
2. The entry module calls `app-shell.js` to render header, footer, cart badge, and shared nav state.
3. Shared data is loaded through `data-store.js` and cached per page session.
4. Page-specific services prepare a view model.
5. Render modules output HTML into predefined mount points.
6. Event delegation is attached after initial render.
7. Cart badge subscribes to cart updates and rerenders independently.

#### Shop Listing Flow
1. `shop.js` loads `products.json`.
2. `filter-state.js` parses current query params.
3. `product-service.js` returns active listing products.
4. `filter-state.js` filters the collection.
5. `sort-state.js` sorts the filtered result.
6. `product-grid.js` renders cards.
7. If result count is `0`, `empty-state.js` renders a branded no-results state.

#### Product Detail Flow
1. `product.js` reads `slug` from the query string.
2. `product-service.js` resolves a matching product from `products.json`.
3. If found, `product-detail.js` renders the detail view.
4. `related-service.js` computes related products.
5. `related-products.js` renders the related row.
6. If not found, `empty-state.js` renders an invalid-product fallback with links to Shop and Discovery.

#### Related Products Flow
1. Use explicit `relatedIds` when present.
2. If absent, derive from same `family`.
3. If more products are needed, expand by shared `tags`.
4. Exclude the current product and hidden products.
5. Cap the row to `3` or `4` items.

#### Cart Flow
1. `cart.js` loads cart from localStorage through `cart-store.js`.
2. `products.json` is loaded to join persisted items with live product data.
3. `cart-view.js` renders line items and totals.
4. Quantity or remove actions mutate store state and trigger partial rerender.
5. If the cart becomes empty, swap to empty-cart state.

#### Checkout Flow
1. `checkout.js` loads cart and product data.
2. If cart is empty, render empty-checkout state and disable submission path.
3. Otherwise render checkout form and order summary.
4. On submit, `checkout-service.js` validates required fields.
5. If valid, show static success state on the same page and clear cart.
6. After success, header cart badge updates to `0`.

### Event Flow

| trigger | handler | result |
| --- | --- | --- |
| `DOMContentLoaded` | page entry module | Initialize shell, load data, render page |
| Filter control change | `filter-state.js` | Update query params and rerender product grid |
| Sort control change | `sort-state.js` | Update query params and rerender product grid |
| Product card click | native navigation | Go to `product.html?slug={slug}` |
| Add to cart click | `cart-store.addItem()` | Persist item, emit `cart:updated`, refresh badge |
| Quantity stepper click | `cart-store.updateItem()` | Persist new quantity, rerender cart summary |
| Remove line click | `cart-store.removeItem()` | Remove line, rerender cart or empty state |
| Clear invalid cart data | `cart-store.getState()` | Reset to empty safe state |
| Checkout submit | `checkout-service.validate()` | Show errors or success state |
| Successful checkout | `cart-store.clear()` | Empty cart and update header badge |

#### Custom Event Policy
- Dispatch one shared browser event after any cart mutation:
  - `window.dispatchEvent(new CustomEvent("cart:updated"))`
- Header badge, cart summary, and checkout summary subscribe to `cart:updated`.
- Avoid page-wide full rerenders; rerender only the affected UI block.

### Risks
- Slug collisions break product detail loading.
- Mitigation: validate unique `slug` values in `product-service.js` during development and log a hard error for duplicates.
- Product schema drift breaks rendering across pages.
- Mitigation: centralize normalization in `product-service.js`; all pages consume the same normalized shape.
- Filter state becomes inconsistent after reload.
- Mitigation: make query string the source of truth for shop filters and sort state.
- localStorage corruption causes broken cart states.
- Mitigation: wrap parse logic in `storage.js`, validate shape, and fall back to an empty cart.
- Related products feel random or repetitive.
- Mitigation: support explicit `relatedIds` first and only use family/tag fallback when needed.
- Default Bootstrap styling leaks into production UI.
- Mitigation: keep all page rendering on custom classes and override Bootstrap primitives defined in `DESIGN_SYSTEM.md`.
- Missing product IDs referenced by bundles or related items create silent failures.
- Mitigation: guard references in `product-service.js` and skip invalid links with console warnings in development.

### Manual Browser Verification Checklist
1. Open `shop.html` and confirm all listing products render from `products.json`.
2. Apply each filter and sort option, then reload the page and verify state persists from the URL.
3. Click a product card and confirm `product.html?slug={slug}` loads the correct product.
4. Manually change the `slug` to an invalid value and verify the branded invalid-product state appears.
5. Confirm related products render on valid product pages and never include the current product.
6. Add an item to cart from Shop and from Product Detail; verify the cart badge updates immediately.
7. Reload the browser and verify cart contents persist.
8. Open `cart.html`, increase quantity, decrease quantity, and remove an item; verify totals update correctly.
9. Verify empty-cart state appears when the last line is removed.
10. Open `checkout.html` with an empty cart and verify the empty-checkout fallback appears.
11. Open `checkout.html` with items in cart, submit invalid form data, and verify inline validation is shown.
12. Submit valid checkout data and verify success state renders and the cart is cleared.
13. Navigate across all pages and verify the header, footer, and cart count stay consistent.
14. Check mobile, tablet, and desktop widths for Shop, Product Detail, Cart, and Checkout.
15. Confirm there are no obvious console errors in the full demo path.
