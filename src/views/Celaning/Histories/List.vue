<template>
   <div class="header">
      <b-row>
         <b-col cols="6" lg="4">
            <DateBox :required="false" v-model="filter.fromDate" label="Dari Tanggal" labelType="out"/>
         </b-col>
         <b-col cols="6" lg="4">
            <DateBox :minDate="filter.fromDate" :required="false" v-model="filter.toDate" label="Sampai Tanggal" labelType="out"/>
         </b-col>
         <b-col cols="10" lg="3">
            <SelectBox :required="false" v-model="filter.status" label="Status" :dataSource="transactionStatus" labelType="out"/>
         </b-col>
         <b-col cols="2" lg="1" style="align-content: flex-end;">
            <Button iconFa="fa fa-refresh" @click="refresh" height="40px"/>
         </b-col>
      </b-row>
   </div>
   <div style="margin-top: 8px" class="content" v-if="userHasRole">
        <Grid :module="$module.cleaningHistories" 
            :queryParams="getFilter"
            ref="grid" 
            :autoSizeStrategy="'fitCellContents'"
            :showDefaultColumn="false"
            :showEdit="false"
            optionId="SessionId"
            :showDelete="false"/>

            <Dialog
               class="cleaning-histories-dialog"
               modal
               :header="`Cleaning Detail`"
               v-model:visible="openDetail"
               style="width: 50vw"
               :pcCloseButton="true"
               :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
            >
               <div class="w-100 text-center" style="height: 50vh; align-content: center" v-if="selectedData == null">
                  <b-spinner style="width: 50px; height: 50px;"/>
               </div>

               <div v-else>
                  <b-row class="room-information">
                     <b-col cols="12" lg="5" class="mt-2">Property Name</b-col>
                     <b-col cols="12" lg="6" class="mt-2 ms-2">: <b>{{ selectedData.PropertyName }}</b></b-col>

                     <b-col cols="12" lg="5" class="mt-2">Room Name</b-col>
                     <b-col cols="12" lg="6" class="mt-2 ms-2">: <b>{{ selectedData.RoomName }}</b></b-col>

                     <b-col cols="12" lg="5" class="mt-2">AssignOn</b-col>
                     <b-col cols="12" lg="6" class="mt-2 ms-2">: <b>{{ selectedData.AssignOn }}</b></b-col>


                     <b-col cols="12" lg="5" class="mt-2">Start Cleaning On</b-col>
                     <b-col cols="12" lg="6" class="mt-2 ms-2">: <b>{{ selectedData.ProgressOn }}</b></b-col>


                     <b-col cols="12" lg="5" class="mt-2">Finished On</b-col>
                     <b-col cols="12" lg="6" class="mt-2 ms-2">: <b>{{ selectedData.CompleteOn }}</b></b-col>


                     <b-col cols="12" lg="5" class="mt-2">Cleaning Duration</b-col>
                     <b-col cols="12" lg="6" class="mt-2 ms-2">: <b>{{ selectedData.TotalDuration }}</b></b-col>
                  </b-row>
                  <div class="font-h4">Kondisi Awal : {{ selectedData.ProgressOn }}</div>
                  <Camera 
                     v-model="selectedData.StartCondition.CleaningSessionImages"
                     :value="selectedData.StartCondition.CleaningSessionImages"
                     :disabled="true"
                  />
                  <TextArea label="Keterangan" :disabled="true" :required="false" v-model="selectedData.StartCondition.Description"/>
                  
                  <div class="font-h4 mt-4">Kondisi Akhir : {{ selectedData.CompleteOn }}</div>
                  <Camera 
                     v-model="selectedData.EndCondition.CleaningSessionImages"
                     :value="selectedData.EndCondition.CleaningSessionImages"
                     :disabled="true"
                  />
                  <TextArea label="Keterangan" :disabled="true" :required="false" v-model="selectedData.EndCondition.Description"/>
               </div>
            </Dialog>
    </div>
    <div v-if="!userHasRole" style="height: 100%;">
        <div class="notHaveAccess text-center">You don't have access to view this page</div>
    </div>
