# Sillage Storefront

Storefront ecommerce tĩnh nhiều trang cho đồ án Web Programming, triển khai theo hướng premium D2C bằng Vite MPA, Bootstrap 5.3.x, Vanilla JS, JSON data và `localStorage`.

## Tài liệu

Tài liệu dự án đã được gom vào thư mục [docs](D:\MyProfile\Documents\PTIT\sillage-storefront\docs):

- [README chi tiết](D:\MyProfile\Documents\PTIT\sillage-storefront\docs\README.md)
- [PLANS](D:\MyProfile\Documents\PTIT\sillage-storefront\docs\PLANS.md)
- [PROJECT_BRIEF](D:\MyProfile\Documents\PTIT\sillage-storefront\docs\PROJECT_BRIEF.md)
- [DESIGN_SYSTEM](D:\MyProfile\Documents\PTIT\sillage-storefront\docs\DESIGN_SYSTEM.md)
- [HANDBOOK](D:\MyProfile\Documents\PTIT\sillage-storefront\docs\HANDBOOK.md)
- [DEFENSE_NOTES](D:\MyProfile\Documents\PTIT\sillage-storefront\docs\DEFENSE_NOTES.md)
- [code_review](D:\MyProfile\Documents\PTIT\sillage-storefront\docs\code_review.md)
- [NHAT_KY_XAY_DUNG_DU_AN](D:\MyProfile\Documents\PTIT\sillage-storefront\docs\NHAT_KY_XAY_DUNG_DU_AN.md)
- [TOM_TAT_QUA_TRINH_XAY_DUNG](D:\MyProfile\Documents\PTIT\sillage-storefront\docs\TOM_TAT_QUA_TRINH_XAY_DUNG.md)
- [SCRIPT_THUAT_LAI_QUA_TRINH_CODE](D:\MyProfile\Documents\PTIT\sillage-storefront\docs\SCRIPT_THUAT_LAI_QUA_TRINH_CODE.md)

## Chạy dự án

```bash
npm install
npm run dev
```

Build production:

```bash
npm run build
npm run preview
```

## Ràng buộc

- Không backend, không database, không auth
- Không thanh toán thật, không quản lý tồn kho realtime
- Không có hệ thống tài khoản người dùng

## Mở rộng trong tương lai

- Gắn CMS/API thay cho JSON cục bộ
- Lưu đơn hàng và giỏ hàng phía server
- Tích hợp payment gateway
- Bổ sung quản trị sản phẩm và vận hành fulfillment
