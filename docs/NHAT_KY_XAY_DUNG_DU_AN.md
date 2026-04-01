# NHAT_KY_XAY_DUNG_DU_AN

Tài liệu này được dựng lại từ repo hiện tại, git history còn giữ được, các file runtime, và các tài liệu đi kèm. Tôi đã đọc toàn bộ lớp HTML/CSS/JS/JSON hiện có, đối chiếu với `README.md`, `HANDBOOK.md`, `DEFENSE_NOTES.md`, `AGENTS.md`, `PROJECT_BRIEF.md`, `DESIGN_SYSTEM.md`, `PLANS.md`, `code_review.md`, và đã chạy `npm run build` thành công trên trạng thái hiện tại của repo.

Điểm phải nói ngay từ đầu: repo này có dấu vết rất rõ của quá trình evolve. Runtime hiện tại là đúng nhất. Một số tài liệu cũ vẫn nhắc route tiếng Anh, `About`, `Guide`, `Contact` như page riêng, trong khi runtime hiện tại đã Việt hóa route và đã gộp:

- `huong-dan-mui-huong.html` chỉ còn redirect sang `bo-kham-pha.html#tu-van-chon-mui`
- `lien-he.html` chỉ còn redirect sang `cau-hoi-thuong-gap.html#lien-he-tong`
- không còn public page `about.html` hay `cau-chuyen-thuong-hieu.html` trong git history khả dụng

## SECTION 1 — Project starting point

### 1.1 Dự án này là gì

Đây là một storefront ecommerce tĩnh nhiều trang cho thương hiệu nước hoa giả lập tên Sillage. Về mặt sản phẩm, nó cố tình không làm kiểu “web bán hàng demo cho có”, mà đi theo mô hình D2C fragrance tương đối hợp lý:

- catalog nhỏ, được biên tập
- Discovery Set đóng vai trò điểm vào ít rủi ro
- copy thương mại ngắn, cụ thể
- có cart persistent
- có checkout mô phỏng nhưng đủ believable để demo

Runtime hiện tại xoay quanh 7 chai full-size và 1 Discovery Set trong `src/data/products.json`.

### 1.2 Stack đang dùng

Stack hiện tại được xác nhận trực tiếp từ `package.json`, `vite.config.js`, cấu trúc `src/`, và runtime code:

- Vite 8.0.3
- Bootstrap 5.3.8
- Vanilla JavaScript ES modules
- Static HTML pages ở root repo
- JSON data files trong `src/data/`
- `localStorage` cho cart persistence

Các dependency trong `package.json` cũng cho thấy dự án chủ động kéo font local qua `@fontsource/cormorant-garamond`, `@fontsource/lora`, `@fontsource/manrope` thay vì dựa vào CDN.

### 1.3 Nó đang cố trở thành loại sản phẩm gì

Theo `PROJECT_BRIEF.md`, `DESIGN_SYSTEM.md`, `README.md`, và chính runtime hiện tại, mục tiêu không phải generic store mà là:

- premium D2C storefront
- quiet-luxury / luxury minimalism
- brand-led fragrance ecommerce
- content-commerce rõ ràng: vừa bán chai, vừa giải thích cách chọn mùi

Điểm này thấy rất rõ ở:

- `src/styles/tokens.css` và `src/styles/bootstrap-overrides.css`: tone màu, type, spacing đã custom rất mạnh
- `src/js/render/home-view.js`: Home ưu tiên storytelling + CTA funnel hơn là grid hàng hóa ngay từ trên cùng
- `src/js/render/discovery-view.js`: Discovery không chỉ là product page, mà là entry funnel + tư vấn chọn mùi

### 1.4 Những constraint nào đã định hình cách build

Các constraint cứng được xác nhận từ `AGENTS.md` và `PROJECT_BRIEF.md`:

- không backend
- không database
- không framework frontend kiểu React/Vue
- phải multi-page
- product detail phải static-safe
- `products.json` phải là nguồn dữ liệu sản phẩm chính
- cart phải reload-safe qua `localStorage`
- không để lộ cảm giác Bootstrap mặc định

Hệ quả kỹ thuật của các constraint này là:

- mỗi route là một file HTML thật ở root repo
- dữ liệu phải fetch hoặc import từ JSON nội bộ
- mọi behavior phải tự sống được sau reload
- product detail phải đọc query param, không dựa vào server route động

### 1.5 “Static multi-page ecommerce” trong repo này nghĩa là gì

Trong repo này, “static multi-page ecommerce” không có nghĩa là “web chỉ có HTML chết”. Nó có nghĩa là:

- route là file thật: `index.html`, `cua-hang.html`, `chi-tiet-san-pham.html`, `bo-kham-pha.html`, `cau-hoi-thuong-gap.html`, `gio-hang.html`, `thanh-toan.html`, cùng 2 route legacy redirect
- Vite build theo `appType: "mpa"` trong `vite.config.js`
- mỗi file HTML chỉ là shell mỏng, mount `#app`, rồi import entry JS riêng
- JS module mới render phần thân trang, đọc JSON, cập nhật query string, đồng bộ cart badge, hydrate cart, validate checkout

Nó vẫn là static site vì:

- không có API backend thật
- không có SSR
- không có database
- không có tài khoản, đơn hàng thật, payment gateway thật

Nhưng nó vẫn là storefront có behavior thật vì:

- `src/js/core/cart-store.js` đọc/ghi `localStorage`
- `src/js/core/query-state.js`, `filter-state.js`, `sort-state.js` điều khiển trạng thái shop qua URL
- `src/js/entries/product.js` đọc `?san-pham=...` để dựng PDP đúng
- `src/js/core/checkout-service.js` validate form và tạo success state tĩnh

## SECTION 2 — What evidence is available to reconstruct the build process

### 2.1 Có thể xác nhận trực tiếp từ code hiện tại

Từ code runtime hiện tại, có thể xác nhận chắc chắn:

- dự án đang chạy theo MPA thật, không phải SPA giả multi-page
- route public hiện tại là route tiếng Việt
- `products.json` là trục dữ liệu chính cho shop, PDP, discovery, cart hydration, checkout summary
- `site.json` cấp dữ liệu cho footer, contact block, discovery copy, Zalo widget, newsletter
- `guide.json` hiện không còn render qua route guide live, nhưng vẫn được dùng trong `src/js/entries/discovery.js` để đổ nội dung tư vấn vào `src/js/render/discovery-view.js`
- `faq.json` đang render trên `cau-hoi-thuong-gap.html`
- `lien-he.html` và `huong-dan-mui-huong.html` hiện chỉ là route giữ link cũ

### 2.2 Có thể xác nhận trực tiếp từ config

Từ `package.json` và `vite.config.js`, có thể xác nhận:

- dự án được scaffold bằng Vite
- `vite.config.js` dùng `appType: "mpa"`
- ngay từ commit đầu tiên khả dụng, config đã map các file HTML tiếng Việt:
  - `cua-hang.html`
  - `chi-tiet-san-pham.html`
  - `bo-kham-pha.html`
  - `huong-dan-mui-huong.html`
  - `cau-hoi-thuong-gap.html`
  - `lien-he.html`
  - `gio-hang.html`
  - `thanh-toan.html`

Điểm này rất quan trọng: naming Vietnam-first của route đã hiện diện từ commit `c813226`, nên trong lịch sử git khả dụng không có bằng chứng một runtime tiếng Anh đã từng được commit lên branch hiện tại.

### 2.3 Có thể xác nhận từ docs

Từ docs, có thể xác nhận các ý định và định hướng:

- `AGENTS.md`: constraint kỹ thuật và visual direction
- `PROJECT_BRIEF.md`: kiến trúc mục tiêu, page inventory mục tiêu, schema, rendering flow mục tiêu
- `DESIGN_SYSTEM.md`: token, typography, Bootstrap override strategy, responsive rules
- `PLANS.md`: repo được nghĩ theo phase, có nhiều remediation pass và consolidation pass
- `README.md`: route công khai hiện tại và mô tả runtime hiện tại
- `HANDBOOK.md`: repo đã từng được giải thích theo logic “runtime hiện tại là đúng, docs cũ còn dấu vết route cũ”

### 2.4 Có thể xác nhận từ git history

Git history hiện còn 6 commit trên `main`:

| Date | Commit | Message | Ý nghĩa reconstruct |
| --- | --- | --- | --- |
| 2026-03-30 23:32:44 +0700 | `c813226` | `chore: initialize vite storefront tooling` | xác nhận pha khởi tạo Vite/tooling |
| 2026-03-30 23:32:50 +0700 | `62594a6` | `feat: implement json-driven multi-page storefront flows` | xác nhận pha build toàn bộ runtime logic |
| 2026-03-30 23:32:59 +0700 | `54820ac` | `feat: add premium design system and component styles` | xác nhận pha skin/design system sau logic |
| 2026-03-30 23:33:10 +0700 | `89d378c` | `chore: add documentation and static media assets` | xác nhận pha thêm asset/docs |
| 2026-03-31 19:49:27 +0700 | `ad6eb99` | `feat: enhance FAQ view with contact CTA option and update footer links` | xác nhận pha gộp guide/contact vào discovery/faq và chỉnh footer |
| 2026-03-31 22:12:20 +0700 | `1735c6a` | `refactor: update contact references in various views for consistency` | xác nhận pha dọn copy cuối |

### 2.5 Những gì chỉ có thể suy luận

Có những thứ repo không cho phép nói chắc 100%:

- thứ tự nội bộ bên trong commit `62594a6`
  - commit này tạo một lúc HTML, JSON, core, entries, render
  - git chỉ cho biết chúng land cùng commit, không cho biết file nào viết trước theo phút/giây
- việc từng tồn tại route `about.html`, `shop.html`, `product.html`, `guide.html`, `contact.html` trong runtime branch hiện tại
  - `PROJECT_BRIEF.md` và `PLANS.md` nhắc các route này
  - nhưng git history hiện khả dụng không có commit nào chứa các file đó
- việc có một “localization pass” riêng trong code
  - `PLANS.md` có section `Localization Pass - Vietnam-First Storefront`
  - nhưng git history hiện có không tách thành commit riêng, còn `vite.config.js` ban đầu đã dùng route tiếng Việt

### 2.6 Các mâu thuẫn tài liệu cần nói thẳng

Đây là những chỗ mâu thuẫn phải phân biệt rõ khi kể lại quá trình build:

1. `PROJECT_BRIEF.md` vẫn mô tả `shop.html`, `product.html`, `about.html`, `guide.html`, `contact.html`, `cart.html`, `checkout.html`.
   Runtime hiện tại dùng `cua-hang.html`, `chi-tiet-san-pham.html`, `bo-kham-pha.html`, `cau-hoi-thuong-gap.html`, `gio-hang.html`, `thanh-toan.html`.

2. `PROJECT_BRIEF.md` và nhiều plan cũ coi `About`, `Guide`, `Contact` là page riêng.
   Runtime hiện tại:
   - không có public About route
   - Guide đã gộp vào Discovery
   - Contact đã gộp vào FAQ

3. `HANDBOOK.md` tự mâu thuẫn nội bộ.
   Phần đầu file nói rất đúng rằng docs cũ còn dấu vết route cũ và brand story route đã bị bỏ.
   Nhưng nhiều section phía sau vẫn giải thích `huong-dan-mui-huong.html` và `lien-he.html` như page live đầy đủ.

