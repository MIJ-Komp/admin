<template>
    <div class="fadeIn" v-if="userHasRole" style="height: 100%; display: flex; flex-direction: column;">
      <b-row class="filter-container">
         <b-col cols="8" lg="10">
            <SelectModuleBox height="40" labelType="out" placeholder="Pilih property dahulu" :required="false" :disabled="userRole.RoleProperties.length == 1" :module="$module.property" label="Pilih Property" v-model="propertyId"/>
         </b-col>
         <b-col cols="4" lg="2" style="align-content: end">
            <Button iconFa="fa fa-refresh" label="Refresh" buttonType="secondary" @click="refresh"/>
         </b-col>
      </b-row>
      <div v-if="!propertyId" style="height: 100%; background: white; padding-top: 80px; text-align: center">Pilih Properti dahulu</div>
      <div class="content" v-if="propertyId && rooms">
         <Grid :module="$module.room"
            ref="grid"
            :dataSource="rooms"
            :showEdit="false"
            :showDelete="false"
            :showSearchBar="true"
            :showDefaultColumn="false"
            :canDelete="false"/>
         </div>
      </div>

    <div class="fadeIn" v-else style="height: 100%;">
        <div class="notHaveAccess text-center">You don't have access to view this page</div>
    </div>


    <Dialog class="dialog-status" v-model:visible="changeStatus.visible" modal :header="changeStatus.header" :style="{ width: '50vw' }" 
         :closable="false" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
         <div class="mt-3">{{ changeStatus.label }}</div>
         <TextArea label="Keterangan" class="mt-2" v-model="changeStatus.Description"/>
         <div class="actionButton mt-5">
          <Button buttonType="secondary" label="Cancel" id="no" @click="cancel"/>
          <Button label="Submit" id="yes" @click="submit"/>
      </div>
   </Dialog>

 </template>
 <script>
 import {mapActions, mapGetters} from 'vuex'
 import module from '../../constant/module'
 import { RoomStatus } from '../../constant/enums/RoomStatus';
 import accessModule from '../../constant/accessModule';
 import Dialog from 'primevue/dialog';
 import { provide, ref, onMounted, reactive } from "vue";

export default {
   setup(){
      var selectedRoom = ref(null)
      var isLoading= reactive(false)

      var changeStatus= reactive({
            visible: false,
            header: '',
            label: ',',
            Description: null
      })

      provide("actionContext", [
      {
            //  label: "Request Cleaning",
            getLabel: (data)=>{
               if(data.Status == RoomStatus.MAKE_UP_ROOM) return 'Cancel Request Cleaning'
               return 'Request Cleaning'
            },
            //  visible: async(data)=>{
            //    return data.Status != RoomStatus.MAKE_UP_ROOM
            //  },
            action: async (data) => {
               selectedRoom.value = data
               changeStatus.visible = true;
               changeStatus.label = `Anda akan Request Cleaning Kamar ${data.Name}`

               if(data.Status == RoomStatus.MAKE_UP_ROOM){
                  changeStatus.header = 'Cancel Request Cleaning';
                  changeStatus.Status = RoomStatus.SERVICE_REFUSED
                  changeStatus.label = `Anda akan Cancel Request Cleaning Kamar ${data.Name}`
               }
               else{
                  changeStatus.header = 'Request Cleaning';
                  changeStatus.Status = RoomStatus.MAKE_UP_ROOM
               }
            },
         },
         {
            label: "Early Checkout",
            action: async (data) => {
               selectedRoom.value = data
               changeStatus.header = 'Early Checkout';
               changeStatus.visible = true;
               changeStatus.label = `Anda akan mengubah status kamar ${data.Name} menjadi CheckOut`

               changeStatus.Status = RoomStatus.EARLY_CHECKOUT;
            },
         }
      ])

      const cancel = () => {
         changeStatus.visible = false;
         changeStatus.Description = null;
         selectedRoom.value = null
      }

      return {selectedRoom, changeStatus, cancel, isLoading}
   },
   
   components:{Dialog},
   watch: {
      propertyId:{
         immediate: true,
         handler(newVal){
            this.refresh()
         }
      }
   },
    methods: {
        ...mapActions(module.roomPrice.name, ["getAll", "updateStatus", "getOccupiedRooms"]),
        ...mapActions(module.user.name, ["hasViewRole", "getUserRole"]),

        async refresh(){
               if(this.onRefresh || !this.propertyId) return
                  this.onRefresh = true;

               this.rooms = (await this.getOccupiedRooms(
                  {propertyId : this.propertyId}
               )).filter(
                  data=> true || data.RoomStatuses.find(roomStatus => roomStatus.Status == RoomStatus.OCCUPIED)
               )

               this.onRefresh = false;
               if(this.$refs.grid)this.$refs.grid.refreshData()
        },
        submit(){
         if(this.isLoading) return
         this.isLoading = true
         this.updateStatus(
         {
            RoomId : this.selectedRoom.Id, 
            Status: this.changeStatus.Status,
            Description: this.changeStatus.Description
         }
         ).then(res=>{
            this.$showToast.success(`${this.changeStatus.header}`)
            this.refresh()
            this.cancel()
         })
         .catch(err=> this.$showToast.error(err))
         .finally(()=>{this.isLoading = false})
        }
    },
    async mounted () {
      this.refresh()

      this.$nextTick(async ()=>{
         if(!this.userRole){
            await this.getUserRole()
         }
         if(this.userRole.RoleProperties.length == 1){
            this.propertyId = this.userRole.RoleProperties[0].PropertyId
         }
         this.userHasRole = await this.hasViewRole(accessModule.module.booking.Id)
      })
    },
    computed:{
      ...mapGetters(module.user.name, ["userRole"]),
    },
    data() {
       return {
          onRefresh: false,
          propertyId: null,
          userHasRole: false,
          rooms: null,
       };
    },
 };
 </script>
 <style scoped>
.filter{
   display: flex;
   flex-shrink: 1;
}
.content{
   flex-grow: 1;
    overflow: auto;
    height: 100%;
}
.notHaveAccess{
    height: 100%;
    border-radius: 8px;
    background: white;
    padding-top: 100px;
}

.dialog-status  .actionButton{
  display: flex;
  justify-content: end;
}
.dialog-status  .actionButton .mij-button{
  width: 150px !important;
  margin-left: 20px;
}
</style>
 