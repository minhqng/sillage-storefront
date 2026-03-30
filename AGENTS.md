# AGENTS.md

## Project identity
You are building a startup-grade static multi-page ecommerce website for a university Web Programming coursework project.

The website must feel commercial, premium, and realistic — never like a default student Bootstrap template.

## Non-negotiable stack
- Vite
- Bootstrap 5.3.x
- Vanilla JavaScript ES modules
- Static HTML pages
- JSON data files
- localStorage for cart persistence

## Hard constraints
- No database
- No backend
- No jQuery
- No React, Vue, Angular, Next, Nuxt, Svelte, or similar frameworks
- No fake dynamic behavior that breaks on reload
- No placeholder lorem ipsum
- No broken links or empty pages
- No default Bootstrap visual identity left visible

## UX and visual direction
- Luxury minimalism
- Premium D2C ecommerce tone
- Strong whitespace usage
- Restrained typography
- High visual consistency
- Clean product storytelling
- Commercially believable copy

## Engineering rules
- Separate data from UI
- products.json must be the main product data source
- Cart state must persist through localStorage
- Shop listing and product detail must be JSON-driven
- Multi-page architecture is mandatory
- Product detail must be addressable by URL parameter or another static-safe mechanism
- Builder must work phase-by-phase, not all-at-once

## Working style
- For difficult tasks, plan first
- Before large implementation, create or update PLANS.md
- For every implementation phase, report:
  1. files changed
  2. rationale
  3. verification steps
- Do not claim completion until the feature is manually verifiable

## Review behavior
- Reviews must prioritize bugs, regressions, brittle logic, maintainability, responsiveness, and perceived product quality
- Reviews should be severity-ranked
- Reviews must propose exact fixes
- Follow code_review.md during review

## Definition of done
A feature is done only when:
- code is implemented cleanly
- browser behavior is manually verifiable
- responsive behavior is acceptable
- no obvious console errors appear
- the result aligns with PROJECT_BRIEF.md and DESIGN_SYSTEM.md