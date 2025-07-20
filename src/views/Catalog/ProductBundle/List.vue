<template>
   <ListPage
      :module="$module.productBundle"
      :actions="actions"
   />
   <Dialog
         header="Bulk Update Product Item"
         v-model:visible="visible"
         :style="{ width: '60vw' }"
         :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"

   >
      <div class="mb-4">Ubah massal produk dalam Bundle dengan memilih <b>Produk lama</b> yang akan diubah menjadi <b>Produk baru</b></div>
      <b-row class="mb-4">
         <b-col cols="12" lg="6" md="6">
            <SelectBox labelType="out" :dataSource="getProductFiltered(form.oldProductId, form.newProductId)" v-model="form.oldProductId" label="Produk lama" :module="$module.product"/>
         </b-col>
         <b-col cols="12" lg="6" md="6" class="mb-4">
            <SelectBox labelType="out" :dataSource="getProductById(form.oldProductId)?.productSkus" v-model="form.oldProductSkuId" label="Variasi" :module="$module.product"/>
         </b-col>
         
         <b-col cols="12" lg="6" md="6">
            <SelectBox labelType="out" :dataSource="getProductFiltered(form.newProductSkuId, form.oldProductSkuId)" v-model="form.newProductId" label="Produk baru" :module="$module.product"/>
         </b-col>
         <b-col cols="12" lg="6" md="6" class="mb-4">
            <SelectBox labelType="out" :dataSource="getProductById(form.newProductId)?.productSkus" v-model="form.newProductSkuId" label="Variasi" :module="$module.product"/>
         </b-col>
      </b-row>
      <Button :disabled="!form.oldProductId || !form.newProductId || !form.oldProductSkuId || !form.newProductSkuId" label="Ubah" @click.stop.prevent="doChangeComponent"/>
   </Dialog>
   <!-- Export Modal -->
      <b-modal v-model="showExportModal" title="Export Products" hide-footer>
         <div class="p-3">
            <h6 class="mb-3">Select Platform</h6>
            <div class="mb-3">
               <b-form-radio v-model="selectedPlatform" value="tiktok">TikTok</b-form-radio>
               <b-form-radio v-model="selectedPlatform" value="tokopedia">Tokopedia</b-form-radio>
            </div>

            <h6 class="mb-3">Select Attributes to Export</h6>
            <b-row>
               <b-col cols="6">
                  <b-form-checkbox v-model="selectedAttributes" value="name">Product Name</b-form-checkbox>
               </b-col>
               <b-col cols="6">
                  <b-form-checkbox v-model="selectedAttributes" value="description">Description</b-form-checkbox>
               </b-col>
               <b-col cols="6">
                  <b-form-checkbox v-model="selectedAttributes" value="price">Price</b-form-checkbox>
               </b-col>
               <b-col cols="6">
                  <b-form-checkbox v-model="selectedAttributes" value="stock">Stock</b-form-checkbox>
               </b-col>
               <b-col cols="6">
                  <b-form-checkbox v-model="selectedAttributes" value="category">Category</b-form-checkbox>
               </b-col>
               <b-col cols="6">
                  <b-form-checkbox v-model="selectedAttributes" value="images">Images</b-form-checkbox>
               </b-col>
               <b-col cols="6">
                  <b-form-checkbox v-model="selectedAttributes" value="variants">Variants</b-form-checkbox>
               </b-col>
               <b-col cols="6">
                  <b-form-checkbox v-model="selectedAttributes" value="sku">SKU</b-form-checkbox>
               </b-col>
               <template v-if="selectedPlatform === 'tokopedia'">
                  <b-col cols="6">
                     <b-form-checkbox v-model="selectedAttributes" value="weight">Weight</b-form-checkbox>
                  </b-col>
                  <b-col cols="6">
                     <b-form-checkbox v-model="selectedAttributes" value="dimension">Dimension</b-form-checkbox>
                  </b-col>
               </template>
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
</template>
<script>
import { provide, ref, onMounted } from "vue";
import Dialog from "primevue/dialog";
import { mapActions } from "vuex";
import module from "../../../constant/module";
export default {
   components:{
      Dialog
   },
   setup(){
      const showExportModal = ref(false);
      const selectedPlatform = ref('tiktok');
      const selectedAttributes = ref([]);
      const exporting = ref(false);

      provide("actionContext", [
            // {
            //     label: 'Manage Room', action: (data) => {
            //         // console.log("manage room")
            //     }
            // },
      ])
      return {
         showExportModal,
         selectedPlatform,
         selectedAttributes,
         exporting,
      };
   },
   data() {
      return {
         visible: false,
         allProducts: [],
         form:{
            oldProductSkuId: null,
            newProductSkuId: null,
         },
         actions:[
            {
               label : 'Bulk Update Product Items',
               buttonType: 'secondary',
               click: ($event)=>{
                  this.visible = true
               }
            },
            {
               label: 'Export Products',
               buttonType: 'secondary',
               click: () => {
                  this.showExportModal = true;
               }
            }
         ]
      };
   },
   computed:{

   },
   async created(){
      this.allProducts = await this.getAll()
   },
   methods:{
      async exportProducts() {
         try {
            this.exporting = true;
            
            // Validate selections
            if (this.selectedAttributes.length === 0) {
               this.$showToast.error('Error', 'Please select at least one attribute to export');
               return;
            }

            // TODO: Implement actual export logic here
            // 1. Get selected products data
            // 2. Filter attributes based on selectedAttributes
            // 3. Format data according to platform requirements
            // 4. Generate and download CSV/Excel file

            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate export process

            this.$showToast.success('Success', 'Products exported successfully');
            this.showExportModal = false;
         } catch (error) {
            this.$showToast.error('Error', error.message || 'Failed to export products');
         } finally {
            this.exporting = false;
         }
      },
      getProductById(id){
        return this.allProducts.find(data=> data.id == id)
      },
      getProductFiltered(currentId, selectedId){
        return this.allProducts.filter(data=> data.id == currentId || selectedId != data.id)
      },
      async doChangeComponent(){
          var confirm = await this.$dialog.Confirmation.confirm({
            title: "Konfirmasi",
            message: "Tindakan ini akan mengubah seluruh item produk yang ada pada seluruh bundle, apakah kamu yakin?",
         });
         if (confirm) {
             this.changeComponent(this.form)
             .then((res)=>{
               this.visible = false
               this.$showToast.success("Berhasil mengubah massal produk pada seluruh bundle");
             })
             .catch((err)=>{
               this.$showToast.error("Gagal mengubah massal produk pada seluruh bundle", err);
             })
         }
      },
      ...mapActions(module.productBundle.name, ["changeComponent"]),
      ...mapActions(module.product.name, ["getAll"])
   }
};
</script>
