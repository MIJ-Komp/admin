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
               label="Nama Add On"
               type="name"
               v-model="form.Name"
               style="margin-bottom: 24px"
            />
         </b-col>
         <b-col cols="6">
            <TextBox
               label="Harga (Rp)"
               type="number"
               v-model="form.Price"
               style="margin-bottom: 24px"
            />
         </b-col>
         <b-col cols="6">
            <TextBox
               label="Jumlah"
               type="number"
               v-model="form.Quantity"
               style="margin-bottom: 24px"
            />
         </b-col>
         <b-col cols="12">
            <TextArea
               :required="false"
               label="Deskripsi"
               v-model="form.Description"
            >
            </TextArea>
         </b-col>
      </b-row>
   </ChForm>
</template>
<script>
import module from "../../../constant/module";
import { mapActions } from "vuex";
export default {
   props: {
      showCancel: { type: Boolean, default: false },
   },
   methods: {
      doCreate() {
         return this.create(this.form);
      },
      doUpdate() {
         return this.update(this.form);
      },
      ...mapActions(module.addOn.name, ["create", "update", "getById"]),
   },
   created() {},
   watch: {},
   data() {
      return {
         formData: {
            module: this.$module.addOn,
         },
         form: {
            Name: null,
            Price: null,
            Quantity: null,
            Description: null,
         },
      };
   },
   async mounted() {
      // // console.log(this.$route)
      if (this.$route.meta.formMode == this.$constant.formMode.update) {
         const tmpForm = await this.getById(this.$route.params.id);
         this.form = { ...tmpForm };
      }
   },
};
</script>
