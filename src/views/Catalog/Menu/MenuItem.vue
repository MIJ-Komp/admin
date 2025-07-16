<template>
    <div class="menu-item">
      <span class="new-menu font-small" v-if="!item.id">*new</span>
  <li>
    <div>
    <b-row class="w-100">
      <b-col cols="12" lg="9" md="8" class="mt-2">
        <TextBox :disabled="!editing" label="Title" placeholder="New Menu" v-model="item.name"/>
        <TextBox :disabled="!editing" label="Path" placeholder="/mij-basic" v-model="item.path" class="mt-2"/>
        <Button v-if="item.id" :disabled="adding || (selectedMenuId && item.id != selectedMenuId)" @click="addMenuItems" style="height: 30px; width: 150px !important; height: 30px !important;" class="font-small mt-2 p-1" label="Add Category"/>
        
        <div v-if="item.id" class="mt-2 font-small">Product Categories :</div>
        <b-row v-if="item.id" class="ms-1 mt-1 p-1" v-for="(category, index) in item.menuItems">
          <b-col cols="8" class="p-1">
            <SelectModuleBox class="font-small" placeholder="select category" :module="$module.productCategory" v-model="category.productCategoryId" />
          </b-col>
          <b-col cols="2" class="p-1">
            <Button :disabled="adding || (selectedMenuId && item.id != selectedMenuId)" @click="cancelEditCategory(category, index)" buttonType="danger" style="height: 30px !important;" :label="category.id? 'delete': 'cancel'"/>
          </b-col>
          <b-col cols="2" class="p-1">
            <Button v-if="!category.id" :disabled="adding || (selectedMenuId && item.id != selectedMenuId)" @click="editCategory(category, index)" buttonType="secondary" style="height: 30px !important;" label="save"/>
          </b-col>
        </b-row>
      </b-col>
      <b-col class="mt-2" cols="12" lg="3" md="4">
        <div v-if="item.id">
          <b-row v-if="!editing" class="mt-1">
            <b-col cols=6 class="mt-1 p-1">
              <Button :disabled="adding || (selectedMenuId && item.id != selectedMenuId)" @click="editMenu" label="Edit" style="padding: 4px 8px;"></Button>
            </b-col>
            <b-col cols=6 class="mt-1 p-1">
              <Button :disabled="adding || (selectedMenuId && item.id != selectedMenuId)" buttonType="secondary" @click="addChild" label="+ Sub menu" style="padding: 4px 8px;"></Button>
            </b-col>
            <b-col cols="6" class="mt-1 p-1">
              <Button :disabled="adding || (selectedMenuId && item.id != selectedMenuId)" @click="$emit('delete')" buttonType="danger" label="delete" style="padding: 4px 8px;"></Button>
            </b-col>
         </b-row>
         <b-row v-else class="mt-1">
           <b-col cols="6" class="mt-1 p-1">
            <Button :disabled="adding || (selectedMenuId && item.id != selectedMenuId)" @click="cancelEdit" buttonType="danger" label="cancel" style="padding: 4px 8px;"></Button>
          </b-col>
           <b-col cols=6 class="mt-1 p-1">
            <Button :disabled="adding || (selectedMenuId && item.id != selectedMenuId)" @click="save()" label="save" style="padding: 4px 8px;"></Button>
          </b-col>
        </b-row>
        </div>
        
        <b-row v-else class="mt-3">
          <b-col class="mt-1 p-1">
            <Button @click="$emit('delete')" buttonType="danger" label="Cancel" style="padding: 4px 8px;"></Button>
          </b-col>
          <b-col class="mt-1 p-1">
            <Button @click="save()"  label="save" style="padding: 4px 8px;"></Button>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    </div>

    <!-- Render childs recursively -->
    <ul v-if="item.childs && item.childs.length">
      <MenuItem
        v-for="(child, index) in item.childs"
        :key="index"
        :item="child"
        :adding="adding"
         @delete="deleteChild(index)"
         @refresh="$emit('refresh')"
         @updateSelectedMenu="$emit('updateSelectedMenu', $event)"
      />
    </ul>
  </li>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import module from '../../../constant/module';

