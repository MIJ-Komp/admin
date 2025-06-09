<template>
   <Dialog
      class="dialog"
      modal
      header="Room Status"
      v-model:visible="visible"
      :style="{ width: '50vw' }"
      :pcCloseButton="true"
      :visible="visible"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
   >
      <div class="d-flex flex-column">
         <label class="text-muted mb-1">Date</label>
         <label class="mb-4">{{ statusData.CreatedOn }}</label>
      </div>

      <div class="d-flex flex-column bg-light rounded mb-3 p-2">
         <label>Status</label>
         <label>{{ getRoomStatus(statusData.Status) }}</label>
      </div>
      <div class="d-flex flex-column bg-light rounded mb-3 p-2">
         <label>Deskripsi</label>
         <label>{{ statusData.Description }}</label>
      </div>
      <div class="d-flex flex-column bg-light rounded mb-3 p-2">
         <label>UpdatedBy</label>
         <label>{{ statusData.CreatedBy }}</label>
      </div>
   </Dialog>
</template>
<script>
import Dialog from "primevue/dialog";
import { RoomStatus } from "../../../../constant/enums/RoomStatus";
export default {
   components: {
      Dialog,
   },
   data() {
      return {
         visible: false,
      };
   },
   props: {
      showPopUp: {
         type: Boolean,
         default: false,
      },
      statusData: {
         type: Object,
         default: null,
      },
   },
   watch: {
      showPopUp: {
         handler() {
            this.visible = this.showPopUp;
         },
      },
      visible: {
         handler() {
            this.$emit("updatePopUp", this.visible);
         },
      },
   },
   methods: {
      getRoomStatus(status) {
         return (
            Object.entries(RoomStatus)
               .find(([key, value]) => value === status)?.[0]
               .replace("_", " ") || "Unknown"
         );
      },
   },
};
</script>
<style lang="scss" scoped>
.p-dialog-header-actions {
   display: none !important;
}
.dialog .actionButton {
   display: flex;
   justify-content: end;
}
.dialog .actionButton .mij-button {
   width: 150px !important;
   margin-left: 20px;
}
</style>
