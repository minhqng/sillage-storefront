# Handbook bảo vệ và học dự án Sillage

Tôi đã đọc toàn bộ repo hiện tại, các file runtime chính, các tài liệu hướng dẫn nội bộ, và đã chạy `npm run build` thành công. Có một điểm rất quan trọng cần nhớ ngay từ đầu: tài liệu như `README.md`, `PROJECT_BRIEF.md`, `PLANS.md` vẫn còn dấu vết của phiên bản cũ dùng route tiếng Anh và có trang About riêng, nhưng runtime hiện tại đã Việt hóa route và đã bỏ route About, gộp phần brand story vào Home.

## SECTION 1 — Tổng quan dự án cho người mới hoàn toàn

Đây là một website bán hàng tĩnh nhiều trang cho một thương hiệu nước hoa giả lập tên Sillage. “Tĩnh” ở đây không có nghĩa là “không có tương tác”. Nó có tương tác thật như lọc sản phẩm, xem chi tiết theo URL, thêm giỏ hàng, cập nhật số lượng, checkout và lưu giỏ hàng sau khi reload. “Tĩnh” nghĩa là nó không cần server backend riêng để tạo trang theo thời gian thực.

Mục tiêu của dự án là làm ra một storefront nhìn và hoạt động giống một brand D2C cao cấp thật, chứ không giống bài tập Bootstrap ghép linh tinh. Vì vậy dự án tập trung mạnh vào:
- dữ liệu sản phẩm rõ ràng
- điều hướng nhiều trang rõ ràng
- giao diện premium
- giỏ hàng bền sau reload
- checkout believable dù không có backend

“Static multi-page ecommerce” có thể hiểu rất đơn giản như sau:
- “Static”: file HTML/CSS/JS được build sẵn, không có server render động, không database.
- “Multi-page”: mỗi trang là một file HTML riêng, ví dụ trang chủ, cửa hàng, chi tiết sản phẩm, giỏ hàng, thanh toán.
- “Ecommerce”: vẫn có các luồng mua sắm thật ở phía trình duyệt như xem sản phẩm, thêm giỏ, tính tổng, đi checkout.

Vì sao stack này được chọn:
- Vite: làm dev server nhanh, build nhanh, xử lý assets và hỗ trợ multi-page app rất gọn.
- Bootstrap 5.3.x: cho layout, grid, form, navbar, utility cơ bản, nhưng bị override mạnh để không nhìn như Bootstrap mặc định.
- Vanilla JavaScript ES modules: đủ mạnh cho đồ án này, giúp hiểu rõ data flow thay vì ẩn sau framework.
- JSON data files: dữ liệu sản phẩm và nội dung dùng chung được tách khỏi UI.
- localStorage: lưu giỏ hàng ở ngay trên trình duyệt người dùng, hợp với site tĩnh không backend.

Vite làm gì trong dự án này:
- chạy `npm run dev` để mở môi trường dev
- build toàn bộ các file HTML nhiều trang
- xử lý import CSS, font, JS module, JSON
- tạo thư mục `dist/` với asset hash hóa để demo/bàn giao

Bootstrap làm gì trong dự án này:
- cho sẵn hệ grid responsive, nút, form, collapse navbar
- cung cấp biến `--bs-*`
- nhưng visual identity bị thay gần như toàn bộ qua token và CSS custom

Vanilla JS modules làm gì:
- chia code thành nhiều file nhỏ theo vai trò
- `entries/` khởi động từng trang
- `core/` xử lý dữ liệu, cart, query, checkout rules
- `render/` tạo HTML string
- `utils/` lo format và escape

JSON data files làm gì:
- `products.json` là nguồn dữ liệu sản phẩm chính
- `site.json` chứa brand/support/footer/discovery/contact content
- `guide.json` chứa nội dung hướng dẫn mùi hương
- `faq.json` chứa nhóm câu hỏi thường gặp

localStorage làm gì:
- nhớ giỏ hàng trên chính thiết bị đó
- bạn thêm vào giỏ, reload trang, giỏ vẫn còn
- checkout xong thì giỏ bị xóa khỏi localStorage

## SECTION 2 — Mô hình tư duy toàn hệ thống

Hãy tưởng tượng dự án này là một cửa hàng vật lý nhưng được chia thành nhiều phòng:

- Mỗi file HTML là một “cửa vào” riêng.
- `main.css` là bộ quy chuẩn nội thất.
- `app-shell.js` là bộ phận dựng sảnh chung: header, footer, cart badge, widget hỗ trợ.
- JSON là kho hồ sơ sản phẩm và nội dung.
- `render/*.js` là đội dựng trưng bày.
- `core/*.js` là đội điều hành phía sau.
- localStorage là quyển sổ tay giữ lại giỏ hàng giữa các lần quay lại.

Bản đồ chạy của hệ thống:
1. Người dùng mở một route như `index.html` hoặc `cua-hang.html`.
2. File HTML đó gần như trống phần thân, chỉ có một vùng mount `#app`.
3. Trình duyệt nạp `main.css` và entry JS của trang đó.
4. Entry JS gọi `mountPageShell()` hoặc `mountAppShell()` để dựng khung chung.
5. Entry JS lấy dữ liệu từ JSON.
6. Entry JS gọi các render module để tạo HTML.
7. HTML được chèn vào vùng mount.
8. Sau đó JS gắn event cho nút, form, filter, add-to-cart.
9. Khi user thao tác, state đổi, localStorage đổi, badge và nội dung liên quan được cập nhật.

Các trang hiện có trong bản runtime:
- Home: `index.html`
- Shop: `cua-hang.html`
- Product Detail: `chi-tiet-san-pham.html?san-pham=...`
- Discovery Set: `bo-kham-pha.html`
- Scent Guide: `huong-dan-mui-huong.html`
- FAQ: `cau-hoi-thuong-gap.html`
- Contact: `lien-he.html`
- Cart: `gio-hang.html`
- Checkout: `thanh-toan.html`

Navigation hoạt động ra sao:
- Header dùng các link HTML thật.
- Footer cũng dùng các link HTML thật.
- Product card dùng link tới trang chi tiết hoặc discovery page.
- Không có router kiểu React/Vue. Mỗi lần bấm link là sang file HTML khác.

Data được load ra sao:
- `products.json`, `site.json`, `guide.json`, `faq.json` được lấy qua `fetch` trong `data-store.js`
- riêng một số phần shell như footer/Zalo dùng import JSON trực tiếp để có dữ liệu sẵn trong bundle
- `data-store.js` có cache để không fetch lặp vô ích trong cùng phiên chạy trang

Link sản phẩm hoạt động ra sao:
- chai nước hoa thường đi tới `chi-tiet-san-pham.html?san-pham=<slug>`
- Discovery Set không đi vào generic PDP mà đi thẳng `bo-kham-pha.html`
- đây là quyết định rất đúng về mặt merchandising: discovery là một “entry product” khác logic với chai full-size

Cart hoạt động ra sao:
- khi bấm add-to-cart, JS lấy `productId`, `sizeId`, `quantity`, `unitPrice`
- cart-store ghi state đó vào `localStorage["sillage-cart"]`
- cart-store bắn event `cart:updated`
- header badge và các phần liên quan nghe event này và tự cập nhật

Checkout hoạt động ra sao:
- checkout đọc giỏ hàng hiện tại từ cart-store
- đồng bộ giỏ với catalog hiện tại để loại bỏ item stale và cập nhật giá
- render form giao hàng + thanh toán + summary
- validate ở client side
- submit hợp lệ thì tạo trạng thái success ngay trên trang và clear cart

Shared layout/header/footer hoạt động ra sao:
- mỗi trang không tự viết lại header/footer
- entry chỉ đưa nội dung trang riêng
- `app-shell.js` bọc nội dung đó bằng header, main, footer, skip link, Zalo widget

CSS và JS shared hoạt động ra sao:
- toàn site dùng chung `main.css`
- mỗi component/page area có CSS file riêng
- header/footer/product card/page intro/cart/checkout đều là module dùng lại
- điều này giúp visual consistent và giảm lặp

Product detail routing hoạt động ra sao:
- không có server route động
- chỉ có một file `chi-tiet-san-pham.html`
- file này đọc query param `san-pham`
- từ param đó, JS tìm đúng product trong `products.json`
- nếu tìm thấy thì render
- nếu không thấy thì hiện fallback state branded

Query param hoạt động ra sao:
- ví dụ `?san-pham=man-ho-phach`
- shop còn dùng `?nhom-huong=...&dip-su-dung=...&sap-xep=...`
- query string là cách “ghi nhớ trạng thái” mà vẫn static-safe

State được lưu ở đâu:
- state dài hạn của cart: localStorage
- state tạm của filter/sort: URL query string
- state tạm trong phiên render: biến JS trong entry module

## SECTION 3 — Walkthrough cấu trúc thư mục

Repo hiện tại có thể đọc như sau:

- Root HTML pages: các file HTML ở thư mục gốc là entry thật của multi-page app. Nếu xóa một file, route tương ứng biến mất.
- `public/`: chứa asset tĩnh như favicon, hình sản phẩm, hình editorial, icon thanh toán. Nếu xóa, UI mất hình hoặc OG image/favicons hỏng.
- `src/data/`: chứa dữ liệu JSON. Đây là lớp data.
- `src/js/`: chứa hành vi. Đây là lớp behavior.
- `src/styles/`: chứa giao diện. Đây là lớp styling.
- `dist/`: build output, không phải source of truth.
- `tests/`: đang trống, nghĩa là dự án hiện tại gần như dựa vào manual verification.
- Tài liệu root như `AGENTS.md`, `PROJECT_BRIEF.md`, `DESIGN_SYSTEM.md`, `PLANS.md`, `code_review.md`, `DEFENSE_NOTES.md`: ảnh hưởng mạnh tới định hướng kiến trúc và cách giải thích đồ án, dù không chạy trực tiếp trên browser.

Giải thích từng vùng quan trọng:

- `public/images/products/`: mỗi sản phẩm có thư mục riêng với ảnh PNG gốc, SVG và hai bản WebP `-480.webp`, `-768.webp`. Runtime dùng PNG làm `src` và suy luận `srcset` WebP.
- `public/images/editorial/`: ảnh không phải ảnh packshot sản phẩm, dùng cho band editorial, gallery, OG image.
- `public/images/icons/`: icon thanh toán như Visa, Mastercard, COD.
- `src/data/products.json`: file quan trọng nhất của commerce layer. Xóa file này thì shop, product detail, discovery, cart hydration, checkout summary đều gãy.
- `src/data/site.json`: nội dung brand/footer/contact/discovery. Xóa file này thì contact/discovery và một phần footer logic gãy.
- `src/data/guide.json`: nội dung trang guide.
- `src/data/faq.json`: nội dung trang FAQ.
- `src/js/core/`: business logic trung tâm.
- `src/js/entries/`: file khởi động từng trang.
- `src/js/render/`: file chuyên sinh markup.
- `src/js/utils/`: helper nhỏ, dùng lại.
- `src/styles/tokens.css`: design tokens.
- `src/styles/bootstrap-overrides.css`: đổi Bootstrap.
- `src/styles/utilities.css`: layout helper classes.
- `src/styles/components/`: CSS tách theo component/page block.

Một điểm rất nên biết để bảo vệ:
- `README.md` và `PROJECT_BRIEF.md` còn nhắc route kiểu `shop.html`, `product.html`, `about.html`.
- Runtime thật hiện nay dùng route Việt hóa như `cua-hang.html`, `chi-tiet-san-pham.html` và không còn page About công khai.
- Đây không phải bug runtime; đây là dấu vết của quá trình evolve dự án, và `PLANS.md` ghi rất rõ chuyện bỏ brand-story route để storefront commerce-led hơn.

