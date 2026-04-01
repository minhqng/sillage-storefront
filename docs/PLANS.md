# PLANS.md

## Summary
- This plan is phased to minimize rework: scaffold first, freeze the data contract, build the shared shell, implement core commerce, add support pages, then cart/checkout, then polish, then defense packaging.
- Basic responsive correctness is verified in every implementation phase.
- Final responsiveness polish and demo hardening are reserved for the final build phase only.

## Plan usage rule
- For any multi-step change, update this file before implementation.

## Planning principles
- Lock structure, routing, page roots, and design tokens before component work.
- Freeze the product data contract before product rendering logic begins.
- Build shared data and app-shell systems before page-specific rendering.
- Implement Home, Shop, and Product Detail before Discovery Set and merchandising refinements.
- Verify basic mobile and tablet behavior in every phase.
- Leave final responsiveness polish and demo hardening to the final build phase.

## Required plan structure
- Objective
- Files to create or modify
- Dependencies
- Risks
- Acceptance criteria
- Manual verification steps
- Status

## Status values
- planned
- in_progress
- blocked
- done

## Discovery + Guide Consolidation
- Objective: Bỏ route Hướng dẫn như một trang riêng, gộp phần nội dung tư vấn chọn mùi phù hợp vào trang Bộ Khám Phá, và giữ luồng điều hướng thương mại điện tử liền mạch không link gãy.
- Files to create or modify:
  - `PLANS.md`
  - `bo-kham-pha.html`
  - `huong-dan-mui-huong.html`
  - `src/data/site.json`
  - `src/js/entries/discovery.js`
  - `src/js/entries/guide.js`
  - `src/js/entries/home.js`
  - `src/js/render/discovery-view.js`
  - `src/js/render/header.js`
  - `src/js/render/home-view.js`
  - `src/js/render/checkout-view.js`
  - `src/styles/components/support-pages.css`
- Dependencies:
  - `AGENTS.md`
  - Existing Discovery page structure and cart binding behavior
  - `src/data/guide.json` as source for guidance content
- Risks:
  - Link cũ tới guide có thể tạo trải nghiệm lỗi nếu không redirect chuẩn
  - Gộp quá nhiều nội dung tư vấn vào Discovery có thể làm trang dài và loãng chuyển đổi
  - Active-state điều hướng có thể sai nếu key/footer không được cập nhật đồng bộ
- Acceptance criteria:
  - Không còn điều hướng chính trỏ tới guide như một page độc lập
  - `huong-dan-mui-huong.html` chuyển hướng an toàn sang phần tư vấn trong Discovery
  - Discovery hiển thị thêm khối tư vấn chọn mùi từ dữ liệu guide theo hướng phục vụ mua hàng
  - Home/Checkout/CTA liên quan tới guide đều trỏ về Discovery section mới
  - Build thành công, không lỗi runtime rõ ràng trong luồng chính
- Manual verification steps:
  1. Mở `bo-kham-pha.html` và xác nhận có section tư vấn chọn mùi cùng section nghi thức thử mùi.
  2. Bấm các CTA “Tư vấn chọn mùi” từ Home/Checkout/Footer và xác nhận trỏ đúng anchor trên Discovery.
  3. Truy cập trực tiếp `huong-dan-mui-huong.html` và xác nhận redirect ngay sang Discovery.
  4. Chạy `npm run build` và xác nhận build sạch.
- Status: done

## Discovery Page Refinement - Density and Conversion Balance
- Objective: Tinh chỉnh trang Bộ Khám Phá theo hướng nén hero, giảm text-heavy ở cột trái, tăng lực visual cho 3 benefits, và nâng product card bên phải thành điểm chốt đơn rõ ràng hơn mà vẫn giữ luxury minimalism.
- Files to create or modify:
  - `PLANS.md`
  - `src/data/site.json`
  - `src/js/entries/discovery.js`
  - `src/js/render/discovery-view.js`
  - `src/styles/components/support-pages.css`
- Dependencies:
  - `AGENTS.md`
  - `PROJECT_BRIEF.md`
  - `DESIGN_SYSTEM.md`
  - Existing discovery entry/view and support-page styling system
- Risks:
  - Nén hero quá mức có thể làm trang mất nhịp editorial cần thiết
  - Tăng lực card phải quá tay có thể phá cân bằng visual với cột trái
  - Rút copy benefits nếu không đủ sắc có thể làm giảm độ rõ về giá trị sản phẩm
- Acceptance criteria:
  - Hero mở đầu bớt rỗng và lên nội dung chính sớm hơn
  - Cột trái giảm lượng chữ lặp ý, benefits ngắn và có phân cấp mạnh hơn
  - Product card phải có hierarchy rõ hơn cho tên/giá/meta/quantity/CTA
  - Bố cục trái-phải cân hơn, không còn hụt nhịp rõ ở dưới cụm benefits
  - Build chạy sạch sau khi chỉnh
- Manual verification steps:
  1. Mở `bo-kham-pha.html` desktop: xác nhận khối hero bớt trống và section chính lên sớm hơn.
  2. So sánh cột trái/phải: cột trái gọn hơn, cột phải giữ vai trò điểm chốt mua rõ.
  3. Kiểm tra 3 benefits: heading ngắn, dễ quét mắt, body không dài dòng.
  4. Kiểm tra quantity control + CTA trong card: nhịp spacing và phân cấp primary/secondary rõ.
  5. Chạy `npm run build` và xác nhận không lỗi.
- Status: done

## Unified Contact Hub - Merge Contact Into FAQ
- Objective: Gộp toàn bộ nội dung trang Liên hệ vào trang Câu hỏi thường gặp để tạo một trang Liên hệ tổng duy nhất, đồng thời cập nhật điều hướng và đường dẫn để không còn trải nghiệm tách rời giữa FAQ và Contact.
- Files to create or modify:
  - `PLANS.md`
  - `cau-hoi-thuong-gap.html`
  - `lien-he.html`
  - `src/data/site.json`
  - `src/js/entries/faq.js`
  - `src/js/render/contact-view.js`
  - `src/js/render/faq-view.js`
  - `src/js/render/header.js`
  - `src/js/render/home-view.js`
- Dependencies:
  - `AGENTS.md`
  - `PROJECT_BRIEF.md`
  - `DESIGN_SYSTEM.md`
  - Existing support pages structure and shared app shell
- Risks:
  - Gộp hai page có thể tạo lặp CTA nếu không tinh lại nội dung FAQ và Contact
  - Đổi route liên hệ có thể để lại link cũ gây trải nghiệm đứt đoạn nếu không xử lý chuyển hướng
  - Đổi nhãn điều hướng có thể gây lệch active state nếu key không đồng bộ
- Acceptance criteria:
  - Trang `cau-hoi-thuong-gap.html` trở thành trang Liên hệ tổng và chứa cả block liên hệ lẫn hỏi đáp
  - Các link trước đây trỏ tới `lien-he.html` được cập nhật hoặc chuyển hướng an toàn sang trang Liên hệ tổng
  - Header/footer và CTA liên quan phản ánh đúng khái niệm “Liên hệ tổng”
  - Không phát sinh link gãy, build chạy sạch
- Manual verification steps:
  1. Mở `cau-hoi-thuong-gap.html` và xác nhận thấy đủ nội dung liên hệ + FAQ trong cùng một trang.
  2. Bấm các link Liên hệ từ Home/Footer và xác nhận đều về đúng trang Liên hệ tổng.
  3. Truy cập trực tiếp `lien-he.html` và xác nhận được chuyển hướng hợp lệ sang trang hợp nhất.
  4. Chạy `npm run build` và xác nhận không có lỗi.
- Status: done

## Footer Hierarchy Refinement - Premium Utility Pass
- Objective: Tái cấu trúc footer theo thứ tự ưu tiên rõ ràng (brand/contact credibility -> navigation -> newsletter -> map link phụ), giảm cảm giác chật ở cột phải, làm states tương tác đủ chuẩn sản phẩm thực chiến, và giảm nhẹ tổng chiều cao footer trong khi vẫn giữ chất premium tối giản.
- Files to create or modify:
  - `PLANS.md`
  - `src/data/site.json`
  - `src/js/core/app-shell.js`
  - `src/js/render/footer.js`
  - `src/styles/components/footer.css`
- Dependencies:
  - `AGENTS.md`
  - `PROJECT_BRIEF.md`
  - `DESIGN_SYSTEM.md`
  - Existing shared shell (`app-shell`) and footer renderer/style stack
- Risks:
  - Đổi hierarchy footer có thể làm vỡ nhịp spacing trên tablet nếu tỷ lệ grid không được cân kỹ
  - Đưa map về dạng text-only nhưng đặt sai vị trí có thể làm mất ngữ cảnh showroom
  - Cập nhật states newsletter nếu không đồng bộ CSS + JS có thể tạo trạng thái “kẹt loading” hoặc feedback mơ hồ
- Acceptance criteria:
  - Footer không còn map thumbnail; map hiển thị dạng utility block text gọn với CTA rõ ràng
  - Cột phải không còn cảm giác quá tải, nhịp 4 cột desktop cân hơn (brand lớn nhất, support không quá hẹp)
  - Newsletter có placeholder đúng sản phẩm, có copy phụ ngắn, và trạng thái loading/success/error rõ
  - Footer bottom có utility links nhỏ để tăng độ “storefront thật” nhưng không gây rối
  - Tổng chiều cao footer giảm nhẹ, vẫn giữ hierarchy rõ trên desktop/mobile/tablet
- Manual verification steps:
  1. Mở `index.html` desktop và kiểm tra thứ tự thị giác: brand/contact -> nav -> newsletter -> map utility -> meta bottom.
  2. Mở `cua-hang.html` và `chi-tiet-san-pham.html`, kiểm tra active link footer nhất quán theo trang hiện tại.
  3. Trên mobile/tablet, kiểm tra thứ tự stack không vỡ: brand/contact -> nav/support -> newsletter -> map link.
  4. Test newsletter: nhập sai email, nhập đúng email, submit liên tiếp để xác nhận loading/success/error hoạt động đúng.
  5. Chạy `npm run build` và xác nhận không có lỗi bundling.
- Status: done

## Homepage Simplification Pass - Premium Commerce Focus
- Objective: Tối giản hero trang chủ theo hướng sang và dễ chốt quyết định mua, giảm lặp thông tin, giữ rõ lộ trình hành vi (vào thẳng chai full-size hoặc bắt đầu bằng Bộ Khám Phá).
- Files to create or modify:
  - `PLANS.md`
  - `src/js/render/home-view.js`
  - `src/styles/components/home.css`
- Dependencies:
  - `AGENTS.md`
  - `PROJECT_BRIEF.md`
  - `DESIGN_SYSTEM.md`
  - Existing Home renderer and Home component styles