Khi có mâu thuẫn, runtime hiện tại và git history khả dụng phải được ưu tiên hơn tài liệu.

## SECTION 3 — Reconstructed implementation timeline

### Pha 0 — Khởi tạo tooling Vite và cấu hình MPA

1. **Phase title**
   `Khởi tạo tooling Vite và cấu hình MPA`
2. **Objective**
   Dựng nền build tối thiểu để repo có thể chạy dev/build như một multi-page app thay vì một SPA hay tập HTML rời.
3. **Why this phase logically comes at this point**
   Không có `package.json`, `vite.config.js`, dependency và rule build thì chưa thể nói tới page shell, JSON, hay render module.
4. **Files created or changed**
   - `.gitignore`
   - `package.json`
   - `package-lock.json`
   - `vite.config.js`
5. **What was implemented in this phase**
   - thêm script `dev`, `build`, `preview`
   - kéo `bootstrap`, `vite`, các font package
   - bật `appType: "mpa"`
   - khai báo đủ 9 HTML input trong `rollupOptions.input`
6. **How this phase connects to previous phases**
   Đây là điểm bắt đầu khả dụng sớm nhất trong git history.
7. **How this phase enabled later phases**
   Nhờ `vite.config.js`, mọi phase sau có thể viết page riêng, import CSS/JS riêng, và build ra `dist/` với nhiều route HTML thật.
8. **Important code details**
   - `vite.config.js` dùng `fileURLToPath(new URL(...))` để map file root vào build input
   - naming route tiếng Việt đã xuất hiện ngay ở đây, không phải đợi về sau mới có
9. **Manual verification that likely should have happened**
   - chạy `npm install`
   - chạy `npm run dev`
   - thử `npm run build`
   - xác nhận Vite nhận MPA config, không còn là single-entry default
10. **Risks / tradeoffs / limitations at that phase**
   - lúc này mới chỉ có tooling, chưa có page nào thật để chứng minh route build ổn
   - route naming đã chốt sớm, nên nếu đổi về sau sẽ ảnh hưởng link nội bộ và docs
11. **Whether the phase order is**
   `confirmed`

### Pha 1 — Dựng khung HTML gốc và contract mount cho từng route

1. **Phase title**
   `Dựng khung HTML gốc và contract mount`
2. **Objective**
   Tạo từng file HTML root thật để mỗi route có entry tĩnh riêng, nhưng vẫn giữ HTML đủ mỏng để JS render nội dung.
3. **Why this phase logically comes at this point**
   Sau khi có MPA config thì việc hợp lý tiếp theo là tạo các root entry mà config đang trỏ tới.
4. **Files created or changed**
   - `index.html`
   - `cua-hang.html`
   - `chi-tiet-san-pham.html`
   - `bo-kham-pha.html`
   - `huong-dan-mui-huong.html`
   - `cau-hoi-thuong-gap.html`
   - `lien-he.html`
   - `gio-hang.html`
   - `thanh-toan.html`
5. **What was implemented in this phase**
   - mỗi file có metadata, link favicon, `link rel="stylesheet" href="/src/styles/main.css"`
   - `body` dùng `data-page="..."`
   - thân trang gần như chỉ có `<div id="app" data-page-root></div>`
   - mỗi page import entry riêng trong `src/js/entries/*`
6. **How this phase connects to previous phases**
   Nó là bước cụ thể hóa `vite.config.js`: config nói sẽ có 9 route, HTML root là hiện thân của 9 route đó.
7. **How this phase enabled later phases**
   Sau khi có contract `[data-page-root]`, `src/js/core/app-shell.js` và `src/js/core/page-shell.js` mới có một mount target thống nhất để render header/footer/content.
8. **Important code details**
   - pattern HTML cực mỏng này là lựa chọn có chủ đích, không phải thiếu implementation
   - mỗi page import entry module riêng, ví dụ `index.html` -> `src/js/entries/home.js`, `gio-hang.html` -> `src/js/entries/cart.js`
9. **Manual verification that likely should have happened**
   - mở trực tiếp từng HTML trong Vite dev server
   - xác nhận không 404 CSS/JS import
   - xác nhận `document.title`/meta cơ bản có sẵn
10. **Risks / tradeoffs / limitations at that phase**
   - ở thời điểm commit `62594a6`, CSS còn land sau logic, nên commit granularity không phản ánh được từng bước nhỏ
   - nếu mount contract sai ngay từ đầu thì về sau tất cả entry sẽ phải sửa hàng loạt
11. **Whether the phase order is**
   `strongly inferred`

### Pha 2 — Chốt data contract JSON và lớp service/state dùng chung

1. **Phase title**
   `Data contract JSON và lớp service/state dùng chung`
2. **Objective**
   Tách dữ liệu khỏi UI và dựng lớp core để mọi page không tự fetch/tự xử lý nghiệp vụ theo kiểu copy-paste.
3. **Why this phase logically comes at this point**
   Home, Shop, PDP, Discovery, Cart, Checkout đều cần chung một catalog và chung một bộ helper. Nếu làm page trước rồi mới gom service, repo sẽ nhanh chóng vỡ cấu trúc.
4. **Files created or changed**
   - `src/data/products.json`
   - `src/data/site.json`
   - `src/data/guide.json`
   - `src/data/faq.json`
   - `src/js/core/data-store.js`
   - `src/js/core/product-service.js`
   - `src/js/core/filter-state.js`
   - `src/js/core/query-state.js`
   - `src/js/core/sort-state.js`
   - `src/js/utils/format.js`
   - `src/js/utils/escape-html.js`
5. **What was implemented in this phase**
   - `products.json` thành source of truth cho full-size và Discovery Set
   - `site.json` giữ brand/footer/discovery/contact metadata
   - `guide.json` giữ family definitions, how-to-choose, glossary
   - `faq.json` giữ grouped FAQ
   - `data-store.js` fetch JSON một lần rồi cache Promise
   - `product-service.js` lo lookup, link, size, related, category
   - `filter-state.js`, `query-state.js`, `sort-state.js` điều khiển URL state của shop
6. **How this phase connects to previous phases**
   HTML shell đã có, nên giờ cần data layer để entry module có cái để đọc và render.
7. **How this phase enabled later phases**
   - Home lấy featured product từ `products.json`
   - Shop lọc/sort qua `product-service.js` + query helpers
   - PDP resolve qua `getProductBySlug()`
   - Cart hydrate item từ catalog hiện tại
   - Checkout tái dùng cart summary đã hydrate
8. **Important code details**
   - `data-store.js` dùng `requestCache` nên trong cùng một page session không fetch JSON lặp lại
   - `product-service.js` có `normalizeLookupToken()` bỏ dấu và chuẩn hóa slug/id
   - `getProductHref()` cố ý đưa Discovery Set về `bo-kham-pha.html`, không đi qua generic PDP
   - `getProductSizes()` và `resolveProductSize()` cho thấy size được coi là first-class state, không hardcode
9. **Manual verification that likely should have happened**
   - sửa thử một sản phẩm trong `products.json` và xác nhận Shop/PDP/Cart phản ứng đúng
   - thử query param lạ trên Shop và PDP
   - thử item cart với `sizeId` cũ/không hợp lệ
10. **Risks / tradeoffs / limitations at that phase**
   - `site.json` sau này được dùng theo hai đường: import trực tiếp ở shell/footer và fetch ở page entry, tạo dấu hiệu mixed access pattern
   - `guide.json` và `faq.json` dễ trở thành “content page data” hơn là data thuần commerce, nhưng tradeoff này chấp nhận được cho static site
11. **Whether the phase order is**
   `strongly inferred`

### Pha 3 — Dựng shared shell: header, footer, page intro, cart badge, mobile nav

1. **Phase title**
   `Shared shell`
2. **Objective**
   Tạo một contract layout chung để mọi trang không phải tự dựng header/footer/page intro và không bị trôi visual contract.
3. **Why this phase logically comes at this point**
   Khi đã có route + data layer, việc hợp lý là dựng khung dùng chung trước khi đổ business section riêng cho từng trang.
4. **Files created or changed**
   - `src/js/core/app-shell.js`
   - `src/js/core/page-shell.js`
   - `src/js/render/header.js`
   - `src/js/render/footer.js`
   - `src/js/render/page-intro.js`
5. **What was implemented in this phase**
   - `mountAppShell()` render header + main + footer + Zalo widget
   - `mountPageShell()` trở thành wrapper mỏng để các entry dùng cùng một API
   - `renderHeader()` giải quyết active nav và cart badge
   - `renderFooter()` đọc `site.json` để đổ nhóm link/support/newsletter/map
   - bind mobile nav, bind cart badge, bind newsletter form, bind Zalo widget
6. **How this phase connects to previous phases**
   Nó đứng trên HTML root và data layer, và tạo môi trường chung để page view chỉ lo `content`.
7. **How this phase enabled later phases**
   - entry của Home/Shop/PDP/Discovery/FAQ/Cart/Checkout chỉ cần gọi `mountPageShell({ ...content })`
   - footer/header không bị copy lặp
   - cart badge có thể sync xuyên trang nhờ `subscribeToCartUpdates()`
8. **Important code details**
   - `header.js` map `currentPage === "product"` về nav key `shop`, vì PDP là ngữ cảnh của Shop
   - `app-shell.js` import thẳng `site.json` cho Zalo/newsletter/footer support metadata
   - `bindMobileNav()` dùng `Collapse` của Bootstrap JS, nghĩa là Bootstrap JS chỉ được tận dụng có kiểm soát
9. **Manual verification that likely should have happened**
   - thử nav desktop/mobile trên nhiều page
   - thử add-to-cart ở page bất kỳ và xem badge đổi
   - thử newsletter form invalid/valid
   - thử Zalo widget mở/đóng bằng click ngoài và phím Escape
10. **Risks / tradeoffs / limitations at that phase**
   - shell quá dày sẽ kéo page-specific logic vào khung chung
   - import trực tiếp `site.json` ở shell/footer trong khi page khác fetch cùng file là dấu hiệu refactor chưa hoàn toàn thống nhất
11. **Whether the phase order is**
   `strongly inferred`

### Pha 4 — Định hình core commerce flow: Home, Shop, Product Detail

1. **Phase title**
   `Home, Shop, Product Detail`
2. **Objective**
   Build xương sống browse funnel trước: vào brand, duyệt catalog, mở PDP, chuẩn bị add-to-cart.
3. **Why this phase logically comes at this point**
   Đây là đường thương mại chính. Cart và checkout không có ý nghĩa nếu browse funnel chưa có.
4. **Files created or changed**
   - `src/js/entries/home.js`
   - `src/js/entries/shop.js`
   - `src/js/entries/product.js`
   - `src/js/render/home-view.js`
   - `src/js/render/product-card.js`
   - `src/js/render/product-grid.js`
   - `src/js/render/shop-view.js`
   - `src/js/render/product-detail.js`
   - `src/js/render/related-products.js`
   - `src/js/render/media-art.js`
   - `src/js/render/empty-state.js`
5. **What was implemented in this phase**
   - Home: hero, featured products, editorial band, trust/story sections
   - Shop: filter theo family/occasion, sort, chips, no-result state, quick add
   - PDP: slug-driven render, size selector, quantity control, add-to-cart, notes, related products, invalid fallback
