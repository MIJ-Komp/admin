<template>
   <div>
      <Field :name="`${label} ${uniqId}`" 
         v-slot="{ field, errors }" :rules="schema">
         <FloatLabel
            v-if="labelType == 'in'"
            variant="in"
            class="date-box"
            :class="`border-${errors[0] ? 'danger' : status}`"
         >
            <i
               v-if="iconFa"
               class="iconLabel iconFa"
               ref="iconFa"
               :class="iconFa"
            />
            <img v-else-if="iconImg" class="iconLabel" :src="iconImg" />
            <DatePicker
               v-bind="field"
               @focus="onStatus('focus')"
               @mouseenter="onStatus('hover')"
               @mouseout="onStatus('normal')"
               @blur="onStatus('blur')"
               ref="date-picker"
               class="w-100 h-100"
               :selectionMode="selectionMode"
               :minDate="minDate"
               :maxDate="maxDate"
               v-model="currentValue"
               :disabled="disabled"
               @input="field.validate"
               :required="required"
               showIcon
               fluid
               iconDisplay="input"
               inputId="icondisplay"
               dateFormat="dd M yy"
            />
            <label
               ref="label"
               class="font-body"
               :class="errors[0] ? 'text-danger' : ''"
               >{{ label }}
               <span :class="disabled ? '' : 'text-danger'" v-if="required"
                  >*</span
               ></label
            >
         </FloatLabel>
         <div v-else style="display: flex; flex-direction: column">
            <label
               ref="label"
               :style="currentValue ? 'color: var(--blue-500);' : ''"
               :class="
                  currentValue
                     ? 'font-small'
                     : errors[0]
                     ? 'text-danger'
                     : 'font-body'
               "
               >{{ label }}
               <span :class="disabled ? '' : 'text-danger'" v-if="required"
                  >*</span
               ></label
            >
            <DatePicker
               :selectionMode="selectionMode"
               v-bind="field"
               @focus="onStatus('focus')"
               @mouseenter="onStatus('hover')"
               @mouseout="onStatus('normal')"
               @blur="onStatus('blur')"
               ref="date-picker"
               class="w-100 h-100"
               :minDate="minDate"
               :maxDate="maxDate"
               v-model="currentValue"
               :disabled="disabled"
               @input="field.validate"
               :required="required"
               :class="`border-${
                  errors[0] ? 'danger' : currentValue ? 'focus' : status
               }`"
               showIcon
               fluid
               iconDisplay="input"
               inputId="icondisplay"
               dateFormat="dd M yy"
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
import DatePicker from "primevue/datepicker";
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
         if (this.currentValue || this.labelType != "in") return;

         setTimeout(() => {
            if (this.$refs["date-picker"]) {
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
      DatePicker,
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
         if (this.minDate) rules += `minDate:${this.minDate}|`;
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
            if (this.isMounted) {
               if (this.currentValue && this.$refs["date-picker"]) {
                  this.$refs["date-picker"].$emit("input", this.currentValue);
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
            this.currentValue = newVal;
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
      minDate: { type: Date, required: false, default: null },
      maxDate: { type: Date, required: false, default: null },
      labelType: { type: String, required: false, default: "in" },
      minLength: { type: Number, required: false, default: null },
      maxLength: { type: Number, required: false, default: null },
      dataSource: { type: Array, required: false, default: () => [] },
      optionLabel: { type: String, required: false, default: "name" },
      optionValue: { type: String, required: false, default: "id" },
      selectionMode: {
         type: String,
         default: "single",
      },
      rules: {
         type: String,
         required: false,
         default: null,
      },
      modelValue: {
         type: String,
         required: false,
         default: null,
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
.p-inputtext {
   border: 0 !important;
}
.p-datepicker-panel {
   color: black !important;
   min-width: unset !important;
}
.p-inputtext {
   width: 100%;
}
.p-inputtext.p-variant-filled:enabled:focus,
.p-inputtext.p-variant-filled:enabled:hover {
   background: white !important;
   color: #1e1e1e;
}
.p-inputtext.p-variant-filled {
   background: white !important;
   color: #1e1e1e;
}
.p-password input {
   width: 100% !important;
   border: 0;
}
.p-inputtext:disabled {
   background: var(--grey-400) !important;
   border: 0 !important;
   color: black !important;
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
.date-box {
   height: 80px;
   position: relative;
}
.date-box .font-small {
   color: var(--blue-500);
}
.date-box .font-body {
   color: var(--grey-800);
}
</style>