- Risks:
  - Tối giản quá tay có thể làm mất tín hiệu thương mại (giá, hướng ra quyết định)
  - Giảm thông tin hero không đúng chỗ có thể khiến người dùng khó chọn lối đi tiếp theo
  - Điều chỉnh spacing hero có thể gây lệch nhịp với section sản phẩm bên dưới
- Acceptance criteria:
  - Hero còn 2 điểm nhấn chính: thông điệp + visual sản phẩm, cột phải chuyển sang khối hướng dẫn ra quyết định ngắn
  - Không lặp danh sách sản phẩm ở hero khi section kế tiếp đã hiển thị sản phẩm nổi bật
  - Nhịp cuộn từ hero sang section sản phẩm liền mạch hơn (giảm khoảng trống thừa)
  - Vẫn giữ tín hiệu ecommerce rõ: CTA chính/phụ, mốc best-seller, đường dẫn khám phá
- Manual verification steps:
  1. Mở `index.html` desktop: xác nhận hero không còn cảm giác nhồi nhét, mắt đi theo đúng thứ tự headline -> visual -> hành động.
  2. Mở `index.html` mobile/tablet: xác nhận các khối không vỡ, CTA vẫn nổi bật và dễ bấm.
  3. So sánh hero với section sản phẩm kế tiếp: không còn lặp nội dung danh sách sản phẩm.
  4. Chạy `npm run build` và xác nhận không phát sinh lỗi.
- Status: in_progress

## Story Route Removal - Home Consolidation
- Objective: Remove the standalone public brand-story route so the storefront stays tighter and more commerce-led, then merge only the most useful brand context back into the Home section `Vì sao nhà hương mang cảm giác này`.
- Files to create or modify:
  - `PLANS.md`
  - `vite.config.js`
  - `index.html`
  - `cau-chuyen-thuong-hieu.html`
  - `src/data/site.json`
  - `src/js/entries/home.js`
  - `src/js/entries/about.js`
  - `src/js/render/about-view.js`
  - `src/js/render/header.js`
  - `src/js/render/home-view.js`
  - `src/styles/main.css`
  - `src/styles/components/about.css`
  - `src/styles/components/home.css`
- Dependencies:
  - `AGENTS.md`
  - `PROJECT_BRIEF.md`
  - `DESIGN_SYSTEM.md`
  - Current shared header, footer, Home render, and Vite multi-page inputs
- Risks:
  - Removing the route can leave dead links in shared navigation, footer data, or Home fallbacks if the cleanup is incomplete
  - Folding too much old story copy into Home can make the landing page feel heavier and less commerce-focused
  - Deleting the standalone page styles and entry points can cause build errors if any hidden import still points at them
- Acceptance criteria:
  - `cau-chuyen-thuong-hieu.html` is no longer part of the public build or navigation
  - Header, footer, Home CTAs, and fallback states no longer reference the removed route
  - The Home story section becomes a concise brand fragment that explains why Sillage exists, how it composes fragrance, and what that means for the wearer
  - The merged section stays visually light and keeps a clear path back into commerce
  - The project still builds cleanly after the route removal
- Manual verification steps:
  1. Open `index.html` and confirm the section `Vì sao nhà hương mang cảm giác này` contains concise brand context and one commerce-aware CTA.
  2. Open the header and footer on Home, Shop, Product, Cart, and Checkout and confirm `Câu chuyện thương hiệu` no longer appears.
  3. Trigger the Home fallback state and confirm it no longer links to the removed route.
  4. Confirm `cau-chuyen-thuong-hieu.html` is absent from the Vite input list and no longer builds as a public page.
  5. Run `npm run build` and confirm there are no dead import or broken route errors.
- Status: in_progress

## Remediation Pass - Pre-Launch Quality Gaps
- Objective: Close the remaining investor-level quality gaps by giving Home a visual anchor, clarifying CTA hierarchy, adding quick-add commerce behavior, contextualizing trust surfaces, improving checkout orientation, enriching the footer, adding editorial pacing, handling zero-result shop states, and explaining the Sillage brand name more deliberately while preserving the current premium visual system.
- Files to create or modify:
  - `PLANS.md`
  - `src/data/site.json`
  - `src/js/core/app-shell.js`
  - `src/js/core/cart-store.js`
  - `src/js/core/product-service.js`
  - `src/js/entries/shop.js`
  - `src/js/render/about-view.js`
  - `src/js/render/cart-view.js`
  - `src/js/render/checkout-view.js`
  - `src/js/render/footer.js`
  - `src/js/render/home-view.js`
  - `src/js/render/media-art.js`
  - `src/js/render/product-card.js`
  - `src/js/render/product-detail.js`
  - `src/js/render/shop-view.js`
  - `src/styles/bootstrap-overrides.css`
  - `src/styles/components/about.css`
  - `src/styles/components/cart.css`
  - `src/styles/components/checkout.css`
  - `src/styles/components/footer.css`
  - `src/styles/components/home.css`
  - `src/styles/components/product-card.css`
  - `src/styles/components/product-detail.css`
  - `src/styles/components/shop.css`
  - `public/images/icons/payment-visa.svg`
  - `public/images/icons/payment-mastercard.svg`
  - `public/images/icons/payment-cod.svg`
- Dependencies:
  - `AGENTS.md`
  - `PROJECT_BRIEF.md`
  - `DESIGN_SYSTEM.md`
  - Current Home, Shop, Product, Cart, Checkout, About, and shared shell implementations
  - Existing PNG product and editorial imagery already present in `public/images/products/*` and `public/images/editorial/*`
- Risks:
  - Shared CTA and layout changes can unintentionally flatten page hierarchy if modifiers are applied too broadly
  - Quick-add behavior can create duplicate navigation/add-to-cart triggers if card event handling is not isolated cleanly
  - Footer and trust-surface enrichment can drift into clutter if icons, payment cues, and copy are not kept restrained
  - New editorial sections and empty states can create spacing regressions across mobile and tablet breakpoints
- Acceptance criteria:
  - Home hero includes a credible visual anchor and clearer primary-versus-secondary CTA hierarchy
  - Shop cards support quick-add without breaking product-detail navigation
  - Product, Cart, and Checkout trust surfaces are context-specific rather than repeated copies of one another
  - Checkout includes a clear progress indicator and stronger security/payment reassurance
  - Footer includes showroom, social, newsletter, and payment cues while staying visually premium
  - Shop renders an intentional zero-results state with a clear reset action
  - Brand etymology appears in a believable storytelling surface
  - The project still builds cleanly after the pass
- Manual verification steps:
  1. Open `index.html` on desktop and mobile and confirm the hero image, CTA hierarchy, editorial interstitial, and etymology note all read clearly.
  2. Open `cua-hang.html`, hover product cards on desktop, and confirm quick-add works without hijacking the PDP link; then force a zero-result combination and confirm the reset state appears.
  3. Open one fragrance detail page and confirm the purchase CTA hierarchy, trust cards, and gallery rhythm feel product-specific.
  4. Open `gio-hang.html` and `thanh-toan.html` and confirm payment badges, trust copy, checkout progress, and security assurance render cleanly on desktop and mobile.
  5. Open the footer on multiple pages and confirm showroom, newsletter, social links, and payment cues feel integrated rather than template-like.
  6. Run `npx vite build` and confirm the bundle completes without errors.
- Status: in_progress

## Visual Remediation Pass - Typography and Layout Stability
- Objective: Fix the cross-route layout breakage shown in browser screenshots by hardening shared heading rhythm, reducing inappropriate use of display serif for long Vietnamese copy, improving card/grid resilience on support and product pages, and tightening the overall premium hierarchy so the storefront feels calmer, more commercial, and less crowded.
- Files to create or modify:
  - `PLANS.md`
  - `src/styles/tokens.css`
  - `src/styles/main.css`
  - `src/styles/utilities.css`
  - `src/styles/components/header.css`
  - `src/styles/components/home.css`
  - `src/styles/components/about.css`
  - `src/styles/components/product-detail.css`
  - `src/styles/components/cart.css`
  - `src/styles/components/checkout.css`
  - `src/styles/components/support-pages.css`
  - `src/js/render/home-view.js`
  - `src/js/render/about-view.js`
  - `src/js/render/guide-view.js`
  - `src/js/render/product-detail.js`
- Dependencies:
  - `AGENTS.md`
  - `PROJECT_BRIEF.md`
  - `DESIGN_SYSTEM.md`
  - Existing shared typography tokens, renderers, and multi-page route structure
- Risks:
  - Relaxing typography too little can leave Vietnamese headings cramped and visually unstable
  - Relaxing typography too much can dilute the intended premium editorial feel
  - Shared grid and spacing changes can unintentionally alter route rhythm on pages that are not visibly broken today
- Acceptance criteria:
  - Long Vietnamese headings no longer collide with surrounding body copy on Product, Guide, About, Cart, Checkout, and support routes
  - Display serif is reserved for true hero/editorial moments, while descriptive and utility-heavy sections read cleanly in a more appropriate type treatment
  - Shared cards, panels, and support sections feel lighter, calmer, and more commercially premium without extra decoration
  - Main navigation and CTA hierarchy remain restrained and consistent across routes
  - The main route flow loads without obvious console or layout errors after the pass
- Manual verification steps:
  1. Open `index.html`, `cua-hang.html`, `chi-tiet-san-pham.html`, `bo-kham-pha.html`, `huong-dan-mui-huong.html`, `cau-chuyen-thuong-hieu.html`, `gio-hang.html`, and `thanh-toan.html` on desktop width and confirm there is no text overlap or collapsed section rhythm.
  2. Re-check the same routes on tablet and mobile widths to confirm heading wraps stay readable in Vietnamese and no panel content breaks out of its card.
  3. Compare hero, section headings, and support cards across pages and confirm the site feels calmer and more premium rather than more decorative.
  4. Run `Trang chủ -> Cửa hàng -> Chi tiết sản phẩm -> Giỏ hàng -> Thanh toán` and confirm CTA hierarchy, typography, and cart persistence still behave correctly.
  5. Build the project and verify there are no obvious console or bundling errors.
- Status: in_progress