6. **How this phase connects to previous phases**
   Nó dùng trực tiếp product data, shared shell, format helper, media helper, filter/query state.
7. **How this phase enabled later phases**
   - quick add ở Shop và add-to-cart ở PDP tạo input cho Cart
   - related products và discovery CTA tạo cross-link cho funnel
   - Shop/PDP proof được rằng static site vẫn làm được data-driven product flow
8. **Important code details**
   - `shop.js` render skeleton trước, sau đó hydrate controls/results
   - `product.js` redirect Discovery Set sang `bo-kham-pha.html`, không cho discovery đi qua PDP generic
   - `renderProductArtwork()` tự sinh `srcset` từ pattern ảnh product
   - `renderProductCard()` hỗ trợ `allowQuickAdd`
9. **Manual verification that likely should have happened**
   - Home CTA sang Shop/Discovery
   - Shop filter/sort rồi reload
   - product URL hợp lệ và không hợp lệ
   - quick add từ Shop
   - đổi size trên PDP làm giá đổi theo
10. **Risks / tradeoffs / limitations at that phase**
   - Home, Shop, PDP đều phụ thuộc mạnh vào `products.json`; schema drift sẽ lan rất rộng
   - nếu slug collision xảy ra, PDP lookup sẽ mơ hồ
   - related logic hiện nằm trong `product-service.js`, khác với `PROJECT_BRIEF.md` vốn từng dự kiến `related-service.js` riêng
11. **Whether the phase order is**
   `strongly inferred`

### Pha 5 — Dựng Discovery flow và Guide page riêng ở bản đầu

1. **Phase title**
   `Discovery và Guide ban đầu`
2. **Objective**
   Tạo đường mua ít rủi ro cho khách mới và tách phần tư vấn chọn mùi thành page độc lập trong giai đoạn đầu.
3. **Why this phase logically comes at this point**
   Sau khi browse funnel lõi xong, Discovery là extension hợp lý nhất của category fragrance.
4. **Files created or changed**
   - `src/js/entries/discovery.js`
   - `src/js/entries/guide.js` ở bản đầu
   - `src/js/render/discovery-view.js`
   - `src/js/render/guide-view.js`
   - `bo-kham-pha.html`
   - `huong-dan-mui-huong.html`
5. **What was implemented in this phase**
   - Discovery page render product block cho Discovery Set
   - included fragrance overview
   - guide page riêng dùng `guide.json`
   - CTA nối từ Guide về Shop/PDP/Discovery
6. **How this phase connects to previous phases**
   Nó tái dùng catalog data, shared shell, product link helper và editorial panel patterns.
7. **How this phase enabled later phases**
   Sau này khi merge Guide vào Discovery, toàn bộ content và component đã có sẵn nên chỉ cần reorganize chứ không phải viết lại từ số 0.
8. **Important code details**
   - `getDiscoveryProduct(products)` trong `product-service.js` xác định SKU discovery riêng
   - `guide-view.js` cho thấy từng có guide page đầy đủ: family cards, choosing steps, glossary, recommended products
   - commit `ad6eb99` sau này biến `src/js/entries/guide.js` thành redirect, xác nhận phiên bản page riêng từng tồn tại
9. **Manual verification that likely should have happened**
   - add Discovery Set vào cart
   - từ Guide click sang Shop có filter/intent phù hợp
   - đảm bảo discovery không bị render như full-size grid item trên Shop
10. **Risks / tradeoffs / limitations at that phase**
   - có nguy cơ phân tán funnel: user phải nhảy giữa Discovery và Guide
   - route Guide riêng làm support/content tree rộng hơn cần thiết
11. **Whether the phase order is**
   `partially inferred`

### Pha 6 — Dựng FAQ và Contact như hai trang support riêng ở bản đầu

1. **Phase title**
   `FAQ và Contact ban đầu là hai route riêng`
2. **Objective**
   Tạo lớp reassurance/support cho shipping, returns, payment và contact methods.
3. **Why this phase logically comes at this point**
   Sau khi có browse/discovery, storefront cần lớp trust trước khi đi sâu vào cart/checkout.
4. **Files created or changed**
   - `src/js/entries/faq.js`
   - `src/js/entries/contact.js` ở bản đầu
   - `src/js/render/faq-view.js`
   - `src/js/render/contact-view.js`
   - `cau-hoi-thuong-gap.html`
   - `lien-he.html`
5. **What was implemented in this phase**
   - FAQ grouped theo shipping/discovery-payment
   - Contact page riêng lấy data từ `site.json`
   - CTA đi giữa FAQ và Contact
6. **How this phase connects to previous phases**
   Dùng chung shell, `site.json`, `faq.json`, CTA patterns, support panels.
7. **How this phase enabled later phases**
   Khi gộp Contact vào FAQ ở commit `ad6eb99`, các block support đã tồn tại sẵn trong `contact-view.js`, chỉ cần nhúng vào `faq.js`.
8. **Important code details**
   - diff ở `ad6eb99` cho thấy `src/js/entries/contact.js` ban đầu load `getSite()`, mount `renderContactView({ site })`, rồi mới bị thay thành `window.location.replace(...)`
   - `faq-view.js` ban đầu có contact CTA trỏ sang `lien-he.html`
9. **Manual verification that likely should have happened**
   - mở/đóng FAQ bằng `<details>`
   - click mailto/tel/maps từ Contact
   - click CTA giữa FAQ và Contact
10. **Risks / tradeoffs / limitations at that phase**
   - support bị tách làm hai route riêng, dễ làm user đổi ngữ cảnh quá nhiều
   - footer phải gánh nhiều link hơn và hierarchy dễ loãng
11. **Whether the phase order is**
   `partially inferred`

### Pha 7 — Dựng cart store persistent và Cart page

1. **Phase title**
   `Cart state layer và Cart page`
2. **Objective**
   Cho phép add/update/remove item, giữ cart qua reload, và render cart page như một trạng thái thương mại thật.
3. **Why this phase logically comes at this point**
   Cart chỉ có ý nghĩa sau khi browse funnel, discovery funnel, và product purchase control đã tồn tại.
4. **Files created or changed**
   - `src/js/core/cart-store.js`
   - `src/js/entries/cart.js`
   - `src/js/render/cart-view.js`
5. **What was implemented in this phase**
   - schema `sillage-cart`
   - normalize state/item
   - add/remove/increment/decrement/update quantity
   - subscribe event `cart:updated`
   - hydrate lại item từ catalog hiện tại
   - sync stale item và price snapshot
   - render cart empty/loading/error/populated states
6. **How this phase connects to previous phases**
   Nó ăn trực tiếp add-to-cart trigger từ Shop/PDP/Discovery và badge ở app shell.
7. **How this phase enabled later phases**
   Checkout về sau chỉ cần tái dùng `getCartSummary()`/`syncCartWithCatalog()` thay vì tự tính order summary từ đầu.
8. **Important code details**
   - `hydrateCartItem()` join persisted line item với `products.json`
   - `syncCartWithCatalog()` dọn stale item và cập nhật giá
   - `subscribeToCartUpdates()` lắng nghe cả custom event lẫn `storage` event
   - `cart.js` có `createCartRenderSignature()` để tránh rerender vô ích
9. **Manual verification that likely should have happened**
   - add hàng từ Shop, PDP, Discovery
   - reload page
   - mở `gio-hang.html`, tăng/giảm/xóa item
   - seed localStorage với product/size không hợp lệ
10. **Risks / tradeoffs / limitations at that phase**
   - localStorage là state per-device, không cross-device
   - giá snapshot được lưu nhưng vẫn ưu tiên catalog hiện tại, nên behavior phải được giải thích rõ khi demo
11. **Whether the phase order is**
   `strongly inferred`

### Pha 8 — Dựng Checkout tĩnh nhưng believable

1. **Phase title**
   `Checkout static simulation`
2. **Objective**
   Hoàn tất browse-to-order flow bằng một checkout có validation thật, shipping logic thật trong phạm vi client-side, và success state có ngữ cảnh.
3. **Why this phase logically comes at this point**
   Checkout là điểm cuối của funnel; không nên làm trước cart.
4. **Files created or changed**
   - `src/js/core/checkout-service.js`
   - `src/js/entries/checkout.js`
   - `src/js/render/checkout-view.js`
5. **What was implemented in this phase**
   - shipping options theo subtotal
   - format input card/expiry/cvc
   - validate phone/card/expiry/cvc/terms
   - render empty-checkout state nếu cart trống
   - create confirmation object + success state
   - clear cart sau submit thành công
6. **How this phase connects to previous phases**
   Nó tái dùng cart summary đã hydrate từ `cart-store.js` và nhờ app shell để badge tự reset về 0.
7. **How this phase enabled later phases**
   Tới đây demo path đầy đủ mới tồn tại: Home -> Shop/Product/Discovery -> Cart -> Checkout.
8. **Important code details**
   - `getCheckoutState(products, selectedShippingId, state)` bọc `syncCartWithCatalog()`
   - `checkout.js` cố tình tránh rerender khi form đang focus/đã validate để không phá trải nghiệm nhập
   - success state được hydrate bằng `textContent`, tránh đổ raw HTML từ input người dùng
9. **Manual verification that likely should have happened**
   - mở checkout với cart trống
   - submit form rỗng
   - nhập card/expiry/cvc sai/đúng
   - đổi shipping method xem total đổi
   - submit thành công xem cart clear
10. **Risks / tradeoffs / limitations at that phase**
   - checkout chỉ là simulation, không có payment thật
   - rule shipping đang hardcode trong `checkout-service.js`
   - không có order persistence
11. **Whether the phase order is**
   `strongly inferred`

### Pha 9 — Phủ design system premium và bóc Bootstrap mặc định

1. **Phase title**
   `Premium design system và component styles`
2. **Objective**
   Đưa toàn bộ runtime logic ở commit trước vào một visual system nhất quán, premium, không lộ “student Bootstrap”.
3. **Why this phase logically comes at this point**
   Commit history xác nhận logic land trước, style land sau. Điều này hợp lý: phải chốt contract HTML/JS trước rồi skin mới ổn định.
4. **Files created or changed**
   - `src/styles/tokens.css`
   - `src/styles/bootstrap-overrides.css`
   - `src/styles/utilities.css`
   - `src/styles/main.css`
   - `src/styles/components/header.css`
   - `src/styles/components/footer.css`
   - `src/styles/components/forms.css`
   - `src/styles/components/home.css`
   - `src/styles/components/product-card.css`
   - `src/styles/components/product-detail.css`
   - `src/styles/components/shop.css`
   - `src/styles/components/cart.css`
   - `src/styles/components/checkout.css`
   - `src/styles/components/support-pages.css`
   - `src/styles/components/zalo-widget.css`
5. **What was implemented in this phase**
   - token system màu, font, spacing, radius, shadow
   - override `--bs-*`
   - CSS base + utility
   - component CSS theo từng page/khối
6. **How this phase connects to previous phases**
   Nó bám đúng DOM contract mà render modules đã sinh ra từ commit logic trước.
7. **How this phase enabled later phases**
   - giúp footer/header/shop/PDP/cart/checkout mang cùng visual language
   - tạo mặt bằng để sau này merge page support mà không bị vỡ nhịp UI