## SECTION 4 — HTML căn bản, giải thích bằng chính dự án này

HTML là gì?  
HTML là “bộ khung xương” của trang web. Nó không quyết định màu đẹp hay logic giỏ hàng. Nó quyết định trang có các vùng nào: tiêu đề, ảnh, section, form, nút, v.v.

Một page entry file là gì?  
Trong dự án này, mỗi file HTML ở root là “điểm vào” của một trang công khai. Ví dụ:
- [index.html](D:/MyProfile/Documents/PTIT/sillage-storefront/index.html)
- [cua-hang.html](D:/MyProfile/Documents/PTIT/sillage-storefront/cua-hang.html)
- [chi-tiet-san-pham.html](D:/MyProfile/Documents/PTIT/sillage-storefront/chi-tiet-san-pham.html)

`<head>` và `<body>` làm gì:
- `<head>` chứa metadata, title, description, open graph, link CSS, favicon
- `<body>` chứa nội dung nhìn thấy trên màn hình

Vì sao stylesheet đặt trong `head`:
- để CSS được tải sớm
- tránh hiện giao diện trần chưa style

Vì sao script được load:
- để dựng nội dung động của từng trang
- để đọc JSON
- để xử lý click, form, cart, query params

Tại sao dùng `type="module"`:
- vì project dùng ES modules
- cho phép `import/export`
- mỗi entry file có thể import core/render/utils

Các semantic tag xuất hiện nhiều trong project:
- `header`: đầu trang
- `nav`: điều hướng
- `main`: nội dung chính
- `section`: từng khối nội dung
- `article`: card/khối độc lập
- `footer`: chân trang
- `aside`: khối phụ như summary
- `form`, `fieldset`, `legend`, `label`, `input`: form chuẩn
- `details`, `summary`: FAQ accordion native

Cách reusable shell được mount:
- mỗi HTML chỉ có `div#app[data-page-root]`
- entry JS gọi `mountPageShell()` hoặc `mountAppShell()`
- shell render header/footer/main vào `#app`
- rồi phần content riêng của trang được chèn vào giữa

### Giải thích từng HTML page

- [index.html](D:/MyProfile/Documents/PTIT/sillage-storefront/index.html)
  Vai trò: trang chủ. Route public: `/` hoặc `index.html`. Mount area: `#app`. Nội dung static: metadata, favicon, link CSS, link JS. Nội dung injected: toàn bộ hero, featured products, editorial band, discovery/trust/story sections.

- [cua-hang.html](D:/MyProfile/Documents/PTIT/sillage-storefront/cua-hang.html)
  Vai trò: cửa hàng. Route public: `cua-hang.html`. Mount area: `#app`. Static: metadata. Injected: page intro, filter bar, sort bar, product grid, active chips, toast.

- [chi-tiet-san-pham.html](D:/MyProfile/Documents/PTIT/sillage-storefront/chi-tiet-san-pham.html)
  Vai trò: một trang chi tiết dùng chung cho mọi chai full-size. Route public: `chi-tiet-san-pham.html?san-pham=...`. Static: metadata. Injected: loading state, sau đó là breadcrumb, gallery, size selector, quantity, add-to-cart, notes, related products.

- [bo-kham-pha.html](D:/MyProfile/Documents/PTIT/sillage-storefront/bo-kham-pha.html)
  Vai trò: landing page riêng cho Discovery Set. Route public: `bo-kham-pha.html`. Injected: discovery intro, product purchase block, danh sách 7 mùi bên trong, ritual steps, CTA quay lại shop/guide.

- [huong-dan-mui-huong.html](D:/MyProfile/Documents/PTIT/sillage-storefront/huong-dan-mui-huong.html)
  Vai trò: guide page. Route public: `huong-dan-mui-huong.html`. Injected: family cards, how-to-choose steps, glossary, recommended products.

- [cau-hoi-thuong-gap.html](D:/MyProfile/Documents/PTIT/sillage-storefront/cau-hoi-thuong-gap.html)
  Vai trò: FAQ. Route public: `cau-hoi-thuong-gap.html`. Injected: intro, 3 nhóm FAQ, map, CTA sang contact/shop.

- [lien-he.html](D:/MyProfile/Documents/PTIT/sillage-storefront/lien-he.html)
  Vai trò: contact/support. Route public: `lien-he.html`. Injected: support hero, contact methods, commitments, FAQ shortcuts, CTA.

- [gio-hang.html](D:/MyProfile/Documents/PTIT/sillage-storefront/gio-hang.html)
  Vai trò: cart page. Route public: `gio-hang.html`. Injected: loading state, sau đó populated cart hoặc empty cart. Có các control số lượng và CTA sang checkout.

- [thanh-toan.html](D:/MyProfile/Documents/PTIT/sillage-storefront/thanh-toan.html)
  Vai trò: checkout page. Route public: `thanh-toan.html`. Injected: loading state, empty-checkout fallback, form checkout hoặc success confirmation.

Mẫu chung của 9 HTML page này là cực kỳ nhất quán. Đây là một điểm rất tốt để bảo vệ: HTML được giữ mỏng, logic chuyển hết sang JS module, nên multi-page nhưng vẫn maintainable.

## SECTION 5 — CSS và Bootstrap, giải thích bằng chính dự án này

CSS là gì?  
CSS là lớp định nghĩa “trang nhìn như thế nào”: màu gì, font gì, khoảng cách bao nhiêu, responsive ra sao.

Bootstrap là gì?  
Bootstrap là một thư viện CSS/JS giúp có sẵn:
- grid layout
- button
- form-control
- navbar
- responsive breakpoints
- utility classes

Bootstrap utility classes là gì?  
Đó là các class nhỏ để chỉnh layout nhanh, ví dụ `container`, `ms-auto`, `mb-0`, `navbar-expand-lg`. Trong project này, Bootstrap utility được dùng ở mức vừa phải, còn visual identity do class `sl-*` kiểm soát.

Dự án này dùng Bootstrap mà không nhìn như Bootstrap mặc định bằng cách nào?
- đổi biến `--bs-*` trong `bootstrap-overrides.css`
- tự viết design token riêng trong `tokens.css`
- viết class component riêng `sl-*`
- đổi button/form/nav/card rất mạnh
- dùng font riêng, màu riêng, spacing riêng, shadow riêng
- tránh màu xanh Bootstrap, pill shape, card mặc định, badge mặc định

### Vai trò của từng CSS file gốc

- [src/styles/tokens.css](D:/MyProfile/Documents/PTIT/sillage-storefront/src/styles/tokens.css)
  Đây là gốc của design system. Nó định nghĩa:
  - màu nền, surface, text, border, accent, success, danger
  - font wordmark, font display, font UI, monospace
  - cỡ chữ, line-height, tracking
  - spacing scale
  - radius
  - shadow
  - timing animation
  - gutter responsive
  - chiều cao navbar
  - alias token cho button/input/card

  Đây là câu trả lời mạnh nhất nếu giảng viên hỏi “thiết kế được quản lý như thế nào”.

- [src/styles/bootstrap-overrides.css](D:/MyProfile/Documents/PTIT/sillage-storefront/src/styles/bootstrap-overrides.css)
  File này map token của Sillage vào biến Bootstrap:
  - `--bs-body-bg`, `--bs-body-color`
  - `--bs-primary`, `--bs-border-radius`
  - `--bs-form-control-*`
  - `--bs-navbar-*`
  - `--bs-btn-*`

  Sau đó nó restyle trực tiếp:
  - `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-quiet`
  - `.navbar`, `.navbar-toggler`
  - `.form-control`, `.form-select`, `.form-check-input`
  - `.card`, `.accordion`, `.badge`

  Đây là lớp “bẻ Bootstrap về đúng brand”.

- [src/styles/utilities.css](D:/MyProfile/Documents/PTIT/sillage-storefront/src/styles/utilities.css)
  File này định nghĩa các object/layout class dùng lại:
  - `.sl-shell`
  - `.sl-section`
  - `.sl-stack`
  - `.sl-cluster`
  - `.sl-link-row`
  - `.sl-panel`, `.sl-surface`
  - `.sl-label`, `.sl-muted`

  Đây giống “bộ Lego layout” riêng của project.

- [src/styles/main.css](D:/MyProfile/Documents/PTIT/sillage-storefront/src/styles/main.css)
  File này rất quan trọng vì nó là entry CSS chính. Thứ tự import là:
  1. `tokens.css`
  2. Bootstrap CSS
  3. `bootstrap-overrides.css`
  4. `utilities.css`
  5. component CSS files

  File này cũng định nghĩa:
  - reset box-sizing
  - font/body global
  - heading styles
  - link/focus style
  - container gutter
  - skip link
  - artwork system
  - global responsive/reduced motion

  Thứ tự import này là một điểm bảo vệ rất hay: có system, có tầng, không trộn bừa.

### Vai trò của từng component CSS file

- [src/styles/components/header.css](D:/MyProfile/Documents/PTIT/sillage-storefront/src/styles/components/header.css)
  Kiểm soát sticky header, blur background, wordmark, nav link active state, cart badge, mobile nav panel.

- [src/styles/components/footer.css](D:/MyProfile/Documents/PTIT/sillage-storefront/src/styles/components/footer.css)
  Kiểm soát footer nền tối, cột link, social pills, newsletter bar, map block.

- [src/styles/components/zalo-widget.css](D:/MyProfile/Documents/PTIT/sillage-storefront/src/styles/components/zalo-widget.css)
  Kiểm soát widget chat Zalo nổi góc phải dưới.

- [src/styles/components/forms.css](D:/MyProfile/Documents/PTIT/sillage-storefront/src/styles/components/forms.css)
  Làm form layout gọn, field note, validation spacing, checkbox alignment.

- [src/styles/components/home.css](D:/MyProfile/Documents/PTIT/sillage-storefront/src/styles/components/home.css)
  Định nghĩa toàn bộ visual rhythm của Home: hero grid, featured grid, editorial band, story/trust sections.

- [src/styles/components/product-card.css](D:/MyProfile/Documents/PTIT/sillage-storefront/src/styles/components/product-card.css)
  Định nghĩa product card dùng chung ở shop/home/related/guide.

- [src/styles/components/product-detail.css](D:/MyProfile/Documents/PTIT/sillage-storefront/src/styles/components/product-detail.css)
  Định nghĩa gallery, size selector, quantity stepper, metadata grid, notes grid, trust cards của PDP.

- [src/styles/components/shop.css](D:/MyProfile/Documents/PTIT/sillage-storefront/src/styles/components/shop.css)
  Định nghĩa filter bar, chips, toast, empty state, product grid responsive.

- [src/styles/components/cart.css](D:/MyProfile/Documents/PTIT/sillage-storefront/src/styles/components/cart.css)
  Định nghĩa cart notice, cart item card, quantity control, sticky summary, trust cards.

- [src/styles/components/checkout.css](D:/MyProfile/Documents/PTIT/sillage-storefront/src/styles/components/checkout.css)
  Định nghĩa progress steps, shipping method cards, summary rail, success state, invalid/valid styles.

- [src/styles/components/support-pages.css](D:/MyProfile/Documents/PTIT/sillage-storefront/src/styles/components/support-pages.css)
  Đây là file rất hiệu quả vì gom style cho Discovery, Guide, FAQ, Contact. Nó giữ các panel hỗ trợ có cùng ngôn ngữ hình ảnh.

### Typography, spacing, colors, radii, borders, surfaces được kiểm soát thế nào

- Typography:
  - Wordmark dùng Cormorant Garamond
  - Heading lớn dùng Lora
  - UI/body dùng Manrope
- Spacing:
  - mọi khoảng cách dựa trên token `--sl-space-*`