</template>
<script>
import access from '../../../constant/accessModule'
import Dialog from 'primevue/dialog';
import module from '../../../constant/module'
import {mapActions, useStore} from 'vuex'
import {CleaningType} from '../../../constant/enums/RoomStatus'
import { provide, inject, reactive, computed, ref, watch } from "vue";
import moment from 'moment'
export default {
   components: { Dialog },
   setup() {
      const store = useStore();

      var openDetail = ref(false)
      var selectedData = ref(null)

      const showToast = inject("showToast")
      var filter = reactive({
            fromDate: new Date(),
            toDate: new Date(),
            status: 0
      })

      const getFilter= computed(()=>{
         return {
            fromDate : moment(filter.fromDate).format("YYYY-MM-DD"),
            toDate : moment(filter.toDate).format("YYYY-MM-DD"),
            status : filter.status == 0 ? null : filter.status,
         }
      })
      
      // watch(openDetail, (newVal) => {
      //    console.log(newVal);
      //    if (!newVal) {
      //       selectedData.value = null; // akses `value` untuk ref
      //    }
      // }, { immediate: true });
      provide("actionContext", [
      {
            label: "View Detail",
            action: async (data) => {
               openDetail.value = true
               selectedData.value = null

               const temp = await store.dispatch('cleaningHistories/getAll', Object.assign(getFilter.value, {sessionId : data.SessionId}))
               if(temp.length > 0){
                  selectedData.value = temp[0]
                  selectedData.value.StartCondition = selectedData.value.CleaningSessions.find(data=> data.Status == CleaningType.START)
                  selectedData.value.EndCondition = selectedData.value.CleaningSessions.find(data=> data.Status == CleaningType.FINISH)

                  selectedData.value.StartCondition.CleaningSessionImages = selectedData.value.StartCondition.CleaningSessionImages.map(data=> data.ImageId)
                  selectedData.value.EndCondition.CleaningSessionImages = selectedData.value.EndCondition.CleaningSessionImages.map(data=> data.ImageId)
               }
               else{
                  showToast.error("Cleaning Session Id tidak ditemukan")
               }
            },
         },
      ])
      return{
         openDetail, selectedData, filter, getFilter
      }
   },
   data() {
      return {
         showBookModal: false,
         bookData: null,
         userHasRole: false,
         transactionStatus:[
            {Id: 0, Name:'All'},
            {Id: 1, Name:'Assigned'},
            {Id: 2, Name:'In Progress'},
            {Id: 3, Name:'Completed'},
         ],
         waitingInput: null
      };
   },
   computed:{
   },
   watch: {
      openDetail:{
         immediate: true,
         handler(newVal){
            if(!newVal){
               this.selectedData = null
            }
         }
      },
      'filter.fromDate':{
        handler(newVal){
         if(newVal){
            if(newVal > this.filter.toDate)
               this.filter.toDate = this.filter.fromDate
            this.refresh()
         }
        }
      },
      'filter.toDate':{
        handler(newVal){
         if(newVal){
            this.refresh()
         }
        }
      },
      'filter.status':{
        handler(newVal){
         if(newVal){
            this.refresh()
         }
        }
      }
   },
   async mounted(){
      this.userHasRole = await this.hasViewRole(access.module.booking.Id)
   },
   methods: {
      refresh(){
         clearTimeout(this.waitingInput); 
         this.waitingInput = setTimeout(() => {
            this.$refs.grid.refreshData()
         }, 500);
      },
      ...mapActions(module.user.name, ["hasViewRole"]),
      ...mapActions(module.cleaningHistories.name, ["getAll"]),
      updateBookModalVisibility(status) {
         this.showBookModal = status;
      },
   },
};
</script>

<style scoped>
.cleaning-histories-dialog .p-dialog-header{
   border-bottom: 1px solid var(--grey-600);
   box-shadow: 0 0.8px 2px 0px var(--grey-600);
   z-index: 1;
}

.room-information{
   margin-bottom: 16px;
   padding-bottom: 8px;
   border-bottom: 1px solid var(--grey-700);
}

.notHaveAccess{
    height: 100%;
    border-radius: 8px;
    background: white;
    padding-top: 100px;
}
.header {
    flex-shrink: 1;
    background: white;
    padding: 20px;
    border-radius: 8px;
}

.content {
    flex-grow: 1;
    overflow: auto;
    height: 100%;
}</style>
