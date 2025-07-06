<template>
   <div class="form-page fadeIn">
      <!-- <vue-loading
        :active.sync="isPageLoading"
        :is-full-page="false"
        :color="$_const.color.default"
        class="loading"
      /> -->
      <Form
         v-if="hasAccess"
         @submit="doSave($event)"
         :style="styleFormHistory"
         class="bg-form"
         ref="observer"
      >
         <div class="w-100 header-form">
            <b-col>
               <span class="font-h5">
                  {{ mode }}
               </span>
            </b-col>
            <b-col cols="auto">
               <div class="d-flex">
                  <Button class="ps-4 pe-4" @click.prevent="cancel"  buttonType="danger" label="cancel" style="margin-right: 20px;" 
                  v-if="showCancel || ($route && $route.meta && $route.meta.formMode === $constant.formMode.update)"/>
                  <Button class="ps-4 pe-4" type="submit" buttonType="primary" label="Save" :isLoading="process" />
               </div>
            </b-col>
         </div>
         <b-row align-h="between" class="form-content">
            <b-col>
               <slot />
            </b-col>
         </b-row>
      </Form>
      <div v-else v-html="accessMessage" class="notHaveAccess text-center"></div>
   </div>
</template>
<script>
import { Form } from "vee-validate";
import access from '../constant/accessModule'
import module from '../constant/module'
import {mapActions} from 'vuex'

export default {
   data() {
      return {
         isPageLoading: false,
         process: false,
         accessMessage: ``,
         canDelete: true,
         hasAccess: true,
         isLoading: false,
      };
   },
   components: {
      Form,
   },
   props: {
      showCancel:{type: Boolean, default: false},
      formData: {
         type: Object,
         required: true,
         default: () => {},
      },
      createAction: {
         type: Function,
         default: () => {
            // // console.log('No Create Action')
         },
      },

      updateAction: {
         type: Function,
         default: () => {
            // // console.log('No Update Action')
         },
      },
      redirect: { type: String, default: null },

      deleteAction: {
         type: Function,
         default: () => {
            // // console.log('No Delete Action')
         },
      },
   },
   computed: {
      mode() {
         if (this.$route && this.$route.meta && this.$route.meta.formMode) {
            return this.$route.meta.formMode == this.$constant.formMode.create
               ? this.$label.action.create
               : this.$route.meta.formMode == this.$constant.formMode.update
               ? this.$label.action.update
               : null;
         }
         return null;
      },
      formTitle() {
         return "";
      },
   },
   methods: {
      cancel(){
         if(this.showCancel){
            this.$emit('cancel')
            return
         }
         else if(this.$route.meta.formMode === this.$constant.formMode.update){
            if (this.redirect) {
               this.$router.push({
                  path: this.redirect,
               });
               return;
            }
            this.$router.replace(
               this.$constant.router[this.formData.module.name]
            );
         }
      },
      async doSave(event) {
         if (this.process) {
            return;
         }
         this.process = true;
         // console.log('save')

         const validator = this.$refs.observer;
         // this.$refs.observer.validate().then((isValid) => {
         // })
            // console.log(validator)

         if(validator){
            const result = await validator.validate();
            // console.log(result)
            if (!result) {
               // setTimeout(() => {
               //    const childObservers = validator.observers;
               //    const failedObserver = childObservers.find(
               //       (el) => el.flags.failed
               //    );

               //    if (failedObserver) {
               //       this.$emit("showTab", +failedObserver.$attrs["tab-id"]);
               //    }
               // }, 200);

               // this.setCreateLoading(false);
               return;
            }
         }

         if (this.$route.meta.formMode === this.$constant.formMode.update) {
            this.updateAction()
               .then((response) => {
                  this.$showToast.success(
                     `${this.mode} ${
                        this.$label.menu[this.formData.module.name]
                     } Success`,
                     ""
                  );

                  if (this.redirect) {
                     this.$router.push({
                        path: this.redirect,
                     });
                     return;
                  }
                  this.$router.replace(
                     this.$constant.router[this.formData.module.name]
                  );
               })
               .catch((err) => {
                  this.process = false;
                  this.$showToast.error(
                     `${this.mode} ${
                        this.$label.menu[this.formData.module.name]
                     } Failed`,
                     err
                  );
               })
               .finally(() => {
                  this.process = false;
               });
         } else {
            this.createAction()
               .then((response) => {
                  this.$showToast.success(
                     `${this.mode} ${
                        this.$label.menu[this.formData.module.name]
                     } Success`,
                     ""
                  );
                  if(this.showCancel){
                     console.log(response)
                     this.$emit('cancel', true)
                     return;
                  }
                  if (this.redirect) {
                     this.$router.push({
                        path: this.redirect,
                     });
                     return;
                  }

                  this.$router.replace(
                     this.$constant.router[this.formData.module.name]
                  );
               })
               .catch((err) => {
                  this.process = false;
                  this.$showToast.error(
                     `${this.mode} ${
                        this.$label.menu[this.formData.module.name]
                     } Failed`,
                     err
                  );
               })
               .finally(() => {
                  this.process = false;
               });
         }
      },
      ...mapActions(module.user.name, ["hasViewRole", "hasCreateRole", "hasUpdateRole", "hasDeleteRole"])

   },
   async mounted() {

      // const accessId = this.formData.module.name == module.product.name || this.formData.module.name == module.productBundle.name ?
                        
      //                   this.formData.module.name == module.deviceLock.name || this.formData.module.name == module.deviceGateway.name :
      //                   access.module.device.Id :

      //                   this.formData.module.name == module.roomNoPrice.name || this.formData.module.name == module.roomPrice.name ||
      //                   this.formData.module.name == module.roomTypeNoPrice.name || this.formData.module.name == module.roomTypePrice.name?
      //                   access.module.room.Id :

      //                   access.module[this.formData.module.name].Id

      // if(this.$route.meta.formMode === this.$constant.formMode.update){
      //    this.hasAccess = await this.hasUpdateRole(accessId)
      //    if(!this.hasAccess){
      //       this.accessMessage= `You don't have access to Update <b>${this.$label.menu[this.formData.module.name]}</b>`
      //    }
      // }else{
      //    this.hasAccess = await this.hasCreateRole(accessId)
      //    if(!this.hasAccess){
      //       this.accessMessage= `You don't have access to Create <b>${this.$label.menu[this.formData.module.name]}</b>`
      //    }
      // }
   },
};
</script>

<style scoped>
.notHaveAccess{
    height: 100%;
    border-radius: 8px;
    background: white;
    padding-top: 100px;
}
.bg-form {
   display: flex;
   flex-direction: column;
   height: 100%;
}
.bg-form button{
   height: 36px !important;
}
.form-content {
   overflow: auto;
   flex-grow: 1;
}
.form-page {
   border-radius: 8px;
   background: var(--grey-50);
   padding: 12px;
   height: 100%;
}
.header-form {
   border-bottom: 1px solid var(--grey-600);
   padding-bottom: 10px;
   display: flex;
   align-items: center;
   margin-bottom: 24px;
   flex-shrink: 1;
}

</style>
