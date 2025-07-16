<template>
   <ListPage
      :module="$module.productBundle"
      :actions="actions"
   />
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
         actions:[
            {
               label : 'Bulk Update Product Items',
               buttonType: 'secondary',
               click: ($event)=>{
                  console.log($event)
               }
            }
         ]
      };
   },
};
</script>
