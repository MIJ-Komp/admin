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
        <Grid :module="$module.paymentHistory" 
            :queryParams="getFilter"
            ref="grid" 
            :autoSizeStrategy="'fitCellContents'"
            :showEdit="false"
            :showDelete="false"/>
    </div>

    <div v-if="!userHasRole" style="height: 100%;">
        <div class="notHaveAccess text-center">You don't have access to view this page</div>
    </div>
</template>
<script>
import access from '../../../constant/accessModule'
import module from '../../../constant/module'
import {mapActions, useStore} from 'vuex'
import { provide, ref, onMounted, inject } from "vue";


export default {
   components: {
   },
   setup() {
      const paymentModal = ref(null);

      const store = useStore();
      const dialog = inject("dialog")
      const showToast = inject("showToast")
      const grid = ref(null)

      onMounted(() => {
         provide("actionContext", [
            {
               label: "Pay Now",
               action: (data) => {
                  setTimeout(() => {
                     console.log(paymentModal.value)
                     if(paymentModal.value){
                        paymentModal.value.openModal(data)
                     }
                  }, 0);
               },
            },
            {
               label: "Cancel",
               action: async (data) => {
                  var confirm = await dialog.Confirmation.confirm({
                     title: `Konfirmasi Pembatalan ${data.Code ?? ''}`,
                     message: "Apakah Anda ingin Membatalkan Bookingan ini?",
                  });
                  if (!confirm) return;

                  store.dispatch('booking/cancel', data.Code).then(res=> {
                     showToast.success(`Canceled`)
                     grid.value.refreshData();
                  })
                  .catch(err=> showToast.error("Failed", err))
               },
            },
         ])
      })
      return{
         paymentModal, grid
      }
   },
   data() {
      return {
         showBookModal: false,
         bookData: null,
         userHasRole: false,
         transactionStatus:[
            {Id: 0, Name:'All'},
            {Id: 2, Name:'UnPaid'},
            {Id: 4, Name:'Paid'},
            {Id: 3, Name:'Expired'},
         ],
         filter:{
            fromDate: new Date(),
            toDate: new Date(),
            status: 0
         },
         waitingInput: null,
         showCancel: false
      };
   },
   computed:{
      getFilter(){
         return {
            fromDate : this.$moment(this.filter.fromDate).format("YYYY-MM-DD"),
            toDate : this.$moment(this.filter.toDate).format("YYYY-MM-DD"),
            status : this.filter.status == 0 ? null : this.filter.status,
         }
      }
   },
   watch: {
      '$refs.paymentModal':{
         handler(newVal){
            console.log(newVal)
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
      },
      'showCancel':{
        handler(newVal){
         if(newVal){
            console.log('showcancel', showCancel)
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
            this.$refs.grid.refreshData();
         }, 500);
      },
      ...mapActions(module.user.name, ["hasViewRole"]),
      updateBookModalVisibility(status) {
         this.showBookModal = status;
      },
   },
};
</script>

<style scoped>
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
