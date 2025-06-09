<template>
   <ListPage :module="$module.paymentType" />
</template>
<script>
import { provide, ref, onMounted } from "vue";

export default {
   setup() {
      provide("actionContext", 
      [
         // {
         //    label: "Customer Detail",
         //    action: () => {},
         // },
      ])
   },
}
</script>
