<template>
   <div>
      <Field
         :name="`${label} ${uniqId}`"
         v-slot="{ field, errors }"
         :type="type"
         :rules="schema"
      >
         <FloatLabel variant="in" class="text-box" v-if="labelType == 'in'"
            :style="height ? `height:${height}px !important` : ''">
            <i
               v-if="iconFa"
               class="iconLabel iconFa"
               ref="iconFa"
               :class="iconFa"
            />
            <img v-else-if="iconImg" class="iconLabel" :src="iconImg" />
            <Password
               v-model="currentValue"
               toggleMask
               :disabled="disabled"
               v-bind="field"
               @focus="onStatus('focus')"
               @mouseenter="onStatus('hover')"
               @mouseout="onStatus('normal')"
               @blur="onStatus('blur')"
               ref="inputText"
               :class="`border-${errors[0] ? 'danger' : status}`"
               class="w-100 h-100"
               :placeholder="placeholder"
               v-if="type == 'password'"
               @input="field.validate"
               :value="currentValue"
               variant="filled"
            />
            <InputText
               v-else
               v-bind="field"
               @focus="onStatus('focus')"
               @mouseenter="onStatus('hover')"
               @mouseout="onStatus('normal')"
               @blur="onStatus('blur')"
               :placeholder="placeholder"
               ref="inputText"
               :class="`border-${errors[0] ? 'danger' : status}`"
               class="w-100 h-100"
               variant="filled"
               v-model="currentValue"
               :value="currentValue"
               :disabled="disabled"
               @input="field.validate"
               :type="type"
            />
            <label
               ref="label"
               v-if="label"
               :style="currentValue || modelValue? 'color: var(--primary-color) !important;':''"
               :class="currentValue || modelValue? 'font-small' : errors[0]? 'text-danger': 'font-body'"
               >{{ label }}
               <span :class="disabled ? '' : 'text-danger'" v-if="required"
                  >*</span
               >
            </label>

            <img :src="$assets.icons.pencilEdit" class="editButton" v-if="showEditButton" @click="()=>{$emit('editClicked')}"/>
         </FloatLabel>

         <div v-else style="display: flex; flex-direction: column;" class="text-box-label-out">
            <label ref="label"
               v-if="label"
               :style="currentValue || modelValue? 'color: var(--primary-color) !important;':''"
               :class="currentValue || modelValue? 'font-small' : errors[0]? 'text-danger': 'font-body'"
            >{{ label }} <span :class="disabled? '' :'text-danger'" v-if="required">*</span></label>

            <InputText
               :style="height ? `height:${height}px !important` : ''"
               v-bind="field"
               @focus="onStatus('focus')"
               @mouseenter="onStatus('hover')"
               @mouseout="onStatus('normal')"
               @blur="onStatus('blur')"
               :placeholder="placeholder"
               ref="inputText"
               :class="`border-${errors[0] ? 'danger' : status}`"
               class="w-100 h-100"
               variant="filled"
               v-model="currentValue"
               :value="currentValue"
               :disabled="disabled"
               @input="validate(field)"
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
import InputText from "primevue/inputtext";
import FloatLabel from "primevue/floatlabel";
import Password from "primevue/password";
import { Field, ErrorMessage } from "vee-validate";
export default {
   methods: {
      validate(field) {
         field.validate;
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
      changeStatus() {
         if (this.currentValue || this.modelValue) return;
         setTimeout(() => {
            if (this.$refs.inputText) {
               if(this.$refs.label){
                  this.$refs.label.classList.remove("font-body");
                  this.$refs.label.classList.remove("font-small");
               }
               switch (this.status) {
                  case "hover":
                     if(this.$refs.label){
                        this.$refs.label.classList.add("font-body");
                     }

                     if (this.$refs.iconFa)
                        this.$refs.iconFa.style.color =
                           "var(--grey-900) !important";
                     break;
                  case "focus":
                     if(this.$refs.label){
                        this.$refs.label.classList.add("font-small");
                        this.$refs.label.style.color =
                           "var(--primary-color) !important";
                     }

                     if (this.$refs.iconFa)
                        this.$refs.iconFa.style.color =
                           "var(--primary-color) !important";
                     break;
                  default:
                     if(this.$refs.label){
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
      InputText,
      FloatLabel,
      Password,
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
         if (this.required) rules += `required:${this.type}|`;
         if (this.minLength) rules += `minLength:${this.minLength}|`;
         if (this.maxLength) rules += `maxLength:${this.maxLength}|`;

         if (this.min) rules += `minMax:${this.min},${this.max}|`;
         if (this.max) rules += `minMax:${this.min},${this.max}|`;
         if (this.type == "email") rules += `email|`;
         if(this.mustStartWith) rules += `mustStartWith:${this.mustStartWith}|`
         return rules;
      },
   },
   mounted() {
      // this.onStatus("focus");
      // setTimeout(() => {
      //    this.onStatus("blur");
      // }, 100);
   },
   watch: {
      currentValue: {
         immediate: true,
         handler(newVal) {
            // // console.log(isMounted)
            // if(this.isMounted)
            // // console.log(newVal)
            if(this.isMounted){
               if(newVal){
                  this.onStatus('focus')
               }
               if (this.$refs.inputText) {
                  this.$refs.inputText.$emit("input", newVal);
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
            if(newVal && newVal != this.currentValue){
               this.currentValue = newVal.toString();

               setTimeout(() => {
                  if (this.$refs.inputText && newVal) {
                     this.$refs.inputText.$emit("input", newVal);
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
      height: { default: null, },

      showEditButton: { type: Boolean, required: false, default: false },
      min: { type: Number, required: false, default: null },
      max: { type: Number, required: false, default: null },
      mustStartWith: { type: String, required: false, default: null },
      minLength: { type: Number, required: false, default: null },
      maxLength: { type: Number, required: false, default: null },
      rules: { type: String, required: false, default: null, },
      modelValue: {
         type: [String, Number],
         required: false,
         default: "",
      },
      label: { type: String, default: "" },
      placeholder: { type: String, default: "" },
      labelType: {
         type: String,
         default: "out",
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

<style lang="scss" scoped>
.text-box .editButton {
   position: absolute;
    right: 10px;
    background: white;
    height: 30px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    top: calc(50% - 15px);
    justify-content: center;
    cursor: pointer;
}

.p-floatlabel label{
   top: 40%;
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
   color: var(--primary-color) !important;
}

.border-normal, .border-hover,.border-focus,
.p-filled,.border-danger {
   border-radius: 4px;
}

.border-normal {
   border: 1px solid var(--grey-700) !important;
}
.border-hover {
   border: 1px solid var(--grey-900) !important;
}
.border-focus,
.p-filled {
   border: 1px solid var(--primary-color) !important;
}
label.text-danger {
   color: var(--red-500) !important;
}
.border-danger {
   border: 1px solid var(--red-500) !important;
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
.text-box {
   height: 60px;
   position: relative;
}
.text-box-label-out{
   text-align: left;
}
.text-box-label-out .p-inputtext {
   height: 30px !important;
}
.text-box .font-small {
   color: var(--primary-color);
   margin: 0 !important;
}
.text-box .font-body {
   color: var(--grey-800);
}
</style>
