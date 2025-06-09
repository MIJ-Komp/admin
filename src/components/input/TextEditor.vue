<template>
   <div class="text-editor">
      <Field
         :name="`${label} ${uniqId}`"
         v-slot="{ field, errors }"
         :type="type"
         :rules="schema"
      >
         <!-- <i v-if="iconFa" class="icon iconFa" ref="iconFa" :class="iconFa" />
        <img v-else-if="iconImg" class="icon" :src="iconImg"/> -->
         <label ref="label" class="font-body mb-2 label" v-if="label"
            >{{ label }}
            <span :class="disabled ? '' : 'text-danger'" v-if="required"
               >*</span
            ></label
         >
         <Editor
            v-bind="field"
            @focus="onStatus('focus')"
            @mouseenter="onStatus('hover')"
            @mouseout="onStatus('normal')"
            @blur="onStatus('blur')"
            ref="texteditor"
            :class="`border-${status}`"
            class="w-100"
            variant="filled"
            v-model="currentValue"
            editorStyle="height: 200px"
            :readonly="disabled"
            @input="field.validate"
            :modules="modules"
         >
            <template v-if="modules" v-slot:toolbar>
               <span class="ql-formats">
               </span>
            </template>
         <pre>{{ currentValue }}</pre>
         </Editor>
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
         <slot name="hints"></slot>
      </Field>
   </div>
</template>
<script>
import Editor from "primevue/editor";
import Button from "primevue/button";
import { Field } from "vee-validate";
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
         // console.log(this.status)
      },
      changeStatus() {
         // console.log(this.currentValue)
         if (this.currentValue) return;
         setTimeout(() => {
            if (this.$refs.texteditor) {
               this.$refs.label.classList.remove("font-body");
               this.$refs.label.classList.remove("font-small");
               switch (this.status) {
                  case "hover":
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
      Editor,
      Field,
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
   data() {
      return {
         isMounted: false,
         currentValue: "<p></p>",
         status: "normal",

         refId: `editor-box-identifier-${Math.ceil(Math.random() * 1000000)}`
      };
   },
   mounted() {
   },
   watch: {
      currentValue: {
         immediate: true,
         handler(newVal) {
            if(this.isMounted){
               if (this.$refs.texteditor) {
                  this.$refs.texteditor.$emit("input", newVal);
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
            this.currentValue = newVal;

            setTimeout(() => {
               if (this.$refs.texteditor && newVal) {
                  this.$refs.texteditor.$emit("input", newVal);
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
      modules: {
         type: Object,
         default: null
      }
   },
};
</script>

<style>
/* label:after {
    content: '';
    position: absolute;
    top: 5px;
    left: 5px;
    width: 20px;
    height: 20px;
    background: white;
  } */
/* input[type="checkbox"]:checked + label:after {
    background: var(--blue-500);
} */
.p-checkbox-box:after,
.p-checkbox-input:after,
.p-checkbox:after {
   background: white;
}
.p-checkbox-box,
.p-checkbox-input,
.p-checkbox {
   width: 24px !important;
   height: 24px !important;
   border-radius: 4px !important;
}
.p-editor-toolbar,
.p-editor .p-editor-content .ql-editor {
   background: white !important;
}
.label {
   color: #1e1e1e !important;
}
.p-editor {
   width: 100%;
}
.p-editor.p-variant-filled:enabled:focus,
.p-editor.p-variant-filled:enabled:hover {
   background: white;
   color: black;
}
.p-editor.p-variant-filled {
   background: white;
   color: black;
}
.p-password input {
   width: 100% !important;
   border: 0;
}
.p-editor:disabled {
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
/* .iconFa{
    font-size: 24px;
    color: var(--grey-700);
} */
/* .icon{
    width: 24px;
    height: 24px;
    object-fit: contain;
    position: absolute;
    right: 16px;
    top: calc(50% - 12px);
} */
.text-editor {
   /* height: 80px; */
   position: relative;
}
.text-editor .font-small {
   color: var(--blue-500);
}
.text-editor .font-body {
   color: var(--grey-800);
}
</style>
