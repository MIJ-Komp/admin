<template>
   <div>
      <ListPage
         :module="$module.product"
         :actions="actions"
         ref="productList"
      />
      <!-- Export Modal -->
      <b-modal v-model="showExportModal" title="Export Products" hide-footer>
         <div class="p-3">
            <h6 class="mb-3">Mandatory Export Attributes</h6>
            <b-row>
               <b-col cols="4"><b-form-checkbox checked disabled>Name</b-form-checkbox></b-col>
               <b-col cols="4"><b-form-checkbox checked disabled>Image</b-form-checkbox></b-col>
               <b-col cols="4"><b-form-checkbox checked disabled>Category</b-form-checkbox></b-col>
               <b-col cols="4"><b-form-checkbox checked disabled>Description</b-form-checkbox></b-col>
               <b-col cols="4"><b-form-checkbox checked disabled>Price</b-form-checkbox></b-col>
               <b-col cols="4"><b-form-checkbox checked disabled>Weight(gr)</b-form-checkbox></b-col>
               <b-col cols="4"><b-form-checkbox checked disabled>Stock</b-form-checkbox></b-col>
               <b-col cols="4"><b-form-checkbox checked disabled>Weight</b-form-checkbox></b-col>
            </b-row>

            <h6 class="mb-3">Select Optional Attributes to Export</h6>
            <b-row>
               <b-col cols="6">
                  <b-form-checkbox v-model="selectedAttributes" value="Merk">Merk</b-form-checkbox>
               </b-col>
               <b-col cols="6">
                  <b-form-checkbox v-model="selectedAttributes" value="SKU">SKU</b-form-checkbox>
               </b-col>
               <!-- <b-col cols="6">
                  <b-form-checkbox v-model="selectedAttributes" value="length">Panjang</b-form-checkbox>
               </b-col>
               <b-col cols="6">
                  <b-form-checkbox v-model="selectedAttributes" value="width">Lebar</b-form-checkbox>
               </b-col>
               <b-col cols="6">
                  <b-form-checkbox v-model="selectedAttributes" value="height">Tinggi</b-form-checkbox>
               </b-col> -->
            </b-row>

            <div class="d-flex justify-content-end mt-2">
               <Button
                  label="Export"
                  :loading="exporting"
                  @click="exportProducts"
               />
            </div>
         </div>
      </b-modal>
   </div>
</template>

<script>

import { provide, ref, getCurrentInstance } from "vue";
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import constant from "../../../constant/constant";

