<template>
   <ListPage :module="$module.role" />
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
   data() {
      return {
      };
   },
};
</script>