8. **Important code details**
   - `tokens.css` import local fonts và chốt palette/tone
   - `bootstrap-overrides.css` remap body/buttons/forms/navbar/card/pagination
   - `support-pages.css` gom Discovery/Guide/FAQ/Contact vào một panel system chung
9. **Manual verification that likely should have happened**
   - check tất cả page ở mobile/tablet/desktop
   - soi xem còn Bootstrap blue/pill/default form-card hay không
   - thử hover/focus/keyboard states
10. **Risks / tradeoffs / limitations at that phase**
   - CSS bundle khá lớn vì đi kèm font assets và nhiều page skin
   - component CSS chồng lên Bootstrap nên phải giữ class contract rất kỷ luật
11. **Whether the phase order is**
   `confirmed`

### Pha 10 — Bổ sung asset tĩnh và gói tài liệu dự án

1. **Phase title**
   `Static media assets và docs packaging`
2. **Objective**
   Bổ sung hình sản phẩm, editorial image, favicon, tài liệu brief/design/plan/defense để repo có đủ ngữ cảnh và tài nguyên demo.
3. **Why this phase logically comes at this point**
   Sau khi runtime logic và skin chính đã có, mới hợp lý để đổ asset thật và đóng gói docs.
4. **Files created or changed**
   - `public/favicon/favicon.svg`
   - toàn bộ `public/images/editorial/*`
   - toàn bộ `public/images/products/*`
   - `README.md`
   - `DEFENSE_NOTES.md`
   - `DESIGN_SYSTEM.md`
   - `PROJECT_BRIEF.md`
   - `PLANS.md`
   - `HANDBOOK.md`
   - `AGENTS.md`
   - `code_review.md`
5. **What was implemented in this phase**
   - asset hình thật để `media-art.js` và OG image hoạt động
   - docs quy định scope, plan, design, defense
6. **How this phase connects to previous phases**
   Nó làm repo vừa chạy được vừa giải thích được.
7. **How this phase enabled later phases**
   - về sau các pass merge/refactor có tài liệu để bám
   - defense pack bắt đầu hình thành
8. **Important code details**
   - commit này thêm cả `public/images/icons/payment-*.svg`, nhưng các icon này về sau bị xóa ở `1735c6a`
   - asset naming bám theo product id, giúp `renderProductArtwork()` suy ra `srcset` ổn định
9. **Manual verification that likely should have happened**
   - mở Home/Shop/PDP/Discovery kiểm tra ratio ảnh
   - check favicon và OG image
   - đọc `README.md` để chắc route/docs trùng runtime tại thời điểm đó
10. **Risks / tradeoffs / limitations at that phase**
   - docs có thể nhanh chóng stale khi runtime tiếp tục đổi
   - asset thêm sau logic nghĩa là một số copy/link trong docs dễ bám theo plan hơn là code thật
11. **Whether the phase order is**
   `confirmed`

### Pha 11 — Gộp Guide vào Discovery, gộp Contact vào FAQ, giữ route legacy bằng redirect

1. **Phase title**
   `Consolidation pass cho funnel support và discovery`
2. **Objective**
   Giảm phân tán route, làm funnel gọn hơn, và giữ link cũ không gãy.
3. **Why this phase logically comes at this point**
   Chỉ sau khi cả Guide/Contact riêng đã tồn tại thì mới có cái để gộp.
4. **Files created or changed**
   - `bo-kham-pha.html`
   - `cau-hoi-thuong-gap.html`
   - `huong-dan-mui-huong.html`
   - `lien-he.html`
   - `src/data/site.json`
   - `src/js/core/app-shell.js`
   - `src/js/entries/contact.js`
   - `src/js/entries/discovery.js`
   - `src/js/entries/faq.js`
   - `src/js/entries/guide.js`
   - `src/js/render/contact-view.js`
   - `src/js/render/discovery-view.js`
   - `src/js/render/faq-view.js`
   - `src/js/render/footer.js`
   - `src/js/render/home-view.js`
   - `src/styles/components/footer.css`
   - `src/styles/components/support-pages.css`
   - `README.md`
   - `PLANS.md`
5. **What was implemented in this phase**
   - `src/js/entries/guide.js` đổi từ page renderer sang redirect sang `bo-kham-pha.html#tu-van-chon-mui`
   - `src/js/entries/contact.js` đổi từ page renderer sang redirect sang `cau-hoi-thuong-gap.html#lien-he-tong`
   - `src/js/entries/faq.js` bắt đầu render cả `renderContactView()` lẫn `renderFaqView()`
   - `src/js/render/discovery-view.js` nhận thêm `guide` data và render hẳn section tư vấn chọn mùi
   - footer được đổi hierarchy để nhấn vào Discovery, tư vấn chọn mùi, FAQ/Contact tổng
6. **How this phase connects to previous phases**
   Nó không tạo hệ thống mới từ số 0, mà tái tổ chức lại content/page architecture đã có.
7. **How this phase enabled later phases**
   - runtime hiện tại trở nên commerce-led hơn
   - support route gọn hơn
   - legacy links không gãy nhờ redirect HTML + JS
8. **Important code details**
   - `huong-dan-mui-huong.html` có cả `meta refresh` lẫn `window.location.replace(...)`
   - `lien-he.html` cũng làm redirect kép như vậy
   - `renderFaqView({ showContactCta: false })` cho phép FAQ được nhúng vào contact hub mà không tạo CTA dư thừa
   - `renderContactView({ site, sectionId: "lien-he-tong" })` tạo anchor target cho footer và CTA deep-link
9. **Manual verification that likely should have happened**
   - mở trực tiếp `huong-dan-mui-huong.html`
   - mở trực tiếp `lien-he.html`
   - click footer link sang `#tu-van-chon-mui`, `#nghi-thuc-thu-mui`, `#lien-he-tong`
   - kiểm tra FAQ page còn đầy đủ contact method và FAQ groups
10. **Risks / tradeoffs / limitations at that phase**
   - docs cũ dễ stale ngay lập tức
   - route legacy vẫn tồn tại nên repo trông “thừa” nếu không giải thích rõ
   - `guide-view.js` trở thành dấu vết lịch sử, không còn tham gia route live
11. **Whether the phase order is**
   `confirmed`

### Pha 12 — Dọn copy/contact consistency và bỏ asset không còn dùng

1. **Phase title**
   `Final cleanup cho wording và asset thừa`
2. **Objective**
   Chốt wording support theo một cách gọi thống nhất và loại bỏ artifact không còn dùng.
3. **Why this phase logically comes at this point**
   Đây rõ ràng là pass cuối, sau khi kiến trúc route đã ổn.
4. **Files created or changed**
   - `src/js/render/cart-view.js`
   - `src/js/render/checkout-view.js`
   - `src/js/render/home-view.js`
   - `src/js/render/product-detail.js`
   - xóa `public/images/icons/payment-cod.svg`
   - xóa `public/images/icons/payment-mastercard.svg`
   - xóa `public/images/icons/payment-visa.svg`
5. **What was implemented in this phase**
   - đổi wording từ `liên hệ concierge` thành `liên hệ` hoặc `đội ngũ`
   - xóa bộ payment icon static không còn được dùng ở runtime
6. **How this phase connects to previous phases**
   Đây là cleanup nối tiếp ngay sau consolidation pass.
7. **How this phase enabled later phases**
   Nó không mở tính năng mới, nhưng làm narrative/support copy bớt lệch tone và bớt “brand voice chưa chốt”.
8. **Important code details**
   - diff cho thấy thay đổi chỉ ở text và unused asset cleanup
   - không có thay đổi kiến trúc hay state flow
9. **Manual verification that likely should have happened**
   - kiểm tra Home/PDP/Cart/Checkout còn trỏ đúng FAQ contact anchor
   - tìm reference tới asset payment icon để chắc đã xóa sạch
10. **Risks / tradeoffs / limitations at that phase**
   - đây là pass bề mặt; nếu runtime còn vấn đề sâu hơn thì commit này không giải quyết
11. **Whether the phase order is**
   `confirmed`

## SECTION 4 — Detailed engineering walkthrough by phase

### 4.1 Pha 0: Khởi tạo tooling

Ở bước này file nhiều khả năng được viết đầu tiên là `package.json`, vì không có file đó thì không thể cố định dependency và script chạy dự án. Ngay sau đó mới tới `vite.config.js` để biến repo thành MPA thật. `package-lock.json` và `.gitignore` là phần kéo theo tự nhiên của thao tác cài package.

Lúc này cần chốt rất sớm việc dự án sẽ là MPA chứ không phải SPA. Lý do là quyết định này chi phối toàn bộ cấu trúc repo về sau: mỗi page sẽ có HTML riêng, route public là file thật, và mọi page entry phải độc lập. Nếu để muộn rồi mới đổi từ SPA sang MPA, toàn bộ cách nghĩ về routing, shell, và query state sẽ phải sửa lại.

Điểm đáng chú ý là `vite.config.js` ngay từ đầu đã map route tiếng Việt. Tức là người build không chờ tới cuối mới Việt hóa filename. Họ chốt naming public ngay ở lớp build. Đây là quyết định pragmatic, vì route là public contract. Đổi muộn sẽ kéo theo sửa footer, product link, docs, redirect, và kiểm thử.

### 4.2 Pha 1: Root HTML shells

Nhiều khả năng trong pha này, `index.html` được viết trước để chốt mẫu, rồi các file như `cua-hang.html`, `chi-tiet-san-pham.html`, `bo-kham-pha.html`, `gio-hang.html`, `thanh-toan.html` được copy theo cùng contract. `huong-dan-mui-huong.html`, `cau-hoi-thuong-gap.html`, `lien-he.html` cũng bám cùng mẫu.

File HTML nào cũng gần như giống nhau ở cấu trúc:

- metadata
- favicon
- `main.css`
- `body[data-page]`
- `#app[data-page-root]`
- import entry JS tương ứng

File này được thêm vào để giải quyết chuyện “multi-page nhưng vẫn maintainable”. Nếu đổ nội dung thật vào HTML, repo sẽ nhanh chóng có 9 file HTML rất dày và khó giữ nhất quán. Cách làm hiện tại đẩy phần thông minh sang JS module, còn HTML chỉ đóng vai trò route shell.

### 4.3 Pha 2: Data contract và service layer

Ở bước này, file có xác suất được viết đầu tiên là `src/data/products.json`. Không có catalog thì `product-service.js`, Shop, PDP, Cart, Checkout đều chưa thể định hình. Sau khi có schema sản phẩm, người build mới hợp lý khi viết `src/js/core/product-service.js` để đóng gói các thao tác:

- lấy listing products
- resolve product theo slug/id
- dựng product href
- xử lý size
- suy ra related products

`src/js/core/data-store.js` nhiều khả năng được thêm ngay sau khi có đủ `products.json`, `site.json`, `guide.json`, `faq.json`, vì nó là chỗ hợp nhất fetch/cache. File này được thêm vào để giải quyết một vấn đề maintainability rất cụ thể: nếu mỗi entry tự `fetch()` riêng từng JSON, code sẽ lặp và khó kiểm soát lỗi.

`src/js/core/query-state.js`, `filter-state.js`, `sort-state.js` nhiều khả năng đến sau khi Shop bắt đầu hình thành. Nhưng về dependency, chúng vẫn là core layer, không phải UI layer. Người build chọn cách tách này thay vì nhét hết vào `shop.js` là đúng, vì query param và filter/sort là concern có thể giải thích độc lập, test độc lập, và giữ được rõ ràng khi reload.

