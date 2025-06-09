<template>
   <div>
      <div v-if="!currentSession" class="cleaning-session">
         <div class="filter" v-if="userRole">
            <SelectModuleBox :disabled="userRole.RoleProperties.length == 1" :module="$module.property" label="Pilih Property" v-model="propertyId"/>
         </div>

         <div class="cleaning-list-container">
            <div class="section-header font-h4 flex-row" style="justify-content: space-between">
               <div>Menunggu Dibersihkan</div>
               <Button style="width: auto !important;" iconFa="fa fa-refresh" @click="assignCleaning()"/>
            </div>

            <div v-if="!propertyId" class="me-2 room-cleaning-container">Pilih Properti terlebih dahulu</div>
            <div v-else class="room-cleaning-container">
               <div v-if="dirtyRooms.length ==0">Tidak ada Data</div>
               <div class="room-cleaning-card" v-for="room in dirtyRooms" :key="room" @click="viewRoom(room)">
                  <img :src="getImage(room)"/>
                  <div>
                     <div>{{room.Name}} - {{room.Code}}</div>
                     <div class="font-14">{{ room.RoomTypeName }}</div>
                     <div class="mt-2 flex-row font-14" style="color: var(--grey-800);">
                        <div>{{ room.Status == RoomDirtyType.REQUEST ? 'Request Cleaning' : 
                                room.Status == RoomDirtyType.AFTER_CHECK_OUT ? 'Last Check-out' : 
                                room.Status == RoomDirtyType.EARLY_CHECKOUT ? 'Early Checkout' : 
                                `Tamu akan check-in`}}</div>
                        <div style="margin-left: 4px;">{{ room.CreatedOn || room.CheckInSoonAt ? `pada ${getTimeAt(room)}` : ''}}</div>
                     </div>
                     <div class="font-14" v-if="room.Status == RoomDirtyType.REQUEST">{{ room.IsFromAdmin ? `From Admin` : 'From Guest'}}</div>
                     <div class="font-14 font-disabled">Keterangan : {{ room.Description || 'Tidak ada' }}</div>
                  </div>
               </div>
            </div>
            <div class="section-header font-h4">Sedang Dibersihkan</div>
            <div v-if="!propertyId" class="me-2 room-cleaning-container">Pilih Properti terlebih dahulu</div>
            <div v-else class="room-cleaning-container">
               <div v-if="onCleaningRooms.length ==0">Tidak ada Data</div>
               <div class="room-cleaning-card" style="cursor: default;" v-for="room in onCleaningRooms" :key="room">
                  <img :src="getImage(room)"/>
                  <div>
                     <div>{{room.Code}}</div>
                     <div class="font-14">{{ room.RoomTypeName }}</div>
                     <div class="mt-2">Oleh {{room.CleaningByName}}</div>
                     <div class="font-14 font-disabled">Keterangan : {{ room.Description || 'Tidak ada' }}</div>
                  </div>
               </div>
            </div>
         </div>
         <StartCleaningOverlay ref="startCleaningOverlay" :room="selectedRoom" @success="assignCleaning()"/>
      </div>
      <div v-else class="current-session">
         <div>
            <div class="flex-row room-information" style="align-items: center;">
               <img :src="getImage(currentSession)"/>
               <div>
                  <div style="font-size: 24px;">{{ currentSession?.RoomName }} - {{ currentSession?.PropertyName }}</div>
                  <div style="font-size: 18px;">{{ currentSession?.RoomTypeName }}</div>
               </div>
            </div>
            <div class="lock-information">
               <div class="left">
                  <div>Door PIN</div>
                  <div style="font-size: 28px; font-weight: 700;">{{currentSession.PIN ||'PIN belum tersedia'}}</div>
               </div>
               <div class="right">
                  <div>Time Left</div>
                  <div id="timeLeft">-- : -- : --</div>
               </div>
            </div>
            <!-- <div>Valid until </div> -->
         </div>
         <Form
            ref="observer"
         >
         <div>
            <div class="condition">
               <div class="header font-h4">Kondisi Awal</div>
               <div style="color: var(--grey-800);">Pastikan untuk mengunggah <span style="color: black;">minimal 3 photo</span> untuk Kondisi Awal sebelum memulai pembersihan. Kondisi ini wajib diisi agar kamu bisa melanjutkan ke Kondisi Akhir setelah selesai.</div>
               <!-- <FileInput :multiple="true" style="margin-top: 24px;"/> -->
               <Camera 
                  v-model="currentSession.CleaningSessionImages"
                  :value="currentSession.CleaningSessionImages"
                  :disabled="currentSession.Status != 1"
               />
               <TextArea :disabled="currentSession.Status != 1" v-model="currentSession.Description" label="Catatan" style="margin-top: 24px"/>
               <Button v-if="currentSession.Status == 1" label="Submit" style="margin-top: 24px" @click.prevent="submit" :isLoading="isLoading"/>
            </div>
            <div class="condition" style="padding-bottom: 50px;">
               <div class="header font-h4">Kondisi Akhir</div>
               <div style="color: var(--grey-800);">Kondisi Akhir hanya dapat diisi setelah Anda Submit Kondisi Awal</div>

               <div v-if="currentSession.Status == 2">
                  <Camera v-model="endSession.CleaningSessionImages"
                  :value="endSession.CleaningSessionImages"/>
                  <TextArea v-model="endSession.Description" label="Catatan" style="margin-top: 24px"/>
                  <Button label="End Cleaning" style="margin-top: 24px" @click.prevent="doEndSession" :isLoading="isLoading"/>
               </div>
            </div>
         </div>
      </Form>
      </div>
   </div>