export default {
   setup() {
      const { proxy } = getCurrentInstance() 

      const showExportModal = ref(false);
      const selectedPlatform = ref('tiktok');
      const selectedAttributes = ref([]);
      const exporting = ref(false);
      const productList = ref(null)
      var selectedData = ref([])

      const actions = [
         {
            label: 'Export Products',
            buttonType: 'secondary',
            click: async () => {
               const selectedData = productList?.value?.selectedData?.() || []
               if (!selectedData.length) {
                  proxy.$showToast.error('Error', 'Please select at least one product to export')
                  return
               }
               showExportModal.value = true
            }
         }
      ];

      provide("actionContext", []);

      return {
         showExportModal,
         selectedPlatform,
         selectedAttributes,
         exporting,
         productList,
         selectedData,
         actions
      };
   },
   methods: {
      buildProductName(product, sku) {
         // 1. Ambil nama dasar
         let name = (product.name || '').trim()

         // 2. Siapkan tambahan untuk memperkaya nama
         const extraParts = [
            product.brand?.name,
            product.componentType?.name,     
            product.productVariantOptions.find(value => value.id == sku.productVariantOptionId)?.name,             
            product.productVariantOptionValues.find(value => value.id == sku.productVariantOptionValueId)?.name,             
            'Original',
            'Garansi Resmi'
         ].filter(Boolean)

         // 3. Tambahkan part sampai nama >= 25 char
         for (const part of extraParts) {
            if (name.length >= 25) break
            name += (name ? ' ' : '') + part
         }

         // 4. Kalau masih kurang, tambahkan filler deskriptif (lebih bagus daripada spasi)
         const fillerWords = [
            product.brand?.name,
            product.componentType?.name,
            'Kualitas Terbaik',
            'High Performance',
            'Bergaransi'
         ].filter(Boolean)

         let fillerIndex = 0
         while (name.length < 25 && fillerIndex < fillerWords.length) {
            name += ' ' + fillerWords[fillerIndex]
            fillerIndex++
         }

         // 5. Final guard: minim 25 karakter
         if (name.length < 25) {
            name = name + ' Premium Quality'   // fallback
         }

         // 6. TikTok MAX LIMIT: 255 karakter
         // Potong aman, tanpa motong tengah-tengah spasi
         if (name.length > 255) {
            name = name.substring(0, 255).trim()
         }

         return name
      },

      htmlToPlainText(html) {
         if (!html) return ''
         const div = document.createElement('div')
         div.innerHTML = html
         // textContent = buang semua tag, sisain text
         return div.textContent || div.innerText || ''
      },
      async exportProducts() {
         try {
            this.exporting = true;
         

            console.log(this.selectedAttributes)
            // 1. Load template
                  const response = await fetch('/templateExportProduct.xlsx')
                  const arrayBuffer = await response.arrayBuffer()
                  const workbook = new ExcelJS.Workbook()
                  await workbook.xlsx.load(arrayBuffer)

                  const sheet = workbook.getWorksheet('Template')
                  if (!sheet) {
                     throw new Error('Sheet "Template" tidak ditemukan di file Excel.')
                  }

                  let rowIndex = 7 // baris data pertama di template
                  var selectedData = this.$refs.productList.selectedData() || []
                  for (const product of selectedData) {
                     const skuList = product?.productSkus || []
                     console.log(product)
                     var mainVariant = product.productVariantOptions.find(data=> data.sequence == 1)
                     var secVariant = product.productVariantOptions.find(data=> data.sequence == 2)
                     
                     for (const sku of skuList) {

                        var skuVariant = product.productSkuVariants.filter(data=> data.productSkuId == sku.id)
                        if(!product.productVariantOptionValues.find(value => value.id == skuVariant.find(data=> data.productVariantOptionId == mainVariant.id)?.productVariantOptionValueId)){
                           continue
                        }
                     
                     const row = sheet.getRow(rowIndex)

                     var category = Object.keys(this.$constant.categoryMap).find(data=> data.toLowerCase().includes(product.componentType?.name.toLowerCase()) ||  product.componentType?.name.toLowerCase().includes(data.toLowerCase()))

                     /*~Kategori*/              sheet.getCell(`A${rowIndex}`).value  = category? this.$constant.categoryMap[category].name : 'Komputer Peralatan Kantor'
                     
                     if(this.selectedAttributes.find(data=> data == "Merk")){
                     /*Merk*/                   sheet.getCell(`B${rowIndex}`).value  = product.brand?.name || 'Tidak Ada Merek'
                     }
                     else{
                     /*Merk*/                   sheet.getCell(`B${rowIndex}`).value  = 'Tidak Ada Merek'
                     }
                     
                     /*~Nama*/                  sheet.getCell(`C${rowIndex}`).value  = this.buildProductName(product, sku) || ''
                     /*~Deskripsi*/             sheet.getCell(`D${rowIndex}`).value  = this.htmlToPlainText(product.description) || ''
                     /*~Gbr Utama*/             sheet.getCell(`E${rowIndex}`).value  = product.imageIds[0] ? `${constant.apiURL}/files?id=${product.imageIds[0]}` :''
                     /*Gbr 2*/                  sheet.getCell(`F${rowIndex}`).value  = product.imageIds[1] ? `${constant.apiURL}/files?id=${product.imageIds[1]}` :''
                     /*Gbr 3*/                  sheet.getCell(`G${rowIndex}`).value  = product.imageIds[2] ? `${constant.apiURL}/files?id=${product.imageIds[2]}` :''
                     /*Gbr 4*/                  sheet.getCell(`H${rowIndex}`).value  = product.imageIds[3] ? `${constant.apiURL}/files?id=${product.imageIds[3]}` :''
                     /*Gbr 5*/                  sheet.getCell(`I${rowIndex}`).value  = product.imageIds[4] ? `${constant.apiURL}/files?id=${product.imageIds[4]}` :''
                     /*Gbr 6*/                  sheet.getCell(`J${rowIndex}`).value  = product.imageIds[5] ? `${constant.apiURL}/files?id=${product.imageIds[5]}` :''
                     /*Gbr 7*/                  sheet.getCell(`K${rowIndex}`).value  = product.imageIds[6] ? `${constant.apiURL}/files?id=${product.imageIds[6]}` :''
                     /*Gbr 8*/                  sheet.getCell(`L${rowIndex}`).value  = product.imageIds[7] ? `${constant.apiURL}/files?id=${product.imageIds[7]}` :''
                     /*Gbr 9*/                  sheet.getCell(`M${rowIndex}`).value  = product.imageIds[8] ? `${constant.apiURL}/files?id=${product.imageIds[8]}` :''
                     /*Nama var 1*/             sheet.getCell(`N${rowIndex}`).value  = mainVariant.name || ''
                     /*Nilai Var 1*/            sheet.getCell(`O${rowIndex}`).value  = product.productVariantOptionValues.find(value => value.id == skuVariant.find(data=> data.productVariantOptionId == mainVariant.id)?.productVariantOptionValueId)?.name || ''
                     /*Gbr Var 1*/              sheet.getCell(`P${rowIndex}`).value  = ''
                     /*Nama var sekunder*/      sheet.getCell(`Q${rowIndex}`).value  = secVariant.name|| ''
                     /*Nilai var sekunder*/     sheet.getCell(`R${rowIndex}`).value  = !secVariant ? '' : product.productVariantOptionValues.find(value => value.id == skuVariant.find(data=> data.productVariantOptionId == secVariant.id)?.productVariantOptionValueId)?.name || ''
                     /*~Berat Paket(g)*/        sheet.getCell(`S${rowIndex}`).value  = sku.weight || 1000
                     /*Pjg Paket(cm)*/          sheet.getCell(`T${rowIndex}`).value  = this.selectedAttributes.find(data=> data == "length")  ? sku.length || 0 : 0
                     /*Lebar Paket(cm)*/        sheet.getCell(`U${rowIndex}`).value  = this.selectedAttributes.find(data=> data == "width")  ? sku.width || 0 : 0
                     /*Tinggi Paket(cm)*/       sheet.getCell(`V${rowIndex}`).value  = this.selectedAttributes.find(data=> data == "height")  ? sku.height || 0 : 0
                     /*Opsi Pengiriman*/        sheet.getCell(`W${rowIndex}`).value  = product.shippingOption || ''
                     /*~Harga (Rp)*/            sheet.getCell(`X${rowIndex}`).value  = sku.price || 0
                     /*~Jumlah Stok (Rp)*/      sheet.getCell(`Y${rowIndex}`).value  = sku.stock || 0
                     /*SKU*/                   sheet.getCell(`Z${rowIndex}`).value  = this.selectedAttributes.find(data=> data == "SKU")  ? sku.code || '' : ''
                     /*COD?*/                sheet.getCell(`AC${rowIndex}`).value = 'Tidak'
                     /*Garansi*/                sheet.getCell(`AD${rowIndex}`).value = 'Garansi Produsen'

                     row.commit()
                     rowIndex++
                     }
                  }

                  const buffer = await workbook.xlsx.writeBuffer()
                  saveAs(new Blob([buffer]), 'Tiktok-Tokped-import-product.xlsx')

            this.$showToast.success('Success', 'Products exported successfully');
            this.showExportModal = false;
         } catch (error) {
            console.log(error)
            this.$showToast.error('Error', error.message || 'Failed to export products');
         } finally {
            this.exporting = false;
         }
      }
   }
};
</script>
