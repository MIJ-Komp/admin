<template>
    <div class="switmij-container">
        <div v-if="label" style="margin-right: 10px;">{{ label }}</div>
        <ToggleSwitch v-model="checked" class="toggle-switch" :disabled="disabled">
          <template #handle="{ checked }">
              <span v-if="checked" style="margin-right: 64px;">Ya</span>
              <span v-else style="margin-left: 64px;">Tidak</span>
          </template>
        </ToggleSwitch>
    </div>
</template>

<script>

import ToggleSwitch from 'primevue/toggleswitch';

export default {
  watch: {
    modelValue:{
      immediate: true,
      handler(newVal) {
        this.checked= newVal
      }
    },
    value:{
      immediate: true,
      handler(newVal) {
        this.checked= newVal
      }
    },
    checked:{
      immediate: true,
      handler(newVal) {
        this.$emit("update:modelValue", newVal)
      }
    }
  },
  props: {
    label:{type:String, default: null},
    modelValue:{type:Boolean, default: false},
    value:{type:Boolean, default: false},
    disabled:{type:Boolean, default: false},
  },
  components:{ToggleSwitch},
  data () {
    return {
        checked: false
    }
  },
    
}
</script>
<style>
.toggle-switch{
    width: 80px;
    height: 30px;
}
.switmij-container{
    display: flex;
    flex-direction: row;
    align-items: center !important;
    justify-content: space-between;
}
.switmij-container .p-toggleswitch{
  width: 76px !important;
    height: 32px !important;
}
.switmij-container .p-toggleswitch .p-toggleswitch-handle{
  border: 0.5px solid black !important;
  background: var(--grey-700) !important;
  font-size: 14px;
}
.switmij-container .p-toggleswitch .p-toggleswitch-handle{
  inset-inline-start: 8px !important;
  font-size: 14px;
}

.switmij-container .p-toggleswitch-checked .p-toggleswitch-handle{
  inset-inline-start: calc(100% - 26px) !important;
  background: var(--blue-500) !important;
  font-size: 14px;
}
.switmij-container .p-toggleswitch-checked .p-toggleswitch-handle{
  margin-right: 0;
  color: black !important;
}
</style>