</template>
<script>
import {mapActions, mapGetters} from 'vuex'
import module from '../../../constant/module'
import { RoomDirtyType } from '../../../constant/enums/RoomStatus';
import StartCleaningOverlay from './StartCleaningOverlay.vue'
import { Form } from "vee-validate";

export default {
  components:{StartCleaningOverlay, Form},
  watch:{
   'currentSession.CleaningSessionImages':{
      handler(newVal){
         console.log(newVal)
      }
   },
   propertyId:{
      immediate: true,
      handler(newVal){
         if(newVal){
            this.dirtyRooms = this.allDirtyRooms.filter(data=> !data.StartCleaningOn && data.PropertyId == this.propertyId)
            this.onCleaningRooms = this.allDirtyRooms.filter(data=> data.StartCleaningOn && data.PropertyId == this.propertyId)
         }
      }
   }
   // currentSession:{
   //    handler(newVal){
   //       console.log(newVal)
   //       console.log(this.allDirtyRooms)
   //    }
   // }
  },
  computed:{
      ...mapGetters(module.user.name, ["userRole"]),
  },
  methods: {
   getTimeAt(room){
      var time = this.$moment(room.CheckInSoonAt || room.CreatedOn);

      if(time.format("DD MMM yyyy") == this.$moment().format("DD MMM yyyy")){
         return time.format("HH:mm")
      }
      else{
         return time.format("DD MMM HH:mm")
      }
   },
   async doEndSession(){
      if(this.isLoading) return
      this.isLoading = true

      const validator = this.$refs.observer;
      const result = await validator.validate();
      if (!result) {
         this.isLoading = false
         return
      }

      if(this.endSession.CleaningSessionImages.length < 3){
         this.$dialog.Alert.confirm({ title: 'Gagal', message: `Upload minimal 3 photo kondisi akhir kamar.\n
         Foto dapat berupa Kondisi Tempat tidur,\n Lantai dan Karpet,\n Kamar Mandi,\n Meja dan Furnitur,\n Peralatan Elektronik,\n Lemari dan penyimpanan,\n Jendela dan Tirai jika ada` })
         this.isLoading = false
         return
      }
      if(this.$helper.IsEmpty(this.endSession.Description)){
         this.$dialog.Alert.confirm({ title: 'Gagal', message: `Harus menyertakan catatan`})
         this.isLoading = false
         return
      }
      var confirm = await this.$dialog.Confirmation.confirm({
         title: "Konfirmasi",
         message: "Apakah Anda telah selesai membersihkan? Pastikan kamar telah bersih dan tidak ada peralatan/barang yang tertinggal",
      });
      if (confirm) {
         this.doCleaning({
            RoomId: this.currentSession.RoomId,
            StaffId: this.currentSession.AdminId,
            Status : 3,
            Images: this.endSession.CleaningSessionImages,
            Description: this.endSession.Description
         }).then(res=>{
            this.$showToast.success("Berhasil Menyelesaikan","terimakasih atas kerja keras Anda")
               this.$emit("success")

               setTimeout(() => {
                  this.assignCleaning()
                  // this.$router.push({ path: `${this.$route.path}`})
               }, 1000);
            }
         )
         .catch(err=> this.$showToast.error(err))
         .finally(()=>{this.isLoading = false})
      }
      this.isLoading = false
   },
   async submit(){
      if(this.isLoading) return
      this.isLoading = true

      const validator = this.$refs.observer;
      const result = await validator.validate();
      if (!result) {
         this.isLoading = false
         return
      }

      if(this.currentSession.CleaningSessionImages.length <3){
         this.$dialog.Alert.confirm({ title: 'Gagal', message: `Upload minimal 3 photo kondisi awal kamar.\n
         Foto dapat berupa Kondisi Tempat tidur,\n Lantai dan Karpet,\n Kamar Mandi,\n Meja dan Furnitur,\n Peralatan Elektronik,\n Lemari dan penyimpanan,\n Jendela dan Tirai jika ada`})
         this.isLoading = false
         return
      }
      if(this.$helper.IsEmpty(this.currentSession.Description)){
         this.$dialog.Alert.confirm({ title: 'Gagal', message: `Harus menyertakan catatan`})
         this.isLoading = false
         return
      }

      var confirm = await this.$dialog.Confirmation.confirm({
         title: "Konfirmasi",
         message: "Apakah Anda ingin mengirim data kondisi awal? jika ya maka data kondisi awal tidak dapat Anda ubah lagi",
      });
      if (confirm) {
         console.log(this.currentSession)
         this.doCleaning({
            RoomId: this.currentSession.RoomId,
            StaffId: this.currentSession.AdminId,
            Status : 2,
            Images:this.currentSession.CleaningSessionImages,
            Description: this.currentSession.Description
         }).then(res=>{
               this.$showToast.success("Berhasil Start Cleaning","")
               this.$emit("success")

               this.assignCleaning()
            }
         )
         .catch(err=> this.$showToast.error(err))
         .finally(()=>{this.isLoading = false})
      }
      this.isLoading = false
   },
   async assignCleaning(){
      this.currentSession = await this.getCurrentSession()
      this.allDirtyRooms = await this.getDirtyRooms()

     this.dirtyRooms = this.allDirtyRooms.filter(data=> !data.StartCleaningOn && data.PropertyId == this.propertyId)
     this.onCleaningRooms = this.allDirtyRooms.filter(data=> data.StartCleaningOn && data.PropertyId == this.propertyId)

      this.checkSession()
   },
   viewRoom(room){
      if(!this.currentSession){
         this.selectedRoom = room
         this.$refs.startCleaningOverlay.openMenu()
      }
      else{

      }
   },
   getImage(room){
      if(room.ImageId){
         return `${this.$constant.apiURL}/image/${room.ImageId}`
      }
      if(room&& room.RoomImages && room.RoomImages.length > 0){
         return `${this.$constant.apiURL}/image/${room.RoomImages[0].ImageId}`
      }
      return null
   },
   checkSession(){
      if(!this.currentSession) return
      this.currentRoom = this.allDirtyRooms.find(data=> data.PropertyId == this.currentSession.PropertyId && data.Id == this.currentSession.RoomId)
      this.updateTimeLeft()
      this.timeInterval = setInterval(() => {
                              this.updateTimeLeft()
                           }, 1000);
   },
   updateTimeLeft() {
      if(!this.currentSession) {
         clearInterval(this.timeInterval)
         return
      }
      let currentTime = new Date();
      let timeDifference = new Date(this.currentSession.CleaningEndTime) - currentTime; // Selisih dalam milidetik
      let timerElement = document.getElementById("timeLeft");

      
      if(!timerElement){
         return;
      }
      if (timeDifference > 0) {
         // Hitung jam, menit, dan detik
         let hours = Math.floor(timeDifference / (1000 * 60 * 60)); // Jam
         let minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60)); // Menit
         let seconds = Math.floor((timeDifference % (1000 * 60)) / 1000); // Detik

         // Format menjadi jam:menit:detik
         hours = (hours < 10) ? "0" + hours : hours;
         minutes = (minutes < 10) ? "0" + minutes : minutes;
         seconds = (seconds < 10) ? "0" + seconds : seconds;

         // Tampilkan waktu dengan tanda minus (-) dan warna biru
         timerElement.innerHTML = `- ${hours} : ${minutes} : ${seconds}`;
         timerElement.style.color = "var(--blue-500)"; // Set warna biru jika masih ada waktu
      } else {
         // Setelah waktu habis, mulai hitung mundur dalam format +00:00:xx
         let countdownTime = Math.abs(Math.floor(timeDifference / 1000)); // Ambil detik setelah waktu habis
         let seconds = countdownTime % 60; // Detik
         let minutes = Math.floor(countdownTime / 60) % 60; // Menit
         let hours = Math.floor(countdownTime / 3600); // Jam

         // Format menjadi jam:menit:detik
         hours = (hours < 10) ? "0" + hours : hours;
         minutes = (minutes < 10) ? "0" + minutes : minutes;
         seconds = (seconds < 10) ? "0" + seconds : seconds;

         // Tampilkan waktu dengan tanda plus (+) dan warna merah
         timerElement.innerHTML = `+ ${hours} : ${minutes} : ${seconds}`;
         timerElement.style.color = "#f1485b"; // Set warna merah setelah waktu habis
      }
   },

   ...mapActions(module.cleaningSession.name, ["getCurrentSession", "getDirtyRooms", "doCleaning"])
  },
  async created () {
     this.currentSession = await this.getCurrentSession()
     this.allDirtyRooms = await this.getDirtyRooms()

     this.dirtyRooms = this.allDirtyRooms.filter(data=> !data.StartCleaningOn && data.PropertyId == this.propertyId)
                        .sort((a,b)=> {return new Date(a.CreatedOn) - new Date(b.CreatedOn)})
                        .sort((a, b) => {
                           const statusOrder = [RoomDirtyType.EARLY_CHECKOUT, RoomDirtyType.REQUEST, RoomDirtyType.AFTER_CHECK_OUT];
                           const statusComparison = statusOrder.indexOf(a.Status) - statusOrder.indexOf(b.Status);

                           if (statusComparison !== 0) {
                              return statusComparison;
                           }
                           return new Date(a.CreatedOn) - new Date(b.CreatedOn);
                        });

     this.onCleaningRooms = this.allDirtyRooms.filter(data=> data.StartCleaningOn && data.PropertyId == this.propertyId)
                            .sort((a,b)=> {return new Date(a.CreatedOn) - new Date(b.CreatedOn)})
     if(this.userRole.RoleProperties.length == 1){
         this.propertyId = this.userRole.RoleProperties[0].PropertyId
     }
   //   this.currentSession.CleaningEndTime = new Date()
      this.checkSession()
  },
   data() {
      return {
         RoomDirtyType,
         currentSession:null,
         allDirtyRooms:[],
         dirtyRooms:[],
         onCleaningRooms:[],
         propertyId: null,
         selectedRoom: {},
         currentRoom: null,
         timeInterval: null,
         endSession: {
            CleaningSessionImages:[],
            Description: null
         },
         isLoading: false
      };
   },
};
</script>