- Colors:
  - toàn bộ palette dựa trên token ấm trung tính
- Radii:
  - `--sl-radius-sm/md/lg`
- Borders:
  - `--sl-color-border`, `--sl-color-border-strong`
- Surfaces:
  - card/panel thường dùng nền bán trong suốt + gradient nhẹ + border mảnh

Responsive được xử lý thế nào:
- mobile-first
- breakpoints chính ở `768px`, `992px`, `1200px`
- navbar collapse dưới `992px`
- product grid: 1 -> 2 -> 3 -> 4 cột
- summary sticky chỉ bật ở desktop lớn
- editorial split layout stack lại trên màn hình hẹp

## SECTION 6 — JavaScript căn bản, giải thích bằng chính dự án này

JS module là gì?  
Một file JS module là một file có thể `export` ra thứ gì đó và file khác `import` vào dùng.

`import/export` nghĩa là gì?
- `export`: file này đưa hàm/giá trị ra cho file khác dùng
- `import`: file này lấy hàm/giá trị từ file khác vào dùng

Entry file là gì?
- file khởi động của từng trang
- ví dụ `home.js`, `shop.js`, `product.js`
- nó là nơi “bắt đầu chạy”

Render module là gì?
- file chuyên tạo HTML string
- nó không nên giữ business logic phức tạp
- ví dụ `product-detail.js` render giao diện PDP

Core module là gì?
- file giữ rule xử lý chính
- ví dụ cart, query, checkout, product resolution

Utility module là gì?
- helper nhỏ, tái dùng nhiều nơi
- ví dụ format tiền, escape HTML

“Event-driven behavior” nghĩa là gì?
- giao diện không tự đổi ngẫu nhiên
- nó đổi vì có event:
  - click nút
  - change select
  - submit form
  - cart update event
  - storage event giữa tab
- frontend hiện đại chạy rất nhiều theo mô hình này

Cách project này dùng các module:
- Entry module khởi động trang
- Entry gọi core để lấy/chuẩn hóa dữ liệu
- Entry gọi render để tạo markup
- Entry gắn event listener
- Khi user thao tác, event gọi core update state
- Sau đó UI được render lại phần cần thiết

Một flow cực ngắn của project là:

```text
HTML page
-> entry JS
-> mount app shell
-> load JSON
-> render HTML
-> user click
-> core update localStorage/query state
-> UI rerender
```

## SECTION 7 — Deep dive từng trang

### 1. Home

Mục đích:
- vào brand
- cho user thấy tone, best-seller, featured direction
- cho 2 đường đi rõ: vào shop ngay hoặc bắt đầu bằng Discovery Set

File chính:
- [index.html](D:/MyProfile/Documents/PTIT/sillage-storefront/index.html)
- [src/js/entries/home.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/entries/home.js)
- [src/js/render/home-view.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/render/home-view.js)
- [src/styles/components/home.css](D:/MyProfile/Documents/PTIT/sillage-storefront/src/styles/components/home.css)

Data cần:
- `products.json`

CSS ảnh hưởng mạnh:
- `home.css`
- `product-card.css`
- `main.css`

Render flow:
1. `home.js` gọi `getProducts()`
2. gọi `mountPageShell(... includePageIntro: false ...)`
3. `renderHomeView({ products })` dựng hero + featured + discovery/trust/story

Tương tác:
- CTA sang shop
- CTA sang discovery
- click featured product vào PDP

Edge cases:
- nếu fetch lỗi thì home render fallback state thương mại, không vỡ trắng trang

### 2. Shop

Mục đích:
- duyệt toàn bộ catalog full-size
- lọc theo family
- lọc theo occasion
- sort
- quick add

File chính:
- [cua-hang.html](D:/MyProfile/Documents/PTIT/sillage-storefront/cua-hang.html)
- [src/js/entries/shop.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/entries/shop.js)
- [src/js/render/shop-view.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/render/shop-view.js)
- [src/js/render/product-grid.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/render/product-grid.js)

Data cần:
- `products.json`

Render flow:
1. mount shell với layout loading
2. fetch catalog
3. `getListingProducts()` bỏ discovery ra khỏi grid chính
4. derive option từ data thật
5. đọc state từ query param
6. render filter controls + results + chips
7. bind change/click events

Tương tác:
- đổi family
- đổi occasion
- đổi sort
- clear chip
- clear all filters
- quick add

Edge cases:
- query param sai -> fallback về `tat-ca` hoặc `de-xuat`
- zero result -> empty state đẹp, có nút reset
- fetch fail -> branded fetch error

### 3. Product Detail

Mục đích:
- kể câu chuyện sản phẩm
- cho chọn size
- cho chọn quantity
- add to cart
- gợi ý sản phẩm related

File chính:
- [chi-tiet-san-pham.html](D:/MyProfile/Documents/PTIT/sillage-storefront/chi-tiet-san-pham.html)
- [src/js/entries/product.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/entries/product.js)
- [src/js/render/product-detail.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/render/product-detail.js)
- [src/js/render/related-products.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/render/related-products.js)

Data cần:
- `products.json`
- query param `san-pham`

Render flow:
1. mount loading state
2. đọc `san-pham`
3. tìm product bằng `getProductBySlug`
4. nếu là discovery-set thì redirect sang page discovery
5. nếu hợp lệ thì render detail + related
6. bind size, quantity, add-to-cart

Tương tác:
- đổi size -> giá đổi theo size
- tăng/giảm quantity
- add to cart
- click related product

Edge cases:
- thiếu query param -> invalid product state
- slug sai -> invalid product state
- discovery mở nhầm qua generic PDP -> redirect đúng route

### 4. Discovery Set

Mục đích:
- tạo đường vào ít rủi ro cho người mới
- giải thích vì sao nên thử trước
- cho add Discovery vào cart
- show 7 mùi nằm trong set

File chính:
- [bo-kham-pha.html](D:/MyProfile/Documents/PTIT/sillage-storefront/bo-kham-pha.html)
- [src/js/entries/discovery.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/entries/discovery.js)
- [src/js/render/discovery-view.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/render/discovery-view.js)

Data cần:
- `products.json`
- `site.json`

Tương tác:
- quantity stepper
- add discovery to cart
- click “xem chai lớn” của từng mùi trong set

Edge cases:
- nếu catalog thiếu discovery product -> render error state

### 5. Scent Guide

Mục đích:
- giúp người mới chọn theo mood/family thay vì nhớ thuật ngữ nước hoa

File chính:
- [huong-dan-mui-huong.html](D:/MyProfile/Documents/PTIT/sillage-storefront/huong-dan-mui-huong.html)
- [src/js/entries/guide.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/entries/guide.js)
- [src/js/render/guide-view.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/render/guide-view.js)

Data cần:
- `guide.json`
- `products.json`

Tương tác:
- click family card để sang shop với query param filter sẵn
- click recommended product để đi vào product detail

Edge cases:
- fetch lỗi -> fallback page

### 6. FAQ

Mục đích:
- giải tỏa lo lắng shipping/returns/discovery/payment

File chính:
- [cau-hoi-thuong-gap.html](D:/MyProfile/Documents/PTIT/sillage-storefront/cau-hoi-thuong-gap.html)
- [src/js/entries/faq.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/entries/faq.js)
- [src/js/render/faq-view.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/render/faq-view.js)

Data cần:
- `faq.json`

Tương tác:
- mở/đóng `<details>`
- click shortcut/contact/shop

Edge cases:
- fetch fail -> branded support fallback

### 7. Contact

Mục đích:
- cho user biết liên hệ ai, bằng kênh nào, khi nào

File chính:
- [lien-he.html](D:/MyProfile/Documents/PTIT/sillage-storefront/lien-he.html)
- [src/js/entries/contact.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/entries/contact.js)
- [src/js/render/contact-view.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/render/contact-view.js)

Data cần:
- `site.json`

Tương tác:
- click mailto, tel, Google Maps, FAQ shortcut, CTA về shop/discovery

Edge cases:
- fetch fail -> fallback qua FAQ/shop

### 8. Cart

Mục đích:
- cho user review lại line item
- đổi số lượng
- xóa item
- xem subtotal
- đi checkout

File chính:
- [gio-hang.html](D:/MyProfile/Documents/PTIT/sillage-storefront/gio-hang.html)
- [src/js/entries/cart.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/entries/cart.js)
- [src/js/core/cart-store.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/core/cart-store.js)
- [src/js/render/cart-view.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/render/cart-view.js)

Data cần:
- `localStorage["sillage-cart"]`
- `products.json` để hydrate item hiện tại

Tương tác:
- increment/decrement
- nhập số lượng trực tiếp
- remove
- click quay lại product
- sang checkout

Edge cases:
- stale item bị loại
- giá đổi thì sync lại
- empty cart state đẹp

### 9. Checkout

Mục đích:
- kết thúc hành trình mua
- cho nhập thông tin giao hàng + thanh toán
- tính shipping
- validate
- show success state

File chính:
- [thanh-toan.html](D:/MyProfile/Documents/PTIT/sillage-storefront/thanh-toan.html)
- [src/js/entries/checkout.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/entries/checkout.js)
- [src/js/core/checkout-service.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/core/checkout-service.js)
- [src/js/render/checkout-view.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/render/checkout-view.js)

Data cần:
- cart hiện tại
- `products.json`

Tương tác:
- nhập form
- chọn shipping method
- submit order

Edge cases:
- empty cart -> empty checkout
- invalid field -> inline error
- success -> clear cart + show confirmation
- checkout tránh rerender phá form khi user đang nhập

Không còn public page live nào khác ngoài 9 route trên. Route About/Brand Story đã bị loại khỏi runtime và gộp nội dung vào Home.

## SECTION 8 — Giải thích file-by-file

### Config và entry HTML

- [package.json](D:/MyProfile/Documents/PTIT/sillage-storefront/package.json): khai báo dự án là private, dùng ESM (`"type": "module"`), có ba script `dev/build/preview`, dependency gồm `bootstrap`, `vite`, và các font `@fontsource`. Giáo viên rất dễ hỏi “Vì sao có `type: module`?”; câu trả lời là để toàn bộ cấu hình và source dùng cú pháp `import/export` thống nhất.

- [vite.config.js](D:/MyProfile/Documents/PTIT/sillage-storefront/vite.config.js): trái tim của multi-page build. `appType: "mpa"` nói với Vite đây là multi-page app; `rollupOptions.input` map từng file HTML root vào build. Nếu xóa hoặc cấu hình sai, build vẫn có thể chạy nhưng route sẽ thiếu.

- [index.html](D:/MyProfile/Documents/PTIT/sillage-storefront/index.html): HTML shell của Home; chỉ chứa metadata + `#app` + import `home.js`. Ý quan trọng: HTML mỏng để JS chịu trách nhiệm render thực tế.

- [cua-hang.html](D:/MyProfile/Documents/PTIT/sillage-storefront/cua-hang.html): shell của Shop. Điểm nên nhớ là route public đã Việt hóa.

- [chi-tiet-san-pham.html](D:/MyProfile/Documents/PTIT/sillage-storefront/chi-tiet-san-pham.html): shell của Product Detail. Nó không biết sản phẩm nào; JS sẽ quyết định qua query param.

- [bo-kham-pha.html](D:/MyProfile/Documents/PTIT/sillage-storefront/bo-kham-pha.html): shell của Discovery page riêng.

- [huong-dan-mui-huong.html](D:/MyProfile/Documents/PTIT/sillage-storefront/huong-dan-mui-huong.html): shell của Guide.

- [cau-hoi-thuong-gap.html](D:/MyProfile/Documents/PTIT/sillage-storefront/cau-hoi-thuong-gap.html): shell của FAQ.

- [lien-he.html](D:/MyProfile/Documents/PTIT/sillage-storefront/lien-he.html): shell của Contact.

