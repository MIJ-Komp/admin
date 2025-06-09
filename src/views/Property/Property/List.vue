<template>
   <ListPage :module="$module.property"  />
</template>
<script>
import { provide, ref, onMounted } from "vue";
import { useRouter } from 'vue-router'; // Import useRouter
import constant from '../../../constant/constant'

export default {
   setup() {
      const router = useRouter();

         provide("actionContext", [
            {
               label: "Manage Room",
               action: (data) => {
                  if (data.SetByRoomType) {
                     router.push({
                        path: constant.router.roomTypePrice.replace(
                           ":id",
                           data.Id
                        ),
                     });
                  } else {
                     router.push({
                        path: constant.router.roomTypeNoPrice.replace(
                           ":id",
                           data.Id
                        ),
                     });
                  }
               },
            },
         ])
      return{
      }
   },
   data() {
      return {
      };
   },
};
</script>
