<template>
   <MIJForm
      :formData="formData"
      :createAction="doCreate"
      :updateAction="doUpdate"
      :showCancel="showCancel"
      @cancel="$emit('cancel')"
   >
      <b-row>
         <b-col cols="12">
            <TextBox
               label="Name"
               type="name"
               v-model="form.name"
               style="margin-bottom: 24px"
            />
         </b-col>

         <b-col cols="12">
            <SelectModuleBox :required="false" :module="$module.productCategory" label="Parent Category" v-model="form.parentId"/>
         </b-col>
         
         <!-- <b-col cols="12">
          <TextArea :required="false" label="Deskripsi">

          </TextArea>
        </b-col> -->
      </b-row>
   </MIJForm>
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
      ...mapActions(module.productCategory.name, ["create", "getById", "update"]),
   },
   created() {},
   watch: {},
   data() {
      return {
         formData: {
            module: this.$module.productCategory,
         },
         form: {
            code: null,
            name: null,
            parentId: null
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
