<template>
   <div class="filter-container">
      <b-row>
         <b-col>
            <DateBox
               label="From Date"
               :required="false"
               labelType="out"
               v-model="queryParams.fromDate"
            />
         </b-col>
         <b-col>
            <DateBox
               label="To Date"
               :required="false"
               :endOfDay="true"
               labelType="out"
               v-model="queryParams.toDate"
            />
         </b-col>
      </b-row>
   </div>
   <div style="margin-top: 8px; height: 100%;" class="content">
      <Grid
         ref="statusGrid"
         :showActionButton="false"
         :module="$module.roomLockHistory"
         :searchKeyword="searchKeyword"
         :queryParams="queryParams"
         :keepLoading="true"
         :ignoreSearch="true"
         :dataSource="listHistories"
      />
   </div>
</template>
<script>
import { provide, ref, onMounted } from "vue";
import module from '../../../../constant/module';
import { mapActions } from 'vuex';
export default {
  methods: {
   ...mapActions(module.roomLockHistory.name, ["getAll"]),
   async refresh(){
         try{
            const requestData = Object.assign(this.queryParams, {
               fromDate : this.$moment(this.queryParams.fromDate).format('yyyy-MM-DD'),
               toDate : this.$moment(this.queryParams.toDate).format('yyyy-MM-DD'),
            })
            this.listHistories = await this.getAll(requestData)

            if(this.$refs.statusGrid){
               this.$refs.statusGrid.refreshData()
            }
         }
         catch(err){
            this.$showToast.error(err)
         }
      },
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
         listHistories:[],

         queryParams: {
            roomId: this.$route.params.roomId,
            fromDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
            toDate: new Date(),
         },
         searchKeyword: "",
      };
   },
   watch: {
      'queryParams.fromDate':{
         immediate: true,
         handler(newVal){
            if(newVal){
               this.refresh()
            }
         }
      },
      'queryParams.toDate':{
         immediate: true,
         handler(newVal){
            if(newVal){
               this.refresh()
            }
         }
      },
      queryParams: {
         handler() {
            this.searchKeyword = null;
            setTimeout(() => {
               this.searchKeyword = "";
            }, 1);
         },
         deep: true,
      },
   },
};
</script>
