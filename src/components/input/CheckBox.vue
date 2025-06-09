<template>
   <div class="flex-row items-center">
      <Checkbox
         v-model="currentData"
         :value="currentData"
         :inputId="uniqueCheckId"
         :name="label"
         :disabled="disabled"
         @change="$emit('change', currentData)"
         binary
         class="ch-checkbox"
      />
      <label :for="uniqueCheckId" style="margin-left: 16px" v-if="label">
         {{ label }}
      </label>
   </div>
</template>
<script>
import Checkbox from "primevue/checkbox";
export default {
   data() {
      return {
         currentData: false,
         isMounted: false
      };
   },
   props: {
      label: { type: String, required: false, default: null },
      modelValue: { type: Boolean, required: false, default: false },
      disabled: { type: Boolean, default: false },
      checked: { type: Boolean, default: false },
   },
   components: { Checkbox },
   computed: {
      uniqueCheckId() {
         return `check-box-identifier-${Math.ceil(Math.random() * 1000000)}`;
      },
   },
   mounted() {
      this.isMounted = true;
   },
   watch: {
      currentData: {
         handler(newVal) {
            if(this.isMounted){
               this.$emit("update:modelValue", this.currentData);
               // this.$emit("change", this.currentData);
            }
         },
         immediate: true,
      },
      checked: {
         immediate: true,
         handler(newVal) {
            // console.log(newVal, this.label)

            this.currentData = newVal;
         },
      },
      modelValue: {
         immediate: true,
         handler(newVal) {
            if(newVal != null){
               this.currentData = newVal;
            }
         },
      },
   },
};
</script>
<style scoped>
.ch-checkbox {
   /* margin-right: 16px; */
}
.ch-checkbox input {
   transform: scale(3) !important;
}
</style>
