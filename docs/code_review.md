# code_review.md

## Review mission
You are not here to praise. You are here to find flaws that would reduce product quality, correctness, maintainability, or demo readiness.

## Priorities
1. Functional correctness
2. Cart and localStorage robustness
3. DOM and event handling brittleness
4. Architecture and separation of concerns
5. Responsive issues
6. Accessibility basics
7. Visual consistency and default-Bootstrap leakage
8. Anything that makes the site feel like student work

## Review output format
- Severity-ranked findings
- File references
- Exact fixes
- Regression risks
- Manual test cases

## What to inspect
- state flow
- data rendering
- filter/sort behavior
- product detail loading
- invalid URL/product handling
- empty cart handling
- checkout validation
- nav consistency
- mobile layout
- image ratios
- naming consistency
- dead code