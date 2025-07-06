<template>
   <div class="menu-container fadeIn">
      <div class="header-menu">
         <b-row style="justify-content: end;">
            <b-col cols="12" lg="6" md="6">
                <Button @click="addMenu" :disabled="adding || selectedMenuId" label="+ New Menu" class="p-2"/>
            </b-col>
         </b-row>
      </div>
      <div class="item-menu" id="menus-container">
       <MenuItem v-for="(item, i) in menus" 
         :key="i" 
         :adding="adding"  
         :item="item"
         :selectedMenuId="selectedMenuId"
         @delete="deleteMenu(i)" 
         @refresh="refreshMenu"
         @updateSelectedMenu="updateSelectedMenu"/>
      </div>
   </div>
</template>
<script>
import { provide, ref, onMounted, readonly } from "vue";
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
         baseMenu:[],
         adding: false,
         selectedMenuId: null
      };
   },
   async created(){
     this.refreshMenu()
   },
   methods:{
      updateSelectedMenu(id){
         console.log(id)
         this.selectedMenuId = id
      },
      async refreshMenu(){
         this.baseMenu = await this.getAll()
         this.baseMenu = this.baseMenu.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
         this.menus = this.baseMenu.filter(data=> !data.parentId)
         this.menus.forEach(menu => {
            menu.children = this.getChild(menu.id)
         });
         this.adding = false
         this.$forceUpdate()
      },
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
         if(this.adding){return}
         this.adding = true
         this.menus.push({ name: null, children: [] });
         setTimeout(() => {
            var content = document.getElementById("menus-container");
            if(content){
               content.scrollTo({  top: content.scrollHeight, behavior: 'smooth' });
            }
         }, 50);
      },
      async deleteMenu(index) {
         if(this.menus[index].id){
            var confirm = await this.$dialog.Confirmation.confirm({
               title: "Konfirmasi",
               message: "Anda yakin akan menghapus data ini?",
            });
            if(!confirm) return
            this.delete(this.menus[index].id)
            .then((res)=>{
               this.$showToast.success('Success delete menu')
               this.refreshMenu()
            })
            .catch((err)=>{
               this.$showToast.error('Failed to delete menu',err)
            })
         }
         else{
             this.menus.splice(index, 1);
            this.refreshMenu()
         }
        
      },
      ...mapActions(module.menu.name, ["getAll","create", "getById", "update", "delete"]),
   }
};
</script>
<style>
.menu-container{
   background: white;
   padding: 12px;
   height: 100%;
   display: flex;
   flex-direction: column;
}
.header-menu{
   flex-shrink: 1;
   margin-bottom: 4px;
}
.item-menu{
   overflow: auto;
   flex-grow: 1;
}
</style>