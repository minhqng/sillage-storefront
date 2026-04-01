# TÓM TẮT QUÁ TRÌNH XÂY DỰNG

Tài liệu này là bản rút gọn của `NHAT_KY_XAY_DUNG_DU_AN.md`, dùng để ôn nhanh trước khi bảo vệ. Mục tiêu là giữ đúng thứ tự triển khai hợp lý theo evidence trong repo, không kể lịch sử giả.

## 1. Điểm xuất phát của dự án

Đây là một storefront ecommerce tĩnh nhiều trang, làm bằng:

- Vite
- Bootstrap 5.3.x
- Vanilla JavaScript ES modules
- Static HTML pages
- JSON data files
- `localStorage` cho giỏ hàng

Trong repo này, “static multi-page ecommerce” nghĩa là:

- mỗi route public là một file HTML riêng như `index.html`, `cua-hang.html`, `chi-tiet-san-pham.html`, `gio-hang.html`, `thanh-toan.html`
- dữ liệu không đi qua backend mà nằm trong `src/data/*.json`
- product detail vẫn addressable bằng URL qua query param `san-pham`
- cart vẫn giữ được qua reload nhờ `src/js/core/cart-store.js`

## 2. Evidence dùng để dựng lại timeline

### Xác nhận được

- `package.json` và `vite.config.js` là commit đầu tiên, chứng minh toolchain Vite MPA được chốt ngay từ đầu.
- Commit thứ hai thêm gần như toàn bộ runtime HTML, JSON và JS modules.
- Commit thứ ba mới thêm toàn bộ CSS.
- Commit thứ tư thêm docs và static assets.
- Commit `ad6eb99` xác nhận có một đợt refactor rõ ràng:
  - `guide.js` đổi từ page thật sang redirect về `bo-kham-pha.html#tu-van-chon-mui`
  - `contact.js` đổi từ page thật sang redirect về `cau-hoi-thuong-gap.html#lien-he-tong`
  - `discovery-view.js` hấp thụ nội dung guide
  - `faq.js` hấp thụ contact section
- Commit `1735c6a` là cleanup wording và asset thừa.

### Chỉ suy luận được

- Docs cũ còn nhắc route tiếng Anh như `shop.html`, `product.html`, `about.html`.
- Nhưng commit sớm nhất còn lưu đã dùng route tiếng Việt ngay trong `vite.config.js`.
- Vì vậy không thể khẳng định chắc trong repo hiện tại từng có một commit rename route từ tiếng Anh sang tiếng Việt.
- Tương tự, docs cũ nói About page từng được dự tính, nhưng runtime/commit history hiện không xác nhận chắc About từng tồn tại như page thật trong code đang lưu.

## 3. Timeline xây dựng rút gọn

### Pha 0: dựng nền Vite MPA

Lúc này cần khóa kiến trúc trước. `package.json` chốt dependency, còn `vite.config.js` khai báo nhiều HTML input để build MPA thật. Nếu không làm bước này trước, các phần sau rất dễ trôi thành SPA.

### Pha 1: tạo bộ route HTML mỏng

Sau khi có Vite config, tác giả tạo các file route như `index.html`, `cua-hang.html`, `chi-tiet-san-pham.html`, `bo-kham-pha.html`, `gio-hang.html`, `thanh-toan.html`, `cau-hoi-thuong-gap.html`. HTML ở đây rất mỏng, chủ yếu làm điểm mount cho entry JS.

### Pha 2: dựng data layer

Ở bước này `src/data/products.json` được đặt làm nguồn dữ liệu trung tâm. Tiếp theo mới có `src/data/site.json`, `src/data/guide.json`, `src/data/faq.json` và các core module như:

- `src/js/core/data-store.js`
- `src/js/core/product-service.js`
- `src/js/core/query-state.js`
- `src/js/core/filter-state.js`
- `src/js/core/sort-state.js`

Đây là quyết định quan trọng vì nó buộc UI phải đi qua data contract thay vì hardcode.

### Pha 3: dựng shared shell

Sau khi có dữ liệu, tác giả mới làm:

- `src/js/core/app-shell.js`
- `src/js/core/page-shell.js`
- `src/js/render/header.js`
- `src/js/render/footer.js`
- `src/js/render/page-intro.js`

Mục tiêu là giải quyết phần lặp giữa các page ngay từ sớm. Đây là lý do shared shell phải đứng trước Cart và Checkout.

### Pha 4: làm Home -> Shop -> Product Detail

Home được làm trước qua `src/js/entries/home.js` và `src/js/render/home-view.js` để kiểm tra shell, card và brand copy. Sau khi có Home, mới tái sử dụng `product-card.js` và `product-grid.js` cho Shop. Product Detail đứng sau Shop vì nó phụ thuộc:

- slug/query param
- lookup trong `product-service.js`
- related products
- add-to-cart entry point

### Pha 5: làm Discovery và Guide

Evidence cho thấy ban đầu Discovery và Guide là hai page riêng:

- `src/js/entries/discovery.js`
- `src/js/entries/guide.js`
- `src/js/render/discovery-view.js`
- `src/js/render/guide-view.js`

Sau này Guide được gộp vào Discovery, nhưng pha build ban đầu nhiều khả năng vẫn tách riêng để ship nhanh hơn.

### Pha 6: làm FAQ và Contact

Tương tự, ban đầu:

- `src/js/entries/faq.js`
- `src/js/entries/contact.js`
- `src/js/render/faq-view.js`
- `src/js/render/contact-view.js`

là hai luồng độc lập. Sau đó Contact được nhập vào FAQ hub.

### Pha 7: thêm Cart

Cart chỉ hợp lý khi product identity đã ổn định. Ở bước này `src/js/core/cart-store.js` dùng `localStorage` để giữ line items qua reload, rồi mới có:

- `src/js/entries/cart.js`
- `src/js/render/cart-view.js`

Từ đây site mới đạt yêu cầu cart persistence.

### Pha 8: thêm Checkout

Sau khi Cart chạy ổn, tác giả thêm:

- `src/js/core/checkout-service.js`
- `src/js/entries/checkout.js`
- `src/js/render/checkout-view.js`

Checkout trong repo này là static checkout, nghĩa là có summary và form nhưng không có backend xử lý đơn thật.

### Pha 9: phủ design system và CSS premium

Git history xác nhận CSS đến sau runtime. Thứ tự logic là:

- `src/styles/tokens.css`
- `src/styles/bootstrap-overrides.css`
- `src/styles/utilities.css`
- `src/styles/main.css`
- `src/styles/components/*.css`

Nghĩa là hệ thống được dựng cho chạy được trước, rồi mới premium hóa visual sau.

### Pha 10: thêm docs và assets

`README.md`, `HANDBOOK.md`, `DEFENSE_NOTES.md`, `PROJECT_BRIEF.md`, `DESIGN_SYSTEM.md`, `PLANS.md` cùng asset trong `public/` được thêm khi runtime đã khá hoàn chỉnh. Vì vậy nếu docs cũ mâu thuẫn với runtime hiện tại, phải ưu tiên runtime.

### Pha 11: refactor information architecture

Đây là pha thay đổi rõ nhất:

- Guide page không còn là page đầy đủ, mà redirect về `bo-kham-pha.html`
- Contact page không còn là page đầy đủ, mà redirect về `cau-hoi-thuong-gap.html`
- `discovery-view.js` nhận thêm nội dung guide
- `faq.js` nhận thêm contact section
- `footer.js` được cập nhật link tương ứng

Đây là một đợt gọn hóa hành trình người dùng, không phải bugfix nhỏ.

### Pha 12: cleanup cuối

Commit cuối dọn copy và asset thừa. Đây là dấu hiệu hệ thống chính đã xong, chỉ còn tinh chỉnh consistency.

## 4. Những ý phải nhớ khi bảo vệ

- `vite.config.js` được cấu hình theo MPA vì đề bài yêu cầu nhiều trang tĩnh thật.
- Site vẫn là static vì không có backend, không có database, không có SSR.
- `src/data/products.json` là source of truth cho flow thương mại.
- Shared shell được làm sớm để tránh lặp header/footer và giữ cart badge đồng bộ.
- Product Detail bằng query param là lý do phải có `query-state` và slug normalization.
- Cart đến sau Home/Shop/PDP vì nó phụ thuộc product identity ổn định.
- Guide và Contact hiện là route legacy redirect, không còn là runtime page chính.
- Docs cũ có thể nhắc route tiếng Anh hoặc About page; runtime hiện tại mới là truth source quan trọng hơn.

## 5. Current runtime truth cần nói đúng

Hiện tại các route live quan trọng là:

- `index.html`
- `cua-hang.html`
- `chi-tiet-san-pham.html`
- `bo-kham-pha.html`
- `gio-hang.html`
- `thanh-toan.html`
- `cau-hoi-thuong-gap.html`

Hai route này còn tồn tại nhưng chỉ để redirect:

- `huong-dan-mui-huong.html`
- `lien-he.html`

Đó là trạng thái runtime hiện tại. Khi tài liệu cũ mô tả khác đi, phải nói rõ đây là dấu vết của phiên bản trước hoặc kế hoạch trước, không phải hiện trạng đang chạy.
