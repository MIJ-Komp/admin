<template>
   <Dialog
      class="dialog"
      modal
      :header="editData ? 'Edit' : 'Add New'"
      v-model:visible="visible"
      :style="{ width: '50vw' }"
      :pcCloseButton="true"
      :visible="visible"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
   >
      <TextBox
         label="Nama Tipe Room"
         class="mb-2"
         v-model="roomTypeData.Name"
      />

      <div class="actionButton mt-5">
         <Button label="Save" id="yes" @click="saveRoom" />
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
         roomTypeData: null,
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
               this.roomTypeData = await this.getById(this.editData);
               this.roomTypeData.Type = 2;
            } else {
               this.roomTypeData = {
                  PropertyId: parseInt(this.$route.params.id),
                  Type: 2,
                  Name: "",
               };
            }
         },
         immediate: true,
      },
   },
   methods: {
      async openModal(data){
         this.visible = true
         if (data) {
               this.roomTypeData = await this.getById(data);
               this.roomTypeData.Type = 2;
         } else {
            this.roomTypeData = {
               PropertyId: parseInt(this.$route.params.id),
               Type: 2,
               Name: "",
            };
         }
      },
      ...mapActions(module.roomTypeNoPrice.name, [
         "create",
         "update",
         "getById",
      ]),
      saveRoom() {
         this.visible = false;
         if (!this.editData) {
            this.create(this.roomTypeData)
            .then(res=> {
               this.$showToast.success("Berhasil menambah tipe kamar")
               this.$emit("refresh")
            })
            .catch(err=> this.$showToast.error(err))
         } else {
            this.update(this.roomTypeData)
            .then(res=> {
               this.$showToast.success("Berhasil mengubah tipe kamar")
               this.$emit("refresh")
            })
            .catch(err=> this.$showToast.error(err))
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
