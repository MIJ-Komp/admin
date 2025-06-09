<template>
   <ListPage :module="$module.propertyType" />
</template>
<script>
import { provide, ref, onMounted } from "vue";

export default {
   setup(){
      provide("actionContext", [
            // {
            //     label: 'Manage Room', action: (data) => {
            //         // console.log("manage room")
            //     }
            // },
      ])
   },
   data() {
      return {
      };
   },
};
</script>
