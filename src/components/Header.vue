<template>
   <div class="header-container flex-row jc-spaceBetween slide-bottom">
      <div class="fadeIn navigation-container">
         <b-row class="navigation-pc m-0">
            <b-col cols="auto" class="section-container m-0 p-0 font-h5">
               <div class="font-small">{{ title }}</div>
               <i class="fa fa-angle-right" />
            </b-col>
            <b-col cols="auto" class="section-container m-0 p-0" v-for="(navigation, i) in navigations" :key="navigation">
               <div class="font-small parent" 
               :style="i == navigations.length -1 ? 'color: var(--grey-1000); font-weight: 600 !important':''"
               @click="goTo(navigation.path)">{{ navigation.name }}</div>
               <i v-if="i < navigations.length-1" class="fa fa-angle-right" />
            </b-col>
         </b-row>
      </div>

      <div class="profile-container d-flex align-i-center fadeIn" style="max-width: 50%; overflow: hidden; white-space: nowrap">
         <!-- <div style="margin-right: 20px">
            <img :src="$assets.icons.bell" />
         </div> -->
         <div>
            <div class="font-body text-end">
               {{ $moment().format(windowWidth >= 900 ? "dddd, D MMMM YYYY" : "D MMM YYYY") }}
            </div>
            <!-- <div @click="gotoProfile" class="font-label flex-row" style="align-items: center; cursor: pointer;">{{ user.Email }} <i class="ms-2 fa fa-edit" /></div> -->
            <!-- <div v-if="user.ReferralCode" @click="copyRefCode" class="font-label flex-row" style="align-items: center; cursor: pointer;">REF: {{ user.ReferralCode }} <i class="ms-2 fa fa-copy" /></div> -->
         </div>

         <!-- <div v-click-outside="openUserOption" class="userOption slide-bottom" v-if="isOpenUserOption">
            <div class="item" @click="gotoProfile">Edit Profile</div>
            <div class="item" @click="doLogout">Logout</div>
         </div> -->
      </div>
      <img style="height: 40px;" :src="$assets.logo" class="mobile-section"/>

   </div>
   <b-row class="navigation-mobile">
      <b-col cols="auto" class="section-container mt-2" v-for="(navigation, i) in navigations" :key="navigation">
         <div class="font-body parent" @click="goTo(navigation.path)" :style="i == navigations.length -1 ? 'color: black; font-weight: 600 !important':''">{{ navigation.name }}</div>
         <i v-if="i < navigations.length-1" class="fa fa-angle-right" />
      </b-col>
   </b-row>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import module from "../constant/module";
