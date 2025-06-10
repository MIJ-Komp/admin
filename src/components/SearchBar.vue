<template>
   <div class="searmij-container w-100">
      <b-row class="w-100 m-0">
         <b-col cols="12" 
            :lg="6 + (!showRefresh ? 2:0) + (!showDelete ? 2:0) + (!showCreate ? 2:0)"
            :md="6 + (!showRefresh ? 2:0) + (!showDelete ? 2:0) + (!showCreate ? 2:0)">
            <div >
               <span class="font-body">{{ $label.searchBar.label }}</span>
               <div class="input-container">
                  <i class="fa fa-search" />
                  <input
                     :placeholder="$label.searchBar.placeHolder"
                     v-model="currentValue"
                     class="font-body"
                     @keyup.enter="updateValue"
                     @input="updateValue"
                  />
               </div>
            </div>
         </b-col>
         <b-col class="mt-2" 
               :cols="!showDelete || !showCreate? 6 : 4" lg="2" md="2" style="align-content: end;" v-if="showRefresh">
               <!-- <Button label="View" buttonType="secondary" @click="updateValue"/> -->
               <Button
                  buttonType="secondary"
                  iconFa="fa fa-refresh"
                  label="refresh"
                  @click="refresh"
               />
         </b-col>
         <b-col class="mt-2" :cols="!showRefresh || !showCreate? 6 : 4" lg="2" md="2" style="align-content: end;" v-if="showDelete">
               <Button
                  :label="`${$label.action.delete} ${selectedItems && selectedItems.length > 0 ? '('+selectedItems.length+')':'' }`"
                  :buttonType="'danger'"
                  @click="actionDelete"
                  :iconFa="'fa fa-trash'"
               />
         </b-col>
         <b-col class="mt-2" :cols="!showDelete || !showRefresh? 6 : 4" lg="2" md="2" style="align-content: end;" v-if="showCreate">
               <Button
                  :label="$label.searchBar.addButton"
                  @click="openCreateModule"
               />
         </b-col>
         <slot name="buttons"></slot>
      </b-row>
   </div>
</template>
<script>
import { mapGetters } from "vuex";
import Module from "../constant/module";
export default {
   inject: ['openModal'],

   methods: {
      async refresh() {
         this.$emit("refreshList");
      },
      async actionDelete() {
         this.$emit("delete");
      },
      updateValue() {
         // // console.log(this.currentValue)
         clearTimeout(this.writing); // Hapus timeout sebelumnya
         this.writing = setTimeout(() => {
            this.$emit("update:modelValue", this.currentValue);
         }, 500);
      },
      openCreateModule() {
         if(!this.canCreate){
            this.$dialog.Alert.confirm({ title: 'Gagal', message: 'Anda tidak memiliki Akses' })
            return
         }
         if (this.simpleAdd) {
            if(this.openModal){
               this.openModal(null)
            }
            // this.$parent.openAddPopUp();
         } else {
            this.$router.push({ path: `${this.$route.path}/add` });
         }
      },
   },
   data() {
      return {
         currentValue: null,
         writing: null,
      };
   },
   mounted() {},
   watch: {
      modelValue: {
         immediate: true,
         handler(newVal) {
            this.currentValue = newVal;
         },
      },
   },
   props: {
      selectedItems: { default: null },
      canCreate: { type: Boolean, default: false },
      canUpdate: { type: Boolean, default: false },
      canDelete: { type: Boolean, default: false },

      showRefresh: { type: Boolean, default: true },
      showCreate: { type: Boolean, default: true },
      modelValue: {
         type: String,
         required: false,
         default: "",
      },
      module: {
         type: Object,
         required: true,
         default: () => {},
      },
      showDelete: {
         type: Boolean,
         default: true,
      },
      simpleAdd: {
         type: Boolean,
         default: false,
      },
   },
   computed: {
      title() {
         // // console.log(this.$route)
         return this.$route.name;
      },
      ...mapGetters(Module.user.name, ["user"]),
      // ...mapState('user' ['user', 'message'])
   },
};
</script>

<style scoped>
.searmij-container button{
   height: 32px !important;
   font-size: 12px !important;
}
.font-button{
   font-size: 12px !important;
}

.input-container {
   margin-top: 12px;
   border-radius: 8px;
   background: var(--grey-50);
   border: 1px solid var(--grey-900);
   display: flex;
   height: 32px;
}
.input-container input {
   height: auto;
   width: 100%;
   border-radius: 8px;
   background: white;
}

.input-container i {
   color: var(--blue-500);
   font-size: 14px;
   padding: 8px;
   margin-right: 8px;
}
.searmij-container {
   padding: 8px 0;
   background: var(--grey-50);
   display: flex;
   align-items: end;
   justify-content: space-between;
}
.actionButton {
   display: flex;
   height: 56px;
}
.actionButton .mij-button {
   width: 130px !important;
   text-wrap-mode: nowrap;
   align-items: center;
}
@media screen and (max-width: 800px) {
   /* .header-container{ */
   /* padding: 20px; */
   /* height: auto; */
   /* } */
}
input:focus {
   outline: none; /* Menghapus outline default */
}
</style>