## Localization Pass - Vietnam-First Storefront
- Objective: Việt hóa toàn bộ storefront theo hướng Vietnam-first, bao gồm metadata HTML, nội dung hiển thị, nhãn điều hướng, trạng thái loading/empty/error, slug sản phẩm trong URL, và toàn bộ copy thương mại để trải nghiệm cuối cùng phù hợp với khách hàng Việt Nam.
- Files to create or modify:
  - `PLANS.md`
  - `index.html`
  - `cua-hang.html`
  - `chi-tiet-san-pham.html`
  - `bo-kham-pha.html`
  - `cau-chuyen-thuong-hieu.html`
  - `huong-dan-mui-huong.html`
  - `cau-hoi-thuong-gap.html`
  - `lien-he.html`
  - `gio-hang.html`
  - `thanh-toan.html`
  - `src/data/products.json`
  - `src/data/site.json`
  - `src/data/guide.json`
  - `src/data/faq.json`
  - `src/js/core/cart-store.js`
  - `src/js/core/checkout-service.js`
  - `src/js/core/filter-state.js`
  - `src/js/core/product-service.js`
  - `src/js/core/sort-state.js`
  - `src/js/entries/about.js`
  - `src/js/entries/cart.js`
  - `src/js/entries/checkout.js`
  - `src/js/entries/contact.js`
  - `src/js/entries/discovery.js`
  - `src/js/entries/faq.js`
  - `src/js/entries/guide.js`
  - `src/js/entries/home.js`
  - `src/js/entries/product.js`
  - `src/js/entries/shop.js`
  - `src/js/render/about-view.js`
  - `src/js/render/cart-view.js`
  - `src/js/render/checkout-view.js`
  - `src/js/render/contact-view.js`
  - `src/js/render/discovery-view.js`
  - `src/js/render/empty-state.js`
  - `src/js/render/faq-view.js`
  - `src/js/render/footer.js`
  - `src/js/render/guide-view.js`
  - `src/js/render/header.js`
  - `src/js/render/home-view.js`
  - `src/js/render/product-card.js`
  - `src/js/render/product-detail.js`
  - `src/js/render/product-grid.js`
  - `src/js/render/related-products.js`
  - `src/js/render/shop-view.js`
  - `src/js/utils/format.js`
- Dependencies:
  - `AGENTS.md`
  - `PROJECT_BRIEF.md`
  - `DESIGN_SYSTEM.md`
  - Current multi-page Vite storefront implementation
- Risks:
  - Đổi slug sản phẩm có thể làm hỏng route chi tiết nếu cart state, related products hoặc CTA chưa được cập nhật đồng bộ
  - Việt hóa quá sát nghĩa có thể làm copy mất chất thương mại nếu không giữ cùng giọng luxury tối giản
  - Sửa đồng loạt metadata, fallback state và checkout copy dễ bỏ sót chuỗi tiếng Anh trong các trạng thái ít gặp
- Acceptance criteria:
  - Không còn chuỗi tiếng Anh hiển thị rõ ràng trên mọi trang chính, bao gồm metadata, điều hướng, CTA và trạng thái phản hồi
  - URL sản phẩm và tham số điều hướng dùng slug tiếng Việt không dấu, đọc tự nhiên với người dùng Việt Nam
  - Giá, vận chuyển, thông tin hỗ trợ và thanh toán phản ánh ngữ cảnh Việt Nam thay vì ngữ cảnh Mỹ/quốc tế chung chung
  - Luồng `Trang chủ -> Cửa hàng -> Chi tiết sản phẩm -> Giỏ hàng -> Thanh toán` vẫn hoạt động đúng sau khi đổi nội dung và slug
- Manual verification steps:
  1. Mở tất cả trang HTML trên desktop và mobile, đọc toàn bộ vùng hiển thị chính để xác nhận không còn tiếng Anh.
  2. Từ `cua-hang.html`, mở nhiều trang chi tiết sản phẩm và xác nhận URL dùng slug tiếng Việt không dấu.
  3. Thực hiện luồng thêm sản phẩm vào giỏ, đổi số lượng, sang thanh toán và gửi form để xác nhận mọi nhãn/trạng thái đều là tiếng Việt.
  4. Kiểm tra `meta title`, `meta description`, `og:title`, `og:description` của từng trang để xác nhận đã được Việt hóa.
  5. Quét lại mã nguồn sau build để xác nhận không còn chuỗi hiển thị tiếng Anh rõ ràng ngoài tên thương hiệu hoặc thuật ngữ kỹ thuật không hiển thị cho người dùng.
- Status: in_progress

## Final Pass - Premium Polish
- Objective: Apply a final premium polish pass across the storefront by reducing the last default-Bootstrap cues, tightening typography and spacing rhythm, refining micro-interactions, improving product cards and forms, raising perceived quality in cart and checkout, and making the overall page system feel more restrained and commercially consistent.
- Files to create or modify:
  - `PLANS.md`
  - `src/styles/tokens.css`
  - `src/styles/bootstrap-overrides.css`
  - `src/styles/utilities.css`
  - `src/styles/main.css`
  - `src/styles/components/forms.css`
  - `src/styles/components/footer.css`
  - `src/styles/components/about.css`
  - `src/styles/components/home.css`
  - `src/styles/components/product-card.css`
  - `src/styles/components/shop.css`
  - `src/styles/components/cart.css`
  - `src/styles/components/checkout.css`
  - `src/styles/components/support-pages.css`
  - `src/js/render/home-view.js`
  - `src/js/render/shop-view.js`
  - `src/js/render/cart-view.js`
  - `src/js/render/checkout-view.js`
  - `src/js/render/about-view.js`
  - `src/js/render/empty-state.js`
- Dependencies:
  - `AGENTS.md`
  - `PROJECT_BRIEF.md`
  - `DESIGN_SYSTEM.md`
  - The current post-remediation storefront implementation
- Risks:
  - Over-polishing can reintroduce noise if motion or decorative treatments become too visible
  - Tightening copy too aggressively can make support and empty states feel cold or unclear
  - Shared CSS changes can create regressions across multiple pages if spacing and surface changes are not applied consistently
- Acceptance criteria:
  - Shared buttons, forms, cards, and empty states feel custom and restrained rather than Bootstrap-derived
  - Page rhythm, typography, and whitespace feel more consistent across Home, Shop, support pages, Cart, and Checkout
  - Product cards and transactional surfaces feel calmer, clearer, and more premium
  - Customer-facing copy is shorter, more commercially believable, and less noisy
  - Motion remains subtle and supports perceived quality without calling attention to itself
- Manual verification steps:
  1. Open Home, Shop, Product, Discovery, About, Guide, FAQ, Contact, Cart, and Checkout on desktop and mobile widths.
  2. Compare buttons, form fields, cards, and support panels across pages and confirm they feel part of one restrained design system.
  3. Scan product cards, bag, and checkout without reading every line and confirm the hierarchy remains clear.
  4. Hover primary links, cards, buttons, and form controls to confirm the motion is subtle and consistent.
  5. Run `Home -> Shop -> Product -> Cart -> Checkout` and confirm there are no obvious console errors.
- Status: done

## QA Hardening - Live Demo Readiness
- Objective: Harden the existing storefront for a strict live browser demo by fixing browser-detectable edge cases in navigation, cart and checkout empty states, long-text resilience, desktop cart media consistency, and baseline keyboard accessibility without rewriting working page flows.
- Files to create or modify:
  - `PLANS.md`
  - `src/js/core/app-shell.js`
  - `src/js/render/header.js`
  - `src/styles/main.css`
  - `src/styles/components/header.css`
  - `src/styles/components/cart.css`
- Dependencies:
  - `AGENTS.md`
  - `PROJECT_BRIEF.md`
  - `DESIGN_SYSTEM.md`
  - `code_review.md`
  - Existing multi-page storefront implementation
- Risks:
  - Shared header behavior changes can regress desktop nav state if mobile-only logic is not scoped carefully
  - Global wrapping and focus styling can create unintended visual shifts if selectors are too broad
  - Cart image sizing changes can distort art if aspect-ratio rules fight the existing layout
- Acceptance criteria:
  - Mobile navigation closes reliably on outside click and `Escape`
  - The primary header exposes direct FAQ access during the demo flow
  - Cart imagery keeps a consistent product ratio on desktop and mobile
  - Long dynamic strings do not cause obvious overflow in cart, checkout, footer, or support content
  - Baseline keyboard focus visibility is clear on shared interactive elements
  - Main routes still load without console errors after the hardening pass
- Manual verification steps:
  1. Open the mobile navbar, tap outside it, press `Escape`, and confirm it closes cleanly.
  2. Confirm the header includes a direct `FAQ` link on desktop and mobile.
  3. Add a product to cart, open `cart.html` on desktop and mobile, and confirm the product media stays visually consistent.
  4. Run `Product -> Cart -> Checkout`, submit an empty checkout form, and confirm focus moves to the first invalid field.
  5. Inspect footer, contact, cart, and checkout success text blocks on narrow widths and confirm no obvious horizontal overflow appears.
  6. Re-run the main page load path and confirm no obvious console errors appear.
- Status: in_progress

## Remediation Pass - Premium Quality Cleanup
- Objective: Raise perceived product quality before submission by removing the remaining Bootstrap-card feel, simplifying Home into fewer stronger commerce beats, reducing product-card density, sharpening CTA language, making Shop more merchandised, clarifying cart and checkout, tightening trust signals, pruning top-level navigation, and giving each fragrance a more distinct editorial image treatment.
- Files to create or modify:
  - `PLANS.md`
  - `src/data/products.json`
  - `src/data/site.json`
  - `src/js/render/header.js`
  - `src/js/render/footer.js`
  - `src/js/render/home-view.js`
  - `src/js/render/shop-view.js`
  - `src/js/render/product-card.js`
  - `src/js/render/product-detail.js`
  - `src/js/render/discovery-view.js`
  - `src/js/render/cart-view.js`
  - `src/js/render/checkout-view.js`
  - `src/js/render/about-view.js`
  - `src/js/render/guide-view.js`
  - `src/js/render/contact-view.js`
  - `src/js/render/faq-view.js`
  - `src/styles/tokens.css`
  - `src/styles/bootstrap-overrides.css`
  - `src/styles/main.css`
  - `src/styles/components/header.css`
  - `src/styles/components/footer.css`
  - `src/styles/components/home.css`
  - `src/styles/components/shop.css`
  - `src/styles/components/product-card.css`
  - `src/styles/components/product-detail.css`
  - `src/styles/components/cart.css`
  - `src/styles/components/checkout.css`
  - `src/styles/components/support-pages.css`
  - `public/images/editorial/*`
- Dependencies:
  - `AGENTS.md`
  - `PROJECT_BRIEF.md`
  - `DESIGN_SYSTEM.md`
  - Current Home, Shop, Product, Discovery, Cart, Checkout, and shared shell implementations
- Risks:
  - Simplifying Home too aggressively can remove useful discovery context if the remaining sections are not stronger
  - Reducing card density can make browse surfaces feel too sparse if hierarchy and price treatment do not compensate
  - Changing CTA vocabulary and header structure can create inconsistent flows if not applied across the main commercial paths
  - Adding product-specific editorial assets can introduce path or crop regressions if the gallery contract is not preserved
- Acceptance criteria:
  - Home reads as a disciplined brand/commercial landing page rather than a section checklist
  - Product cards feel lighter, more premium, and less Bootstrap-derived
  - Shop leads with collection merchandising and quieter controls
  - Cart and checkout use clear transactional language with more credible trust cues
  - Primary navigation is more commercially disciplined and the cart entry no longer reads like a Bootstrap button
  - Product gallery imagery no longer relies on the same three editorial assets across the catalog