### 4.4 Pha 3: Shared shell

Trong pha này, file then chốt nhiều khả năng là `src/js/core/app-shell.js`. Sau khi file đó xuất hiện, `src/js/core/page-shell.js` mới trở thành wrapper rất mỏng để ổn định call site cho các entry. `src/js/render/header.js`, `src/js/render/footer.js`, `src/js/render/page-intro.js` là ba render module phụ thuộc vào shell contract đó.

Lúc này cần dựng shared shell sớm vì:

- Home, Shop, PDP, Cart, Checkout đều cần cùng header/footer
- cart badge phải đồng bộ toàn site
- mobile nav phải là một behavior chung, không nên viết lại mỗi page

Người build chọn `mountPageShell({ currentPage, eyebrow, title, summary, content })` thay vì để từng entry tự render cả header/footer. Đó là lựa chọn senior hơn vì nó biến “page” thành dữ liệu đầu vào của shell, thay vì để page tự dựng layout. Hệ quả là các entry hiện tại đều tương đối ngắn và rõ vai trò.

### 4.5 Pha 4: Home, Shop, PDP

Ở bước này, thứ tự rất có thể là Home trước, rồi Shop, rồi PDP.

`src/js/entries/home.js` có độ phức tạp orchestration thấp nhất:

- lấy `products`
- mount shell
- render `renderHomeView({ products })`
- có fallback state

Điều đó phù hợp với việc Home thường là page đầu tiên được dựng để nhìn thấy brand direction sớm.

Sau khi có Home, `src/js/entries/shop.js` mới là page logic-heavy hơn. Shop phụ thuộc vào:

- `data-store.js`
- `product-service.js`
- `filter-state.js`
- `sort-state.js`
- `query-state.js`
- `product-grid.js`
- `shop-view.js`

Nó là nơi đầu tiên chứng minh kiến trúc “data -> state -> render” hoạt động. `shop-view.js` chỉ render control skeleton và status slots. `shop.js` mới là orchestration layer cầm state hiện tại, sync select value, update query params, rồi rerender block kết quả. Đây là kiểu tách hợp lý hơn nhiều so với làm một file vừa sinh HTML vừa parse URL vừa attach event.

Sau khi có Shop, `src/js/entries/product.js` mới làm được sạch. Lý do là PDP tái dùng rất nhiều thứ đã có:

- `getProductBySlug()`
- `getProductSizes()`
- `getDefaultProductSize()`
- `getRelatedProducts()`
- `addCartItem()`

`src/js/render/product-detail.js` được thêm vào để giải quyết một vấn đề khác với Shop: Shop cần card compact, còn PDP cần layout dày hơn nhiều, có size selector, note groups, trust cards, gallery, breadcrumbs. Cố reuse card cho PDP sẽ làm code méo và UI bị nông.

### 4.6 Pha 5: Discovery và Guide bản đầu

Ở bước này người build có vẻ không muốn Discovery chỉ là một product tile trong Shop. Họ tách nó thành một loại sản phẩm riêng với route riêng, đúng logic của category fragrance.

`src/js/entries/discovery.js` trước hết cần xác định discovery SKU từ `products.json`, rồi render một page riêng có:

- purchase block
- included products
- ritual/usage
- CTA sang full-size

Sau khi có phần này, `src/js/entries/guide.js` nhiều khả năng được viết để giải quyết một bài toán khác: làm sao giúp user chưa biết gu mùi vẫn lọc được bầu không khí mình muốn. `src/js/render/guide-view.js` vì vậy đi theo hướng editorial education hơn là transaction.

Lý do người build chọn guide page riêng ở giai đoạn đầu thay vì nhúng luôn vào Discovery có thể là để tách “mua bộ thử” với “học cách chọn mùi”. Về sau họ nhận ra hai thứ này nên ở gần nhau hơn, nên mới có pha gộp sau.

### 4.7 Pha 6: FAQ và Contact bản đầu

`src/js/render/contact-view.js` và `src/js/render/faq-view.js` cho thấy người build ban đầu đi theo mô hình support rất quen thuộc:

- một page contact/support riêng
- một page FAQ riêng

`contact-view.js` giải quyết chuyện trình bày kênh liên hệ, service commitment, shortcut sang FAQ. `faq-view.js` giải quyết grouped Q&A và map block. Cả hai dùng cùng panel language với Discovery/Guide, cho thấy ý đồ “support pages vẫn nằm trong cùng visual system”.

Sau khi có phần này, user journey từ footer sẽ là FAQ -> Contact hoặc Contact -> FAQ. Đây là mô hình đúng chuẩn, nhưng hơi dài cho một storefront nhỏ. Đó cũng là tiền đề để về sau hợp nhất thành contact hub.

### 4.8 Pha 7: Cart

Trong pha này, file nhiều khả năng viết trước là `src/js/core/cart-store.js`. Nếu không có store thì `cart.js` và `cart-view.js` chỉ có thể giả lập UI, không thể có behavior thật.

`cart-store.js` giải quyết rất nhiều việc ở tầng nghiệp vụ:

- schema normalize
- persistence safe
- publish event
- hydrate với catalog
- sync stale item

Sau khi có nó, `src/js/render/cart-view.js` mới chỉ còn việc render theo `summary`. `src/js/entries/cart.js` đóng vai trò cầu nối:

- load products
- gọi `syncCartWithCatalog()`
- render view
- gắn listener click/change

Người build chọn để store chịu trách nhiệm normalize và persistence, còn page chỉ orchestration. Đây là lựa chọn đúng, vì cart là state xuyên trang, không nên bị khóa chặt vào một page cụ thể.

### 4.9 Pha 8: Checkout

Ở bước này, `src/js/core/checkout-service.js` rất có thể được viết trước `src/js/render/checkout-view.js`. Lý do là phải chốt rule:

- shipping options
- validation
- input formatting
- confirmation object

rồi mới render UI tương ứng.

`src/js/render/checkout-view.js` vì vậy khá đồ sộ: nó không chứa business rule, nhưng nó chứa toàn bộ form state presentation, summary rail, trust band, success state. `src/js/entries/checkout.js` thì giữ nhịp submit flow và tránh rerender phá form. Đây là dấu hiệu của một implementation nghĩ đến UX demo thật, chứ không chỉ “submit xong đổi innerHTML”.

### 4.10 Pha 9: Design system

Commit `54820ac` xác nhận design system được land thành một lớp riêng sau khi logic đã có. Nhìn dependency hiện tại thì thứ tự hợp lý bên trong pha style có lẽ là:

1. `src/styles/tokens.css`
2. `src/styles/bootstrap-overrides.css`
3. `src/styles/utilities.css`
4. `src/styles/main.css`
5. các file `src/styles/components/*.css`

`tokens.css` phải đi trước vì mọi thứ khác dùng biến của nó. `bootstrap-overrides.css` đi tiếp vì nó remap primitive. `utilities.css` và `main.css` dựng mặt bằng chung. Sau đó component CSS mới bám vào DOM contract thật của từng block.

Người build chọn override Bootstrap thay vì viết reset + utility system riêng từ đầu. Đó là quyết định pragmatic cho coursework: tận dụng container/form/collapse nền tảng của Bootstrap, nhưng cướp lại visual identity bằng token + class riêng.

### 4.11 Pha 10: Assets và docs

Đây là pha mà repo bắt đầu giống một deliverable hoàn chỉnh chứ không chỉ source code. `public/images/products/*` và `public/images/editorial/*` giúp:

- `media-art.js` sinh `srcset`
- hero/editorial band thật hơn
- OG image và product imagery có căn cứ

Song song, docs như `PROJECT_BRIEF.md`, `DESIGN_SYSTEM.md`, `PLANS.md`, `DEFENSE_NOTES.md`, `README.md` được đưa vào repo để project có thể bảo vệ được. Vấn đề là docs land ở thời điểm giữa, rồi runtime tiếp tục refactor, nên về sau mới sinh ra độ lệch.

### 4.12 Pha 11: Consolidation pass

Đây là pha dễ nhìn nhất trong history vì diff rất rõ.

`src/js/entries/guide.js` bị thay bằng redirect một dòng. Điều đó nói rất rõ rằng page Guide riêng không còn được coi là best path. Đồng thời `src/js/render/discovery-view.js` nhận thêm `guide` data và cả section `id="tu-van-chon-mui"`. Nghĩa là nội dung tư vấn không bị xóa, mà bị kéo về gần hành vi mua Discovery Set hơn.

`src/js/entries/contact.js` cũng bị thay bằng redirect một dòng. Song song, `src/js/entries/faq.js` bắt đầu load cả `faq` và `site`, rồi render:

- `renderContactView({ site, sectionId: "lien-he-tong" })`
- `renderFaqView({ faqGroups, showContactCta: false })`

Nói cách khác, Contact không chết, mà bị nhúng vào FAQ để tạo contact hub.

Đây là một refactor rất “product-driven”: thay vì tăng thêm page, repo rút bớt page, gom đúng những gì user cần trong cùng một luồng.

### 4.13 Pha 12: Cleanup cuối

Pha này nhỏ nhưng nói nhiều về trạng thái dự án:

- không còn thay kiến trúc
- chỉ dọn wording và asset thừa

`concierge` bị bỏ khỏi copy ở Home/PDP/Cart/Checkout. Điều này cho thấy brand voice vẫn đang được tinh chỉnh ở rất muộn. Xóa `public/images/icons/payment-*.svg` cho thấy asset đó đã từng được thêm vào, nhưng về sau không còn cần hoặc không còn khớp UI hiện tại.

## SECTION 5 — File-by-file implementation role map

### 5.1 Config và root HTML

| File | Thuộc pha nào | Vì sao file này được thêm vào | Nó nối với gì | Nếu thiếu thì hỏng gì |
| --- | --- | --- | --- | --- |
| `package.json` | Pha 0 | chốt stack, script, dependency | Vite, Bootstrap, fontsource | repo không thể cài/chạy/build đúng |
| `vite.config.js` | Pha 0 | biến repo thành MPA thật | toàn bộ root HTML entries | build thiếu route hoặc sai loại app |
| `index.html` | Pha 1 | route Home shell | `src/js/entries/home.js`, `src/styles/main.css` | mất route trang chủ |
| `cua-hang.html` | Pha 1 | route Shop shell | `src/js/entries/shop.js` | mất route listing |
| `chi-tiet-san-pham.html` | Pha 1 | shell PDP chung cho mọi full-size SKU | `src/js/entries/product.js` | mất product detail static-safe |
| `bo-kham-pha.html` | Pha 1/5 | shell Discovery page | `src/js/entries/discovery.js` | mất discovery funnel |
| `huong-dan-mui-huong.html` | Pha 1, đổi ở Pha 11 | route legacy guide | redirect sang Discovery | link cũ bị gãy |
| `cau-hoi-thuong-gap.html` | Pha 1/6, đổi ở Pha 11 | shell FAQ rồi thành contact hub | `src/js/entries/faq.js` | mất FAQ/contact tổng |
| `lien-he.html` | Pha 1/6, đổi ở Pha 11 | route legacy contact | redirect sang FAQ hub | link cũ bị gãy |
| `gio-hang.html` | Pha 1/7 | shell Cart page | `src/js/entries/cart.js` | mất cart route |
| `thanh-toan.html` | Pha 1/8 | shell Checkout page | `src/js/entries/checkout.js` | mất checkout route |

