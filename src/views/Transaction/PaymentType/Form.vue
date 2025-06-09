<template>
   <ChForm
      :formData="formData"
      :createAction="doCreate"
      :updateAction="doUpdate"
      :showCancel="showCancel"
      @cancel="$emit('cancel')"
   >
      <b-row>
         <b-col cols="4">
            <TextBox
               label="Kode"
               type="name"
               v-model="form.Code"
               style="margin-bottom: 24px"
            />
         </b-col>
         <b-col cols="8">
            <TextBox
               label="Nama Tipe Properti"
               type="name"
               v-model="form.Name"
               style="margin-bottom: 24px"
            />
         </b-col>
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
         form: {
            Code: null,
            Name: null,
         },
         formData: {
            module: this.$module.paymentType,
         },
      };
   },
   mounted() {
      console.log(this.$route);
   },
   methods: {
      doCreate() {
         return this.create(this.form);
      },
      update() {
         return this.update(this.form);
      },
      ...mapActions(module.paymentType.name, ["create", "getById", "update"]),
   },
};
</script>