- Manual verification steps:
  1. Open Home on desktop and mobile and confirm the brand, primary CTA, and secondary CTA are obvious in the first screen.
  2. Open Shop and confirm the filter area feels secondary to the collection itself.
  3. Scan several product cards and confirm they no longer require reading multiple stacked metadata blocks to understand the product.
  4. Open Product, Cart, and Checkout and confirm the copy is plainer, clearer, and more commercially believable.
  5. Compare several product pages and confirm gallery imagery feels product-specific instead of repeated.
  6. Run `Home -> Shop -> Product -> Cart -> Checkout` and confirm there are no obvious console errors.
- Status: done

## Remediation Pass - Discovery Type and Copy Cleanup
- Objective: Finish the final demo cleanup by separating the Discovery Set from generic fragrance browse and product-detail flows, routing discovery-specific CTAs to `discovery.html`, and replacing the last customer-facing fallback copy that still sounds operational or scaffold-like.
- Files to create or modify:
  - `PLANS.md`
  - `src/data/products.json`
  - `src/js/core/product-service.js`
  - `src/js/entries/product.js`
  - `src/js/entries/home.js`
  - `src/js/entries/shop.js`
  - `src/js/entries/discovery.js`
  - `src/js/render/product-card.js`
  - `src/js/render/product-detail.js`
- Dependencies:
  - `AGENTS.md`
  - `PROJECT_BRIEF.md`
  - `DESIGN_SYSTEM.md`
  - Current Home, Shop, Product Detail, and Discovery implementations
- Risks:
  - Product-type filtering can remove Discovery from surfaces that currently expect the full catalog if the shared helpers are not narrowed carefully
  - Redirecting `product.html?slug=discovery-set` must stay type-appropriate without affecting normal fragrance PDP loading
  - Copy cleanup can become generic if it removes operational phrasing without keeping the brand tone calm and clear
- Acceptance criteria:
  - `shop.html` no longer presents the Discovery Set like a standard bottle SKU
  - Any Discovery card or CTA routes to `discovery.html` instead of the generic fragrance PDP
  - Fragrance-specific labels remain on actual fragrance products only
  - Home, Shop, and Discovery fallback states use short customer-facing copy with no scaffolding or implementation language
- Manual verification steps:
  1. Open `shop.html` and confirm the Discovery Set does not appear as a normal fragrance bottle product.
  2. Click every Discovery-related CTA and confirm the destination is `discovery.html`.
  3. Open a normal fragrance product detail page and confirm the fragrance-specific labels appear only for bottle SKUs.
  4. Force Home, Shop, and Discovery fallback states and read the copy aloud to confirm it sounds customer-facing.
  5. Run `Home -> Shop -> Product -> Cart -> Checkout` and confirm there are no obvious console errors.
- Status: done

## Remediation Pass - Final Demo Cleanup
- Objective: Finish the storefront with a pragmatic demo-focused cleanup by removing checkout live cross-tab rerenders, replacing the inert shop failure surface with a single branded fallback, deleting dead cart DOM state, and rewriting the last Cart and FAQ copy that exposed storage or page-plumbing details.
- Files to create or modify:
  - `PLANS.md`
  - `src/js/entries/checkout.js`
  - `src/js/entries/shop.js`
  - `src/js/entries/cart.js`
  - `src/js/render/cart-view.js`
  - `src/js/entries/faq.js`
  - `src/data/faq.json`
- Dependencies:
  - `AGENTS.md`
  - `PROJECT_BRIEF.md`
  - `DESIGN_SYSTEM.md`
  - Current cart, checkout, shop, and FAQ implementations
- Risks:
  - Checkout will no longer react live to cart edits made in another tab until the page is reloaded or reopened
  - Replacing the shop error surface must not leave the page feeling abruptly empty or broken
  - Copy cleanup must stay premium without misrepresenting the static cart persistence model
- Acceptance criteria:
  - Checkout keeps a stable single-tab form experience and no longer remounts while the user is typing because of cross-tab cart changes
  - Shop data-load failure removes the inert filter/sort UI and shows one clear branded error surface
  - Cart no longer writes unused checkout snapshot data attributes
  - Cart and FAQ copy no longer mentions device storage or page-plumbing language
- Manual verification steps:
  1. Open `checkout.html`, begin filling the form, then change the cart in another tab and confirm the current checkout form does not remount while typing.
  2. Reload `checkout.html` and confirm the order summary still reflects persisted cart data on entry.
  3. Force the shop catalog fetch to fail and confirm the filter/sort controls are gone and replaced by a single branded fallback.
  4. Open `cart.html` and confirm no `data-checkout-item-count` or `data-checkout-subtotal` values are written to the cart content mount.
  5. Read the Cart intro, Cart summary, FAQ cart answer, and FAQ fallback copy aloud and confirm none of it sounds like storage or page-plumbing implementation notes.
  6. Run a production build and confirm there are no obvious console-facing failures in the targeted flows.
- Status: done

## Remediation Pass - Gate Fixes
- Objective: Close the current hard-gate issues by replacing scaffold customer-facing pages, consolidating Home onto the shared data/service path, hardening shell and footer layout, stabilizing persisted size IDs with migration support, fixing visible polish/accessibility defects, and wiring a deliberate temporary imagery strategy that no longer feels like a wireframe.
- Files to create or modify:
  - `PLANS.md`
  - `index.html`
  - `shop.html`
  - `product.html`
  - `discovery.html`
  - `guide.html`
  - `faq.html`
  - `contact.html`
  - `cart.html`
  - `checkout.html`
  - `src/data/products.json`
  - `src/data/site.json`
  - `src/data/guide.json`
  - `src/data/faq.json`
  - `src/js/core/app-shell.js`
  - `src/js/core/cart-store.js`
  - `src/js/core/data-store.js`
  - `src/js/core/product-service.js`
  - `src/js/entries/home.js`
  - `src/js/entries/shop.js`
  - `src/js/entries/checkout.js`
  - `src/js/entries/discovery.js`
  - `src/js/entries/guide.js`
  - `src/js/entries/faq.js`
  - `src/js/entries/contact.js`
  - `src/js/render/footer.js`
  - `src/js/render/header.js`
  - `src/js/render/home-view.js`
  - `src/js/render/shop-view.js`
  - `src/js/render/checkout-view.js`
  - `src/js/render/product-card.js`
  - `src/js/render/product-detail.js`
  - `src/js/render/discovery-view.js`
  - `src/js/render/guide-view.js`
  - `src/js/render/faq-view.js`
  - `src/js/render/contact-view.js`
  - `src/js/render/media-art.js`
  - `src/styles/main.css`
  - `src/styles/components/footer.css`
  - `src/styles/components/home.css`
  - `src/styles/components/product-card.css`
  - `src/styles/components/product-detail.css`
  - `src/styles/components/support-pages.css`
  - `public/images/products/*`
  - `public/images/editorial/*`
- Dependencies:
  - `AGENTS.md`
  - `PROJECT_BRIEF.md`
  - `DESIGN_SYSTEM.md`
  - Existing Home, Shop, Product, Cart, Checkout, and About implementations
- Risks:
  - Route implementations can drift from the premium tone if copy or section density is not controlled
  - Size-id migration can break persisted carts if old label-based entries are not mapped defensively
  - Adding imagery can cause layout regressions if card and detail ratios are not kept consistent
  - Shared-service refactors can introduce regressions if Home stops matching Shop/Product conventions
- Acceptance criteria:
  - `discovery.html`, `guide.html`, `faq.html`, and `contact.html` render real user-facing experiences with no scaffold/internal-dev language
  - Home loads through the shared data layer and shared product-service helpers instead of duplicating catalog logic
  - The shell/footer stay visually correct on short pages and desktop footer columns no longer wrap incorrectly
  - Cart persistence uses stable internal size IDs and legacy label-based carts migrate safely
  - Mojibake is removed, `aria-current` is correct, a skip link exists, and purchase controls have proper semantics
  - Product-driven surfaces use a deliberate imagery treatment backed by actual assets or supported generated visuals
- Manual verification steps:
  1. Run the Vite dev server or production build preview.
  2. Confirm `Home -> Discovery Set -> Cart -> Checkout` works without placeholder language.
  3. Confirm `Home -> Shop -> Product -> Cart -> Checkout` works and cart state persists after reload.
  4. Confirm `Home -> About -> Guide -> FAQ -> Contact -> Shop` works with consistent navigation and footer behavior.
  5. Open an invalid product slug and confirm the branded fallback still appears.
  6. Verify empty cart and empty checkout states remain intentional and usable.
  7. Check desktop footer alignment and short-page layout on `faq.html` and `contact.html`.
  8. Test mobile navigation toggle and link-close behavior.
  9. Seed a legacy cart using old size labels and confirm migration to stable size IDs.
  10. Confirm there are no obvious console errors through the main flows.
- Status: done

## Remediation Pass - Sign-off Blockers
- Objective: Close the remaining sign-off blockers by completing canonical cart size-id rewrites, resolving a single default size in shared product logic, making shared JSON fetches retry-safe after failure, replacing the pseudo size selector with native radios, aligning cart media with the shared artwork system, and removing the last customer-facing implementation-note artifacts from Home, Shop, and Footer.
- Files to create or modify:
  - `PLANS.md`
  - `src/js/core/cart-store.js`
  - `src/js/core/data-store.js`
  - `src/js/core/product-service.js`
  - `src/js/entries/product.js`
  - `src/js/entries/shop.js`
  - `src/js/render/cart-view.js`
  - `src/js/render/footer.js`
  - `src/js/render/home-view.js`
  - `src/js/render/product-detail.js`
  - `src/styles/components/cart.css`
  - `src/styles/components/product-detail.css`
- Dependencies:
  - `AGENTS.md`
  - `PROJECT_BRIEF.md`
  - `DESIGN_SYSTEM.md`
  - Current Home, Shop, Product, Cart, and Checkout implementations
- Risks:
  - Cart rewrites can merge legacy and canonical line items if migration is not normalized through the existing store pipeline
  - Default-size changes can desynchronize the initial product price and add-to-cart payload if render and interaction logic do not use the same resolved size
  - Native radio styling can regress the current purchase-panel layout if the control is not restyled carefully
  - Copy cleanup can drift into bland or generic language if it removes technical artifacts without preserving the brand tone
- Acceptance criteria:
  - Legacy label-based size ids such as `50 ml` and `7 x 2 ml` are rewritten to canonical ids after cart hydration and sync
  - Product detail resolves exactly one default size, honoring the first explicit `default: true` entry and falling back to index `0` only when needed
  - Failed shared JSON fetches do not poison the in-memory request cache for the rest of the page lifetime
  - Product size selection uses native radio inputs with correct labeling, checked state, and keyboard behavior
  - Cart media uses the same shared artwork system as Home, Shop, Product, and Discovery
  - Home, Shop, and Footer no longer expose implementation-note or demo-grade copy
