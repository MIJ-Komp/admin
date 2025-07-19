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
      provide("actionContext", [
            // {
            //     label: 'Manage Room', action: (data) => {
            //         // console.log("manage room")
            //     }
            // },
      ])
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
