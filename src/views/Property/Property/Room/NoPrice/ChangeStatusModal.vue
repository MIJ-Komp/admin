<template>
   <Dialog
      class="dialog"
      modal
      header="Change Room Status"
      v-model:visible="visible"
      :style="{ width: '50vw' }"
      :pcCloseButton="true"
      :visible="visible"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
   >
      <div class="d-flex flex-column">
         <label class="text-muted mb-1">Current Status</label>
         <label class="mb-4 ms-3" >{{
            roomData?.CurrentStatus?.StatusName
         }}</label>
      </div>
      <label><b>Change To</b></label>
      <div class="d-flex ms-3" v-for="stat in Object.entries(roomStatus)" :key="stat">
         <RadioButton
            class="mb-2"
            :inputId="stat[1]"
            :value="stat[1]"
            name="room-status"
            v-if="roomData?.CurrentStatus?.Status != stat[1]"
            :label="stat[0].replace(/_/g, ` `)"
            v-model="updateStatusData.Status"
         />
      </div>
      <TextArea
         class="mt-4"
         label="Deskripsi"
         :required="false"
         v-model="updateStatusData.Description"
      />
      <div class="actionButton mt-5">
         <Button label="Save" id="yes" @click="saveStatus" :isLoading="isLoading" />
      </div>
   </Dialog>
</template>
<script>
import Dialog from "primevue/dialog";
import { mapActions } from "vuex";
import { RoomStatus } from "../../../../../constant/enums/RoomStatus";
import module from "../../../../../constant/module";
export default {
   components: {
      Dialog,
   },
   data() {
      return {
         visible: false,
         roomData: null,
         updateStatusData: {
            RoomId: null,
            Status: null,
            Description: "",
         },
         lockList: [],
         roomStatus: RoomStatus,
         isLoading: false
      };
   },
   props: {
      showPopUp: {
         type: Boolean,
         default: false,
      },
      editData: {
         type: Number,
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
      editData: {
         async handler() {
            this.roomData = await this.getById(this.editData.Id);
            this.roomData.CurrentStatus = this.editData.RoomStatuses.reduce(
               (old, curr) => {
                  return new Date(curr.CreatedOn) > new Date(old.CreatedOn)
                     ? curr
                     : old;
               }
            );
            this.updateStatusData.RoomId = this.roomData.Id;
            // this.updateStatusData.Status = this.roomData.CurrentStatus.Status;
         },
      },
   },
   methods: {
      ...mapActions(module.roomNoPrice.name, ["updateStatus", "getById"]),
      ...mapActions(module.property.name, ["getLocks"]),
      saveRoom() {
         this.visible = false;
         if (this.editData) {
            this.$emit("updatePopUp", this.visible, true);
            return this.update(this.roomData);
         }
      },
      getRoomStatus(status) {
         return (
            Object.entries(RoomStatus)
               .find(([key, value]) => value === status)?.[0]
               .replace("_", " ") || "Unknown"
         );
      },
      saveStatus() {
         if(this.isLoading) return
         this.isLoading = true
         this.updateStatus(this.updateStatusData).then(res=>
            {
               this.$emit("updatePopUp", this.visible, true);
               this.visible = false;
               this.$showToast.success("Success change status")
            }
         )
         .catch(err=> this.$showToast.error(err))
         .finally(res=> {
            this.isLoading = false
         })
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