- [gio-hang.html](D:/MyProfile/Documents/PTIT/sillage-storefront/gio-hang.html): shell của Cart.

- [thanh-toan.html](D:/MyProfile/Documents/PTIT/sillage-storefront/thanh-toan.html): shell của Checkout.

### Data files

- [src/data/products.json](D:/MyProfile/Documents/PTIT/sillage-storefront/src/data/products.json): nguồn dữ liệu chính của commerce. Nó chứa 8 item: 7 fragrance, 1 discovery-set. Professor hay hỏi “Nếu thêm một chai mới thì sửa ở đâu?”; câu trả lời chuẩn là: trước hết sửa file này, rồi UI shop/PDP sẽ lấy theo dữ liệu.

- [src/data/site.json](D:/MyProfile/Documents/PTIT/sillage-storefront/src/data/site.json): chứa brand/support/footer/discovery/contact content. Nó nối giữa phần content marketing và phần shared shell.

- [src/data/guide.json](D:/MyProfile/Documents/PTIT/sillage-storefront/src/data/guide.json): schema của guide page, gồm `families`, `howToChoose`, `noteGlossary`. Nó cho thấy content được tách khỏi markup.

- [src/data/faq.json](D:/MyProfile/Documents/PTIT/sillage-storefront/src/data/faq.json): FAQ được tổ chức thành `groups`, mỗi group có `id`, `eyebrow`, `title`, `items`. `id` còn được dùng làm anchor trên page.

### Core modules

- [src/js/core/data-store.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/core/data-store.js): xuất `getProducts()`, `getSite()`, `getGuide()`, `getFaq()`. Bên trong có `fetchJson()`, `loadJson()` và `requestCache` để fetch một lần rồi cache Promise. Input là “không cần gì ngoài URL nội bộ”; output là Promise JSON. Nếu professor hỏi “vì sao không fetch thẳng trong từng page?” thì trả lời: để gom logic load + cache vào một chỗ.

- [src/js/core/product-service.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/core/product-service.js): file nghiệp vụ sản phẩm quan trọng nhất. Nó xác định product type, filter listing, link product, option filter, theme màu ảnh, tìm product theo slug/id, lấy size mặc định, resolve size, related products. Điểm rất mạnh là `normalizeLookupToken()` bỏ dấu và chuẩn hóa chuỗi nên route robust hơn; thêm nữa `resolveProductSize()` còn hỗ trợ `legacyIds`, tức có nghĩ tới backward compatibility.

- [src/js/core/cart-store.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/core/cart-store.js): store trung tâm của giỏ hàng. Export quan trọng gồm `getCartState`, `addCartItem`, `removeCartItem`, `updateCartItemQuantity`, `incrementCartItem`, `decrementCartItem`, `clearCart`, `getCartCount`, `getCartSummary`, `syncCartWithCatalog`, `subscribeToCartUpdates`. Flow từ trên xuống là: tạo empty state -> lấy localStorage an toàn -> normalize item/state -> save state -> dispatch event -> hydrate cart item với catalog -> sync stale/price mismatch. Pitfall lớn nhất là nếu professor hỏi “làm sao xử lý item cũ khi giá/size đổi?” thì câu trả lời nằm ở `syncCartWithCatalog()`.

- [src/js/core/checkout-service.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/core/checkout-service.js): chịu trách nhiệm shipping logic, format thẻ, validate phone/card/expiry/cvc, sync validity và tạo confirmation object. Đây không render UI; nó chỉ đưa ra rule. Điểm hay để bảo vệ là form validation tách khỏi view nên dễ test bằng suy luận logic.

- [src/js/core/filter-state.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/core/filter-state.js): quản lý state lọc theo family/occasion qua query string. Nó quyết định giá trị hợp lệ, apply filter và cập nhật URL.

- [src/js/core/query-state.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/core/query-state.js): module nhỏ nhưng rất quan trọng. `getQueryParams()` đọc query string, `setQueryParams()` cập nhật URL bằng `history.replaceState` mà không reload. Nó còn xóa param nếu là default như `tat-ca`, `de-xuat`, giúp URL sạch.

- [src/js/core/sort-state.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/core/sort-state.js): chứa `SORT_OPTIONS`, đọc `sap-xep`, sort theo giá/tên/đề xuất. Đây là ví dụ rất điển hình của separation of concerns: rule sort không nằm trong render.

- [src/js/core/app-shell.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/core/app-shell.js): file dựng khung toàn site. Nó import `Collapse` từ Bootstrap để xử lý mobile nav, render header/footer/Zalo widget, sync cart badge, bind newsletter form, bind Zalo widget, set year. Input là config page (`currentPage`, `title`, `content`...), output là `innerHTML` đầy đủ cho `#app`. Đây là “trạm trung chuyển” giữa từng page và giao diện dùng chung.

- [src/js/core/page-shell.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/core/page-shell.js): wrapper mỏng gọi lại `mountAppShell()`. Nó tồn tại để giữ interface gọn cho entry files sau refactor.

### Entry modules

- [src/js/entries/home.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/entries/home.js): load products, mount shell, render Home hoặc fallback. Professor dễ hỏi “trang nào là điểm bắt đầu thật của Home?”; câu trả lời là file này.

- [src/js/entries/shop.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/entries/shop.js): file entry phức tạp nhất sau checkout. Nó derive state từ query, load catalog, hydrate form control, render result grid, gắn event change/click, xử lý quick-add toast. Pitfall: render lại `outerHTML` của root nên event phải được bind sau khi hydrate root mới.

- [src/js/entries/product.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/entries/product.js): đọc `san-pham`, load product, redirect discovery nếu cần, render PDP, bind size/quantity/add-to-cart. Flow rất tuyến tính nên dễ bảo vệ.

- [src/js/entries/discovery.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/entries/discovery.js): load `products + site`, lấy discovery product, render discovery page, bind quantity/add-to-cart.

- [src/js/entries/guide.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/entries/guide.js): load `guide + products`, dựng recommended products từ `recommendedProductIds`, mount page.

- [src/js/entries/faq.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/entries/faq.js): load FAQ groups và mount. Rất đơn giản vì interaction chính dựa vào HTML native `<details>`.

- [src/js/entries/contact.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/entries/contact.js): load `site.json`, mount contact view hoặc fallback.

- [src/js/entries/cart.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/entries/cart.js): load catalog, render cart từ localStorage, subscribe vào cart updates, bind click/change cho remove, stepper, quantity input. Nó còn dùng “render signature” để tránh rerender vô ích.

- [src/js/entries/checkout.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/entries/checkout.js): load catalog, render checkout, gắn input/change/submit handlers, sync shipping summary, validate form, tạo success state và clear cart. Một detail rất hay là nó cố tránh rerender phá form khi user đang nhập.

### Render modules

- [src/js/render/header.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/render/header.js): render navbar, active nav, cart badge placeholder. Header nav được hardcode chứ không đọc từ `site.json`; đó là một tradeoff đơn giản hóa.

- [src/js/render/footer.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/render/footer.js): render footer từ `site.json`, newsletter form, social fallback, map embed. Nó import JSON trực tiếp thay vì fetch.

- [src/js/render/page-intro.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/render/page-intro.js): module rất nhỏ, dựng block intro dùng chung cho non-home pages.

- [src/js/render/empty-state.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/render/empty-state.js): render empty state generic có title/copy/reset/secondary CTA. Được dùng như “phanh an toàn” UI.

- [src/js/render/media-art.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/render/media-art.js): render artwork sản phẩm và editorial image. Điểm đặc biệt là nó tự suy ra `srcset` WebP từ tên file PNG sản phẩm.

- [src/js/render/product-card.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/render/product-card.js): card sản phẩm dùng chung. Input là product object và option `allowQuickAdd`. Output là `<article>` card có ảnh, family, price, name, tagline, và có thể có quick-add button.

- [src/js/render/product-grid.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/render/product-grid.js): nếu list rỗng thì trả empty state; nếu có thì trả grid card.

- [src/js/render/related-products.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/render/related-products.js): render section related products. Rất “view-only”.

- [src/js/render/home-view.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/render/home-view.js): file render dài của Home. Nó dựng hero, featured row, editorial band, discovery trust, story section. Nó dùng `getFeaturedProducts()` và `getDiscoveryProduct()` để giữ Home data-driven chứ không hardcode card.

- [src/js/render/shop-view.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/render/shop-view.js): render bộ khung shop, no-results state, active chips, summary và sync form controls. Nó không tự fetch dữ liệu; entry chịu trách nhiệm điều đó.

- [src/js/render/product-detail.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/render/product-detail.js): render loading state, invalid state, full product detail markup và trust cards. Input là product; output là toàn bộ thân PDP. Nếu professor hỏi “vì sao chọn radio cho size?” thì file này là câu trả lời trực quan nhất.

- [src/js/render/discovery-view.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/render/discovery-view.js): render hero, purchase block, included products, ritual steps, CTA cho discovery. Input: `product`, `includedProducts`, `site`.

- [src/js/render/guide-view.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/render/guide-view.js): render family cards, steps, glossary, recommendation grid. Nó cho thấy content page vẫn có thể data-driven chứ không phải chỉ commerce page.

- [src/js/render/faq-view.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/render/faq-view.js): render FAQ groups bằng `<details>` và map block. Đây là lựa chọn tốt vì semantic và ít JS.

- [src/js/render/contact-view.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/render/contact-view.js): render support hero, method cards, commitments, shortcut links. `compactCopy()` là chi tiết nhỏ giúp card không quá dài.

- [src/js/render/cart-view.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/render/cart-view.js): render loading/error/empty/populated cart states, cart item card, summary card, trust blocks. Input là `summary` từ cart-store.

- [src/js/render/checkout-view.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/render/checkout-view.js): render loading/error/empty/form/success checkout states. Nó còn có `hydrateCheckoutSuccessState()` để gắn text vào success card bằng `textContent`, an toàn hơn render raw HTML từ input user.

### Utility modules

- [src/js/utils/escape-html.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/utils/escape-html.js): helper nhỏ để escape ký tự đặc biệt khi đưa text vào HTML string. Nó giúp tránh lỗi hiển thị hoặc injection cơ bản ở nơi dùng string template.

- [src/js/utils/format.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/utils/format.js): format tiền VND bằng `Intl.NumberFormat`, map tag code sang label tiếng Việt, sort tên theo locale `"vi"`. Đây là lớp localization rất đáng nói.

### CSS base files

- [src/styles/tokens.css](D:/MyProfile/Documents/PTIT/sillage-storefront/src/styles/tokens.css): design token gốc, như đã giải thích ở Section 5.

- [src/styles/bootstrap-overrides.css](D:/MyProfile/Documents/PTIT/sillage-storefront/src/styles/bootstrap-overrides.css): tầng biến Bootstrap + restyle primitives.

- [src/styles/utilities.css](D:/MyProfile/Documents/PTIT/sillage-storefront/src/styles/utilities.css): tầng layout objects và helper classes.

- [src/styles/main.css](D:/MyProfile/Documents/PTIT/sillage-storefront/src/styles/main.css): global entry CSS, import order và base rules.

### CSS component files

- [src/styles/components/header.css](D:/MyProfile/Documents/PTIT/sillage-storefront/src/styles/components/header.css): biến navbar Bootstrap thành header premium mờ, sticky, gọn.

- [src/styles/components/footer.css](D:/MyProfile/Documents/PTIT/sillage-storefront/src/styles/components/footer.css): footer đậm chất editorial, không giống footer template Bootstrap.

- [src/styles/components/zalo-widget.css](D:/MyProfile/Documents/PTIT/sillage-storefront/src/styles/components/zalo-widget.css): style widget hỗ trợ cố định.

