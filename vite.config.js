import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const resolveFromRoot = (file) => fileURLToPath(new URL(file, import.meta.url));

export default defineConfig({
  appType: "mpa",
  build: {
    rollupOptions: {
      input: {
        home: resolveFromRoot("./index.html"),
        shop: resolveFromRoot("./cua-hang.html"),
        product: resolveFromRoot("./chi-tiet-san-pham.html"),
        discovery: resolveFromRoot("./bo-kham-pha.html"),
        guide: resolveFromRoot("./huong-dan-mui-huong.html"),
        faq: resolveFromRoot("./cau-hoi-thuong-gap.html"),
        contact: resolveFromRoot("./lien-he.html"),
        cart: resolveFromRoot("./gio-hang.html"),
        checkout: resolveFromRoot("./thanh-toan.html")
      }
    }
  }
});
