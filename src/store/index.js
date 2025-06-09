import { createStore } from "vuex";

// const modules = {};
// import module from "../constant/module";

// const moduleNames = Object.keys(module);

import addOn from "./modules/addOn";
import booking from "./modules/booking";
import calendar from "./modules/calendar";
import charge from "./modules/charge";
import data from "./modules/data";
import deviceGateway from "./modules/deviceGateway";
import deviceLock from "./modules/deviceLock";
import paymentHistory from "./modules/paymentHistory";
import paymentMethod from "./modules/paymentMethod";
import paymentType from "./modules/paymentType";
import property from "./modules/property";
import propertyFacility from "./modules/propertyFacility";
import propertyType from "./modules/propertyType";
import role from "./modules/role";
import roomAvailability from "./modules/roomAvailability";
import roomFacility from "./modules/roomFacility";
import roomLockHistory from "./modules/roomLockHistory";
import roomNoPrice from "./modules/roomNoPrice";
import roomPrice from "./modules/roomPrice";
import roomStatusHistory from "./modules/roomStatusHistory";
import roomTypeNoPrice from "./modules/roomTypeNoPrice";
import roomTypePrice from "./modules/roomTypePrice";
import transaction from "./modules/transaction";
import user from "./modules/user";
import dashboard from "./modules/dashboard";
import report from "./modules/report";
import cleaningSession from './modules/cleaningSession';
import cleaningHistories from './modules/cleaningHistories';
import setting from './modules/setting';
import generatePin from './modules/generatePin';
import manualPin from './modules/manualPin';
import member from './modules/member';
import referral from "./modules/referral";

export default createStore({
   modules: {
      addOn: addOn,
      booking: booking,
      calendar: calendar,
      charge: charge,
      data: data,
      deviceGateway: deviceGateway,
      deviceLock: deviceLock,
      paymentHistory: paymentHistory,
      paymentMethod: paymentMethod,
      property: property,
      propertyFacility: propertyFacility,
      propertyType: propertyType,
      role: role,
      roomAvailability: roomAvailability,
      roomFacility: roomFacility,
      roomLockHistory: roomLockHistory,
      roomNoPrice: roomNoPrice,
      roomPrice: roomPrice,
      roomStatusHistory: roomStatusHistory,
      roomTypeNoPrice: roomTypeNoPrice,
      roomTypePrice: roomTypePrice,
      transaction: transaction,
      user: user,
      dashboard: dashboard,
      report: report,
      paymentType,
      cleaningSession,
      cleaningHistories,
      setting,
      generatePin,
      manualPin,
      member,
      referral,
   },
});

// const loadModules = async () => {
//     await Promise.all(moduleNames.map(async (moduleName) => {
//       const module = ()=> import(/* @vite-ignore */`./modules/${moduleName}.js`);
//       modules[moduleName] = (await module()).default; // Menyimpan modul
//     }));

//     return createStore({
//       modules,
//     });
//   };

// const loadModules = async () => {
//    await Promise.all(
//       moduleNames.map(async (name) => {
//          if(name != "facility" && name != "device"){
//          const tempModule = await import(`./modules/${name}.js`);
//          modules[name] = tempModule.default;}
//       })
//    );

//    return createStore({
//       modules,
//    });
// };

// const store = await loadModules(); // Membuat store setelah modul dimuat

// // // console.log(store)

// export default store;