- [src/styles/components/forms.css](D:/MyProfile/Documents/PTIT/sillage-storefront/src/styles/components/forms.css): form layout dùng chung, đặc biệt quan trọng cho checkout.

- [src/styles/components/home.css](D:/MyProfile/Documents/PTIT/sillage-storefront/src/styles/components/home.css): tạo cảm giác trang chủ có art direction riêng.

- [src/styles/components/product-card.css](D:/MyProfile/Documents/PTIT/sillage-storefront/src/styles/components/product-card.css): đảm bảo card dùng lại được ở nhiều page mà vẫn premium.

- [src/styles/components/product-detail.css](D:/MyProfile/Documents/PTIT/sillage-storefront/src/styles/components/product-detail.css): purchase panel, gallery, notes, trust cards.

- [src/styles/components/shop.css](D:/MyProfile/Documents/PTIT/sillage-storefront/src/styles/components/shop.css): filter/status/chips/grid/toast/empty state của shop.

- [src/styles/components/cart.css](D:/MyProfile/Documents/PTIT/sillage-storefront/src/styles/components/cart.css): line items, summary rail, trust section của cart.

- [src/styles/components/checkout.css](D:/MyProfile/Documents/PTIT/sillage-storefront/src/styles/components/checkout.css): progress, shipping card, totals, success state của checkout.

- [src/styles/components/support-pages.css](D:/MyProfile/Documents/PTIT/sillage-storefront/src/styles/components/support-pages.css): panel system chung cho Discovery/Guide/FAQ/Contact; nó giúp 4 trang này thống nhất rất mạnh.

## SECTION 9 — Data model và giải thích JSON

### 1. `products.json`

Mỗi object sản phẩm hiện có các field:
- `id`: khóa nội bộ ổn định, ví dụ `amber-veil`
- `slug`: khóa public cho URL tiếng Việt, ví dụ `man-ho-phach`
- `type`: `fragrance` hoặc `discovery-set`
- `name`: tên hiển thị tiếng Việt
- `family`: mã nhóm hương, ví dụ `ho-phach-go`
- `price`: giá base cho listing
- `volumes`: mảng dung tích/size
- `topNotes`, `middleNotes`, `baseNotes`
- `tagline`
- `shortDescription`
- `longDescription`
- `image`
- `gallery`
- `featured`
- `bestSeller`
- `seasonTags`
- `occasionTags`
- `includedProductIds` chỉ có ở discovery set

Ý nghĩa và nơi dùng:
- `id`: dùng nhiều ở cart và internal lookup
- `slug`: dùng trong URL sản phẩm
- `type`: quyết định đây là fragrance thường hay discovery set
- `family`: dùng để render family label, theme artwork, filter
- `price`: giá base card nếu chưa chọn size
- `volumes`: dùng để render size selector và unit price theo size
- `notes`: dùng ở PDP, cart notes, discovery include cards
- `image`/`gallery`: dùng trong artwork system
- `featured`/`bestSeller`: dùng cho home merchandising
- `seasonTags`/`occasionTags`: dùng cho copy, related, shop filters
- `includedProductIds`: dùng để discovery page hiển thị 7 mùi bên trong

Nếu schema đổi thì cái gì vỡ:
- đổi tên `slug` -> PDP routing vỡ
- đổi `family` -> filter/theme/family label vỡ
- đổi `volumes` structure -> size selector/cart size hydration vỡ
- bỏ `occasionTags` -> shop filter và related logic yếu đi
- bỏ `image`/`gallery` -> media render lỗi
- discovery thiếu `includedProductIds` -> page vẫn chạy, nhưng fallback sang toàn catalog fragrance

`slug`, `id`, `type`, `price`, `size` dùng thế nào:
- `id` là internal stable identifier
- `slug` là public route identifier
- `type` điều khiển route và cách render
- `price` cho listing/base price
- `size` nằm trong `volumes` và ảnh hưởng checkout/cart

Discovery khác fragrance SKU bình thường ở đâu:
- `type = "discovery-set"`
- chỉ có một volume cố định
- có `includedProductIds`
- link không đi vào generic product detail
- copy/mục đích bán hàng khác: “entry path”, “sampling”, “gifting”, không phải full-size bottle

### 2. `site.json`

Top-level keys:
- `brand`
- `footer`
- `discovery`
- `contactMethods`
- `serviceCommitments`
- `faqShortcuts`

`brand` chứa:
- tên brand
- tên/support email/phone
- Zalo URL
- response window
- service hours
- studio address

`footer` chứa:
- `brandCopy`
- `groups`: cột link footer
- `newsletter`

`discovery` chứa:
- eyebrow/title/summary
- `benefits`
- `ritualSteps`
- `ctaTitle`
- `ctaCopy`

`contactMethods` chứa 3 phương thức liên hệ có `eyebrow`, `title`, `value`, `href`, `copy`

`serviceCommitments` và `faqShortcuts` nuôi Contact page.

Nếu schema `site.json` đổi:
- footer/contact/discovery page dễ lỗi
- app-shell Zalo/newsletter dễ mất nội dung

### 3. `guide.json`

Top-level:
- `families`
- `howToChoose`
- `noteGlossary`

`families` gồm:
- `id`
- `label`
- `title`
- `summary`
- `signals`
- `wearMoments`
- `recommendedProductIds`

Nơi dùng:
- guide family cards
- deep link sang shop filter theo `family.id`
- recommended products lookup từ `recommendedProductIds`

### 4. `faq.json`

Top-level:
- `groups`

Mỗi group có:
- `id`
- `eyebrow`
- `title`
- `items`

Mỗi item có:
- `question`
- `answer`

`id` của group được dùng cho anchor link, ví dụ từ contact shortcut sang đúng section trong FAQ.

## SECTION 10 — Cart và checkout, giải thích cực chi tiết

localStorage là gì, nói rất đơn giản:  
Đó là một ngăn nhớ nhỏ của trình duyệt. Website có thể ghi dữ liệu text vào đó để lần sau mở lại cùng trình duyệt trên cùng máy, dữ liệu vẫn còn.

Trong dự án này key cart là:
- `sillage-cart`

Ngoài ra shell còn dùng một key khác cho newsletter:
- `sillage-newsletter-email`
Nhưng key này không thuộc commerce core.

Shape của cart object:

```json
{
  "version": 1,
  "updatedAt": "ISO date",
  "items": [
    {
      "productId": "amber-veil",
      "sizeId": "50ml",
      "quantity": 2,
      "unitPrice": 2990000,
      "addedAt": "ISO date"
    }
  ]
}
```

Giải thích từng field:
- `version`: để sau này đổi schema vẫn biết cách migrate
- `updatedAt`: dấu thời gian mới nhất
- `productId`: khóa sản phẩm
- `sizeId`: khóa dung tích
- `quantity`: số lượng
- `unitPrice`: snapshot giá tại lúc thêm
- `addedAt`: dấu thời gian thêm vào giỏ

Vì sao phải có `unitPrice` nếu đã có `products.json`?
- vì cart cần lưu snapshot lúc thêm
- nhưng UI vẫn ưu tiên catalog hiện tại
- nếu giá đã đổi, hệ thống có thể đồng bộ lại và báo cho user

### Add/remove/update hoạt động ra sao

Khi add:
1. `addCartItem()` nhận `productId`, `sizeId`, `quantity`, `unitPrice`
2. `normalizeItem()` kiểm tra dữ liệu có hợp lệ không
3. nếu đã có line cùng `productId + sizeId` thì cộng quantity
4. nếu chưa có thì push line mới
5. `saveState()` ghi localStorage
6. bắn event `cart:updated`

Khi remove:
- `removeCartItem()` lọc bỏ đúng line theo `productId` + `sizeId`

Khi update quantity:
- `updateCartItemQuantity()` parse số
- nếu <= 0 thì remove
- nếu > 12 thì clamp về 12
- nếu không parse được thì bỏ qua

Khi increment/decrement:
- đọc item hiện tại từ state
- cộng hoặc trừ 1
- gọi lại update quantity

Giới hạn quantity:
- `CART_MAX_QUANTITY = 12`

### Cart hydration là gì

Hydration trong context này nghĩa là:
- localStorage chỉ chứa dữ liệu tối thiểu
- khi render cart/checkout, hệ thống phải “ghép” dữ liệu stored đó với catalog hiện tại để tạo object giàu thông tin hơn

Ví dụ localStorage chỉ nhớ:
- productId = `amber-veil`
- sizeId = `50ml`
- quantity = 2

Nhưng khi hiển thị, cart page cần:
- tên sản phẩm
- family
- tagline
- ảnh
- href
- notes
- sizeLabel
- lineTotal
- isDiscovery

`hydrateCartItem()` làm việc đó.

### Stale/invalid item được xử lý thế nào

Nếu localStorage chứa item nhưng:
- product không còn trong catalog
- hoặc size không còn tồn tại

thì item được đánh dấu `stale`.

`syncCartWithCatalog()` sẽ:
- tạo summary hydrated
- đếm stale items
- nếu có stale hoặc giá/size cần đồng bộ, nó rewrite lại localStorage chỉ với item hợp lệ
- cart/checkout show notice như:
  - có item không còn khả dụng bị gỡ
  - có item được cập nhật lại giá niêm yết

Điểm này rất đáng bảo vệ vì nó cho thấy cart không “ngây thơ”.

### Tổng tiền được tính thế nào

Cart subtotal:
- `lineTotal = unitPrice * quantity`
- `subtotal = tổng lineTotal`

Checkout total:
- `total = subtotal + shippingPrice`

Shipping rules hiện tại:
- nếu subtotal >= `2,500,000` VND thì giao tiêu chuẩn miễn phí
- giao tiêu chuẩn bình thường: `30,000`
- giao nhanh: `60,000`

### Checkout đọc từ cart thế nào

Checkout không giữ một state giỏ riêng. Nó dùng:
- `getCheckoutState(products, selectedShippingId, state?)`
- hàm này gọi `syncCartWithCatalog()` trước
- nghĩa là checkout luôn đọc từ cùng source of truth với cart

Đây là lý do cart và checkout đồng nhất.

### Checkout validation hoạt động thế nào

`checkout-service.js` kiểm:
- phone number hợp lệ
- card number đủ 13-19 số
- expiry đúng format MMYY và chưa hết hạn
- CVC dài 3-4 số
- checkbox terms phải được tick

`syncCheckoutValidity()` còn làm thêm:
- `setCustomValidity()` cho field
- `aria-invalid` và `aria-errormessage` để trợ năng tốt hơn
- dựa vào `data-feedback-id` nối field với error message

Một chi tiết rất đáng nhớ:
- nút submit nằm ở summary rail bên phải, ngoài `<form>`
- nhưng nó vẫn submit form được vì dùng `form="sl-checkout-form"`
- đây là kiến thức HTML khá tốt để bảo vệ

### Success state hoạt động thế nào

Khi submit hợp lệ:
1. tạo object confirmation bằng `createCheckoutConfirmation(form, currentCheckoutState)`
2. chờ ngắn `320ms` để tạo cảm giác xử lý
3. `confirmationVisible = true`
4. `clearCart()`
5. render `renderCheckoutSuccessState()`
6. gọi `hydrateCheckoutSuccessState()` để đổ text vào các placeholder
7. đổi `document.title`

`createOrderNumber()` tạo mã kiểu:
- `SLG-YYYYMMDD-XXXX`

`hydrateCheckoutSuccessState()` dùng `textContent`, không dùng `innerHTML`, nghĩa là an toàn hơn với dữ liệu user nhập.

### Empty state hoạt động thế nào

Cart empty:
- render block “giỏ hàng đang trống”
- CTA về shop/discovery

