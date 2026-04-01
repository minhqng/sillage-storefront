# Defense Notes

## 3-Minute Project Pitch

Sillage is a static multi-page ecommerce storefront for a modern niche fragrance startup. The idea is simple: sell a small, highly curated fragrance line through a direct-to-consumer website that feels premium, clear, and commercially believable.

The concept is realistic because fragrance is one of the strongest categories for brand-led ecommerce. Customers do not need hundreds of SKUs. They need strong storytelling, clear differentiation, trust in the product, and a low-risk first purchase path. That is why the site is built around seven signature scents and one Discovery Set. The Discovery Set reduces decision friction, supports gifting, and gives the brand a believable conversion strategy.

From a product perspective, the project covers the full customer journey: landing page, collection browsing, product detail, discovery page, support content, persistent cart, and checkout. The catalog is driven by JSON, product detail is resolved from the URL, and the cart survives reloads with `localStorage`. That means the experience is not just visual. It behaves like a real storefront within static-site constraints.

The design direction is premium and minimal on purpose. Instead of loud ecommerce patterns, the UI uses controlled typography, warm neutral tones, generous spacing, custom art direction, and concise copy. The goal is to make the brand feel edited and confident, which matches the fragrance category.

Architecturally, the project is strong because data, UI, and state are separated. JSON files hold content. Core modules manage data loading, filtering, cart logic, and checkout rules. Render modules generate markup. Page entry files initialize each page independently. This keeps the site maintainable, scalable, and easy to upgrade later.

So even without a backend, this is not a fake mockup. It is a clean, static-safe ecommerce system with credible product thinking, a clear brand position, and an implementation that can evolve into a real startup storefront.

## Why This Is a Realistic Startup Concept

- Premium fragrance works well as a focused D2C brand with a small curated catalog.
- A Discovery Set is a credible first-purchase and gifting strategy.
- The catalog, pricing, copy, support flow, and checkout pattern all match a plausible early-stage ecommerce brand.
- The concept solves a real buying problem: fragrance is hard to choose online, so the site reduces uncertainty instead of pretending to eliminate it.

## Why the Design Feels Premium and Minimal

- The interface uses restraint instead of noise: strong whitespace, controlled hierarchy, and limited accents.
- Typography is intentional: a display serif for brand mood and a clean sans serif for usability.
- The palette is warm and tactile, which fits fragrance better than generic tech or fashion styling.
- Product storytelling is concise and specific, which makes the brand feel edited rather than inflated.

## Why the Architecture Is Strong Without a Backend

- The project is honest about its static constraints and only implements behavior that survives reloads.
- Product data, shared layout, state logic, and rendering are modular instead of mixed into page files.
- Each page has its own entry module, which keeps the multi-page structure clean and scalable.
- The cart is normalized and re-synced against the catalog, which prevents stale or invalid cart states.

## Why JSON + fetch + localStorage Were Chosen

- JSON keeps the product model explicit, readable, and easy to maintain.
- `fetch` mirrors how the same content would be requested from a real API later.
- `localStorage` is the simplest truthful persistence layer for a static storefront.
- Together, they deliver reload-safe behavior without inventing fake server features.

## How Bootstrap Was Customized Instead of Used as a Template

- Bootstrap provides layout and utility foundations, not the visual identity.
- The project overrides Bootstrap variables with a custom token system for color, type, spacing, radius, and surfaces.
- Buttons, forms, cards, navigation, and page sections are re-styled through custom CSS, not left in default Bootstrap form.
- The final result does not rely on the standard Bootstrap look for brand expression.

## What Makes This More Than a Student Assignment

- It has a coherent business concept, not just a set of pages.
- It models a believable ecommerce funnel from discovery to checkout.
- It handles edge cases such as empty states, invalid products, stale cart items, and form validation.
- It is structured for maintainability and future backend integration, which is how a real product team would build phase one.
