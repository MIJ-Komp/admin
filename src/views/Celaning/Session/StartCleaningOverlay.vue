<template>
    <div v-show="isVisible" class="overlay" ref="overlay">
      <div
        class="overlay-menu"
        @touchstart="startTouch"
        @touchmove="onSwipe"
        @touchend="endTouch"
        >
        <div>
          <div style="text-align: center; width: 100%; justify-content: center; display: flex;">
            <div class="controllScroll" style="height: 7px; width: 80px; background: var(--blue-500); border-radius: 8px;"></div>
          </div>
          <div style="background: white; padding-top: 30px;">
            <h2 style="width: 100%; border-bottom: 0.5px solid #8B8A8A; padding: 8px; margin-bottom: 0;">Start Cleaning</h2>
          </div>
          <div class="mt-3">
            <img :src="getImage()"/>
            <div class="mt-4">Kamar : <b>{{room.Name}} - {{room.Code}}</b></div>
            <div class="font-14">Tipe Kamar : <b>{{ room.RoomTypeName }}</b></div>
            <div class="mt-2 flex-row font-14" style="color: var(--grey-800);">
              <div>{{ room.Status == RoomDirtyType.REQUEST ? 'Request Cleaning' : 
                      room.Status == RoomDirtyType.AFTER_CHECK_OUT ? 'Last Check-out' : 
                      room.Status == RoomDirtyType.EARLY_CHECKOUT ? 'Early Checkout' : 
                      `Tamu akan check-in`}}</div>
              <div style="margin-left: 4px;">{{ room.CreatedOn || room.CheckInSoonAt ? `pada ${getTimeAt(room)}` : ''}}</div>
            </div>
            <div class="font-14 font-disabled" v-if="room.Status == RoomDirtyType.REQUEST">{{ room.IsFromAdmin ? `From Admin` : 'From Guest'}}</div>
            <div class="font-14 font-disabled">Keterangan : {{ room.Description || 'Tidak ada' }}</div>
          </div>
        </div>
        <Button label="Start Cleaning" class="mt-4" @click="cleaning()" :isLoading="isLoading"/>
      </div>
    </div>
  </template>
  
  <script>
  import {mapActions, mapGetters} from 'vuex'
  import module from '../../../constant/module'
  import { RoomDirtyType } from '../../../constant/enums/RoomStatus';

  export default {
    data() {
      return {
        RoomDirtyType,
        isVisible: false,
        startY: 0,
        endY: 0,
        menuClose: 0,
        menuHeight: 0,
        isLoading: false
      };
    },
    props:{
      room:{type:Object, default: ()=>{}}
    },
    watch:{
      isVisible:{
  
      }
    },
    mounted(){
    },
    computed:{
      ...mapGetters(module.user.name, ["user"])
    },
    methods: {
      ...mapActions(module.cleaningSession.name, ["doCleaning"]),
      getTimeAt(room){
          var time = this.$moment(room.CheckInSoonAt || room.CreatedOn);

          if(time.format("DD MMM yyyy") == this.$moment().format("DD MMM yyyy")){
            return time.format("HH:mm")
          }
          else{
            return time.format("DD MMM HH:mm")
          }
      },

      cleaning(){
        if(this.isLoading) return
        this.isLoading = true

        this.doCleaning({
          RoomId: this.room.Id,
          StaffId: this.user.Id,
          Status : 1,
          Images:[]
        }).then(res=>{
            this.$showToast.success("Berhasil Start Cleaning","")
            this.$emit("success")
          }
        )
        .catch(err=> this.$showToast.error(err))
        .finally(()=> {this.isLoading = false})
      },
      getImage(){
          if(this.room.RoomImages && this.room.RoomImages.length > 0){
            return `${this.$constant.apiURL}/image/${this.room.RoomImages[0].ImageId}`
          }
          return null
      },
      checkOutside(event){
        if(event.target == this.$refs.overlay){
          this.closeMenu()
        }
      },
      goto(path){
        const id = this.$route.params.id;
        this.$router.replace(`/${id}/${path}`);
      },
      openMenu() {
        this.isVisible = true;
        console.log(this.room)

        document.addEventListener('click', this.checkOutside);
  
        const menu = document.getElementsByClassName("overlay-menu")[0]
        menu.style.height = 'auto';
  
        var index = 100
        var interval = setInterval(() => {
          if(index > 0){
            menu.style.transform = `translateY(${index}%)`
            index -=1
          }
          else{
            menu.style.transform = `translateY(0px)`
            clearInterval(interval)
          }
        }, 0.1);
      },
      closeMenu() {
        this.isVisible = false;
        document.removeEventListener('click', this.checkOutside);
      },
      selectItem(item) {
        console.log('Selected:', item);
        // Anda bisa menambahkan logika di sini jika ingin menutup setelah pemilihan
      },
      startTouch(event) {
  
        this.startY = event.touches[0].clientY;
        const menu = document.getElementsByClassName("overlay-menu")[0]
        this.menuHeight = menu.offsetHeight
      },
      onSwipe(event) {
        this.endY = event.touches[0].clientY;
        const distance = this.endY - this.startY;
        
        if (distance >=0) { 
          const menu = document.getElementsByClassName("overlay-menu")[0]
          menu.style.transform = `translateY(${distance}px)`

          if(distance > 200){
            this.closeMenu()
          }
        }
        else{
          const menu = document.getElementsByClassName("overlay-menu")[0]
          menu.style.height = `${this.menuHeight - distance}px`

          if(distance < -200){
            menu.style.height = `100%`
          }
        }
        
      },
      endTouch() {
        let distance = this.endY - this.startY;
        const menu = document.getElementsByClassName("overlay-menu")[0]

        if(distance > 0 && distance < 200){
          var interval = setInterval(() => {
            if(distance > 0){
              menu.style.transform = `translateY(${distance}px)`
            }
            else{
              clearInterval(interval)
            }
            distance -=1
          }, 0.01);
        }

        else if(distance < 0 && distance > -200){
          console.log(distance)
          var height = menu.offsetHeight

          var interval = setInterval(() => {
            if(height > this.menuHeight){
              menu.style.height = `${height}px`
            }
            else{
              clearInterval(interval)
            }
            height -=1
          }, 0.01);
        }
        // if (temp > 100 && this.endY > 0) { // Jika swipe ke bawah lebih dari 100px
        //   this.closeMenu();
        // }
        // else if(temp > 0){
        //   this.menuClose = temp
        //   console.log(this.menuClose)
        // }
        this.startY = 0
        this.endY = 0
      }
    }
  };
  </script>
  
  <style scoped>
  .img-container{
    padding: 12px;
    background: #7FA7B810;
    border-radius: 8px;
  }
  .menu-item-container{
    display: grid;
    grid-template-columns: repeat(auto-fit, 23%);
    gap: 10px;
    row-gap: 16px;
    font-size: 12px;
  }
  .menu-item img{
    width: 56px;
    max-width: 56px;
    height: 56px;
    max-height: 56px;
  }
  .menu-item{
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0px 13px;  
    text-align: center;
  }
  .menu-group{
    padding: 16px;
    background: white;
    margin-bottom: 8px;
  }
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    justify-content: center;
    right: 0;
    bottom: 0;
    background-color: #c8c8c870;
    display: flex;
    align-items: center;
    z-index: 1000; /* Menempatkan overlay di atas elemen lain */
  }
  
  .overlay-menu {
    background: white;
    padding: 16px;
    border-radius: 8px; 
    width: 600px;
    height: auto; /* Mengatur tinggi dengan jarak 120px di atas */
    overflow-y: auto; /* Menambahkan scroll jika konten lebih dari tinggi */
    transform: translateY(100%);
    flex-direction: column;
    display: flex;
    justify-content: space-between;
  }
  .overlay-menu img{
    height: 360px;
    width: 100%;
    object-fit: contain
  }
.controllScroll{
  display: none;
}
@media screen and (max-width: 800px) {
  .controllScroll{
    display: block;
  }
  .overlay-menu {
    width: 100%;
    border-radius: 24px 24px 0 0; 
  }
  .overlay{
    align-items: flex-end; /* Untuk menempatkan menu di bawah */
  }
}
  </style>
  