- Manual verification steps:
  1. Seed `localStorage["sillage-cart"]` with legacy size ids such as `50 ml` and `7 x 2 ml`, open `cart.html`, and confirm persisted values rewrite to canonical ids.
  2. Mark a non-first product volume as `default: true`, open the corresponding `product.html?slug=...` route, and confirm exactly one size is active with the correct initial price and add-to-cart payload.
  3. Force a JSON fetch failure, restore the file, retry within the same page lifetime, and confirm the route can recover.
  4. Keyboard-test the size selector and confirm native radio behavior works.
  5. Compare Home, Shop, Product, Discovery, and Cart and confirm the cart now uses the shared artwork treatment.
  6. Read the Home featured section, Shop intro copy, and Footer copy aloud and confirm none of it sounds like implementation notes.
  7. Confirm there are no obvious console errors.
- Status: done

## Remediation Pass - Final Sign-off Issues
- Objective: Close the remaining sign-off issues by making checkout confirmation rendering safe against raw user input, introducing a shared cart subscription path for in-tab and cross-tab updates, removing DOM-coupled price syncing from product detail, improving checkout field and shipping semantics, and removing the last demo-grade content and naming artifacts from shared storefront surfaces.
- Files to create or modify:
  - `PLANS.md`
  - `src/data/site.json`
  - `src/js/core/app-shell.js`
  - `src/js/core/cart-store.js`
  - `src/js/core/checkout-service.js`
  - `src/js/entries/cart.js`
  - `src/js/entries/checkout.js`
  - `src/js/entries/discovery.js`
  - `src/js/entries/faq.js`
  - `src/js/entries/product.js`
  - `src/js/render/checkout-view.js`
  - `src/js/render/footer.js`
  - `src/styles/components/checkout.css`
  - `src/styles/components/forms.css`
- Dependencies:
  - `AGENTS.md`
  - `PROJECT_BRIEF.md`
  - `DESIGN_SYSTEM.md`
  - Current cart, checkout, product detail, and shared shell implementations
- Risks:
  - Shared cart subscriptions can cause duplicate rerenders if in-tab and storage handlers are not deduped carefully
  - Checkout success rendering can drift visually if the safe-render path does not preserve the current confirmation layout
  - Semantic checkout markup changes can break existing validation styling if error and helper hooks move without matching CSS updates
  - Moving footer links into a content source can create stale render assumptions if the data contract is not kept minimal and explicit
- Acceptance criteria:
  - Checkout success rendering does not interpolate raw user input into HTML and displays hostile-looking strings as literal text only
  - Header badge, cart page, and checkout page all react to the shared cart update event and cross-tab `storage` changes without noisy duplicate rerenders
  - Product detail price updates are driven from selected size data rather than scraped visible DOM text
  - Checkout shipping methods use a semantic `fieldset` and relevant fields are associated with helper/error text through stable ids and `aria-describedby`
  - Footer merchandising is driven from content data rather than hardcoded SKU labels, demo-style class names are removed, and fallback copy no longer sounds route-level or dev-facing
- Manual verification steps:
  1. Submit checkout with values such as `<b>Avery</b>` and `<img src=x onerror=alert(1)>` and confirm the success state renders literal text only.
  2. Open two tabs, change cart contents in one tab, and confirm the other tab updates the header badge, cart, and checkout views without a hard refresh.
  3. On a multi-size product, change sizes by mouse and keyboard and confirm the selected radio, visible price, and add-to-cart payload always stay aligned.
  4. Keyboard-test the checkout shipping options and invalid fields to confirm grouping and field/error associations remain clear.
  5. Read the Footer, FAQ fallback, Discovery fallback, and Checkout copy aloud and confirm none of it sounds like implementation notes or demo scaffolding.
  6. Confirm there are no obvious console errors and run a production build.
- Status: done

## Remediation Pass - Final Blockers
- Objective: Close the last sign-off blockers by removing sensitive checkout payment draft restoration, making cart and checkout notices reflect the current cart state instead of latching forever, tightening field/error accessibility wiring, reusing shared default-size logic in Discovery, and removing the remaining scaffold-era naming and implementation-facing shell copy from production core paths.
- Files to create or modify:
  - `PLANS.md`
  - `src/js/core/checkout-service.js`
  - `src/js/core/page-shell.js`
  - `src/js/entries/about.js`
  - `src/js/entries/cart.js`
  - `src/js/entries/checkout.js`
  - `src/js/entries/contact.js`
  - `src/js/entries/discovery.js`
  - `src/js/entries/faq.js`
  - `src/js/entries/guide.js`
  - `src/js/entries/home.js`
  - `src/js/entries/product.js`
  - `src/js/entries/shop.js`
  - `src/js/render/checkout-view.js`
  - `src/js/render/discovery-view.js`
- Dependencies:
  - `AGENTS.md`
  - `PROJECT_BRIEF.md`
  - `DESIGN_SYSTEM.md`
  - Current cart, checkout, Discovery, and shared shell implementations
- Risks:
  - Checkout rerenders can feel disruptive if sensitive-field clearing also wipes low-risk customer input
  - One-shot notice handling can hide legitimate cart-rewrite feedback if it is not keyed to the correct cart state
  - Accessibility wiring changes can drift from Bootstrap validation visibility if helper and error hooks are not kept separate
  - Renaming scaffold-era core helpers can break entry imports if the rename is incomplete
- Acceptance criteria:
  - Checkout rerenders never restore `cardNumber` or `cvc`
  - Cart and checkout notices clear or downgrade when the cart becomes clean again
  - Pristine checkout fields do not announce error text before they are invalid
  - Discovery purchase state uses the shared resolved default size and shared price formatting path
  - Shared production core no longer exposes scaffold-era helper naming or route/dev-facing shell copy
- Manual verification steps:
  1. Fill checkout in one tab, change cart contents in another tab, and confirm contact/shipping fields survive if intended while `cardNumber` and `cvc` do not return.
  2. Create stale-item or outdated-price cart conditions, then clean the cart and confirm notices clear or downgrade correctly.
  3. Screen-reader or keyboard sanity check checkout fields before and after validation to confirm pristine fields do not announce error copy early.
  4. Temporarily add a second Discovery volume with a non-first default and confirm Discovery renders the correct default size, price, and add-to-cart payload.
  5. Search shared core for `scaffold` and route/dev-facing language and confirm those production paths are clean.
  6. Run a production build and confirm there are no obvious console-facing failures in the targeted flows.
- Status: done

## Precondition - Data Contract Freeze
- Objective: Freeze and validate the `src/data/products.json` contract before any product rendering or cart logic is implemented.
- Files to create or modify:
  - `src/data/products.json`
  - `PROJECT_BRIEF.md`
  - `PLANS.md`
- Dependencies:
  - `PROJECT_BRIEF.md`
  - `DESIGN_SYSTEM.md`
  - Technical architecture decisions already approved in planning
- Risks:
  - Schema drift between planner intent and builder code
  - Filter, sort, and cart logic depending on fields that later change shape
  - URL loading strategy becoming inconsistent with product identifiers
- Acceptance criteria:
  - `src/data/products.json` is treated as the frozen source-of-truth catalog contract before Phase 2 starts
  - Product-service requirements are explicitly aligned to the approved schema
  - Product detail URL strategy is fixed before rendering begins
- Manual verification steps:
  1. Open `src/data/products.json`.
  2. Confirm the file parses as valid JSON.
  3. Confirm all products share the same field set.
  4. Confirm the product detail loader will use product `id` as the slug source unless a dedicated `slug` field is added before implementation.
- Status: planned

## Phase 1 - Foundation and Multi-Page Scaffold
- Objective: Establish the Vite multi-page structure, root HTML entries, global stylesheet pipeline, page mount conventions, and shared meta/title basics so later phases build on stable file paths and consistent page contracts.
- Files to create or modify:
  - `.gitignore`
  - `package.json`
  - `package-lock.json`
  - `vite.config.js`
  - `index.html`
  - `shop.html`
  - `product.html`
  - `discovery.html`
  - `about.html`
  - `guide.html`
  - `faq.html`
  - `contact.html`
  - `cart.html`
  - `checkout.html`
  - `public/favicon/favicon.svg`
  - `public/images/products/.gitkeep`
  - `public/images/editorial/.gitkeep`
  - `public/images/icons/.gitkeep`
  - `src/styles/tokens.css`
  - `src/styles/bootstrap-overrides.css`
  - `src/styles/utilities.css`
  - `src/styles/main.css`
  - `src/styles/components/.gitkeep`
  - `src/js/core/scaffold.js`
  - `src/js/render/.gitkeep`
  - `src/js/utils/.gitkeep`
  - `src/js/entries/home.js`
  - `src/js/entries/shop.js`
  - `src/js/entries/product.js`
  - `src/js/entries/discovery.js`
  - `src/js/entries/about.js`
  - `src/js/entries/guide.js`
  - `src/js/entries/faq.js`
  - `src/js/entries/contact.js`
  - `src/js/entries/cart.js`
  - `src/js/entries/checkout.js`
- Dependencies:
  - `AGENTS.md`
  - `PROJECT_BRIEF.md`
  - `DESIGN_SYSTEM.md`
- Risks:
  - Incorrect Vite multi-page setup breaks entry points
  - Inconsistent root containers force page-specific hacks later
  - Shared meta and title conventions drift across pages
- Acceptance criteria:
  - All required pages exist as separate HTML files
  - Each page loads the shared stylesheet and its own JS entry without 404 errors
  - Page title, shared meta basics, and consistent mount/root conventions are defined
  - The scaffold is stable enough that later phases do not need to rename pages or replace root structures
- Manual verification steps:
  1. Run the Vite dev server.
  2. Open each page URL directly and confirm it loads.
  3. Confirm CSS and JS assets resolve without missing-file errors.
  4. Confirm page titles and base meta tags are present.
  5. Check mobile and tablet widths to confirm page shells do not immediately break.
- Status: done

## Phase 1B - Global Design System Foundation
- Objective: Translate `DESIGN_SYSTEM.md` into a reusable global styling layer with semantic tokens, Bootstrap overrides, typography rules, layout rhythm, and neutral preview primitives without introducing page-specific commerce sections.
- Files to create or modify:
  - `PLANS.md`
  - `src/styles/tokens.css`
  - `src/styles/bootstrap-overrides.css`
  - `src/styles/utilities.css`
  - `src/styles/main.css`
  - `src/styles/components/header.css`
  - `src/styles/components/footer.css`
  - `src/styles/components/forms.css`
  - `src/js/core/scaffold.js`
- Dependencies:
  - Phase 1 complete
  - `DESIGN_SYSTEM.md`
- Risks:
  - Stock Bootstrap styling may still leak through utility classes or untouched components
  - Design-system preview markup may become too content-heavy and drift into page implementation
  - Inconsistent spacing rules now would force layout churn in later phases
