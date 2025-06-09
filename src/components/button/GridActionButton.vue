<template>
   <div v-click-outside="clickOutSide" class="grid-action-container" @click="open" :style="!params.data ? 'cursor:default;': ''"
      >
      <i class="fa fa-ellipsis-h" v-if="params.data" ref="gridAction" style="position: relative;"/>
   </div>
</template>
<script>
import Dialog from "primevue/dialog";
import { mapActions } from "vuex";
import { inject, onMounted } from "vue";

export default {
   components: {
      Dialog,
   },
   data() {
      return {
         isOpen: false,
         position: {
            x: 0,
            y: 0,
         },
         actionContainer: null,
         id: this.generateRandomUUID(),
      };
   },

   beforeDestroy() {
   
   },
   methods: {
      getLabel(item){
         if(item.getLabel){
            return item.getLabel(this.params.item.data)
         }
         return item.label
      },
      generateRandomUUID(length = 36) {
         const characters =
            "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
         const uuidArray = [];

         for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            uuidArray.push(characters[randomIndex]);
         }

         return uuidArray.join("");
      },
      open(event) {
         const exist = document.querySelector(
            `.grid-action-${this.id}`
         );

         if(!this.params.data || exist)
            return

         this.position.x = event.clientX; // Posisi X kursor
         this.position.y = event.clientY; // Posisi Y kursor
         var modalHTML = `
        <div
            class="grid-action-${this.id} item-container"
            style="
                  position: fixed; 
                  min-width: 110px;
                  top: ${this.position.y}px; 
                  visible:hidden;"
         >  
            ${this.params.showEdit ? '<div class="action-item" id="action-edit">'+ this.$label.action.edit + '</div>' : ''}
            ${this.params.showDelete ? '<div class="action-item" id="action-delete">'+ this.$label.action.delete + '</div>' : ''}
            ${
               this.actionContext && this.actionContext.length > 0
                  ? this.actionContext.map(
                          (item, i) => `<div class="action-item" id="action-${this.getLabel(item)}-${this.id}">${this.getLabel(item)}</div>`
                       )
                       .join("")
                  : ""
            }
         </div>
         `;

         if(this.$refs.gridAction && !this.endElement){
            this.$refs.gridAction.insertAdjacentHTML("beforeend", modalHTML);
         }
         else{
            document.body.insertAdjacentHTML("beforeend", modalHTML);
         }

         this.actionContainer = document.querySelector(
            `.grid-action-${this.id}`
         );
         if(this.$refs.gridAction && !this.endElement){
            // this.actionContainer.style.position = `absolute`;
            this.actionContainer.style.right = `80px`;
            // this.actionContainer.style.top = `0px`;
            this.actionContainer.style.visible = `visible`;
         }
         else{
            const rightPosition = window.innerWidth - this.position.x;
            this.actionContainer.style.right = `${rightPosition}px`;
            this.actionContainer.style.visible = `visible`;
         }


         var edit = document.querySelector(`#action-edit`);
         if(edit){
            edit.addEventListener("click", (event) => {
               event.stopPropagation();
               this.edit();
               console.log("click")
            });
         }

         var actionDelete = document.querySelector(`#action-delete`);
         if(actionDelete){
            actionDelete.addEventListener("click", async (event) => {
               event.stopPropagation();
               this.doDelete();
            });
         }

         if(!this.actionContext) return

         this.actionContext.forEach((context, index) => {
            this.$nextTick(() => {
               var action = document.getElementById(`action-${this.getLabel(context)}-${this.id}`);
                  if(action){
                        action.addEventListener("click", (event) => {
                           event.stopPropagation();
                           console.log(context)
                           console.log(this.params)
                           context.action(this.params.item.data);
                           this.clickOutSide()
                        });
                  }
            })
         });
           

            // document.addEventListener("click", this.clickOutSide);
         // }, 200);
      },
      clickOutSide(event) {
         // // console.log

         this.actionContainer = document.querySelector(
            `.grid-action-${this.id}`
         );

         if(!this.actionContainer || (event && event.srcElement && event.srcElement.parentElement == this.actionContainer)){
            return
         }

         if(this.$refs.gridAction && !this.endElement){
            this.$refs.gridAction.removeChild(this.actionContainer); // Hapus overlay
         }
         else{
            document.body.removeChild(this.actionContainer); // Hapus overlay
         }
      },
      async doDelete() {
         this.clickOutSide();
         
         if(!this.params.canDelete){
            this.$dialog.Alert.confirm({ title: 'Hapus Gagal', message: 'Anda tidak memiliki Akses' })
            return;
         }
         var confirm = await this.$dialog.Confirmation.confirm({
            title: "Konfirmasi",
            message: "Anda yakin akan menghapus data ini?",
         });
         if (confirm) {
            // console.log(this.params)
            this.$store
               .dispatch(
                  `${this.params.module.name}/delete`,
                  this.params.data.Id
               )
               .then((response) => {
                  this.$showToast.success(
                     `Success Delete ${
                        this.$label.menu[this.params.module.name]
                     }`,
                     ""
                  );

                  this.params.context.componentParent.refreshData();
                  // this.params.refreshList();
               })
               .catch((err) => {
                  console.log(err)
                  this.$showToast.error(
                     `Failed Delete ${
                        this.$label.menu[this.params.module.name]
                     }`,
                     err
                  );
               });
         }
      },
      edit() {
         this.clickOutSide();
         if(!this.params.canUpdate){
            this.$dialog.Alert.confirm({ title: 'Edit Gagal', message: 'Anda tidak memiliki Akses' })
            return;
         }

         if (this.params.openEditModal(this.params.data.Id)) {
            return;
         }
         let address = this.$constant.router[this.params.module.name]

         var paths = this.$constant.router[this.params.module.name].split('/')
         paths.forEach(path => {
            if(path && path.startsWith(':')){
               address = address.replace(path, this.$route.params[path.slice(1)])
            }
         });
         this.$router.push({
            path: `${address}/update/${
               this.params.data.Id
            }`,
         });
      },
      // ...mapActions(this.params.module.name, ['delete'])
   },
   props: {
      style: {
         type: String,
         default: "primary",
      },
      iconImg: {
         default: null,
      },
      iconFa: {
         default: null,
      },
      label: {
         type: String,
         default: "ok",
      },
      data: {},
      params: {},
      endElement: {default: true},
      // module:{},
      contexts: {},
   },
   setup(){
      const actionContext = inject('actionContext');

      return {
         actionContext
      }
   },

   mounted() {},
};
</script>
<style>
.action-grid {
   overflow: visible !important;
}
.grid-action-container .p-dialog-header {
   display: none !important;
}
.grid-action-container {
   position: relative;
   cursor: pointer;
   width: 100%;
   justify-content: center;
   align-items: center;
   display: flex;
   height: 100%;
}
.action-item {
   padding: 6px 16px;
   text-wrap: nowrap;
   cursor: pointer;
}
.action-item:hover {
   background: #00000014;
}
.item-container {
   position: absolute;
   background: white;
   z-index: 10000;
   border: 1px solid var(--grey-100);
   border-radius: 4px;
   box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
   font-weight: 500 !important;
   font-size: 14px !important;
   line-height: 16px !important;
   color: black !important;
   font-family: Inter;
}

.grid-action-container i{
   font-size: 28px;
   color: var(--grey-800);
}
</style>