### 5.2 Data files

| File | Thuộc pha nào | Vì sao file này được thêm vào | Nó nối với gì | Nếu thiếu thì hỏng gì |
| --- | --- | --- | --- | --- |
| `src/data/products.json` | Pha 2 | source of truth cho catalog | Home, Shop, PDP, Discovery, Cart, Checkout | phần commerce gần như gãy toàn bộ |
| `src/data/site.json` | Pha 2 | shared content cho brand/footer/discovery/contact | shell, footer, FAQ hub, Discovery | footer/contact/discovery mất dữ liệu |
| `src/data/guide.json` | Pha 2, tái dùng ở Pha 11 | tách content tư vấn khỏi markup | Discovery hiện tại, guide page cũ | mất section tư vấn chọn mùi trong Discovery |
| `src/data/faq.json` | Pha 2 | grouped FAQ data | FAQ hub | mất toàn bộ nhóm FAQ |

### 5.3 Core modules

| File | Thuộc pha nào | Vì sao file này được thêm vào | Nó nối với gì | Nếu thiếu thì hỏng gì |
| --- | --- | --- | --- | --- |
| `src/js/core/data-store.js` | Pha 2 | gom fetch/cache JSON | mọi entry có data | mỗi page phải tự fetch, code lặp và dễ lỗi |
| `src/js/core/product-service.js` | Pha 2 | gom logic sản phẩm | Shop, PDP, Discovery, Cart | lookup/link/size/related đều vỡ |
| `src/js/core/query-state.js` | Pha 2 | đọc/ghi query string an toàn | Shop | filter/sort không reload-safe |
| `src/js/core/filter-state.js` | Pha 2 | chuẩn hóa family/occasion filter | Shop | filter logic nằm tản mác |
| `src/js/core/sort-state.js` | Pha 2 | chuẩn hóa sort options và apply sort | Shop | sort khó maintain |
| `src/js/core/app-shell.js` | Pha 3 | dựng shell chung + bind behavior chung | header, footer, badge, nav, newsletter, Zalo | mọi page phải tự dựng layout |
| `src/js/core/page-shell.js` | Pha 3 | wrapper ổn định cho entry modules | mọi entry live | call site của entry gãy |
| `src/js/core/cart-store.js` | Pha 7 | single source of truth cho cart | Shop quick add, PDP, Discovery, Cart, Checkout, header badge | cart persistence và cross-page sync gãy |
| `src/js/core/checkout-service.js` | Pha 8 | tách validation/shipping/confirmation khỏi UI | Checkout | rule checkout rơi vào view, khó giải thích và dễ brittle |

### 5.4 Entry modules

| File | Thuộc pha nào | Vì sao file này được thêm vào | Nó nối với gì | Nếu thiếu thì hỏng gì |
| --- | --- | --- | --- | --- |
| `src/js/entries/home.js` | Pha 4 | boot Home | `getProducts()`, `renderHomeView()` | Home không mount được |
| `src/js/entries/shop.js` | Pha 4 | boot Shop và cầm state filter/sort | core query/filter/sort + grid render | Shop không có behavior |
| `src/js/entries/product.js` | Pha 4 | boot PDP theo query param | `product-service`, `cart-store`, PDP render | product detail không resolve được |
| `src/js/entries/discovery.js` | Pha 5, đổi ở Pha 11 | boot Discovery, hiện còn kiêm guide content | `getProducts()`, `getSite()`, `getGuide()`, `renderDiscoveryView()` | mất discovery + tư vấn chọn mùi |
| `src/js/entries/guide.js` | Pha 5, đổi ở Pha 11 | ban đầu boot guide page, hiện giữ redirect legacy | Discovery route legacy | link guide cũ không điều hướng đúng |
| `src/js/entries/faq.js` | Pha 6, đổi ở Pha 11 | ban đầu boot FAQ riêng, hiện boot contact hub | `getFaq()`, `getSite()`, `renderContactView()`, `renderFaqView()` | FAQ/contact hub không chạy |
| `src/js/entries/contact.js` | Pha 6, đổi ở Pha 11 | ban đầu boot contact page, hiện giữ redirect legacy | FAQ hub | link contact cũ không điều hướng đúng |
| `src/js/entries/cart.js` | Pha 7 | boot Cart page | `cart-store`, `renderCartView()` | Cart route không có runtime |
| `src/js/entries/checkout.js` | Pha 8 | boot Checkout page | `checkout-service`, `renderCheckoutView()` | Checkout route không có runtime |

### 5.5 Render modules

| File | Thuộc pha nào | Vì sao file này được thêm vào | Nó nối với gì | Nếu thiếu thì hỏng gì |
| --- | --- | --- | --- | --- |
| `src/js/render/header.js` | Pha 3 | render navbar + badge placeholder | app shell | mất nav và active-state logic |
| `src/js/render/footer.js` | Pha 3, refine ở Pha 11 | render footer data-driven | app shell + `site.json` | mất footer hierarchy chung |
| `src/js/render/page-intro.js` | Pha 3 | pattern intro dùng chung | page shell | intro pattern bị lặp bằng tay |
| `src/js/render/media-art.js` | Pha 4 | abstraction cho artwork/product images | Home, card, PDP, Discovery, Cart | ảnh và srcset bị lặp logic |
| `src/js/render/home-view.js` | Pha 4 | Home-specific content | Home entry + product data | Home không có section thương mại/story |
| `src/js/render/product-card.js` | Pha 4 | card reusable cho listing/related | Shop, related, guide cũ | card logic lặp nhiều nơi |
| `src/js/render/product-grid.js` | Pha 4 | render grid + no-result fallback | Shop | Shop grid khó tái dùng |
| `src/js/render/shop-view.js` | Pha 4 | render control shell/status slots | Shop entry | Shop khó tách UI và state |
| `src/js/render/empty-state.js` | Pha 4 | branded empty state helper | Shop | empty state bị hardcode mỗi nơi |
| `src/js/render/product-detail.js` | Pha 4, refine ở Pha 12 | render PDP đầy đủ | PDP entry | không có layout/detail page |
| `src/js/render/related-products.js` | Pha 4 | render related row | PDP | mất cross-sell block |
| `src/js/render/discovery-view.js` | Pha 5, đổi mạnh ở Pha 11 | render Discovery, hiện gồm cả guide content | Discovery entry | discovery funnel hiện tại mất luôn tư vấn |
| `src/js/render/guide-view.js` | Pha 5 | render guide page cũ | guide entry cũ | hiện tại không làm gãy runtime live, nhưng là dấu vết lịch sử quan trọng |
| `src/js/render/contact-view.js` | Pha 6, tái dùng ở Pha 11 | render block contact/support | FAQ hub hiện tại | mất phần contact trong hub |
| `src/js/render/faq-view.js` | Pha 6, đổi ở Pha 11 | render grouped FAQ | FAQ hub | mất FAQ content |
| `src/js/render/cart-view.js` | Pha 7, refine ở Pha 11-12 | render Cart states và summary | Cart entry | Cart không hiển thị được |
| `src/js/render/checkout-view.js` | Pha 8, refine ở Pha 12 | render Checkout states và success | Checkout entry | Checkout không hiển thị được |

### 5.6 Utility modules

| File | Thuộc pha nào | Vì sao file này được thêm vào | Nó nối với gì | Nếu thiếu thì hỏng gì |
| --- | --- | --- | --- | --- |
| `src/js/utils/format.js` | Pha 2 | currency/tag formatting + compare helper | product service, card, shop, PDP, cart, checkout | format tiền/tag rơi vào từng file |
| `src/js/utils/escape-html.js` | Pha 2 | escape output text khi render HTML string | nhiều render modules | tăng rủi ro inject text trực tiếp vào markup |

### 5.7 Styles base

| File | Thuộc pha nào | Vì sao file này được thêm vào | Nó nối với gì | Nếu thiếu thì hỏng gì |
| --- | --- | --- | --- | --- |
| `src/styles/tokens.css` | Pha 9 | token hóa toàn bộ color/type/spacing | mọi CSS file khác | visual system mất nền tảng |
| `src/styles/bootstrap-overrides.css` | Pha 9 | bóc visual Bootstrap mặc định | Bootstrap base classes | site dễ lộ “default Bootstrap” |
| `src/styles/utilities.css` | Pha 9 | tạo helper layout/spacing/panel | mọi page | layout pattern bị lặp |
| `src/styles/main.css` | Pha 9 | import tree và base global styles | toàn site | CSS pipeline đứt |

### 5.8 Component styles

| File | Thuộc pha nào | Vì sao file này được thêm vào | Nó nối với gì | Nếu thiếu thì hỏng gì |
| --- | --- | --- | --- | --- |
| `src/styles/components/header.css` | Pha 9 | skin navbar/badge/mobile nav | `render/header.js` | header mất premium polish |
| `src/styles/components/footer.css` | Pha 9, refine ở Pha 11 | skin footer/newsletter/map/social | `render/footer.js` | footer mất hierarchy hiện tại |
| `src/styles/components/zalo-widget.css` | Pha 9 | skin widget chat hỗ trợ | app shell | widget nhìn như raw DOM |
| `src/styles/components/forms.css` | Pha 9 | skin form field/check/feedback | checkout/newsletter | form nhìn mặc định |
| `src/styles/components/home.css` | Pha 9 | layout/hero/editorial cho Home | `render/home-view.js` | Home mất identity riêng |
| `src/styles/components/product-card.css` | Pha 9 | card hover, quick add reveal | `render/product-card.js` | grid card kém polish |
| `src/styles/components/product-detail.css` | Pha 9 | PDP gallery/purchase/trust/notes | `render/product-detail.js` | PDP mất cấu trúc |
| `src/styles/components/shop.css` | Pha 9 | toolbar/chips/grid/toast/no-result | Shop | listing kém rõ và kém responsive |
| `src/styles/components/cart.css` | Pha 9 | cart item/summary/trust layout | Cart | cart page vỡ layout |
| `src/styles/components/checkout.css` | Pha 9 | checkout progress/form/summary/success | Checkout | checkout không còn visual contract |
| `src/styles/components/support-pages.css` | Pha 9, reuse mạnh ở Pha 11 | panel system cho Discovery/Guide/FAQ/Contact | support/discovery pages | 4 nhóm page này mất cùng ngôn ngữ hình ảnh |

## SECTION 6 — Dependency chain explanation

### 6.1 HTML -> entry JS -> shell -> render

Chuỗi cơ bản của mỗi route hiện tại là:

- `index.html` -> `src/js/entries/home.js` -> `src/js/core/page-shell.js` -> `src/js/core/app-shell.js` -> `src/js/render/home-view.js` -> CSS từ `src/styles/main.css`
- `cua-hang.html` -> `src/js/entries/shop.js` -> shell -> `src/js/render/shop-view.js` + `src/js/render/product-grid.js`
- `chi-tiet-san-pham.html` -> `src/js/entries/product.js` -> shell -> `src/js/render/product-detail.js` + `src/js/render/related-products.js`
- `gio-hang.html` -> `src/js/entries/cart.js` -> shell -> `src/js/render/cart-view.js`
- `thanh-toan.html` -> `src/js/entries/checkout.js` -> shell -> `src/js/render/checkout-view.js`

