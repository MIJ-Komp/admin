console.log('App is loading...');

import { createApp } from "vue";

import App from "./App.vue";
import "bootstrap/dist/css/bootstrap.min.css";
import router from "./router"; // Import router
import BootstrapVue3 from "bootstrap-vue-3";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue-3/dist/bootstrap-vue-3.css";

import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";
import ToastService from "primevue/toastservice";

import 'core-js/stable';
import 'regenerator-runtime/runtime';

import "./plugins/vee-validate";

//set global moment
import moment from "moment";
import 'moment/locale/id';

moment.lang('id');
moment.locale('id');

const app = createApp(App);

app.use(PrimeVue, {
   theme: {
      preset: Aura,
   },
});
app.use(ToastService);

app.use(BootstrapVue3);

app.config.globalProperties.$moment = moment;

//set global component
import * as components from './components/components';
for (const key of Object.keys(components.default)) {
   app.component(key, components.default[key]);
}

//set secara global nilai constant
import constant from "./constant/constant";
app.config.globalProperties.$constant = constant;

//set global label
var language = localStorage.getItem("language");
if (!language || !constant.Languages[language]) {
   language = constant.Languages.EN;
}
app.config.globalProperties.$label = constant.Label[language];

//set secara global assets2 yang statis seperti icon, background
import assets from "./assets/assets";
app.config.globalProperties.$assets = {};
const countKeys = (obj) => {
   let count = 0;
   for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
         count++;
         if (typeof obj[key] === 'object' && obj[key] !== null) {
            count += countKeys(obj[key]); // Rekursif untuk objek anak
         }
      }
   }
   return count;
};
app.config.globalProperties.$assetLength =  countKeys(assets)



for (const key of Object.keys(assets)) {
   if (!assets[key].length && assets[key].length != 0) {
      for (const keyChild of Object.keys(assets[key])) {
         // // console.log(assets[key].length)
         if (!app.config.globalProperties.$assets[key])
            app.config.globalProperties.$assets[key] = {};

         await assets[key][keyChild]().then(res=>{
            app.config.globalProperties.$assets[key][keyChild] = res.default
         })
         // app.config.globalProperties.$assets[key][keyChild] = (
         //    await assets[key][keyChild]()
         // ).default;
      }
   } else {
      assets[key]().then(res=>{
         app.config.globalProperties.$assets[key] = res.default
      })

      // app.config.globalProperties.$assets[key] = (await assets[key]()).default;
   }
}
// console.log(app.config.globalProperties.$assets)
//set global module
import module from "./constant/module";
app.config.globalProperties.$module = module;

//set global axios
import axios from "./store/axios";
app.config.globalProperties.$axios = axios;

import showToast from "./components/toast";
app.config.globalProperties.$showToast = showToast;

function registerGlobal(name, value) {
   app.config.globalProperties[`\$${name}`] = {};
   app.config.globalProperties[`\$${name}`] = value;
}
app.config.globalProperties.$registerGlobal = registerGlobal;

import helper from "./constant/helper";
app.config.globalProperties.$helper = helper;


import store from "./store/index";

import vClickOutside from "click-outside-vue3";
app.use(vClickOutside);


app.use(store);
app.use(router);
app.mount("#app");
