<template>
   <MIJForm 
   :formData="formData"
   :createAction="doCreate"
   :updateAction="doUpdate"
   :showCancel="showCancel"
   @cancel="$emit('cancel')"
   >
      <b-row>
         <b-col><FileInput v-model="form.ImageId"/></b-col>
      </b-row>
      <b-row class="mt-4">
         <b-col cols="12"><TextBox label="Name" v-model="form.Name" /></b-col>
      </b-row>
      <b-row class="mt-4">
         <b-col cols="6"><TextBox label="Email" v-model="form.Email" /></b-col>
         <b-col cols="6"><TextBox label="Phone Number" :required="false" v-model="form.PhoneNumber" type="phone" :mustStartWith="'+'" placeholder="+628xxxxx" :maxLength="14"
         /></b-col>
      </b-row>
      <b-row class="mt-4" 
      v-if="$route.meta.formMode != $constant.formMode.update">
         <TextBox
            label="Password"
            type="password"
            :minLength="8"
            :required="false"
            v-model="form.Password"
            style="margin-bottom: 17px"
         />
      </b-row>
      <b-row class="mt-4">
         <b-col
            ><SelectModuleBox
               label="User Role"
               :module="$module.role"
               v-model="form.RoleId"
         /></b-col>
      </b-row>
   </MIJForm>
</template>
<script>
import { mapActions } from "vuex";
import module from "../../../constant/module";
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
      ...mapActions(module.user.name, ["getById", "create", "update"]),
   },
   created() {},
   watch: {},
   data() {
      return {
         form: {
            Name: null,
            Email: null,
            PhoneNumber: null,
            RoleId: null,
         },
         formData: {
            module: this.$module.user,
         },
      };
   },
   async mounted() {
      // console.log(this.$route)
      if (this.$route.meta.formMode == this.$constant.formMode.update) {
         const tmpForm = await this.getById(this.$route.params.id);
         this.form = { ...tmpForm };
         console.log(this.form);
      }
   },
};
</script>
