<template>
   <MIJForm :formData="formData"
   :createAction="doCreate"
   :updateAction="doUpdate"
   :showCancel="showCancel"
      @cancel="$emit('cancel')"
   >
      <b-row>
         <b-col>
            <FileInput v-model="form.ImageId"/>
         </b-col>
      </b-row>
      <b-row class="mt-4">
         <b-col cols="12">
            <TextBox label="Nama Properti" v-model="form.Name" placeholder="input nama" :minLength="8"/>
         </b-col>
      </b-row>
      <b-row class="mt-4">
         <b-col cols="12">
            <SelectModuleBox
               label="Tipe Properti"
               :module="$module.productCategory"
               v-model="form.PropertyTypeId"
            />
         </b-col>
      </b-row>
      <b-row class="mt-4">
         <b-col cols="12">
            <SelectModuleBox
               label="Dikelola Oleh"
               :module="$module.user"
               v-model="form.HostedBy"
            />
         </b-col>
      </b-row>
      <b-row class="mt-4">
         <b-col cols="12">
            <TextArea
               label="Alamat"
               v-model="form.Address"
               :minLength="3"
            />
         </b-col>
      </b-row>
      <b-row class="mt-4">
         <b-col cols="12">
            <CheckBox
               :disabled="isFormUpdate"
               label="Set Harga Kamar pada Properti berdasarkan Tipe Kamar"
               v-model="form.SetByRoomType"
               :checked="form.SetByRoomType"
            />
         </b-col>
      </b-row>
      <b-row>
         <b-col lg="4" class="mt-4">
            <SelectBox
               ref="country"
               height="80"
               label="Negara"
               :dataSource="countries"
               v-model="form.CountryId"
               :placeholder="'Pilih Negara'"
            />
         </b-col>
         <b-col lg="4" class="mt-4">
            <SelectBox
               ref="city"
               height="80"
               :label="!form.CountryId ? 'Pilih Negara terlebih dahulu':'Pilih Provinsi'"
               :dataSource="provinces"
               :editable="true"
               v-model="form.ProvinceId"
               :disabled="!form.CountryId"
            />
         </b-col>
         <b-col lg="4" class="mt-4">
            <SelectBox
               ref="city"
               height="80"
               :label="!form.ProvinceId ? 'Pilih Provinsi terlebih dahulu':'Pilih Kota'"
               :dataSource="cities"
               :editable="true"
               v-model="form.CityId"
               :disabled="!form.ProvinceId"
            />
         </b-col>
      </b-row>
      <b-row class="mt-4">
         <b-col cols="12">
            <div class="flex-row jc-spaceBetween align-i-center">
               <div>Pilih Lokasi pada peta:</div>
               <Button @click="resetLocation" type="reset" buttonType="secondary" label="Reset Lokasi" style="width: fit-content !important; padding: 6px 16px !important"/>
            </div>
            <div class="mt-3 m-2">
               <GoogleMap
                  api-key="AIzaSyB6hONBS6eje4FuBEqVKGbDq2IJnYcVdXk"
                  style="width: 100%; height: 400px"
                  :center="center"
                  :zoom="15"
                  @click="setLocation"
               >
                  <Marker v-if="marker" 
                     :options="marker" />
               </GoogleMap>
            </div>
         </b-col>
      </b-row>
      
      <b-row class="mt-4">
         <b-col cols="12">
            <TextEditor :required="false" label="Description" v-model="form.Description" :value="form.Description"/>
         </b-col>
      </b-row>
      <b-row class="mt-4">
         <b-col cols="12">
            <MultiSelectModuleBox
               label="Fasilitas Properti"
               :module="$module.product"
               v-model="form.PropertyFacilities"
            />
         </b-col>
      </b-row>
      <b-row class="mt-4">
         <b-col cols="12">
            <div style="border-bottom: 1px solid black; padding-bottom: 10px;">Informasi Tambahan</div>
            <div v-for="info in getInformations()" :key="info">
               <SelectBox
                  label="Jenis Informasi"
                  class="mt-4"
                  :dataSource="informationTypes"
                  v-model="info.Type"
                  :required="false"
                  @deleteAction="deleteInformations(info)"
                  :showDeleteIcon="true"
               />
               <div v-if="info.Type == 1" style="padding: 20px;">
                  <div v-for="(faq, i) in getFaq()" :key="faq">
                     <div class="font-body">FAQ - {{ i+1 }}</div>
                     <div class="faq-card">
                        <TextBox label="Pertanyaan" placeholder="Type here" labelType="out" v-model="faq.Question"/>
                        <TextBox class="mt-3" label="Jawaban" placeholder="Type here.." labelType="out" v-model="faq.Answer"/>
                     </div>
                  </div>
                  <div class="font-button button-add-faq" @click="addFaq">+ Add more question</div>
               </div>
               <div v-if="info.Type == 3" class="mt-3">
                  <TextEditor :required="false" v-model="info.Description"/>
               </div>
               <div v-if="info.Type == 2" style="padding: 20px;">
                  <b-row>
                     <b-col cols="6">
                        <TimePicker :required="false" label="Check-in" placeholder="Dari Pukul" labelType="out" v-model="info.CheckInStart"/>
                     </b-col>
                     <b-col cols="6">
                        <TimePicker :required="false" label="Check-in" placeholder="Sampai Pukul" labelType="out" v-model="info.CheckInEnd"/>
                     </b-col>
                  </b-row>
                  
                  <TimePicker :required="false" class="mt-3" label="Check-out" placeholder="Pilih pukul" labelType="out" v-model="info.CheckOut"/>
               </div>
            </div>
            <div
               v-if=" getInformations().length > 0 &&
                  getInformations()[getInformations().length - 1].Type &&
                  getInformations().length < 3
               "
               class="mt-3"
            >
               <b-row>
                  <b-col cols="auto">
                     <Button
                        buttonType="secondary"
                        label="+ Add More Informations"
                        style="padding: 7px 10px"
                        @click="addInformations"
                     />
                  </b-col>
               </b-row>
            </div>
         </b-col>
      </b-row>
   </MIJForm>
