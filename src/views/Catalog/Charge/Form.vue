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
               label="Nama Biaya Tambahan"
               type="name"
               v-model="form.Name"
               style="margin-bottom: 24px"
            />
         </b-col>
      </b-row>
      <b-row class="align-i-center">
         <b-col cols="auto">
            <SelectBox
               :dataSource="chargeTypes"
               v-model="form.Type"
               :required="false"
            />
         </b-col>
         <b-col>
            <TextBox
               type="number"
               :required="false"
               label="Nilai"
               v-model="form.Amount"
            />
         </b-col>
      </b-row>
      <!-- <b-row class="mt-4">
      <b-col cols="12">
        <TextArea :required="false" label="Deskripsi" v-model="form.description"/>
      </b-col>
    </b-row> -->
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
      ...mapActions(module.charge.name, ["create", "update", "getById"]),
   },
   created() {},
   watch: {
      "form.Type": {
         immediate: true,
         async handler(newVal) {
            // console.log(newVal)
         },
      },
   },
   data() {
      return {
         formData: {
            module: this.$module.charge,
         },
         form: {
            Name: null,
            Type: 1,
            Amount: null,
            // description: null
         },
         chargeTypes: [
            { Id: 1, Name: "%" },
            { Id: 2, Name: "Rp" },
         ],
      };
   },
   async mounted() {
      if (this.$route.meta.formMode == this.$constant.formMode.update) {
         const tmpForm = await this.getById(this.$route.params.id);
         this.form = Object.assign(this.form, tmpForm);
      }
   },
};
</script>
