<template>
   <ListPage 
      :module="$module.roomNoPrice" 
      :queryParams="queryParams" 
      :showEdit="false" 
      :showDelete="false" 
      :showCreate="false"
   >
   <template v-slot:buttons>
         <b-col class="mt-2" cols="4" lg="1" style="align-content: start;">
               <Button
                  label="+Add"
                  @click="startShowAddPopUp()"
               />
         </b-col>
      </template>
   </ListPage>

   <!-- <div class="header">
      <SearchBar
         v-model="searchKeyword"
         :module="$module.roomNoPrice"
         :showRefresh="false"
         :canCreate="true"
         :canUpdate="true"
         :canDelete="true"
      />
   </div>
   <div style="margin-top: 8px" class="content">
      <Grid
      ref="grid"
         :module="$module.roomNoPrice"
         :searchKeyword="searchKeyword"
         :queryParams="queryParams"
         :simpleEdit="true"
         :showPopUp="showEditPopUp"
         @close="closeModal"
         @openModal="openEditPopUp"
      />
   </div> -->
   <ManageRoomModal
      ref="addRoomModal"
      :showPopUp="showAddPopUp"
      :editData="editData"
      @updatePopUp="updateAddRoomModalVisibility"
   />
   <ManageRoomModal
      ref="manageRoomModal"
      :showPopUp="showEditPopUp"
      :editData="editData"
      @updatePopUp="updateEditRoomModalVisibility"
   />
   <ChangeStatusModal
      :showPopUp="showChangeStatusPopUp"
      :editData="roomData"
      @updatePopUp="updateChangeStatusModalVisibility"
   >
   </ChangeStatusModal>
</template>
<script>
import ManageRoomModal from "./ManageRoomModal.vue";
import ChangeStatusModal from "./ChangeStatusModal.vue";
import { provide, ref, onMounted, getCurrentInstance } from "vue";
import { useRouter, useRoute } from "vue-router";
import constant from "../../../../../constant/constant";

export default {
   setup() {
      const router = useRouter();
      const route = useRoute();

      var roomData = ref(null)
      var showChangeStatusPopUp = ref(false)
      var showEditPopUp = ref(false)
      var editData = ref(null)
      var showAddPopUp = ref(false)
      var addData = ref(null)

      provide("actionContext", 
      [

         {
            label: "Edit",
            isLock: true,
            action: (data) => {
               editData.value = data.Id;
               showEditPopUp.value = true;
            },
         },
         {
               label: "Change Status",
               action: (data) => {
                  roomData.value = data;
                  showChangeStatusPopUp.value = true;
               },
            },
            {
               label: "Status History",
               action: (data) => {
                     router.push({
                     path:
                           constant.router.roomNoPrice
                           .replace(":id", route.params.id)
                           .replace(
                              ":roomTypeId",
                              route.params.roomTypeId
                           ) + `/${data.id}/history-status`,
                  });
               },
            },
            {
               label: "Lock History",
               action: (data) => {
                     router.push({
                     path:
                           constant.router.roomNoPrice
                           .replace(":id", route.params.id)
                           .replace(
                              ":roomTypeId",
                              route.params.roomTypeId
                           ) + `/${data.id}/history-lock`,
                  });
               },
            },
            {
               label: "Select Lock",
               isLock: true,
               action: (data) => {
                  editData.value = data.Id;
                  showEditPopUp.value = true;
               },
            },
      ])

      var manageRoomModal = ref(null);
      const { appContext } = getCurrentInstance();

      onMounted(()=>{
         if(manageRoomModal.value){
            appContext.config.globalProperties.$manageRoomModal = manageRoomModal.value;
         }
         
         provide("openModal", 
            (editDataValue = null)=>{
               setTimeout(() => {
                  if(manageRoomModal.value){
                     manageRoomModal.value.openModal(editDataValue)
                  }
                  else if(appContext.config.globalProperties.$manageRoomModal){
                     appContext.config.globalProperties.$manageRoomModal.openModal(editDataValue)
                     // appContext.config.globalProperties.$manageRoomTypeModal = null
                  }
               }, 100);
            }
         )
      })
      return {roomData, showChangeStatusPopUp, showEditPopUp, editData, addData, showAddPopUp}
   },
   components: {
      ManageRoomModal,
      ChangeStatusModal,
   },
   data() {
      return {
         searchKeyword: null,
         queryParams: {
            page: 1,
            limit: -1,
            propertyId: this.$route.params.id,
            roomTypeId: this.$route.params.roomTypeId,
         },
         // editData: null,
         // roomData: null,
         // showEditPopUp: false,
         // showChangeStatusPopUp: false,
      };
   },
   methods: {
      openEditPopUp(editData = null) {
         this.editData = null;
         this.editData = editData;
         this.showEditPopUp = true;
      },
      closeModal() {
         this.showEditPopUp = false;
      },
      updateEditRoomModalVisibility(status, refresh) {
         this.showEditPopUp = status;
         if(refresh && this.$refs.grid){
            this.$refs.grid.refreshData()
         }
      },
      updateChangeStatusModalVisibility(status, refresh) {
         this.showChangeStatusPopUp = status;
         if(refresh && this.$refs.grid){
            this.$refs.grid.refreshData()
         }
      },
      startShowAddPopUp() {
         this.showAddPopUp = true;
      },
      updateAddRoomModalVisibility(status, refresh) {
         this.showAddPopUp = status;
         if(refresh && this.$refs.grid){
            this.$refs.grid.refreshData()
         }
      },
   },
};
</script>
<style scoped>
.header {
   flex-shrink: 1;
}

.content {
   flex-grow: 1;
   overflow: auto;
   height: 100%;
}
</style>