export default {
   methods: {
      async copyRefCode(){
         if (this.user.ReferralCode) {
            await navigator.clipboard.writeText(`${this.$constant.baseURL}/register?ref=${this.user.ReferralCode}`)
            this.$showToast.success(`Berhasil di copy`)
         } else {
            this.$showToast.error(`Tidak ada referral code`)
         }
      },
      gotoProfile(){
         this.isOpenUserOption = false
         this.$router.push({path: `/profile`})
      },
      openUserOption(){
         this.isOpenUserOption = !this.isOpenUserOption
      },
      back() {
         this.$router.replace(
            `${this.$constant.router[this.$route.meta.module.name]}`
         );
      },
      goTo(url){
         if(!url) return;
         setTimeout(() => {
            this.$router.replace({path :`${url}`});
         }, 50);
      },
      async doLogout() {
         var confirm = await this.$dialog.Confirmation.confirm({
            title: "Konfirmasi",
            message: "Apakah Anda ingin Logout?",
         });
         if (confirm) {
            await this.logout().then((res) => {
               this.$showToast.success("Logout Success", "");
               this.$router.replace("/login");
            });
         } else {
         }
      },
   },
   data() {
      return {
         // navigations:[]
         isOpenUserOption: false
      };
   },
   mounted() {
      
   },
   computed: {
      windowWidth(){
         return window.outerWidth
      },
      path() {
         return this.$route.path.trim().replace("/", "").split("/");
      },
      title() {
         if (this.$route.meta.page === "404") {
            return `Url Not Valid`;
         }
         // Ini akan menampilkan judul utama, misalnya "Catalog"
         if (this.path && this.$label.menu) {
            const parentPath = this.path[0]; // Elemen pertama dari path sebagai parent menu
            return this.$label.menu[parentPath] || ""; // Ambil label parent
         }
         return `Url Not Valid`;
         // console.log(this.path)
         //if(this.path && this.$label.menu && this.$label.menu[this.path[0]])
         //return this.$label.menu[this.path[0]].replace(this.path[0] == this.$module.property.name ? 'Manage' : '', '')
      },
      
      navigations(){
         var list = []
         if (this.$route.meta.page === "404") {
            list.push({name:`Url Not Valid`});
         }
         else{
            if(this.$route.meta.navigations){
               this.$route.meta.navigations.forEach(module => {
                  list.push({
                     path : this.$constant.router[module.name] ?
                           this.$constant.router[module.name]
                           .replace(":id", this.$route?.params?.id)
                           .replace(":roomTypeId",this.$route?.params?.roomTypeId)
                           .replace(":roomId",this.$route?.params?.roomId) : null,
                     name : this.$label.menu[module.name] || module.name
                  })
               });
            }
            else{
               if(!this.$route.meta.module){
                  list.push({
                     name: this.$route.name
                  })
               }
               else
               list.push({
                     path : (this.$constant.router[this.$route.meta.module?.name])
                           .replace(":id", this.$route.params.id)
                           .replace(":roomTypeId",this.$route.params.roomTypeId)
                           .replace(":roomId",this.$route.params.roomId),
                     name : this.$label.menu[this.$route.meta.module.name]
               })
            }
            if(this.$route.meta.formMode){
               list.push({
                     name : this.$route.meta.formMode === this.$constant.formMode.create
                        ? this.$label.action.create
                        : this.$route.meta.formMode === this.$constant.formMode.update
                        ? this.$label.action.update
                        : null
                        })
            }
         }
         return list
      },
      section() {
         if (this.$route.meta.page === "404") {
            return `Url Not Valid`;
         }
         if(this.$route.meta.module){
            return this.$label.menu[this.$route.meta.module.name]
         }
         return this.$route.name || "";
      },
      mode() {
         if (this.$route.meta.formMode) {
            return this.$route.meta.formMode === this.$constant.formMode.create
               ? this.$label.action.create
               : this.$route.meta.formMode === this.$constant.formMode.update
               ? this.$label.action.update
               : null;
         }
         return null;
      },
      ...mapGetters(module.user.name, ["user"]),
      ...mapActions(module.user.name, ["logout"]),
      // ...mapState('user' ['user', 'message'])
   },
};
</script>

<style>
.userOption .item{
   cursor: pointer;
   padding: 12px 24px;
}
.userOption .item:hover{
   background: var(--grey-400);
}
.userOption{
   position: absolute;
    background: white;
    border-radius: 8px;
    border: 1px solid var(--grey-600);
    right: 14px;
    bottom: -105px;
    width: 270px;
    max-width: 50%;
    z-index: 1000;
    box-shadow: 0 0.8px 2px 0px var(--grey-800);
}
.font-body {
   color: var(--grey-800);
}

.header-container {
   position: relative;
   height: 60px;
   padding: 12px;
   flex-shrink: 1;
   background: white;
   align-items: center;
   box-shadow: 0 0.8px 2px 0px var(--grey-800);
}

.section-container .parent {
   cursor: pointer;
}

.section-container .parent:hover {
   color: var(--grey-900);
   font-weight: 600 !important;
}

.section-container {
   display: flex;
   align-items: center;
}

.section-container i {
   margin: 0 8px;
   color: var(--grey-800);
   font-weight: 600 !important;
   font-size: 20px;
}
.navigation-mobile{
   display: none;
}
@media screen and (max-width: 900px) {
   .profile-container{
      display: none !important;
   }
   .header-container {
      padding: 15px;
      align-items: center;
      padding-left: 65px;
      border-radius: 0;
   }
   .navigation-container{
      padding-left: 12px;
      border-left: 1px solid var(--grey-800);
   }
   .navigation-pc{
      display: none;
   }
   .navigation-mobile{
      display: flex;
      padding: 8px 12px;
      margin: 0;
   }
   .navigation-mobile .section-container{
      padding: 0 !important;
   }
   .navigation-mobile .section-container .parent{
      background: white;
      border-radius: 8px;
      padding: 2px 8px;
      border: 1px solid var(--grey-700);
   }
   .navigation-mobile .section-container i{
      margin: 0 8px;
   }
}
</style>