- Acceptance criteria:
  - Global token definitions align to `DESIGN_SYSTEM.md`
  - Stock Bootstrap buttons, links, cards, forms, navbar, footer-adjacent elements, and containers visibly no longer feel default
  - Section spacing and typography hierarchy are consistent across all scaffold pages
  - Neutral preview primitives exist so buttons, forms, and cards can be checked without adding business sections
- Manual verification steps:
  1. Run the Vite dev server.
  2. Open `index.html`, `shop.html`, and `checkout.html`.
  3. Confirm body, headings, links, buttons, forms, cards, navbar, footer, containers, and section spacing all reflect the shared design system.
  4. Confirm there is no obvious Bootstrap blue, pill radius, heavy default shadow, or untouched navbar/form/card styling.
  5. Check mobile and tablet widths to confirm spacing rhythm and navigation collapse remain stable.
- Status: done

## Phase 1C - Shared Layout Layer
- Objective: Replace the single scaffold renderer with a reusable shared shell layer for header, footer, page intro, and neutral section patterns so every page shares one polished layout contract before business logic begins.
- Files to create or modify:
  - `PLANS.md`
  - `src/js/core/app-shell.js`
  - `src/js/core/scaffold.js`
  - `src/js/render/header.js`
  - `src/js/render/footer.js`
  - `src/js/render/page-intro.js`
  - `src/styles/utilities.css`
  - `src/styles/main.css`
  - `src/styles/components/header.css`
  - `src/styles/components/footer.css`
- Dependencies:
  - Phase 1 complete
  - Phase 1B complete
- Risks:
  - Shared layout abstractions may still leave page-specific assumptions embedded in the shell
  - Mobile navigation can feel brittle if active-state and close behavior are not handled together
  - Footer and intro patterns may drift later if the shell contract is not clear now
- Acceptance criteria:
  - Header, footer, and page shell render from shared modules on every page
  - Primary nav, cart route, and footer links expose correct active states
  - Mobile navigation opens, closes, and remains visually polished
  - Reusable neutral section patterns exist without implementing page-specific business sections
- Manual verification steps:
  1. Run the Vite dev server.
  2. Open `index.html`, `about.html`, `contact.html`, `cart.html`, and `checkout.html`.
  3. Confirm the same navbar, footer, and page intro structure render across all pages.
  4. Confirm active state is correct for primary nav links, the cart route, and footer links where applicable.
  5. Test the mobile navbar toggle, then click a nav link and confirm the mobile menu closes cleanly.
  6. Check mobile and tablet widths to confirm the shared shell remains visually restrained and consistent.
- Status: done

## Phase 2A - Home Page
- Objective: Implement the Home page as the first real brand experience using editorial content, JSON-backed featured products, a concise manifesto, one trust-building block, one signature-direction section, and clear CTA flow into Shop and Story.
- Files to create or modify:
  - `PLANS.md`
  - `src/js/core/app-shell.js`
  - `src/js/entries/home.js`
  - `src/js/render/home-view.js`
  - `src/styles/main.css`
  - `src/styles/components/home.css`
- Dependencies:
  - Phase 1C complete
  - Validated `src/data/products.json`
- Risks:
  - Homepage sections may become too dense and lose the restrained brand tone
  - Product presentation may break if the featured-product selection is not resilient to data changes
  - CTA flow can feel weak if editorial sections are not sequenced clearly
- Acceptance criteria:
  - Home page presents a strong editorial hero with clear primary and secondary CTAs
  - Featured product section renders 2-3 products from `src/data/products.json`
  - Brand manifesto, signature direction, and trust-building sections are present with believable copy
  - The layout is mobile-first, visually consistent, and avoids placeholder text or cart logic
- Manual verification steps:
  1. Run the Vite dev server.
  2. Open `index.html`.
  3. Confirm the hero, featured products, manifesto, signature direction, trust block, and final CTA band render in order.
  4. Confirm featured products render from `src/data/products.json` and link to `product.html?slug={id}`.
  5. Confirm primary CTAs route to `shop.html` and `about.html`, and trust/secondary links route to `discovery.html`.
  6. Check mobile and tablet widths to confirm the hero, card grid, and CTA rows stack cleanly without overflow.
- Status: done

## Phase 2B - Shop Page
- Objective: Implement the Shop page as the first dynamic catalog view by fetching `products.json`, rendering the product grid client-side, and supporting family filtering, sorting, and empty states with modular vanilla JavaScript.
- Files to create or modify:
  - `PLANS.md`
  - `src/js/core/app-shell.js`
  - `src/js/core/data-store.js`
  - `src/js/core/query-state.js`
  - `src/js/core/product-service.js`
  - `src/js/core/filter-state.js`
  - `src/js/core/sort-state.js`
  - `src/js/entries/shop.js`
  - `src/js/render/page-intro.js`
  - `src/js/render/product-card.js`
  - `src/js/render/product-grid.js`
  - `src/js/render/empty-state.js`
  - `src/js/render/shop-view.js`
  - `src/styles/main.css`
  - `src/styles/components/product-card.css`
  - `src/styles/components/shop.css`
- Dependencies:
  - Phase 1C complete
  - Phase 2A complete
  - Validated `src/data/products.json`
- Risks:
  - Product-grid rendering may drift from the source data if filtering and sorting create derived state in multiple places
  - Invalid query params can produce inconsistent UI if control state and URL state are not normalized together
  - Cards can feel too generic if the listing layout is not styled with enough restraint
- Acceptance criteria:
  - Shop page fetches the product catalog from `src/data/products.json`
  - Product cards render dynamically and link to `product.html?slug={id}`
  - Family, occasion, and sort controls work client-side with vanilla JavaScript
  - Empty-result and fetch-failure states are intentional and readable
  - The code is split into core state/data modules and render modules instead of one page script
- Manual verification steps:
  1. Run the Vite dev server.
  2. Open `shop.html`.
  3. Confirm the product grid renders from the fetched JSON file.
  4. Change the family filter and confirm the grid and result count update.
  5. Change the occasion filter and confirm the grid and active chips update.
  6. Change the sort control and confirm ordering updates.
  7. Apply a family and occasion filter, reload the page, and confirm the selected controls persist through the URL.
  8. Use a combination that yields no results and confirm the branded empty state appears with a reset action.
  9. Click a product card and confirm it navigates to `product.html?slug={id}`.
  10. Manually change the URL to an invalid family query and confirm the page safely falls back to the full catalog.
- Status: done

## Phase 2C - Product Detail Page
- Objective: Implement the Product Detail page as a static-safe, URL-driven product view with size selection, quantity control, add-to-cart insertion, related products, trust content, and graceful invalid-product handling.
- Files to create or modify:
  - `PLANS.md`
  - `src/js/core/app-shell.js`
  - `src/js/core/cart-store.js`
  - `src/js/core/product-service.js`
  - `src/js/entries/product.js`
  - `src/js/render/product-detail.js`
  - `src/js/render/related-products.js`
  - `src/styles/main.css`
  - `src/styles/components/product-detail.css`
- Dependencies:
  - Phase 2B complete
  - Validated `src/data/products.json`
- Risks:
  - Invalid or missing slug values can produce broken states if the loader is not defensive
  - Add-to-cart interaction can drift from the expected localStorage schema if quantity and size are not normalized
  - Related products may feel random if family and tag fallback are not ordered carefully
- Acceptance criteria:
  - Product page loads the correct product from a URL query param
  - Product detail renders media, notes, sizes, price, description, and metadata
  - Quantity selector and add-to-cart interaction persist to localStorage
  - Related products render using family first, then tag overlap fallback
  - Invalid product ids render a branded fallback state with working links
- Manual verification steps:
  1. Run the Vite dev server.
  2. Open `product.html?slug=amber-veil`.
  3. Confirm the correct product data renders, including sizes, notes, metadata, and related products.
  4. Change the size selection and confirm the displayed price updates.
  5. Increase quantity, add to cart, and confirm the cart payload appears in `localStorage["sillage-cart"]`.
  6. Open another product slug and confirm the page switches cleanly to the new product.
  7. Open an invalid slug and confirm the fallback state appears with links to Shop and Discovery.
- Status: done

## Phase 2D - Cart State Layer and Cart Page
- Objective: Implement a robust localStorage-backed cart state layer and a polished Cart page with quantity management, subtotal calculation, empty-state handling, checkout handoff data, and safe cleanup of stale entries.
- Files to create or modify:
  - `PLANS.md`
  - `src/js/core/cart-store.js`
  - `src/js/entries/cart.js`
  - `src/js/render/cart-view.js`
  - `src/styles/main.css`
  - `src/styles/components/cart.css`
- Dependencies:
  - Phase 2C complete
  - Validated `src/data/products.json`
- Risks:
  - Persisted cart entries can become stale if product records or size options change
  - Quantity interactions can desynchronize from localStorage if the store API is not the only source of truth
  - The cart page can feel mechanically correct but commercially weak if the empty state and summary treatment are too bare
- Acceptance criteria:
  - Cart state persists through reload via localStorage
  - The cart store supports add, remove, increment, decrement, direct quantity update, subtotal calculation, and global badge count
  - The Cart page renders hydrated items from current product data and gracefully handles stale or invalid entries
  - Empty cart and populated cart states both feel intentional and premium
  - Checkout handoff data can be derived from the cart state without duplicating page-only logic
- Manual verification steps:
  1. Run the Vite dev server.
  2. Add products from `product.html?slug=...` and confirm the cart badge updates immediately.
  3. Refresh the browser and confirm the cart badge and cart contents persist.
  4. Open `cart.html` and verify increment, decrement, direct quantity edits, item removal, and subtotal updates.
  5. Remove all items and confirm the empty-cart state appears.
  6. Seed `localStorage["sillage-cart"]` with an invalid product or size entry, refresh `cart.html`, and confirm the page safely excludes stale items without breaking.
  7. Confirm the checkout CTA links to `checkout.html` and the summary data remains stable after reload.
- Status: done

## Phase 2E - Checkout Page
- Objective: Implement a polished static checkout experience that hydrates the order summary from persisted cart state, validates shipping and payment fields client-side, disables submission when the cart is empty, and renders a believable success state after simulated completion.
- Files to create or modify:
  - `PLANS.md`
  - `src/js/core/checkout-service.js`
  - `src/js/render/checkout-view.js`
  - `src/js/entries/checkout.js`
  - `src/styles/main.css`
  - `src/styles/components/checkout.css`
- Dependencies:
  - Phase 2D complete
  - Validated `src/data/products.json`
- Risks:
  - The form can feel fake if validation is too shallow or the success state is too generic
  - Totals can drift if the checkout summary does not use the same cart hydration logic as the cart page
  - Empty-cart handling can feel broken if the route still appears submittable without valid items