Checkout empty:
- render block “cần có giỏ hàng trước khi thanh toán”
- CTA về shop/cart
- không render form chính

### Tradeoff của checkout tĩnh

Ưu điểm:
- demo mượt
- không cần backend
- vẫn có validation, summary, success flow

Giới hạn:
- không có thanh toán thật
- không lưu order ở server
- refresh sau success không khôi phục order
- order number là mô phỏng
- card data chỉ được validate cục bộ, không charge thật

Đây là câu trả lời trung thực và đúng cho giảng viên.

## SECTION 11 — Routing, links và query parameters

Dự án điều hướng kiểu multi-page truyền thống:
- mỗi trang là một file HTML
- bấm link là browser sang file HTML mới
- không có client router kiểu SPA framework

### HTML routes hiện tại

- `index.html`
- `cua-hang.html`
- `chi-tiet-san-pham.html`
- `bo-kham-pha.html`
- `huong-dan-mui-huong.html`
- `cau-hoi-thuong-gap.html`
- `lien-he.html`
- `gio-hang.html`
- `thanh-toan.html`

### Product detail mở thế nào

Product detail page chỉ có một file:
- `chi-tiet-san-pham.html`

Sản phẩm cụ thể được chọn bằng query param:
- `?san-pham=man-ho-phach`

Trong `product.js`, hàm `getSlug()` thực chất đọc:
- `new URLSearchParams(window.location.search).get("san-pham")`

Điểm thú vị:
- code tên hàm là `getSlug()`
- nhưng param thực tế là `san-pham`
- đây là localization ở tầng URL.

### Shop filter/sort encode trong URL thế nào

Param đang dùng:
- `nhom-huong`
- `dip-su-dung`
- `sap-xep`

Ví dụ:
- `cua-hang.html?nhom-huong=ho-phach-go&sap-xep=gia-giam-dan`

Lợi ích:
- reload không mất state
- copy link chia sẻ được trạng thái
- static-safe, không cần backend session

`setQueryParams()` còn xóa param default:
- `tat-ca`
- `de-xuat`
nên URL không bị bẩn.

### Links nối toàn site thế nào

- Header nav -> shop, discovery, guide, FAQ
- Wordmark -> home
- Cart badge/link -> cart
- Footer -> shop, discovery, guide, FAQ, contact, cart, checkout
- Product cards -> PDP hoặc discovery
- Guide family cards -> shop đã filter sẵn
- Contact shortcut -> FAQ anchor
- Cart line item -> quay lại PDP

### Route renaming/localized routes

Đây là một điểm rất đáng phòng thủ:
- brief ban đầu và README còn dùng route tiếng Anh như `shop.html`, `product.html`, `about.html`
- runtime hiện tại dùng route tiếng Việt
- brand story route riêng đã bị loại bỏ để storefront gọn hơn, commerce-led hơn
- đó là thay đổi có chủ đích, được phản ánh trong `PLANS.md`

Nếu bị hỏi “sao tài liệu và runtime lệch nhau?”  
Bạn trả lời:
- kiến trúc cốt lõi không đổi: vẫn Vite MPA, data-driven, static-safe
- chỉ có naming/merchandising route được refine theo bản Việt hóa cuối
- route About được gộp vào Home để giảm phân tán hành trình

## SECTION 12 — Shared UI và rendering flow

### Header
Header gồm:
- wordmark Sillage
- nav links
- cart link + cart count
- mobile collapse

Header được render từ:
- [src/js/render/header.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/render/header.js)

Cart count cập nhật bằng:
- `bindCartBadge()` trong `app-shell.js`
- nghe `subscribeToCartUpdates()`

### Footer
Footer gồm:
- brand copy
- showroom address
- support email
- social links
- newsletter form
- nav columns
- map embed

Footer render từ:
- [src/js/render/footer.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/render/footer.js)

### Page intro/shared shell
Non-home pages dùng block intro chung:
- eyebrow
- title
- summary
- optional note

Render từ:
- [src/js/render/page-intro.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/render/page-intro.js)

Home không dùng page-intro này vì có hero riêng.

### Product card system
Một card sản phẩm thống nhất có:
- artwork
- family label
- price
- name
- tagline
- optional quick-add

Điểm quan trọng:
- Shop, related products, guide recommendations dùng cùng card system
- như vậy UI nhất quán, logic link cũng nhất quán

### Empty-state system
Project không để trống trắng khi thiếu data. Nó có:
- empty cart
- empty checkout
- invalid product
- no shop results
- fetch fail fallback

Đây là dấu hiệu của sản phẩm được nghĩ thật, không phải chỉ “happy path”.

### Artwork/media system
`media-art.js` làm một việc thông minh:
- với product image, nó render khung nghệ thuật bằng gradient theme theo `family`
- tự dựng `srcset` WebP nếu ảnh nằm trong `/images/products/`
- do đó ảnh vừa đẹp hơn vừa responsive hơn

### CTA patterns
CTA trong project rất có chủ đích:
- primary thường là nền tối
- secondary/quiet nhẹ hơn
- mỗi page support đều kết thúc bằng CTA quay về commerce
- discovery luôn là “đường an toàn” khi user còn phân vân

### Support/trust blocks
Cart, PDP, Checkout đều có trust cards nhưng nội dung không copy-paste y nguyên:
- PDP nhấn vào occasion/discovery/support
- Cart nhấn vào shipping/returns/payment
- Checkout nhấn vào security/payment/support

Đây là chi tiết cho thấy trust content có ngữ cảnh, không phải filler.

### Shared render modules chống lặp thế nào
Thay vì viết lại HTML giống nhau ở nhiều page, project tách:
- header
- footer
- page intro
- product card
- product grid
- empty state
- media art
- related products

Lợi ích:
- sửa một nơi, nhiều nơi hưởng
- visual nhất quán
- code ít brittle hơn

## SECTION 13 — Master trace: mọi thứ nối với nhau thế nào

### Trace A — Home -> Featured bottle -> Product Detail -> Add to bag -> Cart -> Checkout

1. User mở `index.html`.
2. [index.html](D:/MyProfile/Documents/PTIT/sillage-storefront/index.html) nạp [home.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/entries/home.js).
3. `home.js` gọi [data-store.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/core/data-store.js) lấy `products.json`.
4. `home.js` gọi [page-shell.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/core/page-shell.js) -> [app-shell.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/core/app-shell.js) -> [header.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/render/header.js) + [footer.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/render/footer.js).
5. `home.js` gọi [home-view.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/render/home-view.js) để render featured products.
6. Featured card dùng [product-service.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/core/product-service.js) tạo href `chi-tiet-san-pham.html?san-pham=...`.
7. User click card, browser sang `chi-tiet-san-pham.html?san-pham=man-ho-phach`.
8. [product.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/entries/product.js) đọc query param, gọi `getProductBySlug()`.
9. [product-detail.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/render/product-detail.js) render PDP, bind size/quantity/add-to-cart.
10. User bấm add-to-cart, [cart-store.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/core/cart-store.js) ghi `sillage-cart` vào localStorage và bắn `cart:updated`.
11. Header badge trong shell cập nhật.
12. User mở `gio-hang.html`.
13. [cart.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/entries/cart.js) load `products.json`, gọi `syncCartWithCatalog()`, rồi [cart-view.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/render/cart-view.js) render line item + subtotal.
14. User bấm “Tiến hành thanh toán”, browser sang `thanh-toan.html`.
15. [checkout.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/entries/checkout.js) đọc cart hiện tại, gọi [checkout-service.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/core/checkout-service.js) để tính shipping/total, rồi [checkout-view.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/render/checkout-view.js) render form + summary.

### Trace B — Shop -> Filter -> Sort -> Product -> Change size -> Add to bag

1. User mở `cua-hang.html`.
2. [shop.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/entries/shop.js) fetch `products.json`.
3. [product-service.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/core/product-service.js) trả về listing products.
4. [filter-state.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/core/filter-state.js) đọc `nhom-huong` và `dip-su-dung` từ URL.
5. [sort-state.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/core/sort-state.js) đọc `sap-xep`.
6. [shop-view.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/render/shop-view.js) render controls + summary + chips.
7. User đổi filter, `shop.js` cập nhật query string qua [query-state.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/core/query-state.js), apply lại filter/sort, rerender grid.
8. User click sản phẩm, browser sang PDP tương ứng.
9. [product.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/entries/product.js) render product detail.
10. User đổi size radio, `syncSelectedSize()` trong `product.js` đổi giá hiển thị và data attribute của nút add-to-cart.
11. User bấm add-to-cart, [cart-store.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/core/cart-store.js) lưu đúng `productId + sizeId + unitPrice`.

### Trace C — Discovery Set -> Add to bag -> Cart -> Checkout

1. User mở `bo-kham-pha.html`.
2. [discovery.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/entries/discovery.js) load `products.json` và `site.json`.
3. `getDiscoveryProduct()` trong [product-service.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/core/product-service.js) lấy item `type = discovery-set`.
4. [discovery-view.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/render/discovery-view.js) render purchase block + included products.
5. User tăng quantity.
6. User bấm add-to-cart, [cart-store.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/core/cart-store.js) lưu item với `productId = discovery-set`, `sizeId = set-7x2ml`.
7. User sang `gio-hang.html`, [cart.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/entries/cart.js) hydrate item discovery, cart view hiển thị `isDiscovery`.
8. User sang checkout, [checkout.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/entries/checkout.js) dùng cùng source of truth để tính total và cho submit.

## SECTION 14 — Vì sao kiến trúc này tốt cho một đồ án storefront tĩnh

- JSON-driven rendering tốt hơn hardcode HTML lặp lại vì catalog thay đổi ở một nơi, không phải sửa hàng loạt card thủ công.
- localStorage là lựa chọn đúng khi không có backend nhưng vẫn cần persistence thật sau reload.
- Bootstrap override + design system riêng mạnh hơn import template vì vẫn tận dụng được grid/form/collapse nhưng không bị mang khuôn mặt Bootstrap mặc định.
- Website vẫn là static site vì toàn bộ HTML/CSS/JS có thể build sẵn; sự “động” chỉ xảy ra trong browser bằng JS và dữ liệu local/JSON.
- Dự án này hơn một template import vì:
  - có data contract riêng
  - có multi-page architecture rõ
  - có business logic cart riêng
  - có query-state riêng
  - có PDP routing riêng
  - có component system và design tokens riêng
  - có xử lý edge cases thật

## SECTION 15 — Điểm mạnh, tradeoff và giới hạn cần thừa nhận trung thực

Điểm làm tốt:
- brand direction rõ ràng, không giống template student
- dữ liệu, render, logic được tách tương đối sạch
- cart robust hơn mức cơ bản nhờ hydration và stale sync
- URL/query state được dùng hợp lý
- visual consistency cao
- checkout static nhưng believable
- build hiện tại chạy sạch

Các compromise vì đây là site tĩnh:
- không có backend
- không có thanh toán thật
- không lưu order thật
- không có tài khoản, inventory, review, search
- không có CMS

Các phần “demo-realistic” hơn là “production-real”:
- order number chỉ mô phỏng
- card number chỉ validate format
- shipping chỉ là rule cứng
- support/contact không gửi form về server
- newsletter chỉ lưu localStorage

Giới hạn nên tự tin thừa nhận:
- `tests/` đang trống, dự án chủ yếu dựa vào manual verification
- `README.md` và một phần brief/plans còn dấu vết route cũ tiếng Anh
- dữ liệu `site.json` được dùng theo hai đường: import trực tiếp ở shell/footer và fetch ở page-specific entries; chạy đúng nhưng chưa tuyệt đối đồng nhất về access pattern
- có một vài helper trong `product-service.js` hiện chưa dùng tới, nghĩa là vẫn còn room để cleanup
- không có About page live riêng; content brand story đã được gộp vào Home để giữ funnel gọn hơn

