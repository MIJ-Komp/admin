<template>
   <ChForm
      :formData="formData"
      :createAction="doCreate"
      :updateAction="doUpdate"
      :showCancel="showCancel"
      @cancel="$emit('cancel')"
   >
      <b-row>
         <b-col lg="4" cols="12">
            <TextBox
               label="Kode"
               type="name"
               v-model="form.Code"
               style="margin-bottom: 24px"
            />
         </b-col>
         <b-col lg="8" cols="12">
            <TextBox
               label="Nama Tipe Properti"
               type="name"
               v-model="form.Name"
               style="margin-bottom: 24px"
            />
         </b-col>
         <!-- <b-col cols="12">
          <TextArea :required="false" label="Deskripsi">

          </TextArea>
        </b-col> -->
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
      ...mapActions(module.propertyType.name, ["create", "getById", "update"]),
   },
   created() {},
   watch: {},
   data() {
      return {
         formData: {
            module: this.$module.propertyType,
         },
         form: {
            Code: null,
            Name: null,
         },
      };
   },
   async mounted() {
      // // console.log(this.$route)
      if (this.$route.meta.formMode == this.$constant.formMode.update) {
         const tmpForm = await this.getById(this.$route.params.id);
         this.form = Object.assign(this.form, tmpForm);
      }
   },
};
</script>
