const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0
});

const TAG_LABELS = {
  "ho-phach-go": "Hổ phách - gỗ",
  "sung-xanh": "Sung xanh",
  "dien-vi-phan": "Diên vĩ phấn",
  "co-huong-bai-go": "Cỏ hương bài - gỗ",
  "cam-khoang": "Cam khoáng",
  "go-khoi": "Gỗ khói",
  "hoa-trang-cam": "Hoa trắng - cam",
  "kham-pha": "Khám phá",
  "mua-xuan": "Mùa xuân",
  "mua-he": "Mùa hè",
  "mua-thu": "Mùa thu",
  "mua-dong": "Mùa đông",
  "dau-thu": "Đầu thu",
  "buoi-toi": "Buổi tối",
  "an-toi": "Ăn tối",
  "trang-trong": "Trang trọng",
  "ban-ngay": "Ban ngày",
  "cuoi-tuan": "Cuối tuần",
  "sang-tao": "Sáng tạo",
  "van-phong": "Văn phòng",
  "phong-trung-bay": "Phòng trưng bày",
  "di-chuyen": "Di chuyển",
  "hang-ngay": "Hàng ngày",
  "ky-nghi": "Kỳ nghỉ",
  "hen-ca-phe": "Hẹn cà phê",
  "de-tang": "Dễ tặng",
  "thu-mui": "Thử mùi",
  "tang-qua": "Tặng quà",
  "troi-mat-lanh": "Trời mát lạnh",
  "amber-woods": "Hổ phách - gỗ",
  "green-fig": "Sung xanh",
  "powdered-iris": "Diên vĩ phấn",
  "vetiver-woods": "Cỏ hương bài - gỗ",
  "mineral-citrus": "Cam khoáng",
  "smoked-woods": "Gỗ khói",
  "white-floral-citrus": "Hoa trắng - cam",
  "autumn": "Mùa thu",
  "winter": "Mùa đông",
  "spring": "Mùa xuân",
  "summer": "Mùa hè",
  "early-autumn": "Đầu thu",
  "evening": "Buổi tối",
  "dinner": "Ăn tối",
  "formal": "Trang trọng",
  "daytime": "Ban ngày",
  "creative-work": "Làm việc sáng tạo",
  "office": "Văn phòng",
  "gallery": "Phòng trưng bày",
  "travel": "Di chuyển",
  "daily-wear": "Hàng ngày",
  "holiday": "Kỳ nghỉ",
  "brunch": "Hẹn cà phê",
  "giftable": "Dễ tặng",
  "sampling": "Thử mùi",
  "gifting": "Tặng quà",
  "cold-weather": "Trời mát lạnh"
};

export function formatPrice(value) {
  return currencyFormatter.format(value);
}

export function formatTag(tag) {
  const normalizedTag = String(tag ?? "").trim().toLowerCase();

  if (!normalizedTag) {
    return "";
  }

  if (TAG_LABELS[normalizedTag]) {
    return TAG_LABELS[normalizedTag];
  }

  return normalizedTag
    .split("-")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

export function compareByName(left, right) {
  return left.name.localeCompare(right.name, "vi");
}