## SECTION 16 — Chuẩn bị bảo vệ: câu hỏi giáo viên có thể hỏi

### HTML

- Câu hỏi: “Vì sao mỗi trang HTML gần như trống, chỉ có `#app`?”  
  Trả lời dễ: Vì em tách phần giao diện dùng chung và logic render sang JavaScript module để tránh lặp code giữa nhiều trang.  
  Trả lời kỹ thuật: HTML root chỉ là entry shell; entry JS sẽ mount shared app shell và render content động dựa trên JSON.  
  Nếu hỏi sâu: Cách này vẫn là multi-page vì mỗi route là một HTML riêng, chỉ có điều body content được dựng bởi module tương ứng.

- Câu hỏi: “Tại sao vẫn gọi là multi-page, không phải SPA?”  
  Trả lời dễ: Vì bấm link là sang file HTML khác thật, không phải một app duy nhất đổi view bên trong.  
  Trả lời kỹ thuật: Vite đang chạy ở `appType: "mpa"` và build input là nhiều HTML root khác nhau.  
  Nếu hỏi sâu: Query param chỉ dùng để chọn trạng thái của một page, không biến dự án thành SPA.

### Bootstrap/CSS

- Câu hỏi: “Dùng Bootstrap ở đâu nếu giao diện không giống Bootstrap?”  
  Trả lời dễ: Em dùng Bootstrap như nền móng layout và form, còn diện mạo thì em override lại.  
  Trả lời kỹ thuật: Em import Bootstrap CSS, remap `--bs-*` bằng token system, rồi restyle `.btn`, `.navbar`, `.form-control`, `.badge`, v.v. trong `bootstrap-overrides.css`.  
  Nếu hỏi sâu: Bootstrap JS chỉ dùng `Collapse` cho mobile nav; FAQ còn dùng native `<details>` thay vì phụ thuộc Bootstrap accordion JS.

- Câu hỏi: “Làm sao chứng minh không phải template import?”  
  Trả lời dễ: Vì template thường hardcode card và layout; còn ở đây dữ liệu, render, cart, query-state đều là logic riêng.  
  Trả lời kỹ thuật: Có design token riêng, component CSS riêng, render module riêng, data contract riêng, cart store riêng, routing static-safe riêng.  
  Nếu hỏi sâu: Sự tồn tại của `tokens.css`, `bootstrap-overrides.css`, `product-service.js`, `cart-store.js`, `checkout-service.js` cho thấy đây là system build-up chứ không phải copy demo.

### JavaScript/modules

- Câu hỏi: “Vì sao chia thành `entries`, `core`, `render`, `utils`?”  
  Trả lời dễ: Để mỗi file có một trách nhiệm rõ ràng.  
  Trả lời kỹ thuật: `entries` boot page, `core` giữ rule và state, `render` sinh markup, `utils` xử lý helper nhỏ.  
  Nếu hỏi sâu: Cách chia này giảm coupling; ví dụ đổi cách render product card không cần đụng cart logic.

- Câu hỏi: “`import/export` cho em lợi gì?”  
  Trả lời dễ: Em tái sử dụng code giữa các trang mà không copy-paste.  
  Trả lời kỹ thuật: Browser module graph rõ ràng, Vite bundle tốt hơn, dependencies explicit hơn.  
  Nếu hỏi sâu: Điều này làm việc reasoning về flow dễ hơn: page entry -> service -> render.

### JSON/data

- Câu hỏi: “Vì sao `products.json` là nguồn chính?”  
  Trả lời dễ: Vì toàn bộ shop và chi tiết sản phẩm phải nhất quán từ một nơi.  
  Trả lời kỹ thuật: `products.json` nuôi listing, PDP, related, discovery composition, cart hydration, checkout summary.  
  Nếu hỏi sâu: Nếu dữ liệu tản ra nhiều file/card HTML hardcode thì giá, name, size rất dễ lệch nhau.

- Câu hỏi: “`id` và `slug` khác nhau ở đâu?”  
  Trả lời dễ: `id` là khóa nội bộ, `slug` là khóa public dùng cho URL.  
  Trả lời kỹ thuật: Cart lưu `productId` ổn định; product detail resolve theo `slug`, nhưng service vẫn chịu được cả id/slugs nhờ normalization.  
  Nếu hỏi sâu: Cách tách này giúp thay display URL mà không làm hỏng internal references.

### Routing

- Câu hỏi: “Không có backend thì product detail route hoạt động kiểu gì?”  
  Trả lời dễ: Có một file HTML chi tiết chung, JS đọc query param rồi lấy đúng product từ JSON.  
  Trả lời kỹ thuật: `chi-tiet-san-pham.html?san-pham=...` -> `product.js` -> `getProductBySlug(products, slug)` -> render hoặc fallback.  
  Nếu hỏi sâu: `normalizeLookupToken()` còn bỏ dấu và chuẩn hóa chuỗi để lookup robust hơn.

- Câu hỏi: “Shop nhớ filter sau reload kiểu gì?”  
  Trả lời dễ: Em lưu filter vào URL.  
  Trả lời kỹ thuật: `filter-state.js` và `sort-state.js` đọc/ghi query string bằng `URLSearchParams` + `history.replaceState`.  
  Nếu hỏi sâu: Default values bị xóa khỏi URL để URL sạch hơn.

### Cart/localStorage

- Câu hỏi: “Vì sao cart dùng localStorage?”  
  Trả lời dễ: Vì site tĩnh không có backend nhưng vẫn cần giữ giỏ sau reload.  
  Trả lời kỹ thuật: localStorage là persistence layer tối thiểu nhưng truthful; `cart-store.js` còn normalize và validate state trước khi dùng.  
  Nếu hỏi sâu: Store còn phát `cart:updated` và nghe `storage` để đồng bộ UI trong cùng tab và giữa tab.

- Câu hỏi: “Nếu sản phẩm trong cart bị xóa khỏi catalog thì sao?”  
  Trả lời dễ: Hệ thống tự bỏ item không hợp lệ ra khỏi cart.  
  Trả lời kỹ thuật: `hydrateCartItem()` đánh dấu stale, `syncCartWithCatalog()` rewrite localStorage chỉ với item hợp lệ và show notice.  
  Nếu hỏi sâu: Đây là lý do cart page và checkout page luôn hydrate qua catalog hiện tại.

### Checkout

- Câu hỏi: “Checkout có thật không?”  
  Trả lời dễ: Không, đây là luồng checkout tĩnh có validation thật nhưng không charge tiền thật.  
  Trả lời kỹ thuật: Form validate client-side, tạo confirmation object, render success state tại chỗ, sau đó clear cart.  
  Nếu hỏi sâu: Rule shipping, card formatting, expiry validation, success hydration đều tách riêng trong `checkout-service.js`.

- Câu hỏi: “Nút đặt hàng ở sidebar sao submit được form?”  
  Trả lời dễ: Vì em gắn nó với form bằng thuộc tính HTML `form`.  
  Trả lời kỹ thuật: Button nằm ngoài DOM tree của `<form>` nhưng dùng `form="sl-checkout-form"`.  
  Nếu hỏi sâu: Đây là cách giữ layout hai cột mà vẫn dùng submit chuẩn.

### Architecture

- Câu hỏi: “Điểm mạnh kiến trúc của em là gì?”  
  Trả lời dễ: Tách data, UI và logic.  
  Trả lời kỹ thuật: JSON là data layer, `core/` là nghiệp vụ, `render/` là view, `entries/` là orchestration.  
  Nếu hỏi sâu: Vì vậy thêm product mới chủ yếu là thêm data; thêm rule mới chủ yếu sửa service; thay giao diện chủ yếu sửa render/CSS.

- Câu hỏi: “Điểm chưa hoàn hảo là gì?”  
  Trả lời dễ: Chưa có backend và chưa có automated tests.  
  Trả lời kỹ thuật: `site.json` access pattern còn hơi mixed, docs còn dấu vết route cũ, checkout vẫn là simulated flow.  
  Nếu hỏi sâu: Nhưng các giới hạn này phù hợp với scope static coursework và được thừa nhận rõ.

### UI/UX

- Câu hỏi: “Vì sao có Discovery Set riêng?”  
  Trả lời dễ: Vì nước hoa khó chọn online, nên cần đường vào ít rủi ro hơn.  
  Trả lời kỹ thuật: Discovery set là merchandising strategy hợp lý cho fragrance D2C; vì vậy nó có page riêng, type riêng, route riêng.  
  Nếu hỏi sâu: Shop listing còn cố ý loại discovery khỏi grid chai full-size để tránh user hiểu nhầm.

- Câu hỏi: “Vì sao Home không quá nhiều section sale/discount?”  
  Trả lời dễ: Vì định vị là quiet luxury, không phải promo-heavy ecommerce.  
  Trả lời kỹ thuật: Design system ưu tiên whitespace, editorial pacing, restrained CTA hierarchy.  
  Nếu hỏi sâu: Luồng chính vẫn rõ: Home -> Shop hoặc Discovery -> PDP -> Cart -> Checkout.

### Vì sao không backend / vì sao static vẫn hợp lệ

- Câu hỏi: “Sao không làm backend cho đủ?”  
  Trả lời dễ: Vì yêu cầu đồ án là static-safe và stack không có backend.  
  Trả lời kỹ thuật: Em tập trung giải đúng bài toán của giai đoạn đầu: catalog, state trình duyệt, checkout simulation, JSON-driven rendering.  
  Nếu hỏi sâu: Kiến trúc hiện tại vẫn backend-ready vì data contract, cart shape và render flow đã rõ.

- Câu hỏi: “Site này vẫn gọi là static dù có JS động à?”  
  Trả lời dễ: Vẫn static vì file build ra là HTML/CSS/JS sẵn, không cần server sinh trang động.  
  Trả lời kỹ thuật: Dynamic behavior chỉ là client-side enhancement chạy sau khi trang tải xong.  
  Nếu hỏi sâu: Data cũng là local JSON asset chứ không phải API backend.

## SECTION 17 — Beginner glossary

- HTML: ngôn ngữ tạo khung cấu trúc trang web.
- CSS: ngôn ngữ điều khiển giao diện nhìn như thế nào.
- Bootstrap: thư viện CSS/JS nền tảng cho layout và component cơ bản.
- Component: một khối giao diện có thể tái dùng, ví dụ product card.
- Module: một file JS có `import/export`.
- Import: lấy thứ đã export từ file khác vào dùng.
- Export: đưa hàm/giá trị ra cho file khác dùng.
- Render: biến dữ liệu thành HTML nhìn thấy được.
- State: trạng thái hiện tại của ứng dụng, ví dụ giỏ hàng hiện có gì.
- Event: một hành động như click, submit, change.
- localStorage: nơi trình duyệt lưu dữ liệu nhỏ trên máy người dùng.
- Query parameter: phần sau dấu `?` trong URL.
- Responsive: giao diện tự thích nghi theo kích thước màn hình.
- Breakpoint: mốc chiều rộng màn hình để đổi layout.
- Utility class: class CSS nhỏ làm một việc cụ thể.
- JSON: định dạng dữ liệu key-value rất phổ biến.
- Route: đường dẫn/trang mà user mở.
- Slug: chuỗi ngắn thân thiện URL để định danh nội dung.
- Hydration: ở dự án này, nghĩa là ghép dữ liệu cart tối thiểu với catalog đầy đủ để render.
- Validation: kiểm tra dữ liệu người dùng nhập có hợp lệ không.
- Fallback: phương án dự phòng khi dữ liệu lỗi/thiếu.
- Empty state: giao diện khi không có dữ liệu, ví dụ giỏ trống.
- Source of truth: nơi dữ liệu chính thức được xem là đúng nhất.
- MPA: multi-page application, ứng dụng nhiều trang HTML riêng.
- SPA: single-page application, ứng dụng một trang đổi view bằng JS.
- Design token: biến thiết kế dùng chung cho màu, font, spacing...
- Theme: bộ màu/phong cách áp vào một khu vực hoặc loại sản phẩm.
- Badge: chỉ báo nhỏ như số lượng trong giỏ.
- Breadcrumb: đường dẫn phân cấp như Trang chủ / Cửa hàng / Sản phẩm.
- CTA: call to action, nút/hành động chính muốn user bấm.
- Semantic HTML: HTML dùng đúng ý nghĩa như `nav`, `main`, `section`.
- Data-driven UI: UI dựng ra từ dữ liệu, không hardcode lặp lại.

