# Sillage Storefront

Sillage Storefront là website ecommerce tĩnh nhiều trang cho đồ án Web Programming, định hướng trải nghiệm thương mại điện tử thực tế (premium D2C) thay vì template học phần mặc định.

## Hiện trạng kiến trúc

Dự án đang vận hành theo mô hình:

- Vite MPA (multi-page application)
- Bootstrap 5.3.x + hệ style override riêng
- Vanilla JavaScript ES modules
- Data tách rời trong JSON
- Giỏ hàng lưu bằng localStorage

Điểm mới quan trọng:

- Trang Hướng dẫn mùi hương đã được gộp vào trang Bộ Khám Phá (section nội trang)
- Trang Liên hệ đã được gộp vào trang Câu hỏi thường gặp thành Liên hệ tổng
- Hai route cũ vẫn tồn tại dưới dạng redirect để không gãy link

## Route công khai

| Trang | Route | Ghi chú |
|---|---|---|
| Trang chủ | `index.html` | Entry chính, mở luồng mua hàng |
| Cửa hàng | `cua-hang.html` | Listing, filter, sort |
| Chi tiết sản phẩm | `chi-tiet-san-pham.html?san-pham=...` | PDP cho full-size |
| Bộ Khám Phá | `bo-kham-pha.html` | Mua discovery + tư vấn chọn mùi |
| Liên hệ tổng | `cau-hoi-thuong-gap.html` | Contact + FAQ trong cùng trang |
| Giỏ hàng | `gio-hang.html` | Quản lý cart |
| Thanh toán | `thanh-toan.html` | Checkout tĩnh + xác nhận |
| Redirect Guide (legacy) | `huong-dan-mui-huong.html` | Redirect sang `bo-kham-pha.html#tu-van-chon-mui` |
| Redirect Contact (legacy) | `lien-he.html` | Redirect sang `cau-hoi-thuong-gap.html#lien-he-tong` |

## Cấu trúc thư mục

```text
.
|-- index.html
|-- cua-hang.html
|-- chi-tiet-san-pham.html
|-- bo-kham-pha.html
|-- huong-dan-mui-huong.html
|-- cau-hoi-thuong-gap.html
|-- lien-he.html
|-- gio-hang.html
|-- thanh-toan.html
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
|   |   |-- render/
|   |   `-- utils/
|   `-- styles/
|       |-- tokens.css
|       |-- bootstrap-overrides.css
|       |-- utilities.css
|       |-- main.css
|       `-- components/
|-- tests/
|-- docs/
|   |-- README.md
|   |-- PLANS.md
|   |-- PROJECT_BRIEF.md
|   |-- DESIGN_SYSTEM.md
|   |-- HANDBOOK.md
|   |-- DEFENSE_NOTES.md
|   |-- code_review.md
|   |-- NHAT_KY_XAY_DUNG_DU_AN.md
|   |-- TOM_TAT_QUA_TRINH_XAY_DUNG.md
|   `-- SCRIPT_THUAT_LAI_QUA_TRINH_CODE.md
|-- package.json
`-- vite.config.js
```

## Cài đặt và chạy

```bash
npm install
npm run dev
```

Build production:

```bash
npm run build
npm run preview
```

## Luồng người dùng chính

1. Home -> Cửa hàng -> Chi tiết sản phẩm -> Thêm giỏ -> Thanh toán.
2. Home/Checkout -> Bộ Khám Phá -> Tư vấn chọn mùi -> quay lại Cửa hàng với filter nhóm hương.
3. Mọi nhu cầu hỗ trợ -> Liên hệ tổng (contact methods + FAQ trong một nơi).

## Data và state

Nguồn dữ liệu:

- `src/data/products.json`: catalog sản phẩm (full-size + discovery set)
- `src/data/site.json`: nội dung dùng chung (footer, discovery copy, contact methods...)
- `src/data/guide.json`: nội dung tư vấn chọn mùi (được render trong trang Bộ Khám Phá)
- `src/data/faq.json`: nhóm FAQ cho Liên hệ tổng

State runtime:

- URL query string cho filter/sort:
  - `nhom-huong`
  - `dip-su-dung`
  - `sap-xep`
  - `san-pham` (ở PDP)
- `localStorage` cho cart persistence

## Tính năng nổi bật

- Catalog data-driven với 7 mùi chủ đạo + 1 Discovery Set
- Shop filter/sort với trạng thái lưu qua URL
- PDP theo slug query static-safe
- Discovery page có khối mua hàng + khối tư vấn chọn mùi tích hợp
- Cart đồng bộ xuyên trang, có badge và hydrate lại từ catalog hiện tại
- Checkout validate phía client và hiển thị xác nhận đơn tĩnh
- Footer, header, page shell dùng chung toàn site

## Bộ tài liệu

Các tài liệu hỗ trợ chính nằm trong cùng thư mục `docs/`:

- `PLANS.md`
- `PROJECT_BRIEF.md`
- `DESIGN_SYSTEM.md`
- `HANDBOOK.md`
- `DEFENSE_NOTES.md`
- `code_review.md`
- `NHAT_KY_XAY_DUNG_DU_AN.md`
- `TOM_TAT_QUA_TRINH_XAY_DUNG.md`
- `SCRIPT_THUAT_LAI_QUA_TRINH_CODE.md`