export default {
  name: 'MenuItem',
  props: {
    item: {},
    adding:{default: false},
    selectedMenuId: {default: null}
  },
  data(){
    return{
      editing: false
    }
  },
  watch:{
    item: {
         deep: true,
         immediate: true,
         handler(newVal) {
            this.editing = false
            if(newVal && !newVal.id){
              this.editing = true
            }
         }
    }
  },
  // async mounted(){
  //   this.editing = false
  //   await this.$nextTick()
  //   if(!this.item.id){
  //     this.editing = true
  //   }
  // },
  methods: {
    editMenu(){
      this.editing= true
      this.$emit('updateSelectedMenu', this.item.id)
    },
    async cancelEditCategory(category, index){
      if(category.id){
            var confirm = await this.$dialog.Confirmation.confirm({
               title: "Konfirmasi",
               message: "Anda yakin akan menghapus category ini?",
            });
            if(!confirm) return

            this.deleteItem(category.id)
            .then((res)=>{
               this.$showToast.success('Success delete menu items category')
               this.$emit('refresh')
            })
            .catch((err)=>{
               this.$showToast.error('Failed to delete menu items category',err)
            })
        }
        else{
            this.item.menuItems.splice(index, 1);
        }
    },
    editCategory(category, index){
      // if(!category.editing){
      //   this.item.menuItems[index].editing = true
      //   return
      // }
      // this.item.menuItems[index].editing = false
      if(category.id){

      }
      else{
        this.createMenuItem(category)
            .then((res)=>{
               this.$showToast.success('Success add menu items category')
               this.item.menuItems[index].editing = false
               this.$emit('refresh')
            })
            .catch((err)=>{
               this.$showToast.error('Failed to add menu items category',err)
        })
      }
    },
    addMenuItems(){
      this.item.menuItems.push(
        {
          menuId: this.item.id,
          productCategoryId : null
        }
      )
    },
    cancelEdit(){
      this.editing = false
      this.$emit('updateSelectedMenu', null)
      this.$emit('refresh')
    },
    addChild() {
      this.item.childs.push({
        name: null,
        parentId: this.item.id,
        childs: []
      });
    },
    async deleteChild(index) {
      if(this.item.childs[index].id){
            var confirm = await this.$dialog.Confirmation.confirm({
               title: "Konfirmasi",
               message: "Anda yakin akan menghapus data ini?",
            });
            if(!confirm) return
            this.delete(this.item.childs[index].id)
            .then((res)=>{
               this.$showToast.success('Success delete menu')
               this.$emit('refresh')
            })
            .catch((err)=>{
               this.$showToast.error('Failed to delete menu',err)
            })
         }
         else{
            this.item.childs.splice(index, 1);
            this.$emit('refresh')
         }

    },
    async save(){
      if(!this.item.name){
        this.$showToast.error("Title can not be empty")
        return
      }
      if(!this.item.path){
        this.$showToast.error("Path can not be empty")
        return
      }
        if(this.item.id){

        }
        else{
          this.create(this.item)
          .then((res)=>{
             this.$showToast.success('Success create menu')
            this.cancelEdit()
          })
          .catch((err)=>{
            this.$showToast.error('Failed to create menu',err)
          })
        }
    },
    ...mapActions(module.menu.name, ['create', 'getById', 'update', 'getAll', 'delete', 'createMenuItem', 'deleteItem']),
  },
  components: {
    // register self
    MenuItem: () => import('./MenuItem.vue')
  }
};
</script>

<style>
.menu-item li.level-0 > div {
  background-color: #f8f9fa !important;
}
.menu-item li.level-1 > div {
  background-color: #e0f7fa !important;
}
.menu-item li.level-2 > div {
  background-color: #ffe0b2 !important;
}
.menu-item li.level-3 > div {
  background-color: #f3e5f5 !important;
}
.menu-item ul {
  list-style-type: none;
  padding-left: 20px;
  margin: 0;
}

.menu-item li {
  list-style-type: none; 
  margin: 8px 0;
  position: relative;
}
.menu-item{
  position: relative;
}
.new-menu{
      position: absolute;
    z-index: 1;
    top: -4px;
    background: red;
    color: white;
    border-radius: 4px;
    padding: 2px;
    left: -4px;
}

.menu-item li > div {
  background-color: #f8f9fa;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #dee2e6;
  display: flex;
  justify-content: space-between;
  align-items: start;
  transition: background-color 0.2s ease;
}

.menu-item li > div:hover {
  background-color: #e9ecef;
}

</style>