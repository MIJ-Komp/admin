<template>
   <div class="filter-container">
      <b-row>
         <b-col lg="4" class="mt-2">
            <SelectBox :showClear="true" label="Status" :required="false" labelType="out" v-model="queryParams.status" :dataSource="statusOptions"/>
         </b-col>
         <b-col lg="4" class="mt-2" cols="5">
            <DateBox label="From Date" :required="false" labelType="out" v-model="queryParams.fromDate"/>
         </b-col>
         <b-col lg="3" class="mt-2" cols="5">
            <DateBox label="To Date" :required="false" labelType="out" v-model="queryParams.toDate"/>
         </b-col>
         <b-col cols="2" lg="1" style="align-content: end;">
            <Button iconFa="fa fa-refresh" @click="refresh"/>
         </b-col>
      </b-row>
   </div>
   <div style="margin-top: 8px; height: 100%;" class="content">
      <Grid
         ref="statusGrid"
         :showActionButton="false"
         :simpleAction="{
            Active: true,
            Header: 'Action',
         }"
         :module="$module.roomStatusHistory"
         :searchKeyword="searchKeyword"
         :queryParams="queryParams"
         :dataSource="listHistories"
         :showDefaultColumn="false"
      />
   </div>
   <StatusDetailModal
      :showPopUp="showStatusDetailModal"
      :statusData="statusData"
      @updatePopUp="updateStatusModalVisibility"
   />
</template>
<script>
import StatusDetailModal from "./StatusDetailModal.vue";
import { provide, ref, onMounted } from "vue";
import { AllRoomStatus } from "../../../../constant/enums/RoomStatus";
import module from '../../../../constant/module';
import { mapActions } from 'vuex';

export default {
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
   'queryParams.status':{
      immediate: true,
      handler(newVal){
         this.refresh()
      }
   }
  },
  created () {
   this.statusOptions = Object.keys(AllRoomStatus).map(data=> ({ Id: AllRoomStatus[data], Name: data, }))
  },
   setup(){
      var statusData = ref(null)
      var showStatusDetailModal = ref(false)

      provide("actionContext", [
         {
            Icon: "fa fa-eye",
            action: (data) => {
               statusData.value = data;
               showStatusDetailModal.value = true;
            },
         },
      ])
      return{
         statusData,
         showStatusDetailModal
      }
   },
   components: {
      StatusDetailModal,
   },
   data() {
      return {
         listHistories:[],
         searchKeyword: null,
         statusOptions: [],
         queryParams: {
            page: 1,
            limit: -1,
            roomId: this.$route.params.roomId,
            fromDate: new Date(),
            toDate: new Date(),
            status: null
         },
      };
   },
   methods: {
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
      updateStatusModalVisibility(status) {
         this.showStatusDetailModal = status;
      },
      ...mapActions(module.roomStatusHistory.name, ["getAll"])
   },
};
</script>
<style scoped>
.header {
   flex-shrink: 1;
}

.content {
   flex-grow: 1;
   overflow: auto;
   height: 100%;
}

.dashboard-container {
   display: flex;
   flex-direction: column;
}
.dashboard-container .content-container {
   overflow-x: hidden;
   flex-grow: 1;
   border-radius: 8px;
   background: white;
}
.filter-container {
   padding: 20px 24px;
   background: white;
   border-radius: 8px;
   box-shadow: 0 0.8px 2px 0px var(--grey-800);
   flex-shrink: 1;
}
</style>
