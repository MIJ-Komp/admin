<template>
   <div>
      <ListPage
         :module="$module.product"
         :actions="actions"
      />
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
   </div>
</template>

<script>
import { provide, ref } from "vue";

export default {
   setup() {
      const showExportModal = ref(false);
      const selectedPlatform = ref('tiktok');
      const selectedAttributes = ref([]);
      const exporting = ref(false);
      const actions = [
         {
            label: 'Export Products',
            buttonType: 'secondary',
            click: () => {
               showExportModal.value = true;
            }
         }
      ];

      provide("actionContext", []);

      return {
         showExportModal,
         selectedPlatform,
         selectedAttributes,
         exporting,
         actions
      };
   },
   methods: {
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
      }
   }
};
</script>