<style>
#timeLeft{
   font-weight: 700;
   font-size: 26px;
}
.condition{
   margin-top: 32px;
}
.upload-area{
   width: 100% !important;
}
.condition .header{
   border-bottom: 1px solid black;
   padding-bottom: 8px;
   margin-bottom: 16px;
}
.lock-information{
   display: flex;
   justify-content: space-between;
}
.lock-information .right{
   width: 190px;
}
.room-information{
   margin-bottom: 16px;
   padding-bottom: 8px;
   border-bottom: 1px solid var(--grey-700);
}
.room-information img{
   height: 80px;
   width: 80px;
   object-fit: contain;
   margin-right: 16px;
   border-radius: 8px;
}
.room-cleaning-container{
   grid-template-columns: repeat(auto-fit, 400px)
}

.room-cleaning-card{
   /* width: 400px !important; */
   max-width: 100% !important;
   height: 170px;
   display: flex;
   align-items: center;
   border: 1px solid #AAAAAA !important;
   cursor: pointer;

   display: flex;
   padding: 20px;
   border-radius: 8px;
}
.room-cleaning-container{
   max-height: 55vh;
   overflow: auto;
   /* justify-content: center; */
   margin: 24px 0;


   display: grid;
   gap: 20px;
}
.room-cleaning-card img{
   width: 72px;
   height: 72px;
   object-fit: contain;
   border-radius: 8px;
   margin-right: 20px;
}

.cleaning-list-container{
   background: white;
   border-radius: 8px;
   padding: 16px;
   margin-top: 24px;
}
.section-header{
   padding-bottom: 8px;
   border-bottom: 1px solid #1E1E1E;
}
.cleaning-session .filter{
   padding: 14px;
   background: white;
   border-radius: 8px;
}
.current-session{
   background: white;
   border-radius: 8px;
   padding: 16px;
}
@media screen and (max-width: 900px) {
   .room-cleaning-container{
      justify-content: center;
      grid-template-columns: repeat(auto-fit, minMax(400px,100%))
   }
}
</style>
