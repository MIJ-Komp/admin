<template>
   <div class="menu-container fadeIn">
      <Button @click="addMenu" label="+ New Menu"/>
       <MenuItem v-for="(item, i) in menus" :key="i" :item="item" @delete="deleteMenu(i)"/>
   </div>
</template>
<script>
import { provide, ref, onMounted } from "vue";
import MenuItem from "./MenuItem.vue";
import { mapActions } from "vuex";
import module from "../../../constant/module";
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
         ], 
         baseMenu:[]
      };
   },
   async created(){
     this.baseMenu = await this.getAll()
     this.baseMenu = this.baseMenu.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
     this.menus = this.baseMenu.filter(data=> !data.parentId)
     this.menus.forEach(menu => {
        menu.children = this.getChild(menu.id)
     });
   },
   methods:{
      getChild(parentId){
        return this.baseMenu.filter(data=> data.parentId == parentId).map(data=>{
            var hasChild = this.baseMenu.find(data=> data.parentId == data.id)
            if(hasChild){
                data.children = this.getChild(data.id)
            }
            return data
        })
      },
      addMenu() {
         this.menus.push({ name: 'Menu Baru', children: [] });
      },
      deleteMenu(index) {
         this.menus.splice(index, 1);
      },
      ...mapActions(module.menu.name, ["getAll","create", "getById", "update"]),
   }
};
</script>
<style>
.menu-container{
   background: white;
   padding: 12px;
}
</style>