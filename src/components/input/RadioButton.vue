<template>
   <div class="flex-row items-center" style="align-items: center; cursor: pointer;" @click="update()">
      <RadioButton
         v-model="model"
         :inputId="inputId"
         :name="name"
         :value="value"
         :disabled="disabled"
         class="ch-radiobutton"
      />
      <label :for="inputId" class="ml-2" style="cursor: pointer;">{{ label }}</label>
   </div>
</template>

<script>
import RadioButton from "primevue/radiobutton";

export default {
  methods: {
   update(){
      if(!this.disabled)
         this.model = this.value
   }
  },
   components: { RadioButton },
   props: {
      disabled: { type: Boolean, default: false },
      label: { type: String, default: null },
      inputId: { type: String, required: true },
      name: { type: String, default: "" },
      value: { type: String, default: "" },
      modelValue: [String, Number, Boolean],
   },
   emits: ["update:modelValue"],
   computed: {
      model: {
         get() {
            return this.modelValue;
         },
         set(value) {
            this.$emit("update:modelValue", value);
         },
      },
   },
};
</script>

<style>
.ch-radiobutton {
   margin-right: 16px;
}

.ch-radiobutton input {
   transform: scale(1.5) !important;
}
.p-radiobutton-checked .p-radiobutton-box {
   border-color: var(--blue-500) !important;
   background: var(--blue-500) !important;
}
.p-radiobutton-checked:not(.p-disabled):has(.p-radiobutton-input:hover)
   .p-radiobutton-box {
   border-color: var(--blue-500) !important;
   background: var(--blue-500) !important;
}
</style>
