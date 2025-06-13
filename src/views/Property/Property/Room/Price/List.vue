<template>
   <ListPage :module="$module.roomPrice" :queryParams="queryParams"/>

   <!-- <div class="header">
      <SearchBar
         v-model="searchKeyword"
         :module="$module.roomPrice"
         :showRefresh="false"
         :canCreate="true"
         :canUpdate="true"
         :canDelete="true"
      />
   </div>
   <div style="margin-top: 8px" class="content">
      <Grid
         ref="grid"
         :module="$module.roomPrice"
         :searchKeyword="searchKeyword"
         :queryParams="queryParams"
      />
   </div> -->
   <ChangeStatusModal
      :showPopUp="showChangeStatusPopUp"
      :editData="roomData"
      @updatePopUp="updateChangeStatusModalVisibility"
   >
   </ChangeStatusModal>
   <ChangeLockModal
      :showPopUp="showEditLockPopUp"
      :editData="roomData?.Id"
      @updatePopUp="updateChangeLockModalVisibility"
   />
</template>
<script>
import ChangeStatusModal from "../NoPrice/ChangeStatusModal.vue";
import ChangeLockModal from "./ManageRoomModal.vue";
import { provide, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import constant from "../../../../../constant/constant";

export default {
  watch: {
  },
   setup() {
      const router = useRouter();
      const route = useRoute();

      var roomData = ref(null)
      var showChangeStatusPopUp = ref(false)
      var showEditLockPopUp = ref(false)

      provide("actionContext", 
      [
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
                        constant.router.roomPrice
                           .replace(":id", route.params.id)
                           .replace(
                              ":roomTypeId",route.params.roomTypeId
                           ) + `/${data.id}/history-status`,
                  });
               },
            },
            {
               label: "Lock History",
               action: (data) => {
                     router.push({
                     path:
                           constant.router.roomPrice
                           .replace(":id", route.params.id)
                           .replace(
                              ":roomTypeId", route.params.roomTypeId
                           ) + `/${data.id}/history-lock`,
                  });
               },
            },
            {
               label: "Select Lock",
               isLock: true,
               action: (data) => {
                  roomData.value = data;
                  showEditLockPopUp.value = true;
               },
            }
      ])
      return {roomData, showEditLockPopUp, showChangeStatusPopUp}
   },
   components: {
      ChangeStatusModal,
      ChangeLockModal,
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
      };
   },
   methods: {
      updateChangeStatusModalVisibility(status, refresh) {
         this.showChangeStatusPopUp = status;
         if(refresh && this.$refs.grid){
            this.$refs.grid.refreshData()
         }
      },
      updateChangeLockModalVisibility(status, refresh) {
         this.showEditLockPopUp = status;
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
