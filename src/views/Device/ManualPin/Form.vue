<template>
   <ChForm
      :formData="formData"
      :createAction="doCreate"
      :updateAction="doUpdate"
      :showCancel="showCancel"
   >
      <b-row>
         <b-col cols="12" class="mt-3">
            <SelectModuleBox label="Pilih Kamar" v-model="form.RoomId" :module="$module.roomPrice" :dataSource="getRooms"/>
         </b-col>
         <b-col cols="12" lg="6" class="mt-3">
            <TextBox label="Name" v-model="form.Name" minLength="3"/>
         </b-col>
         
         <b-col cols="12" lg="6" class="mt-3">
            <TextBox label="PIN" type="number" v-model="form.PIN" minLength="6"/>
         </b-col>
         <div class="mt-4">Berlaku:</div>
         <b-col cols="12" lg="6" class="mt-2">
            <DateBox label="Dari Tangal" v-model="form.StartDate"/>
         </b-col>
         <b-col cols="12" lg="6" class="mt-2">
            <DateBox label="Sampai Tangal" v-model="form.EndDate" :minDate="form.StartDate"/>
         </b-col>
         <b-col cols="12" lg="6" class="mt-3">
            <TimePicker label="Dari Pukul" v-model="form.StartTime"/>
         </b-col>
         <b-col cols="12" lg="6" class="mt-3">
            <TimePicker label="Sampai Pukul" v-model="form.EndTime"/>
         </b-col>
        
      </b-row>
   </ChForm>
</template>
<script>
import module from "../../../constant/module";
import { mapActions, mapGetters } from "vuex";
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
         
         formData.PIN = formData.PIN.toString()

         formData.StartDate = this.$moment(formData.StartDate).format("YYYY-MM-DD")
         
         formData.EndDate = this.$moment(formData.EndDate).format("YYYY-MM-DD")

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
      ...mapActions(module.manualPin.name, ["create", "update", "getById"]),
   },
   computed:{
      ...mapGetters(module.user.name, ["userRole"]),
      getRooms(){
         if(this.userRole)
            return this.rooms.filter(data=> this.userRole.RoleProperties.find(role=> role.PropertyId == data.PropertyId))
         return []
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
            module: this.$module.manualPin,
         },
         rooms:[],
         roles:[],

         form: {
            RoomId: null,
            PIN: null,
            Name: null,
            StartDate: null,
            EndDate: null,
            StartTime: null,
            EndTime: null,
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
