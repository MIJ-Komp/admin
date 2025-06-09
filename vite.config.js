import vue from "@vitejs/plugin-vue";
import { createHtmlPlugin } from "vite-plugin-html";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
import path from "path";
import constant from './src/constant/constant'
// https://vitejs.dev/config/
export default defineConfig({
   resolve: {
      alias: {
         "@": path.resolve(__dirname, "./src"),
      },
   },
   plugins: [
      vue(),
      createHtmlPlugin({
         minify: true, // Minifikasi HTML
      }),
      visualizer({
         emitFile: true,
         filename: "bundle-visualization.html",
         open: true,
      }),
   ],
   build: {
      target: "esnext", // Target ECMAScript terbaru
      outDir: "dist", // Direktori output
      minify: "terser", // Minifikasi menggunakan Terser
      terserOptions: {
         compress: {
            drop_console: true, // Menghapus // console.log untuk produksi
         },
      },
      rollupOptions: {
         output: {
            manualChunks(id) {
               if (id.includes("node_modules")) {
                  return "vendor"; // Memisahkan dependensi ke dalam chunk terpisah
               }
            },
         },
      },
      assetsInlineLimit: 4096, // Menentukan batas ukuran asset untuk inline
   },
   server: {
      host: "0.0.0.0",
      port: 7070,
   },
});