- Acceptance criteria:
  - Checkout summary renders from the persisted cart state and current catalog data
  - Shipping and payment inputs use native and/or Bootstrap-compatible validation states
  - Submission is disabled when the cart is empty
  - Successful simulated checkout shows a credible confirmation state and clears the cart
  - Trust cues and spacing maintain the same restrained premium tone as the rest of the storefront
- Manual verification steps:
  1. Run the Vite dev server.
  2. Add at least one item to cart, then open `checkout.html`.
  3. Confirm the order summary matches the persisted cart lines and subtotal.
  4. Submit the form empty and confirm invalid fields surface visible validation states.
  5. Fill valid shipping and payment details, submit again, and confirm a success state appears.
  6. Confirm the cart badge resets after successful checkout.
  7. Open `checkout.html` with an empty cart and confirm checkout is visibly unavailable and the primary action is disabled.
  8. Check mobile and tablet widths to confirm the form, summary rail, and trust blocks remain usable and visually controlled.
- Status: done

## Phase 4A - Our Story Page
- Objective: Replace the About route placeholder with a believable editorial brand-story page that explains the founder philosophy, craftsmanship, material thinking, packaging values, and customer promise without leaning on melodrama or generic luxury language.
- Files to create or modify:
  - `PLANS.md`
  - `about.html`
  - `src/js/entries/about.js`
  - `src/js/render/about-view.js`
  - `src/js/render/footer.js`
  - `src/styles/main.css`
  - `src/styles/components/about.css`
- Dependencies:
  - Phase 1C complete
  - Shared design system and shell already in place
- Risks:
  - Brand copy can slip into vague premium clichés if the writing is not specific enough
  - The page can feel overbuilt if editorial sections become too dense or overly dramatic
  - Shared footer copy can undermine the page if scaffold-era placeholder language remains visible
- Acceptance criteria:
  - The About page reads like a real startup fragrance brand story
  - Founder philosophy, craftsmanship, materials/process, packaging values, and customer promise are all present
  - The layout remains editorial, restrained, readable, and responsive
  - No obvious placeholder or coursework-facing copy remains visible on the page
- Manual verification steps:
  1. Run the Vite dev server.
  2. Open `about.html`.
  3. Confirm the page presents a clear hero, founder philosophy, craftsmanship, materials/process, packaging values, and customer promise sections.
  4. Confirm the copy feels commercially believable and avoids generic “luxury” filler.
  5. Check mobile and tablet widths to confirm the editorial layout stacks cleanly and remains readable.
  6. Confirm shared footer copy no longer references scaffold or coursework language.
- Status: done

## Phase 2 - Shared Data, Utilities, and App Shell
- Objective: Build the reusable shell and shared utilities so all pages use one source of truth for navigation, footer, page intros, formatting, and cart badge behavior.
- Files to create or modify:
  - `src/data/site.json`
  - `src/data/guide.json`
  - `src/data/faq.json`
  - `src/js/core/app-shell.js`
  - `src/js/core/data-store.js`
  - `src/js/core/query-state.js`
  - `src/js/core/cart-store.js`
  - `src/js/render/header.js`
  - `src/js/render/footer.js`
  - `src/js/render/page-intro.js`
  - `src/js/utils/dom.js`
  - `src/js/utils/storage.js`
  - `src/js/utils/format.js`
  - `src/js/utils/guards.js`
  - `src/styles/components/header.css`
  - `src/styles/components/footer.css`
  - `src/styles/main.css`
  - `src/js/entries/home.js`
  - `src/js/entries/shop.js`
  - `src/js/entries/product.js`
  - `src/js/entries/discovery.js`
  - `src/js/entries/about.js`
  - `src/js/entries/guide.js`
  - `src/js/entries/faq.js`
  - `src/js/entries/contact.js`
  - `src/js/entries/cart.js`
  - `src/js/entries/checkout.js`
- Dependencies:
  - Phase 1 complete
  - Validated `src/data/products.json` schema approved against product-service requirements
- Risks:
  - Shared shell logic becomes brittle if page contracts are inconsistent
  - localStorage parsing failures break the cart badge
  - Data fetch and render responsibilities get duplicated between pages
- Acceptance criteria:
  - Header and footer render from shared data on every page
  - Active navigation state is correct per page
  - Cart badge reads from localStorage and safely falls back to zero
  - Internal pages reuse the same `page-intro.js` contract
- Manual verification steps:
  1. Open every page and confirm the same header and footer render consistently.
  2. Confirm the correct nav item is visually active on each page.
  3. Seed `localStorage["sillage-cart"]` with a sample payload and refresh.
  4. Confirm the cart badge updates without console errors.
  5. Test header and footer behavior on mobile and tablet widths.
- Status: planned

## Phase 3A - Home, Shop, and Product Detail
- Objective: Implement the core browsing experience first: Home, Shop, and Product Detail, driven entirely by JSON with filtering, sorting, empty states, and static-safe product loading.
- Files to create or modify:
  - `index.html`
  - `shop.html`
  - `product.html`
  - `src/js/core/product-service.js`
  - `src/js/core/filter-state.js`
  - `src/js/core/sort-state.js`
  - `src/js/render/product-card.js`
  - `src/js/render/product-grid.js`
  - `src/js/render/product-detail.js`
  - `src/js/render/empty-state.js`
  - `src/js/entries/home.js`
  - `src/js/entries/shop.js`
  - `src/js/entries/product.js`
  - `src/styles/components/product-card.css`
  - `src/styles/components/product-detail.css`
  - `src/styles/main.css`
  - `public/images/products/*`
  - `public/images/editorial/*`
- Dependencies:
  - Phase 2 complete
  - Validated `src/data/products.json` schema approved against product-service requirements
  - `src/data/site.json`
- Risks:
  - Product detail routing becomes brittle if URL state and product IDs are inconsistent
  - Filter and sort behavior drift from the data contract
  - Home page and Shop page diverge in product card behavior
  - Missing image assets break intended ratios and premium presentation
- Acceptance criteria:
  - Home page renders featured commerce sections from approved data and copy sources
  - Shop listing renders entirely from `src/data/products.json`
  - Filtering and sorting work and persist through URL query state
  - Product detail loads with a static-safe URL strategy using product `id` as the slug source
  - Invalid product URLs show a branded fallback state
  - Product card rendering is shared across Home and Shop
- Manual verification steps:
  1. Open `index.html` and confirm featured products and CTAs render.
  2. Open `shop.html` and verify all products come from JSON data.
  3. Apply filters and sort options, then refresh the page and confirm state persists.
  4. Click a product card and confirm the correct product detail loads.
  5. Manually change the product query to an invalid value and confirm the fallback state appears.
  6. Check Home, Shop, and Product Detail at mobile and tablet widths.
- Status: planned

## Phase 3B - Discovery Set and Related Merchandising Refinements
- Objective: Add the Discovery Set experience and finish related-merchandising behavior after the core browsing loop is stable.
- Files to create or modify:
  - `discovery.html`
  - `src/js/core/related-service.js`
  - `src/js/render/related-products.js`
  - `src/js/entries/discovery.js`
  - `src/js/entries/product.js`
  - `src/js/entries/home.js`
  - `src/styles/components/product-detail.css`
  - `src/styles/main.css`
  - `public/images/products/*`
  - `public/images/editorial/*`
- Dependencies:
  - Phase 3A complete
  - Validated `src/data/products.json` schema approved against product-service requirements
- Risks:
  - Discovery Set page feels disconnected from the storefront if merchandising patterns differ
  - Related products feel random if fallback rules are weak
  - Discovery CTA blocks on Home and Product Detail drift from the actual Discovery page
- Acceptance criteria:
  - Discovery Set page presents a low-friction purchase path tied to the existing catalog
  - Product Detail pages include a consistent related-products merchandising block
  - Related products never include the current product
  - Discovery merchandising uses the same product-linking pattern as the storefront
  - Builder implements Home, Shop, and Product Detail first, then Discovery Set last within this phase
- Manual verification steps:
  1. Open `discovery.html` and confirm the page renders correctly.
  2. Navigate into the Discovery Set from Home and Product Detail CTAs.
  3. Confirm related products on Product Detail are relevant and link correctly.
  4. Confirm Discovery and related-merchandising sections work on mobile and tablet widths.
- Status: planned

## Phase 4 - Story and Support Pages
- Objective: Build the brand, education, and reassurance pages after commerce is stable so they reuse the same shell, editorial rhythm, CTA treatment, and product-linking patterns.
- Files to create or modify:
  - `about.html`
  - `guide.html`
  - `faq.html`
  - `contact.html`
  - `src/js/render/guide-view.js`
  - `src/js/render/faq-view.js`
  - `src/js/entries/about.js`
  - `src/js/entries/guide.js`
  - `src/js/entries/faq.js`
  - `src/js/entries/contact.js`
  - `src/data/site.json`
  - `src/data/guide.json`
  - `src/data/faq.json`
  - `src/styles/main.css`
- Dependencies:
  - Phase 2 complete
  - Phase 3B complete
- Risks:
  - Editorial pages become visually disconnected from the storefront
  - FAQ interaction feels inconsistent with the rest of the UI
  - Internal product links use different patterns and break trust
- Acceptance criteria:
  - About page communicates the brand story and product philosophy
  - Guide page explains scent families and links users back into commerce
  - FAQ page answers shipping, returns, discovery, and ordering concerns
  - Contact page provides credible support information and response expectations
  - FAQ uses a consistent interactive pattern
  - Guide and About pages reuse the same editorial section rhythm and CTA block treatment
  - All internal commerce links use the same product-linking pattern as the storefront
  - Internal pages reuse the same `page-intro.js` contract
- Manual verification steps:
  1. Open `about.html`, `guide.html`, `faq.html`, and `contact.html`.
  2. Confirm page intros, section rhythm, and CTA blocks feel consistent.
  3. Expand and collapse FAQ items and confirm the interaction pattern is stable.
  4. Follow internal commerce links back into Shop, Product, and Discovery pages.
  5. Check all four pages at mobile and tablet widths.
- Status: planned

## Phase 5 - Cart and Checkout Experience
- Objective: Implement cart persistence, cart management UI, checkout validation, and a believable static completion flow after browsing and support pages are already stable.
- Files to create or modify:
  - `cart.html`
  - `checkout.html`
  - `src/js/core/cart-store.js`
  - `src/js/core/checkout-service.js`
  - `src/js/render/cart-view.js`
  - `src/js/render/checkout-view.js`
  - `src/js/utils/validate.js`
  - `src/js/entries/cart.js`
  - `src/js/entries/checkout.js`
  - `src/js/render/product-card.js`
  - `src/js/render/product-detail.js`
  - `src/js/entries/shop.js`
  - `src/js/entries/product.js`
  - `src/js/entries/discovery.js`
  - `src/js/core/app-shell.js`
  - `src/styles/components/forms.css`
  - `src/styles/components/cart.css`
  - `src/styles/components/checkout.css`
  - `src/styles/main.css`
