<template>
   <ListPage :module="$module.manualPin" :showEdit="false"/>
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
