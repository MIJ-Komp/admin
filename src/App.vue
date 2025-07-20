<template>
   <div class="mij-container" :class="!user ? 'login' : ''" >
      <Toast />
      <!-- <div>{{  user}}</div> -->
      <SideBar v-if="user" />
      <div class="mij-content-container" :class="!user ? 'login' : ''">
         <Header v-if="user" />
         <div class="mij-content" :class="!user ? 'login' : ''">
            <div
               v-show="!hasMounted"
               style="
                  height: max;
                  width: 100%;
                  display: flex;
                  align-items: center;
               "
            >
               <ProgressSpinner />
            </div>
            <main @click="menuIsShow = false" v-show="hasMounted">
               <keep-alive>
                  <router-view ref="routerView"/>
               </keep-alive>
            </main>
         </div>
      </div>
      <Alert ref="alert" />
      <Confirmation ref="confirmation" />
   </div>
</template>

<script>
import module from "./constant/module";
import { mapActions } from "vuex";
import { nextTick, provide, onMounted, ref, getCurrentInstance } from "vue";
import ProgressSpinner from "primevue/progressspinner";

import Toast from "primevue/toast";
import createToast from "./components/toast";

export default {
   setup(){
      const alert = ref(null);
      const confirmation = ref(null);
      const { appContext } = getCurrentInstance();

      const toast = appContext.config.globalProperties.$toast;
      const showToast = createToast(toast);

      onMounted(()=>{
         provide("dialog", {
            Alert: alert.value,
            Confirmation: confirmation.value,
         })

         provide("showToast", showToast)
      })
      return{
         alert, confirmation, showToast
      }
   },
   async created() {
      const data = await this.getUserRole()
      // console.log(this.$router)
      const countKeys = (obj) => {
         let count = 0;
         for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
               count++; // Hitung key dari level ini
               if (typeof obj[key] === "object" && obj[key] !== null) {
                  count += countKeys(obj[key]); // Rekursif untuk objek anak
               }
            }
         }
         return count;
      };
      var loaded = 0
      var loadImage = setInterval(() => {
         // || loaded == this.$assetLength && countKeys(this.$assets)==this.$assetLength
         if(loaded = 10 ){
            clearInterval(loadImage);
            this.hasMounted = true
         }
         loaded += 1;
         this.$forceUpdate();
      }, 500);
   },
   watch: {
      // "window.outerWidth": {
      //    immediate: true,
      //    async handler(newVal) {
      //    },
      // },
      '$route':{
         immediate: true,
         handler(to){
            setTimeout(() => {
               this.name= to.name
            }, 50);
         }
      }
   },
   components: {
      Toast,
      ProgressSpinner,
   },
   data() {
      return {
         hasMounted: false,
         name: ""
      };
   },
   computed: {
      // currentPage(){
      //   var returnData = {
      //     index : null,
      //     fiturIndex : null
      //   }
      //   // console.log(this.$route)
      //   switch (this.$route.path) {
      //   }
      //   return returnData
      // },
      // pageName(){
      //   // console.log(this.$route)
      //   return "ok"
      //   // const component = this.$route.matched[this.$route.matched.length - 1].components.default;
      //   // // console.log(component)
      //   // return component ? component.options.name : 'Unknown';
      // }
      // ...mapGetters(module.user.name, ['user']),

      user() {
         // // console.log(this.$store.state.user)
         // // console.log(this.$store.state.user)
         return this.$store.state.user.user;
      },
   },
   async beforeMount() {

      var currentPath = window.location.pathname;
      while (currentPath.includes("/")) {
         currentPath = currentPath.replace("/", "");
      }

      if (!(await this.getCurrentUser())) {
         if (currentPath == "register") {
            const ref = this.$route.query.ref;
            if (ref) {
               this.goto(`register`, { ref: ref });
            } else {
               this.goto(`register`);
            }
            return;   
         } else {
            this.goto("login");
            return;
         }
      }

      if (currentPath == "login" || currentPath == "register") {
         this.goto("dashboard");
      }
   },
   mounted() {
      // document.body.classList.remove('dark-mode');
      window.addEventListener("resize", ()=>{this.autoResizeMobile()});
      window.addEventListener('orientationchange', ()=>{this.autoResizeMobile()});

      nextTick(() => {
         this.autoResizeMobile();

         var dialog = {};
         if (this.$refs.alert) {
            dialog.Alert = this.$refs.alert;
            
         }
         if (this.$refs.confirmation) {
            dialog.Confirmation = this.$refs.confirmation;
         }
         this.$registerGlobal("dialog", dialog);
         const showToast = createToast(this.$toast);
         this.$registerGlobal("showToast", showToast);
      });

      // // console.log(this.pageName)
   },
   methods: {
      ...mapActions(module.user.name, ["getCurrentUser", "getUserRole"]),

      goto(url, query) {
         var content = document.getElementById("mij-content");
         if (content) {
            content.scrollTo({ top: 0, behavior: "smooth" });
         }

         setTimeout(() => {
            // this.$router.replace(`/${url}`);
            this.$router.replace({ path: `/${url}`, query: query});
         }, 50);
      },

      autoResizeMobile() {
         let widthDevice = window.outerWidth + 400;
         let scale = 1;

         if (window.outerWidth < 700) {
            widthDevice = window.outerWidth + 100;
         }
         if (window.outerHeight < 600) {
            widthDevice = 1600;
         }

         scale = window.outerWidth / widthDevice;

         console.log(scale)

         if (document && document != null) {
            document
               .querySelector("meta[name=viewport]")
               .setAttribute(
                  "content",
                  `width=device-width, initial-scale=${scale}, maximum-scale=1.0, user-scalable=0`
               );
         }
         // this.$forceUpdate();
      },
   },
};
</script>
<style scoped>
.mij-container {
   background: var(--grey-400);
   overflow: hidden;
}
.mij-content-container {
   display: flex;
   flex-direction: column;
   /* height: 100vh; */
   width: calc(100% - 220px);
}
.mij-content-container.login{
   width: 100% !important;
}
.mij-content {
   overflow: auto;
   height: 100%;
   flex-grow: 1;
   margin-top: 12px;
}
.login {
   padding: 0 !important;
   margin: 0 !important;
}

.mij-content main {
   display: flex;
   flex-direction: column;
   overflow: auto;
   height: 100%;
}
@media screen and (max-width: 900px) {
   .mij-content-container {
      margin-left: 0;
      width: 100%;
   }
   .mij-container{
        background: var(--grey-400) !important;
        padding: 0 !important;
    }
   .mij-content {
      margin-top: 0px;
      padding: 12px;
      /* top: 80px; */
      /* width: calc(100% - 32px); */
      /* left: 16px; */
      /* height: calc(100% - 110px); */
      /* position: absolute; */
   }
   .mij-content.login {
      width: 100%;
      height: 100%;
      left: 0;
      top: 0px;
   }
}
</style>

<style>
@media (prefers-color-scheme: dark) {
   :root {
      color-scheme: light;
   }
}
</style>
