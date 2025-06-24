<template>
   <div>
      <Field
         :name="`${label} ${uniqId}`"
         v-slot="{ field, errors }"
         :rules="schema"
      >
         <div v-if="labelType == 'in'">
            <FloatLabel
               variant="in"
               class="select-box"
               :style="height ? `height: ${height}px !important` : ''"
            >
               <i
                  v-if="iconFa"
                  class="iconLabel iconFa"
                  ref="iconFa"
                  :class="iconFa"
               />
               <img v-else-if="iconImg" class="iconLabel" :src="iconImg" />
               <Select
                  v-if="!multiSelect"
                  v-bind="field"
                  @focus="onStatus('focus')"
                  @mouseenter="onStatus('hover')"
                  @mouseout="onStatus('normal')"
                  @blur="onStatus('blur')"
                  ref="select-box"
                  :class="`border-${errors[0] ? 'danger' : currentValue ? 'focus' : status} ${
                     !label ? 'noLabel' : ''
                  }`"
                  class="w-100 h-100 font-body"
                  variant="filled"
                  v-model="currentValue"
                  :disabled="disabled"
                  @input="validate(field)"
                  @change="validate(field)"
                  @update="validate(field)"
                  :required="required"
                  :options="dataSource"
                  :optionLabel="optionLabel"
                  :optionValue="optionValue"
                  :editable="editable"
                  :showClear="showClear ? true : false"
               />
               <MultiSelect
                  v-else
                  filter
                  id="multi-select"
                  ref="select-box"
                  variant="filled"
                  :class="`border-${errors[0] ? 'danger' : currentValue ? 'focus' : status} ${
                     !label ? 'noLabel' : ''
                  }`"
                  class="w-100 h-100 font-body"
                  v-model="currentValue"
                  v-bind="field"
                  @input="validate(field)"
                  @change="validate(field)"
                  @update="validate(field)"
                  :disabled="disabled"
                  :required="required"
                  :options="dataSource"
                  :optionLabel="optionLabel"
                  :optionValue="optionValue"
                  :editable="editable"
                  :maxSelectedLabels="3"
                  showClear
               />
               <i
                  class="fa fa-times deleteButton"
                  v-if="showDeleteIcon && currentValue"
                  @click="deleteAction"
               />
               <label
                  v-if="label"
                  ref="label"
                  class="font-body"
                  :style="currentValue || modelValue? 'color: var(--blue-500) !important; margin-bottom: 8px;':''"
                  :class="currentValue || modelValue? 'font-small' : errors[0]? 'text-danger': 'font-body'"
                  >{{ label }}
                  <span :class="disabled ? '' : 'text-danger'" v-if="required"
                     >*</span
                  >
               </label>
            </FloatLabel>
         </div>
         <div v-else class="h-100">
            <label
               v-if="label"
               ref="label"
               class="font-body"
               style="display: flex;"
               :style="currentValue || modelValue? 'color: var(--blue-500) !important; margin-bottom: 8px;':''"
               :class="currentValue || modelValue? 'font-small' : errors[0]? 'text-danger': 'font-body'"
               >{{ label }} <span style="margin-left: 4px;" :class="disabled ? '' : 'text-danger'" v-if="required">*</span> 
               <div style="font-size: 10px; margin-left: 4px;" v-if="hasNew">(new)</div>
            </label>
            <Select
               v-if="!multiSelect"
               v-bind="field"
               @focus="onStatus('focus')"
               @mouseenter="onStatus('hover')"
               @mouseout="onStatus('normal')"
               @blur="onStatus('blur')"
               ref="select-box"
               :class="`border-${errors[0] ? 'danger' : currentValue ? 'focus' : status} ${
                  !label ? 'noLabel' : ''
               }`"
               class="w-100 h-100 font-body"
               variant="filled"
               v-model="currentValue"
               :placeholder="placeholder ? placeholder : `Pilih ${label}`"
               :disabled="disabled"
               @input="validate(field)"
               @change="validate(field)"
               @update="validate(field)"
               :required="required"
               :options="dataSource"
               :optionLabel="optionLabel"
               :optionValue="optionValue"
               :editable="editable"
               :showClear="showClear ? true : false"
            />
            <MultiSelect
               v-else
               filter
               ref="select-box"
               :placeholder="placeholder ? placeholder : `Pilih ${label}`"
               id="multi-select"
               variant="filled"
               :class="`border-${errors[0] ? 'danger' : currentValue ? 'focus' : status} ${
                  !label ? 'noLabel' : ''
               }`"
               class="w-100 h-100 font-body"
               v-model="currentValue"
               v-bind="field"
               @input="validate(field)"
               @change="validate(field)"
               @update="validate(field)"
               :disabled="disabled"
               :required="required"
               :options="dataSource"
               :optionLabel="optionLabel"
               :optionValue="optionValue"
               :editable="editable"
               :maxSelectedLabels="3"
               showClear
            />
         </div>
         <div v-if="errors[0]" class="text-danger d-flex align-i-center">
            <i
               class="fa fa-exclamation-circle pr-2"
               style="font-size: 18px; margin-right: 5px"
            />
            <div class="font-small">{{ errors[0] }}</div>
         </div>
      </Field>
   </div>
</template>

<script>
import Select from "primevue/select";
import MultiSelect from "primevue/multiselect";
import FloatLabel from "primevue/floatlabel";
import { Field, ErrorMessage } from "vee-validate";

export default {
   methods: {
      validate(field) {
         if (this.isMounted) {
            field.value = this.currentValue;
            field.validate;
         }
      },
      deleteAction() {
         // this.currentValue = null;
         this.$emit("deleteAction");
      },
      onStatus(status) {
         if (this.disabled || (status !== "blur" && this.status === "focus")) {
            return;
         }
         this.status = status === "blur" ? "normal" : status;
      },
      changeStatus() {
         if (this.currentValue || this.labelType != "in") return;

         setTimeout(() => {
            if (this.$refs["select-box"]) {
               if (this.$refs.label) {
                  this.$refs.label.classList.remove("font-body");
                  this.$refs.label.classList.remove("font-small");
               }
               switch (this.status) {
                  case "hover":
                     if (this.$refs.label)
                        this.$refs.label.classList.add("font-body");
                     if (this.$refs.iconFa)
                        this.$refs.iconFa.style.color =
                           "var(--grey-900) !important";
                     break;
                  case "focus":
                     if (this.$refs.label)
                        this.$refs.label.classList.add("font-small");
                     this.$refs.label.style.color =
                        "var(--blue-500) !important";
                     if (this.$refs.iconFa)
                        this.$refs.iconFa.style.color =
                           "var(--blue-500) !important";
                     break;
                  default:
                     if (this.$refs.label) {
                        this.$refs.label.classList.add("font-body");
                        this.$refs.label.style.color =
                           "var(--grey-700) !important";
                     }
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
      MultiSelect,
      FloatLabel,
      Field,
      ErrorMessage,
   },
   data() {
      return {
         currentValue: this.multiSelect ? [] : null,
         status: "normal",
         isMounted: false,
      };
   },
   computed: {
      uniqId(){
         return this.$helper.GenerateRandomUUID(8)
      },
      schema() {
         if (this.rules) return this.rules;

         let rules = "";
         if (this.required) rules += "required|";
         if (this.minLength) rules += `minLength:${this.minLength}|`;
         if (this.maxLength) rules += `maxLength:${this.maxLength}|`;
         if (this.type === "email") rules += "email|";
         return rules;
      },
      uniqueSelectId() {
         return `select-identifier-${Math.ceil(Math.random() * 1000000)}`;
      },
   },
   mounted() {
      // this.isMounted = true;
   },
   watch: {
      currentValue: {
         immediate: true,
         handler(newVal) {
            if(this.isMounted){
               if(newVal){
                  this.onStatus('focus')
               }
               setTimeout(() => {
                  if (this.$refs["select-box"]) {
                     this.$refs["select-box"].$emit("input", newVal);
                  }
               }, 100)
               this.$emit('change', newVal);
               this.$emit("update:modelValue", this.currentValue);
            }
         },
      },
      status: {
         immediate: true,
         handler() {
            this.changeStatus();
         },
      },
      modelValue: {
         immediate: true,
         handler(newVal) {
            this.currentValue = newVal;
            
            setTimeout(() => {
               if (this.$refs["select-box"] && newVal) {
                  this.$emit('change', newVal);
                  this.$refs["select-box"].$emit("input", newVal);
               }
            }, 100);

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
      showClear:{type: Boolean, default: false},
      editable:{type: Boolean, default: false},
      showDeleteIcon: { type: Boolean, required: false, default: false },
      height: { type: Number, default: 70 },
      minLength: { type: Number, default: null },
      maxLength: { type: Number, default: null },
      dataSource: { type: Array, default: () => [] },
      optionLabel: { type: String, default: "Name" },
      optionValue: { type: String, default: "Id" },
      rules: { type: String, default: null },
      modelValue: { type: [Number, Array, String], default: null },
      label: { type: String, default: "" },
      labelType: { type: String, default: "in" },
      placeholder: { type: String, default: "" },
      required: { type: Boolean, default: true },
      disabled: { type: Boolean, default: false },
      type: { type: String, default: "text" },
      iconImg: { default: null },
      iconFa: { default: null },
      multiSelect: { type: Boolean, default: false },
   },
};
</script>

<style lang="scss">
.select-box .deleteButton {
   position: absolute;
   width: 40px;
   right: 1px;
   background: white;
   height: calc(100% - 18px);
   border-radius: 8px;
   display: flex;
   align-items: center;
   top: 1px;
   justify-content: center;
   cursor: pointer;
}
.noLabel .p-select-label {
   padding: 0.75em !important;
}
.p-select-option {
   color: #1e1e1e !important;
}
.p-select-option:not(.p-select-option-selected):not(.p-disabled).p-focus {
   background: var(--light-blue-100) !important;
   color: black !important;
}
.p-select-option.p-select-option-selected {
   background: var(--light-blue-600) !important;
   color: black !important;
}
.p-select-option.p-select-option-selected.p-focus {
   background: var(--light-blue-500) !important;
   color: black !important;
}
.p-select-overlay {
   background: white !important;
   color: #1e1e1e;
}
.p-select {
   width: 100%;
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
   color: var(--blue-500) !important;
}
.border-normal {
   border: 1px solid var(--grey-700) !important;
   border-radius: 8px;
}
.border-hover {
   border: 1px solid var(--grey-900) !important;
   border-radius: 8px;
}
.border-focus,
.p-filled {
   border: 1px solid var(--blue-500) !important;
   border-radius: 8px;
}
label.text-danger {
   color: var(--red-500) !important;
}
.border-danger {
   border: 1px solid var(--red-500) !important;
   border-radius: 8px;
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
   position: relative;
}
.select-box .font-small {
   color: var(--blue-500);
}
.select-box .font-body {
   color: var(--grey-800);
}
</style>