## SECTION 18 — Lộ trình học 3 cấp

### Level 1 — Đủ để thuyết trình tự tin

Cần học trước:
- [package.json](D:/MyProfile/Documents/PTIT/sillage-storefront/package.json)
- [vite.config.js](D:/MyProfile/Documents/PTIT/sillage-storefront/vite.config.js)
- 9 file HTML root
- [src/data/products.json](D:/MyProfile/Documents/PTIT/sillage-storefront/src/data/products.json)
- [src/js/entries/shop.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/entries/shop.js)
- [src/js/entries/product.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/entries/product.js)
- [src/js/core/cart-store.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/core/cart-store.js)

Cần hiểu:
- static multi-page là gì
- vì sao dùng Vite
- `products.json` là nguồn dữ liệu chính
- product detail route hoạt động ra sao
- localStorage cart hoạt động ra sao
- vì sao giao diện không giống Bootstrap default

Bạn phải trả lời được:
- website này làm gì
- có những trang nào
- add-to-cart chạy như thế nào
- checkout có thật hay mô phỏng
- vì sao vẫn là static site

### Level 2 — Đủ để trả lời câu hỏi truy sâu

Cần học thêm:
- [src/js/core/product-service.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/core/product-service.js)
- [src/js/core/query-state.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/core/query-state.js)
- [src/js/core/filter-state.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/core/filter-state.js)
- [src/js/core/checkout-service.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/core/checkout-service.js)
- [src/styles/tokens.css](D:/MyProfile/Documents/PTIT/sillage-storefront/src/styles/tokens.css)
- [src/styles/bootstrap-overrides.css](D:/MyProfile/Documents/PTIT/sillage-storefront/src/styles/bootstrap-overrides.css)

Cần hiểu:
- `id` và `slug` khác nhau thế nào
- query param và sort/filter persistence
- stale cart item sync
- shipping/checkout total calculation
- token system và Bootstrap overrides

Bạn phải trả lời được:
- nếu đổi schema dữ liệu thì đâu sẽ vỡ
- nếu user reload trang thì giỏ còn vì sao
- vì sao Discovery có route riêng
- vì sao dùng `<details>` cho FAQ
- làm sao header badge cập nhật toàn site

### Level 3 — Đủ để nói như người xây dự án

Cần học thêm:
- [src/js/core/app-shell.js](D:/MyProfile/Documents/PTIT/sillage-storefront/src/js/core/app-shell.js)
- toàn bộ `render/`
- toàn bộ CSS component files
- [PROJECT_BRIEF.md](D:/MyProfile/Documents/PTIT/sillage-storefront/PROJECT_BRIEF.md)
- [DESIGN_SYSTEM.md](D:/MyProfile/Documents/PTIT/sillage-storefront/DESIGN_SYSTEM.md)
- [PLANS.md](D:/MyProfile/Documents/PTIT/sillage-storefront/PLANS.md)

Cần hiểu:
- kiến trúc nhiều tầng
- design system -> bootstrap override -> component CSS
- entry -> core -> render -> event -> rerender
- scope refinement từ brief ban đầu sang runtime cuối
- honesty about limitations

Bạn phải trả lời được:
- tại sao chọn kiến trúc này thay vì hardcode
- tại sao route About bị bỏ
- tại sao docs và runtime còn dấu vết lịch sử
- nếu có backend sau này thì thay chỗ nào trước
- đâu là điểm mạnh thật sự của đồ án ngoài giao diện đẹp

## SECTION 19 — Ultra-practical oral defense cheat sheet

### 10 ý quan trọng nhất phải nhớ

- Đây là storefront tĩnh nhiều trang, không phải SPA.
- Vite đang chạy ở multi-page mode.
- `products.json` là nguồn dữ liệu sản phẩm chính.
- Product detail dùng một HTML chung và query param `san-pham`.
- Shop filter/sort dùng query string để nhớ state sau reload.
- Cart dùng `localStorage["sillage-cart"]`.
- Cart không chỉ lưu mà còn hydrate lại với catalog để loại stale item và sync giá.
- Discovery Set là product type riêng, route riêng, mục đích bán hàng riêng.
- Bootstrap chỉ là nền móng; visual identity đến từ token + override + component CSS.
- Dự án tĩnh nhưng vẫn có hành vi thật nhờ JavaScript modules và localStorage.

### 10 câu trả lời một câu cho câu hỏi phổ biến

- “Website này là gì?” -> Đây là website ecommerce tĩnh nhiều trang cho brand nước hoa Sillage, có đủ browse-to-checkout flow ở phía trình duyệt.
- “Dữ liệu sản phẩm nằm ở đâu?” -> Nằm tập trung trong `src/data/products.json`.
- “Trang chi tiết biết sản phẩm nào để render bằng cách nào?” -> Nó đọc query param `san-pham` rồi resolve product từ JSON.
- “Giỏ hàng lưu ở đâu?” -> Lưu trong localStorage với key `sillage-cart`.
- “Vì sao reload không mất giỏ?” -> Vì cart store luôn đọc lại localStorage khi trang chạy.
- “Vì sao không dùng React?” -> Vì scope yêu cầu là Vite + Bootstrap + Vanilla JS ES modules và bài toán này không cần framework.
- “Vì sao không giống Bootstrap mặc định?” -> Vì em override biến `--bs-*` và viết class `sl-*` cho toàn bộ component chính.
- “Checkout có thật không?” -> Không, checkout là static simulation có validation thật nhưng không thanh toán thật.
- “Discovery Set có gì đặc biệt?” -> Nó là đường vào ít rủi ro cho khách mới nên có product type, page và CTA riêng.
- “Điểm mạnh kiến trúc là gì?” -> Tách data, business logic, render và page bootstrapping thành các tầng rõ ràng.

### 10 câu hỏi nguy hiểm giáo viên có thể hỏi

- Nếu `products.json` đổi field `volumes` thành tên khác thì gì vỡ trước?
- Tại sao header không đọc nav từ `site.json` như footer?
- Vì sao `site.json` vừa được import trực tiếp vừa được fetch?
- Nếu user sửa localStorage thành dữ liệu rác thì sao?
- Nếu giá sản phẩm đổi sau khi đã thêm vào giỏ thì checkout có đúng không?
- Vì sao route About biến mất dù brief ban đầu có yêu cầu?
- Nếu query param nhập sai có crash không?
- Nếu product slug trùng nhau thì sao?
- Vì sao nói dự án này không phải template import?
- Nếu triển khai backend sau này thì module nào thay đổi đầu tiên?

### Cách trả lời các câu khó đó

- Nói rõ source of truth nào đang dùng.
- Chỉ đúng file xử lý.
- Phân biệt “bản runtime hiện tại” với “tài liệu lịch sử”.
- Thừa nhận tradeoff trước khi giảng viên chỉ ra.
- Trả lời theo cấu trúc: “hiện tại”, “vì sao chọn vậy”, “nếu mở rộng sau này”.

### Cách phục hồi nếu bí

- “Hiện tại runtime xử lý việc đó ở tầng `core`, không nằm trong HTML.”
- “Em xin nói đúng theo bản chạy hiện tại chứ không theo plan cũ.”
- “Điểm quan trọng là source of truth của phần này nằm trong JSON/localStorage chứ không hardcode ở giao diện.”
- “Phần đó là static simulation chứ không phải backend thật, nên em cố ý dừng ở mức client-side validation.”
- “Nếu cần em có thể giải thích theo flow: HTML -> entry -> service -> render -> localStorage.”

---

# Defense Notes — Bản ngắn hơn

Sillage là một storefront ecommerce tĩnh nhiều trang cho thương hiệu nước hoa niche giả lập. Điểm mạnh của nó không chỉ là giao diện premium mà là kiến trúc rõ: dữ liệu nằm trong JSON, từng trang có entry module riêng, logic nghiệp vụ nằm trong `core/`, và phần HTML được render bởi `render/`.

Trang Shop và Product Detail đều data-driven từ `products.json`. Product detail là static-safe vì chỉ có một file `chi-tiet-san-pham.html`, rồi JS đọc query param `san-pham` để resolve đúng sản phẩm. Shop cũng không hardcode danh sách; nó lấy filter options và product grid trực tiếp từ dữ liệu.

Giỏ hàng được lưu bằng localStorage với key `sillage-cart`, nên reload không mất. Quan trọng hơn, cart không tin hoàn toàn dữ liệu cũ mà luôn hydrate lại với catalog hiện tại để loại item stale và cập nhật giá nếu cần. Checkout dùng cùng source of truth đó nên cart và checkout không lệch nhau.

Bootstrap được dùng như foundation chứ không phải template. Dự án có `tokens.css` để quản lý màu, font, spacing, radius; `bootstrap-overrides.css` để remap biến `--bs-*`; và component CSS `sl-*` để tạo visual identity riêng. Vì vậy dù dùng Bootstrap 5.3.x, giao diện cuối không còn cảm giác Bootstrap mặc định.

Discovery Set được xử lý như một product type riêng, không gộp nhầm vào chai full-size. Nó có route riêng `bo-kham-pha.html`, page riêng, CTA riêng, và đóng vai trò là entry path ít rủi ro cho người mới. Đây là quyết định vừa đúng UX vừa đúng với category fragrance.

Điểm trung thực cần thừa nhận là site không có backend, không thanh toán thật, không lưu order thật và chưa có automated tests. Nhưng trong phạm vi static coursework, nó làm đúng bài toán: multi-page, JSON-driven, cart persistent, checkout believable, visual premium, và có separation of concerns đủ rõ để giải thích và nâng cấp sau này.

---

# Last-minute Cheat Sheet — Bản ngắn nhất

- Đây là static multi-page ecommerce site, không phải SPA.
- Vite build nhiều HTML root qua `appType: "mpa"`.
- `products.json` là nguồn dữ liệu sản phẩm chính.
- Shop render từ JSON, không hardcode card.
- PDP dùng `chi-tiet-san-pham.html?san-pham=...`.
- Cart lưu trong `localStorage["sillage-cart"]`.
- Cart hydrate lại với catalog để bỏ item stale và sync giá.
- Checkout là mô phỏng tĩnh có validation thật, không charge tiền thật.
- Bootstrap bị override mạnh bằng token system và custom component CSS.
- Discovery Set là route riêng vì logic bán hàng của nó khác chai full-size.

Câu cứu nguy siêu ngắn:
- “Em xin trả lời theo runtime hiện tại.”
- “Nguồn dữ liệu chính của phần này nằm trong JSON.”
- “Phần state này nằm ở localStorage hoặc query string, không hardcode trong HTML.”
- “Đây là static-safe dynamic behavior, không phải backend behavior.”
- “Logic xử lý nằm ở `core`, phần hiển thị nằm ở `render`.”

Tự kiểm cuối: tài liệu trên đã bao phủ mục đích từng page, cart/localStorage, product detail routing, Bootstrap customization, kết nối CSS/JS/data, và lý do vì sao đây vẫn là static site.