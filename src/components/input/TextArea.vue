<template>
   <div class="input-container">
      <Field
         :name="`${label} ${uniqId}`"
         v-slot="{ field, errors }"
         :type="type"
         :rules="schema"
      >
         <FloatLabel
            variant="in"
            class="textarea-box"
            v-if="labelType == 'in'"
            :class="`border-${errors[0] ? 'danger' : status}`"
         >
            <i
               v-if="iconFa"
               class="iconLabel iconFa"
               ref="iconFa"
               :class="iconFa"
            />
            <img v-else-if="iconImg" class="iconLabel" :src="iconImg" />
            <TextArea
               v-bind="field"
               @focus="onStatus('focus')"
               @mouseenter="onStatus('hover')"
               @mouseout="onStatus('normal')"
               @blur="onStatus('blur')"
               ref="textarea"
               class="w-100 h-100"
               variant="filled"
               v-model="currentValue"
               :rows="rows"
               :disabled="disabled"
               @input="field.validate"
               :type="type"
            />
            <label
               ref="label"
               class="font-body"
               :style="currentValue || modelValue? 'color: var(--blue-500) !important; margin-bottom: 8px;':''"
               :class="currentValue || modelValue? 'font-small' : errors[0]? 'text-danger': 'font-body'"
               >{{ label }}
               <span :class="disabled ? '' : 'text-danger'" v-if="required"
                  >*</span
               ></label
            >
         </FloatLabel>
         <div v-else class="textarea-out">
            <label
               ref="label"
               class="font-body"
               :style="currentValue || modelValue? 'color: var(--blue-500) !important; margin-bottom: 8px;':''"
               :class="currentValue || modelValue? 'font-small' : errors[0]? 'text-danger': 'font-body'"
               >{{ label }}
               <span :class="disabled ? '' : 'text-danger'" v-if="required"
                  >*</span
               ></label
            >
            <TextArea
               v-bind="field"
               @focus="onStatus('focus')"
               @mouseenter="onStatus('hover')"
               @mouseout="onStatus('normal')"
               @blur="onStatus('blur')"
               ref="textarea"
               class="w-100 h-100 textarea-box"
               variant="filled"
               v-model="currentValue"
               :rows="rows"
               :disabled="disabled"
               @input="field.validate"
               :type="type"
            />
         </div>

         <div
            v-if="errors[0]"
            class="text-danger d-flex align-i-center"
            style="margin-top: 10px"
         >
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
import TextArea from "primevue/textarea";
import FloatLabel from "primevue/floatlabel";
import { Field, ErrorMessage } from "vee-validate";
export default {
   methods: {
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
      changeStatus() {
         if (this.currentValue) return;
         setTimeout(() => {
            if (this.$refs.textarea) {
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
                        "var(--blue-500) !important";

                     if (this.$refs.iconFa)
                        this.$refs.iconFa.style.color =
                           "var(--blue-500) !important";
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
      TextArea,
      FloatLabel,
      Field,
      ErrorMessage,
   },
   data() {
      return {
         currentValue: null,
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
      currentValue: {
         immediate: true,
         handler(newVal) {
            if(this.isMounted){
               if(newVal){
                  this.onStatus('focus')
               }
               if (this.$refs.textarea) {
                  this.$refs.textarea.$emit("input", newVal);
               }
               if (this.type == "number") {
                  this.currentValue = parseInt(newVal);
               }
               this.$emit("update:modelValue", this.currentValue);
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
                  if (this.$refs.textarea && newVal) {
                     this.$refs.textarea.$emit("input", newVal);
                  }
               }, 100);
               
               this.isMounted = true;
            }
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
      minLength: { type: Number, required: false, default: null },
      maxLength: { type: Number, required: false, default: null },
      rules: { type: String, required: false, default: null },
      labelType: { type: String, required: false, default: "out" },
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
      rows: {
         type: Number,
         default: 5,
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
textarea{
   font-size: 12px;
}
.p-textarea-overlay {
   background: white !important;
   color: #1e1e1e;
}
.p-textarea {
   width: 100%;
   margin-top: 35px;
   border: 0 !important;
   padding: 0 16px !important;
   background: var(--grey-50) !important;
   box-shadow: unset !important;
}
.p-textarea.p-variant-filled:enabled:focus,
.p-textarea.p-variant-filled:enabled:hover {
   background: white !important;
   color: #1e1e1e;
   // border: 0 !important;
}
.p-textarea.p-variant-filled {
   background: white !important;
   color: #1e1e1e;
}
.p-password input {
   width: 100% !important;
   border: 0;
}
.p-textarea:disabled, .border-disabled {
   background: var(--grey-300) !important;
   
}
.p-floatlabel-in:has(input:focus) label,
.p-floatlabel-in:has(input.p-filled) label {
   color: var(--blue-500) !important;
}
.border-normal, .border-disabled {
   border: 1px solid var(--grey-700) !important;
   border-radius: 4px;
}
.border-hover {
   border: 1px solid var(--grey-900) !important;
   border-radius: 4px;
}
.border-focus {
   border: 1px solid var(--blue-500) !important;
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
.TextArea-box {
   height: 80px;
   position: relative;
}
.TextArea-box .font-small {
   color: var(--blue-500);
}
.TextArea-box .font-body {
   color: var(--grey-800);
}
.input-container textarea {
   border: 0 !important;
}
.textarea-out .p-textarea {
   border: 1px solid var(--grey-700) !important;
   margin-top: 0px;
}
</style>
