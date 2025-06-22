<template>
   <div class="menu-container fadeIn">
      <Button @click="addMenu" label="+ New Menu"/>
       <MenuItem v-for="(item, i) in menus" :key="i" :item="item" @delete="deleteMenu(i)"/>
   </div>
</template>
<script>
import { provide, ref, onMounted } from "vue";
import MenuItem from "./MenuItem.vue";
export default {
   components: {
      MenuItem
   },
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
         menus: [
         {
            name: 'Dashboard',
            children: []
         },
         {
            name: 'Produk',
            children: [
               {
               name: 'Elektronik',
               children: [
                  { name: 'HP', children: [] },
                  { name: 'Laptop', children: [] }
               ]
               }
            ]
         }
         ]
      };
   },
   methods:{
      addMenu() {
         this.menus.push({ name: 'Menu Baru', children: [] });
      },
      deleteMenu(index) {
         this.menus.splice(index, 1);
      }
   }
};
</script>
<style>
.menu-container{
   background: white;
   padding: 12px;
}
</style>
