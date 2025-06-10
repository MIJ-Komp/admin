<template>
   <MIJForm
      :formData="formData"
      :createAction="doCreate"
      :updateAction="doUpdate"
      :showCancel="showCancel"
      @cancel="$emit('cancel')"
   >
      <b-row>
         <b-col cols="auto">
            <FileInput v-model="form.ImageId" ref="image"/>
         </b-col>
      </b-row>
      <b-row>
         <b-col lg="4" cols="12" class="mt-4">
            <TextBox label="Nama Metode Pambayaran" v-model="form.Name" :value="images"/>
         </b-col>
         <b-col lg="4" cols="12" class="mt-4">
            <SelectModuleBox
               label="Tipe"
               v-model="form.PaymentMethodTypeId"
               :module="$module.paymentType"
               :height="80"
            />
         </b-col>
         <b-col lg="4" cols="12" class="mt-4">
            <TextBox label="Kode" v-model="form.Code"  />
         </b-col>

         <!-- <DateBox label="Tanggal"/> -->
      </b-row>
      <b-row class="mt-4">
         <b-col lg="12" class="mb-4">
            <TextBox label="Posisi" v-model="form.Position" type="number"/>
         </b-col>
      </b-row>
   </MIJForm>
</template>
<script>
import { mapActions } from 'vuex';
import module from '../../../constant/module'
export default {
   props: {
      showCancel: { type: Boolean, default: false },
   },
   created() {},
   watch: {},
   data() {
      return {
         form: {
            Name: null,
            Code: null,
            Position: 1,
            // PaymentMethodTypeId: null,
            ImageId: null,
            Image: null
         },
         formData: {
            module: this.$module.paymentMethod,
         },
         paymentMethodTypes: [
            { id: 1, name: "Credit" },
            { id: 1, name: "Debit" },
            { id: 1, name: "VA" },
         ],
      };
   },
   computed:{
      images(){
         console.log([this.form.Image])
         if(!this.form.Image)return []
         return [Object.assign(this.form.Image, {ImageId: this.form.Image.Id})]
      }
   },
   async mounted() {
      if (this.$route.meta.formMode == this.$constant.formMode.update) {
         const tmpForm = await this.getById(this.$route.params.id);
         this.form = { ...tmpForm };

         if(this.form.ImageId){
            console.log(this.form.ImageId)
            this.form.ImageId = parseInt(this.form.ImageId)
            // var test = await this.getImage(this.form.ImageId)
         }
      }
   },
   methods: {
      ...mapActions(module.paymentMethod.name, ["create", "update", "getById"]),
      ...mapActions(module.data.name, ["getImage"]),
      doCreate() {
         if (!this.form.ImageId) {
            return Promise.reject("Please Upload Image");
         }
         return this.create(this.form)
      },
      doUpdate() {
         if (!this.form.ImageId) {
            return Promise.reject("Please Upload Image");
         }
         return this.update(this.form)
      },
   },
};
</script>
