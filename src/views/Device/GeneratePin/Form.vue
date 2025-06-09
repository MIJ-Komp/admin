<template>
   <ChForm
      :formData="formData"
      :createAction="doCreate"
      :updateAction="doUpdate"
      :showCancel="showCancel"
   >
      <b-row>
         <b-col cols="12" lg="10" class="mt-3">
            <SelectModuleBox label="For Role" v-model="form.RoleId" :module="$module.role"/>
         </b-col>
         <b-col cols="auto" lg="2" class="mt-3" style="align-content: center">
            <Switch label="Active?" v-model="form.IsActive"/>
         </b-col>
         <b-col cols="12" class="mt-3">
            <TextBox label="Name" v-model="form.Name"/>
         </b-col>
         
         <b-col cols="12" lg="6" class="mt-3">
            <DateBox label="From Date" v-model="form.StartDate" :required="false"/>
         </b-col>
         <b-col cols="12" lg="6" class="mt-3">
            <DateBox label="To Date" v-model="form.EndDate" :required="false"/>
         </b-col>
         <b-col cols="12" lg="6" class="mt-3">
            <TimePicker label="From Time" v-model="form.StartTime"/>
         </b-col>
         <b-col cols="12" lg="6" class="mt-3">
            <TimePicker label="To Time" v-model="form.EndTime"/>
         </b-col>
         <b-col cols="8" lg="4" class="mt-3" style="align-content: center">
               <Switch label="Always Update Pin?" v-model="form.AlwaysUpdatePin"/>
         </b-col>
         <b-col cols="5" lg="4" class="mt-3">
            <TextBox :min="1" type="number" label="Interval Generate (day)?" v-model="form.GenerateEvery"/>
         </b-col>
         <b-col cols="7" lg="4" class="mt-3">
         <TimePicker label="Generate On" v-model="form.GenerateOn" :stepMinute="60"/>
         </b-col>
      </b-row>

      <div style="border-top: 1px solid var(--grey-700);" class="mt-4 pt-4">Select Room And PIN</div>

      <div v-for="(room, i) in form.GeneratePinRooms" :key="room" class="mt-4">
         <b-row>
            <b-col cols="auto" style="align-content: center;">
               <i class="fa fa-trash text-danger font-h3" @click="deleteRoom(i)" v-if="form.RoleId && form.GeneratePinRooms.length > 1" style="cursor: pointer"/>
            </b-col>
            <b-col cols="6">
               <SelectBox :disabled="!form.RoleId" 
               :label="form.RoleId ? 'Select Room' :'Pilih role terlebih dahulu'" v-model="room.RoomId" :dataSource="getRooms"/>
            </b-col>
            <b-col>
               <TextBox :disabled="!form.RoleId" 
               :label="form.RoleId ? 'PIN (leave blank for automatic generation)' :'Pilih role terlebih dahulu'" 
               type="number" :required="false" v-model="room.PIN"/>
            </b-col>
         </b-row>
      </div>
      <b-row class="mt-4">
         <b-col cols="12">
            <Button label="+ Add Other Room" buttonType="secondary" @click.prevent="addRoom()" v-if="form.RoleId"/>
         </b-col>
      </b-row>
   </ChForm>
</template>
<script>
import module from "../../../constant/module";
import { mapActions } from "vuex";
export default {
   props: {
      showCancel: { type: Boolean, default: false },
   },
   methods: {
      async deleteRoom(id){
         const confirm = await this.$dialog.Confirmation.confirm({ title: 'Konfirmasi', message: `Anda yakin akan menghapus Room ini?` })
         if(confirm)
            this.form.GeneratePinRooms.splice(id, 1); 
      },
      getForm(){
         var formData = {...this.form}
         // console.log(formData)
         formData.StartTime = this.$moment(formData.StartTime).format("HH:mm:ss")
         formData.EndTime = this.$moment(formData.EndTime).format("HH:mm:ss")

         formData.GenerateOn = this.$moment(formData.GenerateOn).format("HH:mm:ss")

         if(formData.StartDate)
            formData.StartDate = this.$moment(formData.StartDate).format("YYYY-MM-DD")
         
         if(formData.EndDate)
            formData.EndDate = this.$moment(formData.EndDate).format("YYYY-MM-DD")

         formData.GeneratePinRooms.map(data=> {
            data.PIN ? {RoomId : data.RoomId, PIN: data.PIN} : {RoomId : data.RoomId}
         })

         return formData
      },
      doCreate() {
         return this.create(this.getForm());
      },
      doUpdate() {
         console.log("click")
         return this.update(this.getForm());
      },
      ...mapActions(module.roomPrice.name, ["getAll"]),
      ...mapActions(module.generatePin.name, ["create", "update", "getById"]),
      addRoom(){
         this.form.GeneratePinRooms.push(
               {
                     RoomId: null,
                     PIN: null
               }
         )
      }
   },
   computed:{
      getRooms(){
         var currentRole = this.roles.find(data=> data.Id == this.form.RoleId) 
         if(!currentRole) return []

         return this.rooms.filter(data=> currentRole.RoleProperties.find(role=> role.PropertyId == data.PropertyId))
      }
   },
   async created() {
      this.rooms = await this.getAll()
      this.roles = await this.$store.dispatch(`role/getAll`);
   },
   watch: {
   },
   data() {
      return {
         formData: {
            module: this.$module.generatePin,
         },
         rooms:[],
         roles:[],

         form: {
            RoleId: null,
            Name: null,
            StartDate: null,
            EndDate: null,
            StartTime: null,
            EndTime: null,
            AlwaysUpdatePin: true,
            GenerateEvery: 1,
            GenerateOn: null,
            IsActive: true,
            GeneratePinRooms: [
               {
                     RoomId: null,
                     PIN: null
               }
            ]
         },
      };
   },
   async mounted() {
      // // console.log(this.$route)
      if (this.$route.meta.formMode == this.$constant.formMode.update) {
         const tmpForm = await this.getById(this.$route.params.id);
         this.form = { ...tmpForm };
      }
   },
};
</script>