</template><script>
import { mapActions } from "vuex";
import module from "../../../constant/module";
import { GoogleMap, Marker } from 'vue3-google-map'

const google = window.google

export default {
   props: {
      showCancel: { type: Boolean, default: false },
   },
   components:{
      GoogleMap, Marker
   },
   created() {},

   data() {
      return {
         formData: {
            module: this.$module.property,
         },
         provinces: [],
         cities: [],
         countries: [],
         map: null,
         form: {
            Name: null,
            Address: null,
            PropertyTypeId: null,
            ProvinceId: null,
            CityId: null,
            Status: true,
            Description: null,
            SetByRoomType: false,
            Latitude: null,
            Longitude: null,
            HostedBy: null,
            ImageId: null,

            Faqs: [],
            // InformationTypes: [],

            OtherInfos: [],
            PropertyFacilities: [],
         },
         informations: [{ Type: null }],
         informationTypes: [
            { Id: 1, Name: "Frequently Asked Question (FAQ)" },
            { Id: 3, Name: "Kebijakan Lainnya" },
            { Id: 2, Name: "Prosedur Check-In" },
         ],
         center:null,
         isFormUpdate: false
      };
   },
   computed: {
      marker(){
         if(this.form.Latitude && this.form.Longitude){
            return { position: {lat: parseFloat(this.form.Latitude), lng: parseFloat(this.form.Longitude)} }
         }
         else return null
      }
   },
   async mounted() {
      this.countries = await this.getAllCountries();
      // console.log(this.provinces)

      if (this.$route.meta.formMode == this.$constant.formMode.update) {
         this.isFormUpdate = true

         const tmpForm = await this.getById(this.$route.params.id);
         this.form = Object.assign(this.form, tmpForm);
         console.log(this.form)
         this.form.PropertyTypeId = parseInt(this.form.PropertyTypeId) 

         if(this.form.PropertyOtherInfos && this.form.PropertyOtherInfos.length > 0){
            this.form.OtherInfos = [...this.form.PropertyOtherInfos]
            this.form.OtherInfos.map(data=>{
               if(data.Type ==2){
                  // let [hoursStart, minutesStart, secondsStart] = data.CheckInStart.split(':').map(Number);
                  // let [hoursEnd, minutesEnd, secondsEnd] = data.CheckInEnd.split(':').map(Number);
                  // let [hoursOut, minutesOut, secondsOut] = data.CheckOut.split(':').map(Number);

                  // let now = new Date();
                  // var start =  now.setHours(hoursStart, minutesStart, secondsStart, 0);
                  // var end =  now.setHours(hoursEnd, minutesEnd, secondsEnd, 0);
                  // var out =  now.setHours(hoursOut, minutesOut, secondsOut, 0);

                  // console.log(start)
                  data.CheckInStart = new Date(`0001-01-01 ${data.CheckInStart}`)
                  data.CheckInEnd = new Date(`0001-01-01 ${data.CheckInEnd}`)
                  data.CheckOut = new Date(`0001-01-01 ${data.CheckOut}`)
               }
               else{

               }
            })
         }
         if(this.form.PropertyFacilities && this.form.PropertyFacilities.length > 0){
            this.form.PropertyFacilities = this.form.PropertyFacilities.map(data=> data.FacilityId)
         }
         if(this.form.PropertyImage){
            this.form.ImageId = this.form.PropertyImage.ImageId
         }

         this.informations = this.form.OtherInfos.filter(data=> data.Type)
                              .map(data=> Object.assign(data,{Address: ""}))

         if(this.informations.length == 0){
            this.informations= [{ Type: null }]
         }
      }

      // get user location/default for center map position
      if(this.form.Latitude && this.form.Longitude){
         this.center = {lat: parseFloat(this.form.Latitude), lng: parseFloat(this.form.Longitude)}
      }
      else{
         if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
            (position) => {
               this.center = {lat:position.coords.latitude,lng: position.coords.longitude}
            },
            (error) => {
               this.center = {lat:-6.175392, lng:106.827153}
            }
            )
         } else {
            this.center = {lat:-6.175392, lng:106.827153}
         }
      }
   },
   methods: {
      ...mapActions(module.data.name, ["getAllProvince", "getAllCities", "getAllCountries"]),
      ...mapActions(module.property.name, ["getById", "create", "update"]),

      async resetLocation(){
         if(this.form.Latitude && this.form.Longitude){
            var confirm = await this.$dialog.Confirmation.confirm({
               title: "Konfirmasi",
               message: "Reset Lokasi Properti pada peta?",
            });
            if (confirm) {
               this.form.Latitude = null
               this.form.Longitude = null
            }
         }
      },
      setLocation(event){
         // console.log(event)
         this.form.Latitude = event.latLng.lat()
         this.form.Longitude = event.latLng.lng()
         this.$forceUpdate()
         // console.log(this.form)
      },
      formRequest(){
         if(!this.form.ImageId){
            throw new Error("Harap upload gambar property");
         }
         if(this.form.Latitude && this.form.Longitude){
            this.form.Latitude = this.form.Latitude.toString() 
            this.form.Longitude = this.form.Longitude.toString() 
         }
         else{
            throw new Error("Harap pilih lokasi property");
         }

         this.form.OtherInfos = this.informations.filter(data=> data.Type)
                        .map(data=> {
                           data = Object.assign(data,{Address: ""})

                           if(data.Type == 2){
                              data.CheckInStart = this.$moment(data.CheckInStart).format("HH:mm")
                              data.CheckInEnd = this.$moment(data.CheckInEnd).format("HH:mm")
                              data.CheckOut = this.$moment(data.CheckOut).format("HH:mm")
                           }
                           return data
                        })

         var formData = JSON.parse(JSON.stringify(this.form))
         formData.PropertyFacilities = formData.PropertyFacilities.map(data=> {
            return {FacilityId : data}
         }) 
         console.log(formData)
         return formData
      },
      doCreate(){
         var form = null
         try{
            form =this.formRequest()
         }
         catch(err){
            return Promise.reject(err)
         }
         return this.create(form)
      },
      doUpdate(){
         var form = null
         try{
            form =this.formRequest()
         }
         catch(err){
            return Promise.reject(err)
         }
         return this.update(form)
      },
      deleteInformations(info) {
         this.informations = this.informations.filter(data=> data.Type != info.Type)
         if(this.informations.length <= 0){
            this.informations= [{ Type: null }]
         }
         // this.informations.slice
      },
      getInformations(){
         return this.informations.reduce((acc, value) => {
            if (!acc.some(item => item.Type === value.Type)) {
               acc.push(value);
            }
            return acc;
            }, []);
      },
      addInformations() {
         this.informations.push({ Type: null });
      },
      addFaq(){
         this.informations.push({ Type: 1 });
      },
      getFaq(){
         return this.informations ? this.informations.filter(data=> data.Type == 1) : [];
      }
   },

   watch: {
      "form.CountryId": {
         immediate: true,
         async handler(newVal) {
            if (newVal) {
               this.provinces = await this.getAllProvince(this.form.CountryId);
            } else this.provinces = [];
         },
      },
      "form.ProvinceId": {
         immediate: true,
         async handler(newVal) {
            if (newVal) {
               this.cities = await this.getAllCities(this.form.ProvinceId);
            } else this.cities = [];
         },
      },
   },
};
</script>

<style scoped>
.faq-card{
   padding: 16px 20px;
   border-radius: 8px;
   border: 1px solid var(--grey-600);
   margin-bottom: 16px;
   margin-top: 8px;
}

.button-add-faq{
   cursor: pointer;
   color: var(--blue-500);
   width: fit-content;
}
</style>
