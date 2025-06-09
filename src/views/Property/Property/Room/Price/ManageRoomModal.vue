<template>
   <Dialog
      class="dialog"
      modal
      header="Edit Lock"
      v-model:visible="visible"
      :style="{ width: '50vw' }"
      :pcCloseButton="true"
      :visible="visible"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
   >
      <div class="d-flex flex-column">
         <label class="text-muted">{{ roomData.Code }} </label>
         <label>{{ roomData.Name }} </label>
      </div>

      <SelectBox
         label="Select Lock"
         :dataSource="lockList"
         v-model="roomData.TTLockId"
         optionValue="TTLockId"
         optionLabel="Alias"
      />
      <div class="actionButton mt-5">
         <Button label="Save" id="yes" @click="saveRoom" :isLoading="isLoading"/>
      </div>
   </Dialog>
</template>
<script>
import Dialog from "primevue/dialog";
import { mapActions } from "vuex";
import module from "../../../../../constant/module";
export default {
   components: {
      Dialog,
   },
   data() {
      return {
         visible: false,
         roomData: {
            Name: "",
         },
         lockList: [],
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
            if (this.editData) {
               this.roomData = await this.getById(this.editData);
            } else {
               this.visible = false;
            }
         },
         immediate: true,
      },
   },
   async mounted() {
      this.lockList = await this.getLocks();
   },
   methods: {
      ...mapActions(module.roomPrice.name, ["setRoomLock", "getById"]),
      ...mapActions(module.property.name, ["getLocks"]),
      saveRoom() {
         if(this.isLoading) return
         this.isLoading = true

         if (this.editData) {
            this.setRoomLock(this.roomData).then(res=>{
               this.$showToast.success("Success")
               this.visible = false;
               this.$emit("updatePopUp", this.visible, true);
            })
            .catch(err=>{
               this.$showToast.error(err)
            })
            .finally(()=>{ this.isLoading= false})
         }
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
