<template>
   <div>
      <Field 
      :name="`${label} ${uniqId}`"
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
               ref="time-picker"
               class="w-100 h-100 font-body input"
               v-model="currentValue"
               :disabled="disabled"
               @input="field.validate"
               :required="required"
               :placeholder="placeholder"
               timeOnly
               showIcon
               fluid
               iconDisplay="input"
               inputId="icondisplay"
               :dateFormat="'HH:mm'"
               :stepMinute="stepMinute"
               showButtonBar
               @todayClick="today"
            />
            <label ref="label"
               v-if="label"
               :style="currentValue || modelValue? 'color: var(--blue-500) !important; margin-bottom: 8px;':''"
               :class="currentValue || modelValue? 'font-small' : errors[0]? 'text-danger': 'font-body'"
            >{{ label }} <span :class="disabled? '' :'text-danger'" v-if="required">*</span></label>
         </FloatLabel>

         <div v-else>
            <label ref="label"
               v-if="label"
               :style="currentValue || modelValue? 'color: var(--blue-500) !important; margin-bottom: 8px;':''"
               :class="currentValue || modelValue? 'font-small' : errors[0]? 'text-danger': 'font-body'"
            >{{ label }} <span :class="disabled? '' :'text-danger'" v-if="required">*</span></label>
            <DatePicker
               v-bind="field"
               @focus="onStatus('focus')"
               @mouseenter="onStatus('hover')"
               @mouseout="onStatus('normal')"
               @blur="onStatus('blur')"
               ref="time-picker"
               class="w-100 h-100 font-body input"
               v-model="currentValue"
               :disabled="disabled"
               @input="field.validate"
               :placeholder="placeholder"
               timeOnly
               showButtonBar
               :required="required"
               :class="`border-${errors[0] ? 'danger' : status}`"
               showIcon
               fluid
               iconDisplay="input"
               inputId="icondisplay"
               :dateFormat="'HH:mm'"
               :stepMinute="stepMinute"
               @todayClick="today"
            >
               <template #inputicon="slotProps">
                  <i class="pi pi-clock" @click="slotProps.clickCallback" />
               </template>
            </DatePicker>
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
import DatePicker from "primevue/datepicker";
import FloatLabel from "primevue/floatlabel";
import { Field, ErrorMessage } from "vee-validate";
export default {
   methods: {
      today(value){
         const minutes = value.getMinutes();
         console.log(this.stepMinute)
         const roundedMinutes = Math.round(minutes / this.stepMinute) * this.stepMinute; // Pembulatan ke kelipatan 30 menit

         // Atur waktu baru
         value.setMinutes(roundedMinutes);
         value.setSeconds(0);
         value.setMilliseconds(0);
         this.currentValue = value
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
         if (this.currentValue) return;
         setTimeout(() => {
            if (this.$refs["time-picker"]) {
               if(this.$refs.label){
                  this.$refs.label.classList.remove("font-body");
                  this.$refs.label.classList.remove("font-small");
               }
               switch (this.status) {
                  case "hover":
                     if(this.$refs.label)
                     this.$refs.label.classList.add("font-body");

                     if (this.$refs.iconFa)
                        this.$refs.iconFa.style.color =
                           "var(--grey-900) !important";
                     break;
                  case "focus":
                     if(this.$refs.label){
                        this.$refs.label.classList.add("font-small");
                        this.$refs.label.style.color =
                           "var(--blue-500) !important";
                     }

                     if (this.$refs.iconFa)
                        this.$refs.iconFa.style.color =
                           "var(--blue-500) !important";
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
         if (this.type == "email") rules += `email|`;
         return rules;
      },
   },
   mounted() {
      // this.isMounted = true;
   },
   watch: {
      currentValue: {
         immediate: true,
         handler(newVal) {
               if(this.isMounted && this.currentValue != this.modelValue){
                  if (this.$refs["time-picker"]) {
                     this.$refs["time-picker"].$emit("input", newVal);
                  }
               }
               this.$emit("update:modelValue", this.currentValue);

               if(newVal){
                  this.status = 'focus'
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
               try
               {
                  if(newVal && this.modelValue != this.currentValue){
                     const date = new Date(newVal)
                     if(!(date instanceof Date && !isNaN(date))){
                        var timeString = newVal.split(" ")
                        timeString = timeString.length > 0 ? timeString[timeString.length -1] : null

                        if(!timeString) { this.currentValue = null}

                        const today = this.$moment();

                        // Mengatur waktu pada objek moment
                        const timeWithDate = today.set({
                           'hours': this.$moment(timeString, 'HH:mm:ss').hours(),
                           'minutes': this.$moment(timeString, 'HH:mm:ss').minutes(),
                           'seconds': this.$moment(timeString, 'HH:mm:ss').seconds()
                        }).toDate();

                        this.currentValue = timeWithDate;
                     }
                     else{
                        this.currentValue = date;
                     }
                     
                     setTimeout(()=>{
                        if(this.$refs["time-picker"] && newVal){
                           this.$refs["time-picker"].$emit("input", this.currentValue)
                        }
                     }, 100)

                     this.isMounted= true
                  }
               }
               catch(err){
                  console.log(err)
                  // this.$showToast.error(`Value dari ${this.label} tidak valid`, newVal)
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
      stepMinute: { type: Number, required: false, default: 1 },
      labelType: { type: String, required: false, default: "in" },
      minLength: { type: Number, required: false, default: null },
      maxLength: { type: Number, required: false, default: null },
      dataSource: { type: Array, required: false, default: () => [] },
      optionLabel: { type: String, required: false, default: "name" },
      optionValue: { type: String, required: false, default: "id" },
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
      label: { type: String, default: "" },
      placeholder: { type: String, default: "" },

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
.input input::placeholder {
   font-size: 12px;
}
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
