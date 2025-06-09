<template>
   <ListPage :module="$module.roomTypeNoPrice" 
      :showPopUp="showPopUp"
      :simpleEdit="true"
      :simpleAdd="true"
      :queryParams="queryParams"
      />

   <!-- <div class="d-flex flex-column" v-if="userHasRole">
      <SearchBar
         v-if="propertyData"
         v-model="searchKeyword"
         :module="$module.roomTypeNoPrice"
         @refreshList="refresh"
         :canCreate="canCreate"
         :canUpdate="canUdate"
         :canDelete="canDelete"
         @delete="doDelete"
         simpleAdd
      />
   </div>
   <div class="mt-2 h-100" v-if="propertyData && userHasRole">
      <Grid
         ref="grid"
         :module="$module.roomTypeNoPrice"
         :searchKeyword="searchKeyword"
         :queryParams="queryParams"
         :showPopUp="showPopUp"
         :simpleEdit="true"
         @close="closeModal"
      />
   </div>
   <div v-if="!userHasRole" style="height: 100%;">
        <div class="notHaveAccess text-center">You don't have access to view this page</div>
    </div> -->
   <ManageRoomTypeModal
      :showPopUp="showPopUp"
      :editData="editData"
      @updatePopUp="updatePopUp"
      @refresh="refresh"
      ref="manageRoomTypeModal"
   />
</template>

<script>
import { mapActions } from "vuex";
import ManageRoomTypeModal from "./ManageRoomTypeModal.vue";
import module from "../../../../../constant/module";
import access from '../../../../../constant/accessModule'

import { provide, ref, onMounted, getCurrentInstance } from "vue";
import { useRouter, useRoute } from "vue-router";
import constant from "../../../../../constant/constant";

export default {
   setup() {
      const router = useRouter();
      const route = useRoute();
      const editData = ref(null);
      const showPopUp = ref(false)

      provide("actionContext", 
      [
         {
            label: "View Room",
            action: (data) => {
               router.push({
                  path: constant.router.roomPrice
                     .replace(":id", route.params.id)
                     .replace(":roomTypeId", data.Id),
               });
            },
         },
      ])
      var manageRoomTypeModal = ref(null);
      const { appContext } = getCurrentInstance();


      onMounted(()=>{
         if(manageRoomTypeModal.value){
            appContext.config.globalProperties.$manageRoomTypeModal = manageRoomTypeModal.value;
         }
         
         provide("openModal", 
            (editDataValue = null)=>{
               setTimeout(() => {
                  if(manageRoomTypeModal.value){
                     manageRoomTypeModal.value.openModal(editDataValue)
                  }
                  else if(appContext.config.globalProperties.$manageRoomTypeModal){
                     appContext.config.globalProperties.$manageRoomTypeModal.openModal(editDataValue)
                     // appContext.config.globalProperties.$manageRoomTypeModal = null
                  }
               }, 100);
            }
         )
      })

      return{
         showPopUp, editData, manageRoomTypeModal, onMounted
      }
   },
   components: {
      ManageRoomTypeModal,
   },
   data() {
      return {
         searchKeyword: "",
         propertyData: null,
         queryParams: {
            page: 1,
            limit: 100,
            propertyId: this.$route.params.id,
         },
         userHasRole: false,
         canDelete: false,
         canUpdate: false,
         canCreate: false,
      };
   },
   async mounted() {
      this.propertyData = await this.getById(this.$route.params.id);

      this.userHasRole = await this.hasViewRole(access.module.room.Id)
      this.canCreate = await this.hasCreateRole(access.module.room.Id)
      this.canDelete = await this.hasDeleteRole(access.module.room.Id)
      this.canUpdate = await this.hasUpdateRole(access.module.room.Id)

   },
   methods: {
      async refresh(){
         if(this.$refs.grid){
            this.$refs.grid.refreshData()
            this.editData = null
         }
      },
      ...mapActions(module.property.name, ["getById"]),
      ...mapActions(module.user.name, ["hasViewRole","hasViewRole", "hasCreateRole", "hasUpdateRole", "hasDeleteRole"]),
      closeModal() {
         this.showPopUp = false;
      },
      async updatePopUp(statusPopUp) {
         if(!statusPopUp){
            this.refresh()
            this.editData = null
         }
         this.showPopUp = statusPopUp;
      },

      async doDelete() {
            if(!this.canDelete){
                this.$dialog.Alert.confirm({ title: 'Gagal Hapus', message: 'Anda tidak memiliki Akses' })
                return
            }
            const selectedData = this.$refs.grid ? this.$refs.grid.selectedData() : []
            if(!selectedData || selectedData.length<= 0){
                this.$dialog.Alert.confirm({ title: 'Gagal Hapus', message: 'Tidak ada data yang dipilih' })
            }
            else{
                const confirm = await this.$dialog.Confirmation.confirm({ title: 'Konfirmasi', message: `Anda yakin akan menghapus data ini? (${selectedData.length} data)` })
                if (confirm) {
                    var success = 0
                    var error = null
                    for (let i = 0; i < selectedData.length; i++) {
                        try{
                            const request = await this.$store.dispatch(`${module.roomTypeNoPrice.name}/delete`, selectedData[i].Id)
                            success += 1
                        }
                        catch(err){
                            error = err
                        }
                    }
                    if(success == selectedData.length){
                        this.$showToast.success(`Success`, `${success} data successfully deleted`)
                    }
                    else if(success > 0){
                        this.$showToast.warn('Only Partly Deleted', `${success} out of ${selectedData.length} data successfully deleted`)
                    }
                    if(error){
                        this.$showToast.error('Failed to Delete', error)
                    }
                    this.$refs.grid.refreshData()
                }
            }
        },
   },
};
</script>

<style scoped>
.notHaveAccess{
    height: 100%;
    border-radius: 8px;
    background: white;
    padding-top: 100px;
}
</style>
