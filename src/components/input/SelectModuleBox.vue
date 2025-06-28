<template>
   <div>
      <Field
         :name="`${label} ${uniqId}`"
         v-slot="{ field, errors }"
         :type="type"
         :rules="schema"
         class="select-container"
      >
         <FloatLabel
            v-if="labelType == 'in'"
            variant="in"
            class="select-box"
            :style="height ? `height:${height}px !important` : ''"
         >
            <i
               v-if="iconFa"
               class="iconLabel iconFa"
               ref="iconFa"
               :class="iconFa"
            />
            <img v-else-if="iconImg" class="iconLabel" :src="iconImg" />
            <Select
               v-bind="field"
               @focus="onStatus('focus')"
               @mouseenter="onStatus('hover')"
               @mouseout="onStatus('normal')"
               @blur="onStatus('blur')"
               ref="select"
               :class="`border-${
                  errors[0] ? 'danger' : currentValue ? 'focus' : status
               }`"
               class="w-100 h-100"
               variant="filled"
               v-model="currentValue"
               :placeholder="placeholder"
               :disabled="disabled"
               :options="sourceData"
               :optionLabel="optionLabel"
               :optionValue="optionValue"
               @input="field.validate"
               :type="type"
               :showClear="!this.required && !this.disabled"
            >
               <template #footer>
                  <!-- <div v-if="!sourceData || sourceData.length <= 0" style="padding: 14px;">Tidak Ada Data</div> -->
                  <div class="addButton" @click="createForm">
                     <i class="fa fa-plus" />
                     <div>{{ $label.action.create }}</div>
                  </div>
               </template>
            </Select>

            <label
               ref="label"
               class="font-body"
               style="display: flex"
               :class="errors[0] ? 'text-danger' : ''"
               >{{ label }}
               <span
                  style="margin-left: 4px"
                  :class="disabled ? '' : 'text-danger'"
                  v-if="required"
                  >*</span
               >
               <div style="font-size: 10px; margin-left: 4px" v-if="hasNew">
                  (new)
               </div></label
            >
         </FloatLabel>

         <div v-else>
            <label
               ref="label"
               class="font-body"
               style="display: flex"
               :class="errors[0] ? 'text-danger' : ''"
               >{{ label }}
               <span
                  style="margin-left: 4px"
                  :class="disabled ? '' : 'text-danger'"
                  v-if="required"
                  >*</span
               >
               <div style="font-size: 10px; margin-left: 4px" v-if="hasNew">
                  (new)
               </div></label
            >
            <Select
               v-bind="field"
               @focus="onStatus('focus')"
               @mouseenter="onStatus('hover')"
               @mouseout="onStatus('normal')"
               @blur="onStatus('blur')"
               ref="select"
               :class="`border-${
                  errors[0] ? 'danger' : currentValue ? 'focus' : status
               }`"
               class="w-100 h-100"
               variant="filled"
               :placeholder="placeholder"
               v-model="currentValue"
               :disabled="disabled"
               :options="sourceData"
               :optionLabel="optionLabel"
               :optionValue="optionValue"
               @change="field.validate"
               :type="type"
               :showClear="!this.required && !this.disabled"
            >
               <template #footer>
                  <!-- <div v-if="!sourceData || sourceData.length <= 0" style="padding: 14px;">Tidak Ada Data</div> -->
                  <div class="addButton" @click="createForm">
                     <i class="fa fa-plus" />
                     <div>{{ $label.action.create }}</div>
                  </div>
               </template>
            </Select>
         </div>

         <div
            v-if="errors[0]"
            class="text-danger d-flex align-i-center"
            style="margin-top: 10px"
         >
            <i
               class="fa fa-exclamation-circle pr-2"
               style="font-size: 13px; margin-right: 5px"
            />
            <div class="font-small">{{ errors[0] }}</div>
         </div>
      </Field>

      <Dialog
         class="select-module-dialog"
         v-if="formVisible"
         v-model:visible="formVisible"
         :closable="false"
         :showHeader="true"
         modal
         :header="$label.menu[module.name]"
         :style="{ width: '70vw' }"
         :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
      >
         <component :is="formModal" :showCancel="true" @cancel="doCancel" />
      </Dialog>
   </div>
</template>
<script>
import Select from "primevue/select";
import FloatLabel from "primevue/floatlabel";
import { Field, ErrorMessage } from "vee-validate";
import Dialog from "primevue/dialog";

export default {
   methods: {
      async doCancel(refresh) {
         try{
            this.formVisible = false;
            if (refresh) {
               let old = this.sourceData;

               this.sourceData = await this.$store.dispatch(
                  `${this.module.name}/getAll`,
                  this.queryParams
               );
               console.log(sourceData)
               const newData = this.sourceData
                  .filter(
                     (data) =>
                        !old.find(
                           (o) => o[this.optionValue] == data[this.optionValue]
                        )
                  )
                  .map((data) => {
                     data[this.optionLabel] = `${data[this.optionLabel]} (new)`;
                     return data;
                  });
               const oldData = this.sourceData.filter((data) =>
                  old.find((o) => o[this.optionValue] == data[this.optionValue])
               );

               if (newData.length > 0) {
                  this.hasNew = true;
               }
               this.sourceData = [...newData, ...oldData];
            }
         }
         catch(err){
            console.log(err)
            this.$showToast.error(err)
         }
      },
      async loadForm() {
         try {
            if (this.module.form) {
               const form = await this.module.form();
               this.formModal = form.default || form; // Pastikan mengakses `default` jika modul berbentuk objek
            }
         } catch (error) {
            console.error("Error loading form:", error);
         }
      },
      async createForm() {
         this.formVisible = true;
         await this.loadForm();
      },
      onStatus(status) {
         if (this.disabled || (status != "blur" && this.status == "focus")) {
            return;
         }
         if (status == "blur") {
            this.status = "normal";
         } else {
            this.status = status;
         }
      },
      capitalizeWords(sentence) {
         if (!sentence) return "";
         return sentence
            .split(" ").filter(data=> data)
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
      },
      changeStatus() {
         if (this.currentValue || this.labelType != "in") return;
         setTimeout(() => {
            if (this.$refs.select) {
               this.$refs.label.classList.remove("font-body");
               this.$refs.label.classList.remove("font-small");
               switch (this.status) {
                  case "hover":
                     this.$refs.label.classList.add("font-body");

                     if (this.$refs.iconFa)
                        this.$refs.iconFa.style.color =
                           "var(--grey-900) !important";
                     break;
                  case "focus":
                     this.$refs.label.classList.add("font-small");
                     this.$refs.label.style.color =
                        "var(--primary-color) !important";

                     if (this.$refs.iconFa)
                        this.$refs.iconFa.style.color =
                           "var(--primary-color) !important";
                     break;
                  default:
                     this.$refs.label.classList.add("font-body");
                     this.$refs.label.style.color =
                        "var(--grey-700) !important";

                     if (this.$refs.iconFa)
                        this.$refs.iconFa.style.color =
                           "var(--grey-700) !important";
                     break;
               }
            }
         }, 100);
      },
   },
   components: {
      Select,
      Dialog,
      FloatLabel,
      Field,
      ErrorMessage,
   },
   data() {
      return {
         currentValue: null,
         status: "normal",
         sourceData: [],
         formVisible: false,
         isMounted: false,
         formModal: null,
         hasNew: false,
      };
   },
   computed: {
      uniqId(){
         return this.$helper.GenerateRandomUUID(8)
      },
      schema() {
         if (this.rules) return this.rules;

         var rules = "";
         if (this.required) rules += "required|";
         if (this.minLength) rules += `minLength:${this.minLength}|`;
         if (this.maxLength) rules += `maxLength:${this.maxLength}|`;
         if (this.type == "email") rules += `email|`;
         return rules;
      },
   },
   mounted() {
      this.isMounted = true;
   },
   watch: {
      module: {
         immediate: true,
         async handler(newVal) {
            if (newVal) {
               try{
                     this.sourceData = await this.$store.dispatch(
                        `${this.module.name}/getAll`,
                        this.queryParams
                     );
                     if (this.haveAllOption) {
                        this.sourceData.unshift({
                           id: null,
                           name: `All ${this.capitalizeWords(this.module.name)}`,
                        });
                     }
                  }
                  catch(err){
                  console.log(err)
                  this.$showToast.error(err)
               }
            }
         },
      },
      currentValue: {
         immediate: true,
         handler(newVal) {
            if (newVal) {
               this.status = "focus";
            }
            if(this.isMounted){
               console.log(this.currentValue)
               if (this.$refs.select) {
                  this.$refs.select.$emit("input", newVal);
               }
               this.$emit("update:modelValue", this.currentValue);
               this.$emit("change:modelValue", this.currentValue);
            }
         },
      },
      status: {
         immediate: true,
         handler(newVal) {
            this.changeStatus();
         },
      },
      modelValue: {
         immediate: true,
         handler(newVal) {
            if(newVal != this.currentValue){
               this.currentValue = newVal;

               setTimeout(() => {
                  if (this.$refs.select && newVal) {
                     this.$refs.select.$emit("input", newVal);
                  }
               }, 100);
            }
            
            this.isMounted = true;
         },
      },
      disabled: {
         immediate: true,
         handler(newVal) {
            if (newVal) {
               this.status = "disabled";
            }
         },
      },
   },
   props: {
      module: { type: Object, required: false, default: () => {} },
      height: { type: Number, required: false, default: 30 },
      labelType: { type: String, required: false, default: "out" },
      minLength: { type: Number, required: false, default: null },
      maxLength: { type: Number, required: false, default: null },
      optionLabel: { type: String, required: false, default: "name" },
      optionValue: { type: String, required: false, default: "id" },
      haveAllOption: { type: Boolean, required: false, default: false },
      placeholder: { type: String, required: false, default: "" },
      rules: {
         type: String,
         required: false,
         default: null,
      },
      modelValue: {
         type: String,
         required: false,
         default: "",
      },
      label: {
         type: String,
         default: "",
      },

      required: {
         type: Boolean,
         default: true,
      },
      disabled: {
         type: Boolean,
         default: false,
      },
      type: {
         type: String,
         default: "text",
      },
      iconImg: {
         default: null,
      },
      iconFa: {
         default: null,
      },
   },
};
</script>

<style lang="scss">
.select-module-dialog .form-page {
   padding-top: 10px;
}
.select-module-dialog .p-dialog-content {
   width: 100% !important;
   padding: 0;
}
.select-module-dialog .p-dialog-header {
   border-bottom: 1px solid var(--grey-600);
   box-shadow: 0 0.8px 2px 0px var(--grey-600);
   z-index: 1;
}
.p-floatlabel-in .p-select-label {
   padding-top: 30px !important;
   //margin-top: 30px !important;
   overflow: auto;
   height: 100%;
   text-wrap: auto !important;
}
.addButton:hover {
   background: var(--blue-100);
}
.addButton i {
   font-size: 12px;
   margin-right: 10px;
}
.addButton {
   border-top: 1px solid var(--grey-800) !important;
   padding: 14px 12px;
   display: flex;
   color: var(--primary-color) !important;
   align-items: center;
   cursor: pointer;
}
.p-select-overlay {
   background: white !important;
   color: #1e1e1e;
}
.p-select {
   width: 100%;
   height: 30px !important;
}
.p-select.p-variant-filled:enabled:focus,
.p-select.p-variant-filled:enabled:hover {
   background: white !important;
   color: #1e1e1e;
}
.p-select.p-variant-filled {
   background: white !important;
   color: #1e1e1e;
}
.p-password input {
   width: 100% !important;
   border: 0;
}

.p-select:disabled {
   background: var(--grey-500) !important;
   border: 0 !important;
}
.p-floatlabel-in:has(input:focus) label,
.p-floatlabel-in:has(input.p-filled) label {
   color: var(--primary-color) !important;
}
.border-normal {
   border: 1px solid var(--grey-700) !important;
   border-radius: 4px;
}
.border-hover {
   border: 1px solid var(--grey-900) !important;
   border-radius: 4px;
}
.border-focus,
.p-filled {
   border: 1px solid var(--primary-color) !important;
   border-radius: 4px;
}
label.text-danger {
   color: var(--red-500) !important;
}
.border-danger {
   border: 1px solid var(--red-500) !important;
   border-radius: 4px;
}
.iconFa {
   font-size: 24px;
   color: var(--grey-700);
}
.iconLabel {
   width: 24px;
   height: 24px;
   object-fit: contain;
   position: absolute;
   right: 16px;
   top: calc(50% - 12px);
}
.select-box {
   max-height: 200px;
   height: auto !important;
   min-height: 30px !important;
   position: relative;
}
.select-container .font-small {
   color: var(--primary-color);
}
.select-container .font-body {
   color: var(--grey-800);
}
</style>