Ý chính là: HTML không chứa business UI. HTML chỉ là entry shell. Entry JS mới quyết định fetch gì, render gì, bind event gì.

### 6.2 Data JSON -> services -> render modules

Chuỗi dữ liệu commerce hiện tại là:

- `src/data/products.json` -> `src/js/core/data-store.js` / `src/js/core/product-service.js`
- từ đó đi tới:
  - `src/js/render/home-view.js`
  - `src/js/render/product-card.js`
  - `src/js/render/product-detail.js`
  - `src/js/render/discovery-view.js`
  - `src/js/render/cart-view.js`
  - `src/js/render/checkout-view.js`

`src/data/site.json` lại đi theo hai nhánh:

- fetch qua `getSite()` cho `src/js/entries/discovery.js` và `src/js/entries/faq.js`
- import trực tiếp trong `src/js/core/app-shell.js` và `src/js/render/footer.js`

`src/data/guide.json` hiện đi vào Discovery:

- `src/data/guide.json` -> `src/js/entries/discovery.js` -> `src/js/render/discovery-view.js`

`src/data/faq.json` đi vào FAQ hub:

- `src/data/faq.json` -> `src/js/entries/faq.js` -> `src/js/render/faq-view.js`

### 6.3 localStorage -> cart store -> badge/cart/checkout

Chuỗi state quan trọng nhất của storefront là:

- `localStorage["sillage-cart"]`
- `src/js/core/cart-store.js`
- từ đó lan sang:
  - `src/js/render/header.js` qua `subscribeToCartUpdates()` trong `app-shell.js`
  - `src/js/entries/cart.js` + `src/js/render/cart-view.js`
  - `src/js/core/checkout-service.js` / `src/js/entries/checkout.js` + `src/js/render/checkout-view.js`

Nghĩa là header badge, cart page và checkout summary không tự giữ state riêng. Chúng đều đọc từ cùng một store.

### 6.4 Route/query params -> shop/product state

PDP chain:

- `chi-tiet-san-pham.html?san-pham=...`
- `src/js/entries/product.js` đọc `new URLSearchParams(window.location.search).get("san-pham")`
- `src/js/core/product-service.js` resolve qua `getProductBySlug(products, slug)`
- render PDP hoặc invalid fallback

Shop chain:

- `cua-hang.html?nhom-huong=...&dip-su-dung=...&sap-xep=...`
- `src/js/core/query-state.js` đọc/ghi query string
- `src/js/core/filter-state.js` và `src/js/core/sort-state.js` normalize state
- `src/js/entries/shop.js` apply state rồi rerender result block

Đây là lý do site vẫn là static site nhưng vẫn reload-safe. State không nằm trong memory của một SPA router; nó nằm trong URL và `localStorage`.

## SECTION 7 — “How I would explain this to the professor”

### 7.1 Bản ngắn

Em build dự án này theo đúng hướng static multi-page ngay từ đầu bằng Vite MPA, tức là mỗi route là một file HTML riêng và mỗi route có entry JavaScript riêng. Sau đó em tách dữ liệu ra JSON, trong đó `src/data/products.json` là nguồn dữ liệu trung tâm cho Home, Shop, Product Detail, Discovery, Cart và Checkout. Khi data layer ổn rồi, em dựng shared shell cho header/footer/page frame, rồi mới đi lần lượt qua Home, Shop, Product Detail, Discovery, Cart và Checkout. Cuối cùng em mới phủ design system CSS, thêm docs, rồi làm một vòng refactor để gộp Guide vào Discovery và gộp Contact vào FAQ, nhưng vẫn giữ route cũ bằng redirect để không gãy link.

### 7.2 Bản trung bình

Nếu giải thích theo thứ tự kỹ thuật thì bước đầu tiên là khóa stack ở `package.json` và `vite.config.js`. `vite.config.js` dùng `rollupOptions.input` để build nhiều trang tĩnh như `index.html`, `cua-hang.html`, `chi-tiet-san-pham.html`, `gio-hang.html`, `thanh-toan.html`, nên dự án đúng nghĩa là multi-page chứ không phải một SPA giả dạng. Sau đó em làm data layer trước UI: `src/data/products.json` là source of truth cho catalog, còn `src/js/core/product-service.js` gom toàn bộ logic đọc, lọc, sort, resolve theo slug và lấy related products.

Khi có data layer rồi, em dựng `src/js/core/app-shell.js`, `src/js/core/page-shell.js`, `src/js/render/header.js`, `src/js/render/footer.js` để tất cả page dùng chung header/footer và active navigation. Sau đó em làm Home trước để kiểm tra shell, product card và tone nội dung. Từ Home em tách ra Shop với filter/sort/query state, rồi mới làm Product Detail vì trang đó phụ thuộc mạnh vào slug trên URL. Cart được thêm sau khi product identity đã ổn định, dùng `localStorage` qua `src/js/core/cart-store.js`. Checkout đi sau Cart và dùng `src/js/core/checkout-service.js` để tính order summary. Sau khi các flow chính đã ổn, repo mới có commit CSS lớn để premium hóa toàn bộ UI và thêm commit refactor nội dung ở phần support/discovery.

### 7.3 Bản kỹ thuật sâu

Về mặt kiến trúc, repo này đi theo mô hình “thin HTML + entry module + shared shell + render modules + JSON data”. HTML chỉ giữ vai trò route entrypoint. Ví dụ `cua-hang.html` chỉ trỏ tới `src/js/entries/shop.js`; chính file entry này mới đọc product data, dựng shell và truyền state vào `src/js/render/shop-view.js`. Cách làm này giúp mỗi page là một route tĩnh thật nhưng phần UI vẫn được tổ chức theo module.

Trục quan trọng nhất là `src/data/products.json`. Từ file này, `src/js/core/product-service.js` cung cấp các hàm nghiệp vụ như lấy listing products, lấy featured products, build href cho từng sản phẩm, tìm sản phẩm theo slug/id đã normalize, resolve size, lấy related products. Chính quyết định này làm cho Home, Shop, Product Detail và Discovery dùng cùng một contract dữ liệu thay vì hardcode riêng từng trang.

Cart được tổ chức đúng kiểu static ecommerce: `src/js/core/cart-store.js` là nơi duy nhất đọc/ghi `localStorage`, còn header badge, Cart page và Checkout chỉ tiêu thụ state đó. Vì thế reload không làm mất giỏ hàng, nhưng site vẫn không cần backend. Ở cuối timeline có một đợt refactor rất rõ trong git: Guide page và Contact page từng là page runtime riêng, sau đó được đổi thành redirect, còn nội dung được hấp thụ vào Discovery và FAQ hub. Đây là bằng chứng repo có ít nhất một vòng tối ưu information architecture chứ không phải code một lần là xong.

## SECTION 8 — Risks, refactors, and likely iterations

### 8.1 Những refactor có thể xác nhận từ git

- Commit `ad6eb99` xác nhận `src/js/entries/guide.js` từng boot một Guide page thật, nhưng sau đó bị rút xuống còn `window.location.replace("bo-kham-pha.html#tu-van-chon-mui");`.
- Cũng trong commit đó, `src/js/entries/contact.js` bị đổi từ page đầy đủ sang redirect tới `cau-hoi-thuong-gap.html#lien-he-tong`.
- `src/js/render/discovery-view.js` được mở rộng để hấp thụ thêm nội dung guide từ `src/data/guide.json`.
- `src/js/entries/faq.js` được đổi từ FAQ-only page sang support hub kết hợp cả `renderContactView()` và `renderFaqView()`.
- Commit `1735c6a` xác nhận có một vòng cleanup wording và xóa các asset `public/images/icons/payment-*.svg` không còn dùng.

### 8.2 Những phần cho thấy code đã qua ít nhất một vòng lặp

- `src/js/render/guide-view.js` vẫn còn trong repo dù route public hiện tại chỉ redirect. Đây là dấu vết lịch sử rất rõ của một kiến trúc cũ.
- `src/js/core/product-service.js` có các lớp normalize như `normalizeLookupToken()`, `legacySlugs`, `legacyIds`. Đây thường là dấu hiệu dữ liệu hoặc URL scheme đã được chỉnh ít nhất một lần.
- `src/js/core/page-shell.js` mỏng hơn `src/js/core/app-shell.js`, cho thấy nó là lớp trừu tượng được thêm vào sau khi đã có đủ nhiều entry module để thấy cần giảm lặp.
- `src/styles/components/support-pages.css` gom style cho Discovery, Guide, FAQ, Contact. Kiểu CSS này thường chỉ xuất hiện sau khi team nhận ra nhiều page đang dần dùng chung một ngôn ngữ hình ảnh.

### 8.3 Những thay đổi chỉ có thể suy luận, không thể xác nhận hoàn toàn

- `PROJECT_BRIEF.md`, `README.md` và một phần `HANDBOOK.md` còn nhắc route tiếng Anh như `shop.html`, `product.html`, `about.html`. Nhưng commit sớm nhất còn lưu trong repo đã dùng route tiếng Việt ngay trong `vite.config.js`. Vì vậy không thể khẳng định chắc rằng repo này từng có một commit public đổi từ route tiếng Anh sang route tiếng Việt. Điều đó chỉ có thể nói là dấu vết của tài liệu hoặc kế hoạch cũ.
- Docs cũ còn nhắc About page, nhưng `git log --all --name-status -- about.html ...` không cho thấy evidence runtime tương ứng trong lịch sử hiện đang có. Nói cách khác: có thể About từng nằm trong brief, nhưng repo hiện không cho phép khẳng định “đã code About rồi xóa”.

### 8.4 Các mâu thuẫn tài liệu phải nói rõ khi bảo vệ

- `PROJECT_BRIEF.md` và một số đoạn trong `README.md` vẫn còn dấu vết route tiếng Anh, trong khi runtime hiện tại dùng `cua-hang.html`, `chi-tiet-san-pham.html`, `bo-kham-pha.html`, `gio-hang.html`, `thanh-toan.html`.
- `HANDBOOK.md` ở phần đầu nói rõ docs có dấu vết route cũ và nói Contact/Guide đã được gộp, nhưng các đoạn sau vẫn mô tả `huong-dan-mui-huong.html` và `lien-he.html` như page đầy đủ. Runtime hiện tại lại cho thấy hai file này là redirect. Vì vậy nếu docs và runtime mâu thuẫn, phải ưu tiên runtime.
- `README.md`, `DEFENSE_NOTES.md` và git history gần cuối khớp hơn với trạng thái runtime hiện tại so với brief cũ.

### 8.5 Rủi ro và giới hạn còn lại

- Vì đây là static site, Checkout không có order persistence thực tế. Nó chỉ mô phỏng bước hoàn tất đơn trong phạm vi client-side.
- Việc giữ route cũ bằng redirect là tốt cho backward compatibility nhưng làm repo có một số historical residue như `guide-view.js` và hai file HTML redirect.
- `site.json` hiện gánh nhiều loại nội dung: brand copy, footer, support contact, social links. Nếu scope dự án tăng tiếp, file này có thể cần được tách nhỏ hơn.

## SECTION 9 — Step-by-step beginner learning path from the build order

### Bước 1: Hiểu build nền và MPA

