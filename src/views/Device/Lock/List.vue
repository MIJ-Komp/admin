<template>
   <ListPage 
      :module="$module.deviceLock" 
      :showCreate="false"
      :showDelete="false"
      :showEdit="false"
      :dataSource="lockList"
   >
      <template v-slot:buttons>
         <b-col class="mt-2" cols="4" lg="1" style="align-content: start;">
               <Button
                  label="Sync"
                  @click="startSyncLock()"
               />
         </b-col>
      </template>
   </ListPage>
</template>
<script>
import module from  '../../../constant/module'
import { mapActions } from 'vuex';
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
  async created () {
   this.lockList = await this.getLocks();
  },
  methods: {
   ...mapActions(module.property.name, ["getLocks", "syncLocks"]),
   async startSyncLock() {
      this.syncLocks().then(async (res) => {
         this.$showToast.success("Success", res)
         this.lockList = await this.getLocks();
      }).catch(err => {
         this.$showToast.error("Failed", err)
      });
   },
  },
   data() {
      return {
         lockList:[],
      };
   },
};
</script>
