<template>
   <ChForm
      :formData="formData"
      :createAction="doCreate"
      :updateAction="doUpdate"
      :showCancel="showCancel"
      @cancel="$emit('cancel')"
   >
      <b-row>
         <b-col cols="12">
            <TextBox
               label="Nama Fasilitas Properti"
               type="name"
               v-model="form.Name"
               style="margin-bottom: 24px"
            />
         </b-col>
         <b-col cols="12">
            <TextArea
               :required="false"
               label="Deskripsi"
               v-model="form.Description"
            />
         </b-col>
         <div class="mt-4">
            <div class="font-body" style="color: #1e1e1e">Choose icon</div>
            <div class="icon-container">
               <div
                  v-for="(icon, i) in $assets.iconPropertyFacility"
                  :key="icon"
                  @click="chooseIcon(i)"
               >
                  <img
                     :src="icon"
                     class="icon"
                     :class="form.IconName == i ? 'selected' : ''"
                  />
               </div>
            </div>
         </div>
      </b-row>
   </ChForm>
</template>
<script>
import { mapActions } from "vuex";
import module from "../../../constant/module";

export default {
   props: {
      showCancel: { type: Boolean, default: false },
   },
   created() {},
   watch: {},
   data() {
      return {
         formData: {
            module: this.$module.propertyFacility,
         },
         form: {
            Name: null,
            Description: null,
            IconName: null,
            Type: 2,
         },
      };
   },
   async mounted() {
      // console.log(this.$route)
      if (this.$route.meta.formMode == this.$constant.formMode.update) {
         const tmpForm = await this.getById(this.$route.params.id);
         this.form = Object.assign(this.form, tmpForm);
      }
   },
   methods: {
      chooseIcon(i) {
         // // console.log(i)
         this.form.IconName = i;
      },
      doCreate() {
         if (!this.form.IconName) {
            return Promise.reject("Please Choose Icon");
         }

         return this.create(this.form);
      },
      doUpdate() {
         if (!this.form.IconName) {
            return Promise.reject("Please Choose Icon");
         }

         return this.update(this.form);
      },
      ...mapActions(module.propertyFacility.name, [
         "create",
         "getById",
         "update",
      ]),
   },
};
</script>
<style scoped>
.icon-container {
   display: grid;
   gap: 16px;
   grid-template-columns: repeat(auto-fit, 58px);
   margin-top: 12px;
   padding: 10px;
}
.icon-container .icon {
   cursor: pointer;
}
.icon-container .icon:hover {
   transform: scale(1.05);
}
.icon-container .selected {
   border: 2px solid var(--blue-500);
}
</style>