- Dependencies:
  - Phase 2 complete
  - Phase 3B complete
  - Validated `src/data/products.json` schema approved against cart and checkout rendering requirements
- Risks:
  - Cart schema drift causes invalid persisted state
  - Quantity updates and totals desynchronize if render state becomes a second source of truth
  - Checkout feels fake or broken if validation and success messaging are weak
  - Empty-cart and empty-checkout states are missed
- Acceptance criteria:
  - Users can add items to cart from listing, product detail, and discovery flows
  - Cart contents persist through reloads using localStorage
  - Cart page supports quantity changes, item removal, totals, and empty-cart fallback
  - Checkout page validates required fields and shows a static success state after valid submission
  - Successful checkout clears the cart and updates the global cart badge
  - Cart totals are derived from current source-of-truth data, not duplicated display state
- Manual verification steps:
  1. Add items to cart from Shop, Product Detail, and Discovery Set pages.
  2. Refresh the browser and confirm cart contents persist.
  3. Open `cart.html` and verify quantity increase, decrease, removal, and total calculations.
  4. Empty the cart and confirm the branded empty-cart state appears.
  5. Open `checkout.html` with an empty cart and confirm the empty-checkout fallback appears.
  6. Submit invalid checkout data and confirm inline validation errors render.
  7. Submit valid checkout data and confirm success state appears and the cart clears.
  8. Check Cart and Checkout at mobile and tablet widths.
- Status: planned

## Phase 6 - Responsive Polish and Demo Hardening
- Objective: Refine the site into a demo-ready product by tightening responsiveness, removing visual inconsistencies, closing edge cases, and validating the full browser walkthrough end to end.
- Files to create or modify:
  - `index.html`
  - `shop.html`
  - `product.html`
  - `discovery.html`
  - `about.html`
  - `guide.html`
  - `faq.html`
  - `contact.html`
  - `cart.html`
  - `checkout.html`
  - `src/styles/main.css`
  - `src/styles/bootstrap-overrides.css`
  - `src/styles/utilities.css`
  - `src/styles/components/header.css`
  - `src/styles/components/footer.css`
  - `src/styles/components/product-card.css`
  - `src/styles/components/product-detail.css`
  - `src/styles/components/forms.css`
  - `src/styles/components/cart.css`
  - `src/styles/components/checkout.css`
  - `src/js/entries/home.js`
  - `src/js/entries/shop.js`
  - `src/js/entries/product.js`
  - `src/js/entries/discovery.js`
  - `src/js/entries/about.js`
  - `src/js/entries/guide.js`
  - `src/js/entries/faq.js`
  - `src/js/entries/contact.js`
  - `src/js/entries/cart.js`
  - `src/js/entries/checkout.js`
  - `src/js/core/*.js`
  - `src/js/render/*.js`
  - `src/data/site.json`
  - `src/data/guide.json`
  - `src/data/faq.json`
  - `public/images/products/*`
  - `public/images/editorial/*`
- Dependencies:
  - Phases 1 through 5 complete
- Risks:
  - Responsive regressions appear after visual polish
  - Default Bootstrap styling leaks back into edge components
  - Small link, spacing, image, or copy issues reduce demo credibility
  - Unverified edge states create avoidable professor-facing bugs
- Acceptance criteria:
  - The full site feels visually coherent, premium, and specific to Sillage
  - No obvious console errors appear across the main demo flow
  - Mobile, tablet, and desktop behavior are acceptable on all required pages
  - Invalid product, empty cart, empty checkout, and no-results states are all present and intentional
  - The site is ready for a live browser walkthrough without requiring explanation of missing functionality
- Manual verification steps:
  1. Run the full demo path: Home -> Shop -> Product -> Cart -> Checkout.
  2. Run the discovery path: Home -> Discovery Set -> Cart -> Checkout.
  3. Run the brand and support path: Home -> About -> Guide -> FAQ -> Contact -> Shop.
  4. Check all pages at mobile, tablet, and desktop widths.
  5. Confirm no default Bootstrap blue, pill shapes, or untouched component styling remain visible.
  6. Confirm all links, buttons, images, and product URLs work.
  7. Confirm no obvious console errors appear in the browser during the walkthrough.
- Status: planned

## Phase 7 - Documentation and Defense Packaging
- Objective: Package the project for submission and defense so the final deliverable is not only demo-ready in-browser but also easy to explain, defend, and grade.
- Files to create or modify:
  - `README.md`
  - `DEFENSE_NOTES.md`
  - `PLANS.md`
- Dependencies:
  - Phase 6 complete
  - Final implementation behavior confirmed in the browser
- Risks:
  - Defense materials are rushed and undersell the technical work
  - The project reads like a template import instead of an intentionally built storefront
  - The explanation of JSON, localStorage, and Bootstrap customization is too vague
- Acceptance criteria:
  - `README.md` explains setup, structure, major pages, and demo path clearly
  - `DEFENSE_NOTES.md` contains a clean 3-minute project pitch
  - Technical decisions are summarized clearly
  - JSON-driven rendering, fetch/data loading, and localStorage cart behavior are explainable
  - Bootstrap customization versus template import is explicitly explainable
  - Defense notes include talking points for premium-brand decisions and multi-page architecture
- Manual verification steps:
  1. Read `README.md` end to end and confirm setup and page overview are clear.
  2. Read `DEFENSE_NOTES.md` aloud as a timed 3-minute explanation.
  3. Confirm the notes explain JSON data flow, localStorage persistence, and Bootstrap customization.
  4. Confirm the defense script matches the implemented browser walkthrough.
- Status: planned

## Assumptions
- Product detail loading will use product `id` as the slug source unless the product schema is intentionally extended before implementation.
- Contact remains a static support page, not a real backend form flow.
- Documentation and defense files are part of the project end-state, not optional post-work.

## Documentation Pass - Build Journal Reconstruction
- Objective: Dựng lại nhật ký xây dựng dự án theo bằng chứng từ repo hiện tại, git history khả dụng, tài liệu kế hoạch, và dependency runtime; đồng thời tách rõ đâu là phần xác nhận được và đâu là phần suy luận hợp lý.
- Files to create or modify:
  - `PLANS.md`
  - `NHAT_KY_XAY_DUNG_DU_AN.md`
  - `TOM_TAT_QUA_TRINH_XAY_DUNG.md`
  - `SCRIPT_THUAT_LAI_QUA_TRINH_CODE.md`
- Dependencies:
  - Toàn bộ runtime hiện tại (`*.html`, `src/data/*`, `src/js/**/*`, `src/styles/**/*`)
  - `README.md`
  - `HANDBOOK.md`
  - `DEFENSE_NOTES.md`
  - `AGENTS.md`
  - `PROJECT_BRIEF.md`
  - `DESIGN_SYSTEM.md`
  - `code_review.md`
  - Git history khả dụng trong repo
- Risks:
  - Git history hiện tại quá gọn nên dễ kể sai thứ tự nếu không phân biệt confirmed và inferred
  - Tài liệu cũ có route tiếng Anh, About page, Guide/Contact page riêng, trong khi runtime hiện tại đã đổi
  - `HANDBOOK.md` tự chứa cả thông tin mới lẫn dấu vết cũ, nên phải ưu tiên runtime truth
- Acceptance criteria:
  - Có một tài liệu dài mô tả lại quá trình build theo pha với file thật, dependency thật và mức độ chắc chắn của từng pha
  - Có bản tóm tắt ngắn cho ôn nhanh trước bảo vệ
  - Có script kể lại bằng ngôi thứ nhất ở 3 mức thời lượng
  - Mọi điểm mâu thuẫn giữa docs cũ và runtime hiện tại đều được nêu rõ, không bị hòa trộn im lặng
- Verification steps:
  1. Đọc lại commit history và đối chiếu với cây file runtime.
  2. Kiểm tra mọi file được nhắc trong timeline đều tồn tại hoặc có bằng chứng lịch sử rõ ràng.
  3. Xác nhận tài liệu ghi rõ route/behavior hiện tại nào là runtime thật, route/behavior nào chỉ còn trong docs hoặc plan.
  4. Chạy `npm run build` để bảo đảm mô tả được viết dựa trên trạng thái repo vẫn build được.
- Status: in_progress

## Documentation Pass - Consolidate Docs Directory
- Objective: Gom tài liệu dự án về `docs/`, cập nhật `HANDBOOK.md` để khớp runtime hiện tại, và giữ lại các file root đặc biệt ở mức tối thiểu để repo vẫn dễ dùng.
- Files to create or modify:
  - `README.md`
  - `AGENTS.md`
  - `docs/README.md`
  - `docs/HANDBOOK.md`
  - `docs/DEFENSE_NOTES.md`
  - `docs/DESIGN_SYSTEM.md`
  - `docs/PLANS.md`
  - `docs/PROJECT_BRIEF.md`
  - `docs/code_review.md`
  - `docs/NHAT_KY_XAY_DUNG_DU_AN.md`
  - `docs/TOM_TAT_QUA_TRINH_XAY_DUNG.md`
  - `docs/SCRIPT_THUAT_LAI_QUA_TRINH_CODE.md`
- Dependencies:
  - Runtime hiện tại của repo
  - Toàn bộ tài liệu markdown đang nằm ở root
  - Các liên kết và chỉ dẫn trong `AGENTS.md`, `README.md`, `HANDBOOK.md`
- Risks:
  - Di chuyển tài liệu có thể làm stale các đường dẫn cũ nếu không cập nhật đồng bộ
  - `AGENTS.md` và `README.md` có vai trò đặc biệt ở root nên không thể xóa hoàn toàn theo cùng cách với các doc khác
  - `HANDBOOK.md` hiện chứa cả thông tin mới lẫn cũ nên dễ giữ lại mâu thuẫn nếu chỉ vá từng đoạn
- Acceptance criteria:
  - Có thư mục `docs/` chứa toàn bộ tài liệu dự án chính
  - `docs/HANDBOOK.md` phản ánh đúng runtime hiện tại, nêu rõ route redirect legacy và mâu thuẫn của docs cũ nếu có
  - Root `README.md` đóng vai trò cổng vào ngắn, trỏ sang `docs/README.md`
  - Root `AGENTS.md` vẫn dùng được và chỉ tới đúng các tài liệu đã chuyển
- Verification steps:
  1. Xác nhận các file markdown mục tiêu đã nằm trong `docs/`.
  2. Đọc lại `docs/HANDBOOK.md` và kiểm tra các route/trang được mô tả khớp với runtime hiện tại.
  3. Kiểm tra `README.md` và `AGENTS.md` không còn trỏ tới các path cũ đã biến mất.
  4. Chạy `git status` và `npm run build` để chắc việc gom tài liệu không làm ảnh hưởng trạng thái build.
- Status: in_progress