- Mở `package.json`, `vite.config.js`
- Học: Vite, MPA, `rollupOptions.input`
- Sau bước này phải trả lời được: vì sao dự án cấu hình theo MPA, và vì sao cách đó vẫn là static

### Bước 2: Xem các root HTML

- Mở `index.html`, `cua-hang.html`, `chi-tiet-san-pham.html`, `bo-kham-pha.html`, `gio-hang.html`, `thanh-toan.html`
- Học: thin HTML shell, route-to-entry mapping
- Sau bước này phải trả lời được: mỗi route đang gọi entry nào

### Bước 3: Đọc dữ liệu trước khi đọc UI

- Mở `src/data/products.json`, `src/data/site.json`, `src/data/guide.json`, `src/data/faq.json`
- Học: content modeling, source of truth, JSON contract
- Sau bước này phải trả lời được: vì sao `products.json` là trung tâm của repo

### Bước 4: Đọc core services và state helpers

- Mở `src/js/core/data-store.js`, `src/js/core/product-service.js`, `src/js/core/query-state.js`, `src/js/core/filter-state.js`, `src/js/core/sort-state.js`
- Học: service layer, query-driven state, reuse logic
- Sau bước này phải trả lời được: dữ liệu đi từ JSON vào UI qua những lớp nào

### Bước 5: Đọc shared shell

- Mở `src/js/core/app-shell.js`, `src/js/core/page-shell.js`, `src/js/render/header.js`, `src/js/render/footer.js`, `src/js/render/page-intro.js`
- Học: layout composition, shared chrome
- Sau bước này phải trả lời được: vì sao shared shell được dựng sớm hơn Cart/Checkout

### Bước 6: Đọc Home trước

- Mở `src/js/entries/home.js`, `src/js/render/home-view.js`
- Học: orchestration của một page, curated storytelling
- Sau bước này phải trả lời được: Home đang test và tận dụng những khối nào của hệ thống

### Bước 7: Đọc Shop

- Mở `src/js/entries/shop.js`, `src/js/render/shop-view.js`, `src/js/render/product-card.js`, `src/js/render/product-grid.js`
- Học: listing flow, filter/sort state, reusable product UI
- Sau bước này phải trả lời được: vì sao Shop phải đứng sau data layer và shared shell

### Bước 8: Đọc Product Detail

- Mở `src/js/entries/product.js`, `src/js/render/product-detail.js`, `src/js/render/related-products.js`
- Học: query param routing, related product strategy, add-to-cart point
- Sau bước này phải trả lời được: Product Detail routing chi phối những gì trong kiến trúc

### Bước 9: Đọc Discovery và lịch sử Guide

- Mở `src/js/entries/discovery.js`, `src/js/render/discovery-view.js`, `src/js/render/guide-view.js`, `src/js/entries/guide.js`
- Học: information architecture iteration, redirect-based backward compatibility
- Sau bước này phải trả lời được: phần nào là runtime hiện tại, phần nào là dấu vết lịch sử

### Bước 10: Đọc support hub và lịch sử Contact

- Mở `src/js/entries/faq.js`, `src/js/render/faq-view.js`, `src/js/render/contact-view.js`, `src/js/entries/contact.js`
- Học: support-page consolidation
- Sau bước này phải trả lời được: vì sao `lien-he.html` vẫn tồn tại nhưng chỉ là redirect

### Bước 11: Đọc Cart và Checkout

- Mở `src/js/core/cart-store.js`, `src/js/entries/cart.js`, `src/js/render/cart-view.js`, `src/js/core/checkout-service.js`, `src/js/entries/checkout.js`, `src/js/render/checkout-view.js`
- Học: `localStorage` persistence, derived summary, static checkout
- Sau bước này phải trả lời được: điều gì phải có trước cart và checkout

### Bước 12: Đọc CSS system và tài liệu bảo vệ

- Mở `src/styles/tokens.css`, `src/styles/bootstrap-overrides.css`, `src/styles/main.css`, `src/styles/components/*.css`, `DESIGN_SYSTEM.md`, `DEFENSE_NOTES.md`, `HANDBOOK.md`
- Học: token-driven styling, Bootstrap de-branding, runtime-vs-doc truth
- Sau bước này phải trả lời được: tài liệu nào phản ánh current runtime tốt hơn, tài liệu nào còn dấu vết cũ

## SECTION 10 — Defense-critical questions tied to implementation order

### Pha toolchain và MPA

- Giáo viên có thể hỏi: Vì sao cấu hình Vite theo MPA?
  - Trả lời ngắn: Vì đề bài yêu cầu static multi-page, nên mỗi route phải là file HTML thật.
  - Trả lời sâu: `vite.config.js` dùng `rollupOptions.input` để build nhiều entry như `index.html`, `cua-hang.html`, `chi-tiet-san-pham.html`, `gio-hang.html`, `thanh-toan.html`. Nhờ vậy site là static thật chứ không phải một SPA dùng JavaScript router để giả lập nhiều trang.

- Giáo viên có thể hỏi: Vì sao nó vẫn là static site?
  - Trả lời ngắn: Vì không có backend, không có database, không có server-side rendering.
  - Trả lời sâu: Dữ liệu nằm trong các file JSON dưới `src/data`, còn state duy nhất cần persistence là cart thì nằm trong `localStorage` qua `src/js/core/cart-store.js`. Runtime chỉ là HTML, CSS, JS tĩnh do Vite build ra.

### Pha data layer

- Giáo viên có thể hỏi: Vì sao `products.json` là trung tâm?
  - Trả lời ngắn: Vì hầu hết flow thương mại đều đọc từ file đó.
  - Trả lời sâu: `src/js/core/product-service.js` lấy `src/data/products.json` làm source of truth rồi cung cấp lookup theo slug, listing, featured products, size resolution, related products, href generation. Nhờ vậy Home, Shop, PDP, Discovery và Cart không cần tự quản logic sản phẩm riêng.

### Pha shared shell

- Giáo viên có thể hỏi: Vì sao shared shell phải làm sớm?
  - Trả lời ngắn: Vì mọi page đều cần header/footer nhất quán và cart badge dùng chung.
  - Trả lời sâu: `src/js/core/app-shell.js` cùng `src/js/render/header.js` và `src/js/render/footer.js` gom layout chung vào một chỗ. Nếu không làm sớm, mỗi page sẽ tự nhân bản nav/footer, sau này chỉnh route, active state, CTA hoặc cart badge sẽ rất tốn và dễ lệch.

### Pha Home -> Shop -> Product Detail

- Giáo viên có thể hỏi: Cái gì có trước cart và checkout?
  - Trả lời ngắn: Data layer, shared shell, Home/Shop/Product Detail phải có trước.
  - Trả lời sâu: Cart không thể tồn tại nếu product identity chưa ổn định. Phải có `products.json`, `product-service.js`, rồi mới có thể add line item đúng `id`, `slug`, `price`, `size`. Checkout lại phụ thuộc vào cart, nên nó đứng sau là đúng dependency chain.

- Giáo viên có thể hỏi: Product Detail routing ảnh hưởng gì tới kiến trúc?
  - Trả lời ngắn: Nó buộc dự án phải có slug/query handling rõ ràng.
  - Trả lời sâu: `chi-tiet-san-pham.html` không có router server-side nên `src/js/entries/product.js` phải tự đọc `san-pham` từ URL rồi gọi `getProductBySlug()`. Quyết định này kéo theo việc slug normalization, legacy slug support và query-state trở thành phần cốt lõi, không còn là chi tiết phụ.

### Pha Discovery/Guide và FAQ/Contact

- Giáo viên có thể hỏi: Vì sao Guide và Contact bây giờ chỉ là redirect?
  - Trả lời ngắn: Vì nội dung đã được hợp nhất vào Discovery và FAQ để giảm phân mảnh nhưng vẫn giữ link cũ.
  - Trả lời sâu: Git diff ở commit `ad6eb99` xác nhận `src/js/entries/guide.js` và `src/js/entries/contact.js` bị đổi từ page đầy đủ sang redirect. Đồng thời `src/js/render/discovery-view.js` hấp thụ guide content và `src/js/entries/faq.js` hấp thụ contact section. Đây là một refactor IA ở giai đoạn muộn.

### Pha Cart và Checkout

- Giáo viên có thể hỏi: Vì sao không dùng backend cho checkout?
  - Trả lời ngắn: Vì đề bài cấm backend và mục tiêu chỉ là static storefront.
  - Trả lời sâu: `src/js/core/cart-store.js` dùng `localStorage` để giữ giỏ hàng qua reload. `src/js/core/checkout-service.js` chỉ tính summary và trạng thái hiển thị từ cart hiện có. Nghĩa là checkout ở đây là client-side flow minh họa cho quy trình đặt hàng, không giả vờ là hệ thống xử lý đơn thật.

### Pha design system và polish

- Giáo viên có thể hỏi: Làm sao để site không còn nhìn như Bootstrap mặc định?
  - Trả lời ngắn: Vì Bootstrap chỉ là nền CSS utility/component, còn visual identity được bọc lại bằng token, override và component styles riêng.
  - Trả lời sâu: `src/styles/tokens.css` định nghĩa biến thiết kế; `src/styles/bootstrap-overrides.css` bẻ lại form/button/layout mặc định; sau đó các file như `src/styles/components/home.css`, `src/styles/components/product-detail.css`, `src/styles/components/support-pages.css` mới định hình lại từng page. Do đó Bootstrap còn ở tầng kỹ thuật, không còn lộ ở tầng nhận diện.

## SECTION 11 — Final condensed engineering narrative

Nếu kể lại ngắn gọn nhưng đúng với evidence trong repo, dự án này được dựng từ nền Vite MPA trước tiên để bảo đảm mỗi route là một file HTML tĩnh thật. Sau đó tác giả không lao vào làm UI ngay mà chốt contract dữ liệu bằng `src/data/products.json`, `src/data/site.json`, `src/data/guide.json`, `src/data/faq.json`, rồi dựng `src/js/core/product-service.js`, `src/js/core/data-store.js` và shared shell để mọi page đi qua cùng một đường dữ liệu và cùng một khung layout.

Sau khi có phần nền đó, các flow được xây theo dependency tự nhiên: Home trước để thử shell và product storytelling, Shop sau để xử lý filter/sort/query state, rồi Product Detail vì nó phụ thuộc slug trên URL. Chỉ khi product identity đã ổn thì Cart mới được thêm bằng `localStorage`, và Checkout mới đọc lại cart để tính summary. Đến một commit sau nữa, toàn bộ hệ CSS mới được phủ lên để đưa giao diện từ functional sang premium. Cuối timeline mới xuất hiện các đợt refactor nội dung, cụ thể là gộp Guide vào Discovery, gộp Contact vào FAQ, rồi giữ route cũ bằng redirect để tránh gãy link.

Điểm cần nói rất rõ khi bảo vệ là repo có một số tài liệu cũ còn nhắc route tiếng Anh hoặc About page. Runtime hiện tại và git history còn lưu xác nhận chắc MPA tiếng Việt, xác nhận việc merge Guide/Contact, nhưng không xác nhận đầy đủ câu chuyện “đã từng có About page runtime”. Vì vậy cách trình bày trung thực nhất là tách rõ: đâu là thứ commit/code xác nhận được, đâu là phần chỉ có thể suy luận từ tài liệu cũ và kiến trúc hiện tại.
