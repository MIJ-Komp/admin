import { defineAsyncComponent } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import NotFound from "../views/404.vue";

const Report = defineAsyncComponent(() => import("../views/Report/List.vue"));
const ViewReport = defineAsyncComponent(() =>
   import("../views/Report/View.vue")
);
const Property = defineAsyncComponent(() =>
   import("../views/Property/Property/List.vue")
);
const PropertyForm = defineAsyncComponent(() =>
   import("../views/Property/Property/Form.vue")
);

// import PropertyFormChangeStatus from
//    "../views/Property/Property/Room/FormChangeStatus.vue"
//

// SetPriceByRoomType = ??
// [15.53, 3/12/2024] Delvin: centangan itu loh
// [15.53, 3/12/2024] Delvin: klo true berarti roomtypeprice
// [15.53, 3/12/2024] Delvin: klo false masuk ke roomtypenoprice
// [15.53, 3/12/2024] Delvin: roomtypeprice -> roomnoprice
// roomtypenoprice -> roomprice
// [15.53, 3/12/2024] Delvin: gitoh

import PropertyViewRoomNoPrice from "../views/Property/Property/Room/NoPrice/List.vue";
import PropertyViewRoomPrice from "../views/Property/Property/Room/Price/List.vue";
import PropertyRoomPriceForm from "../views/Property/Property/Room/Price/Form.vue";

// import PropertyFormRoomNoPrice from
//    "../views/Property/Property/Room/NoPrice/Form.vue"
//
import PropertyViewRoomTypePrice from "../views/Property/Property/RoomType/Price/List.vue";
import PropertyFormRoomType from "../views/Property/Property/RoomType/Price/Form.vue";
import PropertyViewRoomTypeNoPrice from "../views/Property/Property/RoomType/NoPrice/List.vue";

import PropertyStatusHistory from "../views/Property/Property/Room/ListStatusHistory.vue";
import RoomLockHistory from "../views/Property/Property/Room/ListLockHistory.vue";

import User from "../views/User/Admin/List.vue";
import UserForm from "../views/User/Admin/Form.vue";
import Member from "../views/User/Member/List.vue";
import MemberForm from "../views/User/Member/Form.vue";

import Calendar from "../views/Calendar/index.vue";

const Booking = defineAsyncComponent(() => import("../views/Booking/View.vue"));

//Device
import Lock from "../views/Device/Lock/List.vue";
import LockForm from "../views/Device/Lock/Form.vue";
import Gateway from "../views/Device/Gateway/List.vue";
import GatewayForm from "../views/Device/Gateway/Form.vue";

//Catalog
import PropertyType from "../views/Catalog/PropertyType/List.vue";
import PropertyTypeForm from "../views/Catalog/PropertyType/Form.vue";

import PropertyFacility from "../views/Catalog/PropertyFacility/List.vue";
import PropertyFacilityForm from "../views/Catalog/PropertyFacility/Form.vue";

import RoomFacility from "../views/Catalog/RoomFacility/List.vue";
import RoomFacilityForm from "../views/Catalog/RoomFacility/Form.vue";

import Charge from "../views/Catalog/Charge/List.vue";
import ChargeForm from "../views/Catalog/Charge/Form.vue";

import AddOn from "../views/Catalog/AddOn/List.vue";
import AddOnForm from "../views/Catalog/AddOn/Form.vue";

import ManualBooking from "../views/ManualBooking/Form.vue";

//Payment
import PaymentType from "../views/Transaction/PaymentType/List.vue";
import PaymentTypeForm from "../views/Transaction/PaymentType/Form.vue";

import PaymentMethod from "../views/Transaction/PaymentMethod/List.vue";
import PaymentMethodForm from "../views/Transaction/PaymentMethod/Form.vue";
import PaymentHistory from "../views/Transaction/PaymentHistory/List.vue";

const Role = defineAsyncComponent(() => import("../views/User/Role/List.vue"));
const RoleForm = defineAsyncComponent(() => import("../views/User/Role/Form.vue"));


import CleaningHistories from '../views/Celaning/Histories/List.vue'
import CleaningHistoryDetail from '../views/Celaning/Histories/Detail.vue'

import CleaningSessions from '../views/Celaning/Session/List.vue'

import Setting from '../views/Setting/Setting.vue'

import GeneratePinList from '../views/Device/GeneratePin/List.vue'
import GeneratePinForm from '../views/Device/GeneratePin/Form.vue'
import ManualPinList from '../views/Device/ManualPin/List.vue'
import ManualPinForm from '../views/Device/ManualPin/Form.vue'

import OccupiedRooms from '../views/OccupiedRoom/List.vue'
import Profile from '../views/Profile/Profile.vue'

import ReferralList from '../views/Referral/List.vue'

// const Transaction = defineAsyncComponent(() =>
//    import("../views/Transaction/List.vue")
// );

import constant from "../constant/constant";
import helper from "../constant/helper";

const label = helper.GetLabel();
import module from "../constant/module";

const routes = [
   {
      path: `/${constant.router.dashboard}`,
      name: label.menu.dashboard,
      component: Dashboard,
      meta: {
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: null,
      },
   },
   {
      path: `/${constant.router.occupiedRoom}`,
      name: label.menu.occupiedRoom,
      component: OccupiedRooms,
      meta: {
         description: ``,
         keyword: "",
         formMode: null,
      },
   },

   // CATALOG
   /* ========== Property Type =========== */
   {
      //List
      path: `/${constant.router.productCategory}`,
      name: label.menu.productCategory,
      component: PropertyType,
      meta: {
         module: module.productCategory,
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: null,
      },
   },
   {
      // Create
      path: `/${constant.router.propertyType}/add`,
      name: `${label.action.create} ${label.menu.propertyType}`,
      component: PropertyTypeForm,
      meta: {
         module: module.propertyType,
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: constant.formMode.create,
      },
   },
   {
      //Update
      path: `/${constant.router.propertyType}/update/:id`,
      name: `${label.action.update} ${label.menu.propertyType}`,
      component: PropertyTypeForm,
      meta: {
         module: module.propertyType,
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: constant.formMode.update,
      },
   },
   /*=====================================*/

   /* ========== Property Facility =========== */
   {
      //List
      path: `/${constant.router.propertyFacility}`,
      name: label.menu.propertyFacility,
      component: PropertyFacility,
      meta: {
         module: module.propertyFacility,
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: null,
      },
   },
   {
      // Create
      path: `/${constant.router.propertyFacility}/add`,
      name: `${label.action.create} ${label.menu.propertyFacility}`,
      component: PropertyFacilityForm,
      meta: {
         module: module.propertyFacility,
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: constant.formMode.create,
      },
   },
   {
      //Update
      path: `/${constant.router.propertyFacility}/update/:id`,
      name: `${label.action.update} ${label.menu.propertyFacility}`,
      component: PropertyFacilityForm,
      meta: {
         module: module.propertyFacility,
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: constant.formMode.update,
      },
   },
   /*=====================================*/

   /* ========== Room Facility =========== */
   {
      //List
      path: `/${constant.router.roomFacility}`,
      name: label.menu.roomFacility,
      component: RoomFacility,
      meta: {
         module: module.roomFacility,
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: null,
      },
   },
   {
      // Create
      path: `/${constant.router.roomFacility}/add`,
      name: `${label.action.create} ${label.menu.roomFacility}`,
      component: RoomFacilityForm,
      meta: {
         module: module.roomFacility,
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: constant.formMode.create,
      },
   },
   {
      //Update
      path: `/${constant.router.roomFacility}/update/:id`,
      name: `${label.action.update} ${label.menu.roomFacility}`,
      component: RoomFacilityForm,
      meta: {
         module: module.roomFacility,
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: constant.formMode.update,
      },
   },
   /*=====================================*/

   /* ========== Charge =========== */
   {
      //List
      path: `/${constant.router.charge}`,
      name: label.menu.charge,
      component: Charge,
      meta: {
         module: module.charge,
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: null,
      },
   },
   {
      // Create
      path: `/${constant.router.charge}/add`,
      name: `${label.action.create} ${label.menu.charge}`,
      component: ChargeForm,
      meta: {
         module: module.charge,
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: constant.formMode.create,
      },
   },
   {
      //Update
      path: `/${constant.router.charge}/update/:id`,
      name: `${label.action.update} ${label.menu.charge}`,
      component: ChargeForm,
      meta: {
         module: module.charge,
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: constant.formMode.update,
      },
   },
   /*=====================================*/

   /* ========== Add On =========== */
   {
      //List
      path: `/${constant.router.addOn}`,
      name: label.menu.addOn,
      component: AddOn,
      meta: {
         module: module.addOn,
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: null,
      },
   },
   {
      // Create
      path: `/${constant.router.addOn}/add`,
      name: `${label.action.create} ${label.menu.addOn}`,
      component: AddOnForm,
      meta: {
         module: module.addOn,
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: constant.formMode.create,
      },
   },
   {
      //Update
      path: `/${constant.router.addOn}/update/:id`,
      name: `${label.action.update} ${label.menu.addOn}`,
      component: AddOnForm,
      meta: {
         module: module.addOn,
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: constant.formMode.update,
      },
   },
   /*=====================================*/

   // PROPERTY
   /* ========== Property =========== */
   {
      //List
      path: `/${constant.router.property}`,
      name: label.menu.property,
      component: Property,
      meta: {
         module: module.property,
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: null,
      },
   },
   {
      // Create
      path: `/${constant.router.property}/add`,
      name: `${label.action.create} ${label.menu.property}`,
      component: PropertyForm,
      meta: {
         module: module.property,
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: constant.formMode.create,
      },
   },
   {
      //Update
      path: `/${constant.router.property}/update/:id`,
      name: `${label.action.update} ${label.menu.property}`,
      component: PropertyForm,
      meta: {
         module: module.property,
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: constant.formMode.update,
      },
   },
   // {
   //    // View Room
   //    path: `/${constant.router.viewRoom}`,
   //    name: `${label.menu.room}`,
   //    component: PropertyViewRoom,
   //    meta: {
   //       module: module.viewRoom,
   //       description: "",
   //       keyword: "", // pemisah pakai koma
   //       formMode: null,
   //    },
   // },
   {
      path: `/${constant.router.roomTypePrice}`,
      name: `${label.menu.roomTypePrice} `,
      component: PropertyViewRoomTypePrice,
      meta: {
         navigations:[
            module.property,
            module.roomTypePrice
         ],
         module: module.roomTypePrice,
         description: "",
         keyword: "",
         formMode: null,
      },
   },
   {
      path: `/${constant.router.roomTypePrice}/add`,
      name: `${label.action.create}${label.menu.roomTypePrice}`,
      component: PropertyFormRoomType,
      meta: {
         navigations:[
            module.property,
            module.roomTypePrice
         ],
         module: module.roomTypePrice,
         description: "",
         keyword: "",
         formMode: constant.formMode.create,
      },
   },
   {
      path: `/${constant.router.roomTypePrice}/update/:roomTypeId`,
      name: `${label.action.update}${label.menu.roomTypePrice}`,
      component: PropertyFormRoomType,
      meta: {
         navigations:[
            module.property,
            module.roomTypePrice
         ],
         module: module.roomTypePrice,
         description: "",
         keyword: "",
         formMode: constant.formMode.update,
      },
   },

   //RoomTye No Price
   {
      path: `/${constant.router.roomTypeNoPrice}`,
      name: `${label.menu.roomTypeNoPrice}`,
      component: PropertyViewRoomTypeNoPrice,
      meta: {
         module: module.roomTypeNoPrice,
         navigations:[
            module.property,
            module.roomTypeNoPrice
         ],
         description: "",
         keyword: "",
         formMode: null,
      },
   },
   {
      path: `/${constant.router.roomNoPrice}`,
      name: `${label.menu.roomNoPrice}`,
      component: PropertyViewRoomNoPrice,
      meta: {
         navigations:[
            module.property,
            module.roomTypePrice,
            module.roomNoPrice,
         ],
         module: module.roomNoPrice,
         description: "",
         keyword: "",
         formMode: null,
      },
   },
   {
      path: `/${constant.router.roomNoPrice}/:roomId/history-status`,
      name: `${label.menu.roomNoPrice} History Status`,
      component: PropertyStatusHistory,
      meta: {
         navigations:[
            module.property,
            module.roomTypePrice,
            module.roomNoPrice,
            {name: 'Status History'}
         ],
         module: module.roomNoPrice,
         description: "",
         keyword: "", // pemisah pakai koma
         formMode: null,
      },
   },
   {
      path: `/${constant.router.roomNoPrice}/:roomId/history-lock`,
      name: `${label.menu.roomNoPrice} Lock History`,
      component: RoomLockHistory,
      meta: {
         navigations:[
            module.property,
            module.roomTypePrice,
            module.roomNoPrice,
            {name: 'Lock History'}
         ],
         module: module.roomNoPrice,
         description: "",
         keyword: "",
         formMode: null,
      },
   },
   {
      path: `/${constant.router.roomPrice}`,
      name: `${label.menu.roomPrice}`,
      component: PropertyViewRoomPrice,
      meta: {
         navigations:[
            module.property,
            module.roomTypeNoPrice,
            module.roomPrice,
         ],
         module: module.roomPrice,
         description: "",
         keyword: "",
         formMode: null,
      },
   },
   {
      path: `/${constant.router.roomPrice}/add`,
      name: `${label.action.create} ${label.menu.roomPrice}`,
      component: PropertyRoomPriceForm,
      meta: {
         navigations:[
            module.property,
            module.roomTypeNoPrice,
            module.roomPrice,
         ],
         module: module.roomPrice,
         description: "",
         keyword: "",
         formMode: constant.formMode.create,
      },
   },
   {
      path: `/${constant.router.roomPrice}/update/:roomId`,
      name: `${label.action.update} ${label.menu.roomPrice}`,
      component: PropertyRoomPriceForm,
      meta: {
         navigations:[
            module.property,
            module.roomTypeNoPrice,
            module.roomPrice,
         ],
         module: module.roomPrice,
         description: "",
         keyword: "",
         formMode: constant.formMode.update,
      },
   },
   {
      path: `/${constant.router.roomPrice}/:roomId/history-status`,
      name: `${label.menu.roomPrice} History Status`,
      component: PropertyStatusHistory,
      meta: {
         navigations:[
            module.property,
            module.roomTypeNoPrice,
            module.roomPrice,
            {name: 'Status History'}
         ],
         module: module.roomPrice,
         description: "",
         keyword: "", // pemisah pakai koma
         formMode: null,
      },
   },
   {
      path: `/${constant.router.roomPrice}/:roomId/history-lock`,
      name: `${label.menu.roomPrice} Lock History`,
      component: RoomLockHistory,
      meta: {
         navigations:[
            module.property,
            module.roomTypeNoPrice,
            module.roomPrice,
            {name: 'Lock History'}
         ],
         module: module.roomPrice,
         description: "",
         keyword: "",
         formMode: null,
      },
   },
   /*=====================================*/

   /* ========== Calendar =========== */
   {
      path: `/${constant.router.calendar}`,
      name: label.menu.calendar,
      component: Calendar,
      meta: {
         module: module.calendar,
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: null,
      },
   },
   /* ===================================*/

   /* ========== Manual Booking =========== */
   // {
   //    path: `/${constant.router.booking}`,
   //    name: label.menu.booking,
   //    component: Booking,
   //    meta: {
   //       module: module.booking,
   //       description: "",
   //       keyword: "",
   //       formNode: null,
   //    },
   // },

   //Transaction
   /* ========== Payment Type ==========*/
   {
      path: `/${constant.router.paymentType}`,
      name: label.menu.paymentType,
      component: PaymentType,
      meta: {
         module: module.paymentType,
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: null,
      },
   },
   {
      // Create
      path: `/${constant.router.paymentType}/add`,
      name: `${label.action.create} ${label.menu.paymentType}`,
      component: PaymentTypeForm,
      meta: {
         module: module.paymentType,
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: constant.formMode.create,
      },
   },
   {
      //Update
      path: `/${constant.router.paymentType}/update/:id`,
      name: `${label.action.update} ${label.menu.paymentType}`,
      component: PaymentTypeForm,
      meta: {
         module: module.paymentType,
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: constant.formMode.update,
      },
   },
   /* =================================== */
   /* ========== Payment Method ==========*/
   {
      path: `/${constant.router.paymentMethod}`,
      name: label.menu.paymentMethod,
      component: PaymentMethod,
      meta: {
         module: module.paymentMethod,
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: null,
      },
   },
   {
      // Create
      path: `/${constant.router.paymentMethod}/add`,
      name: `${label.action.create} ${label.menu.paymentMethod}`,
      component: PaymentMethodForm,
      meta: {
         module: module.paymentMethod,
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: constant.formMode.create,
      },
   },
   {
      //Update
      path: `/${constant.router.paymentMethod}/update/:id`,
      name: `${label.action.update} ${label.menu.paymentMethod}`,
      component: PaymentMethodForm,
      meta: {
         module: module.paymentMethod,
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: constant.formMode.update,
      },
   },
   /* =================================== */

   /* ========== Payment History ==========*/
   {
      path: `/${constant.router.paymentHistory}`,
      name: label.menu.paymentHistory,
      component: PaymentHistory,
      meta: {
         module: module.paymentHistory,
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: null,
      },
   },
   /* =================================== */

   /* ========== Manual Booking ==========*/
   {
      path: `/${constant.router.manualBooking}`,
      name: label.menu.manualBooking,
      component: ManualBooking,
      meta: {
         module: module.booking,
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: null,
      },
   },
   /* =================================== */

   /* ============ Report ============== */
   {
      path: `/${constant.router.report}`,
      name: label.menu.report,
      component: Report,
      meta: {
         module: module.report,
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: null,
      },
   },
   {
      path: `/${constant.router.viewReport}`,
      name: `${label.action.view} ${label.menu.report}`,
      component: ViewReport,
      meta: {
         module: module.report,
         description: ``,
         keyword: ``,
         formMode: null,
      },
   },
   /* ================================== */

   /* ============ Transaction ============== */
   // {
   //    path: `/${constant.router.transaction}`,
   //    name: label.menu.transaction,
   //    component: Transaction,
   //    meta: {
   //       module: module.transaction,
   //       description: ``,
   //       keyword: "", // pemisah pakai koma
   //       formMode: null,
   //    },
   // },
   /* ================================== */

   /* ============== Admin ============== */
   {
      path: `/${constant.router.user}`,
      name: label.menu.user,
      component: User,
      meta: {
         module: module.user,
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: null,
      },
   },
   {
      // Create
      path: `/${constant.router.user}/add`,
      name: `${label.action.create} ${label.menu.user}`,
      component: UserForm,
      meta: {
         module: module.user,
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: constant.formMode.create,
      },
   },
   {
      //Update
      path: `/${constant.router.user}/update/:id`,
      name: `${label.action.update} ${label.menu.user}`,
      component: UserForm,
      meta: {
         module: module.user,
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: constant.formMode.update,
      },
   },
   /* ================================== */

   /* ============== Member ============ */
   {
      path: `/${constant.router.member}`,
      name: label.menu.member,
      component: Member,
      meta: {
         module: module.user,
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: null,
      },
   },
   /* =================================== */

   // DEVICE
   /* ========== Lock ========= */
   {
      // List
      path: `/${constant.router.deviceLock}`,
      name: label.menu.deviceLock,
      component: Lock,
      meta: {
         module: module.deviceLock,
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: null,
      },
   },
   {
      // Create
      path: `/${constant.router.deviceLock}/add`,
      name: `${label.action.create} ${label.menu.deviceLock}`,
      component: LockForm,
      meta: {
         module: module.deviceLock,
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: constant.formMode.create,
      },
   },
   {
      //Update
      path: `/${constant.router.deviceLock}/update/:id`,
      name: `${label.action.update} ${label.menu.deviceLock}`,
      component: LockForm,
      meta: {
         module: module.deviceLock,
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: constant.formMode.update,
      },
   },
   /*=====================================*/

   /* ========== Gateway =========== */
   {
      // List
      path: `/${constant.router.deviceGateway}`,
      name: label.menu.deviceGateway,
      component: Gateway,
      meta: {
         module: module.deviceGateway,
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: null,
      },
   },
   {
      // Create
      path: `/${constant.router.deviceGateway}/add`,
      name: `${label.action.create} ${label.menu.deviceGateway}`,
      component: GatewayForm,
      meta: {
         module: module.deviceGateway,
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: constant.formMode.create,
      },
   },
   {
      //Update
      path: `/${constant.router.deviceGateway}/update/:id`,
      name: `${label.action.update} ${label.menu.deviceGateway}`,
      component: GatewayForm,
      meta: {
         module: module.deviceGateway,
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: constant.formMode.update,
      },
   },
   /*=====================================*/
   /* ========== Generate Pin ===========*/
   {
      //List
      path: `/${constant.router.generatePin}`,
      name: label.menu.generatePin,
      component: GeneratePinList,
      meta: {
         module: module.generatePin,
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: null,
      },
   },
   {
      // Create
      path: `/${constant.router.generatePin}/add`,
      name: `${label.action.create} ${label.menu.generatePin}`,
      component: GeneratePinForm,
      meta: {
         module: module.generatePin,
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: constant.formMode.create,
      },
   },
   {
      //Update
      path: `/${constant.router.generatePin}/update/:id`,
      name: `${label.action.update} ${label.menu.generatePin}`,
      component: GeneratePinForm,
      meta: {
         module: module.generatePin,
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: constant.formMode.update,
      },
   },
   /* =========================== */ 

    /* ========== Manual Pin ===========*/
    {
      //List
      path: `/${constant.router.manualPin}`,
      name: label.menu.manualPin,
      component: ManualPinList,
      meta: {
         module: module.manualPin,
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: null,
      },
   },
   {
      // Create
      path: `/${constant.router.manualPin}/add`,
      name: `${label.action.create} ${label.menu.manualPin}`,
      component: ManualPinForm,
      meta: {
         module: module.manualPin,
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: constant.formMode.create,
      },
   },
   {
      //Update
      path: `/${constant.router.manualPin}/update/:id`,
      name: `${label.action.update} ${label.menu.manualPin}`,
      component: ManualPinForm,
      meta: {
         module: module.manualPin,
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: constant.formMode.update,
      },
   },
   /* =========================== */ 

   //ROLE
   /* ========== Role =========== */
   {
      // List
      path: `/${constant.router.role}`,
      name: label.menu.role,
      component: Role,
      meta: {
         module: module.role,
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: null,
      },
   },
   {
      // Create
      path: `/${constant.router.role}/add`,
      name: `${label.action.create} ${label.menu.role}`,
      component: RoleForm,
      meta: {
         module: module.role,
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: constant.formMode.create,
      },
   },
   {
      //Update
      path: `/${constant.router.role}/update/:id`,
      name: `${label.action.update} ${label.menu.role}`,
      component: RoleForm,
      meta: {
         module: module.role,
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: constant.formMode.update,
      },
   },
   /*=====================================*/

   //Cleaning
   /* ========== Histories =========== */
   {
      // List
      path: `/${constant.router.cleaningHistories}`,
      name: label.menu.cleaningHistories,
      component: CleaningHistories,
      meta: {
         module: module.cleaningHistories,
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: null,
      },
   },
   {
      //Detail
      path: `/${constant.router.role}/detail/:id`,
      name: `Detail ${label.menu.cleaningHistories}`,
      component: CleaningHistoryDetail,
      meta: {
         module: module.cleaningHistories,
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: constant.formMode.history,
      },
   },
   /* ========== Session =========== */
   {
      // List
      path: `/${constant.router.cleaningSession}`,
      name: label.menu.cleaningSession,
      component: CleaningSessions,
      meta: {
         module: module.cleaningSession,
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: null,
      },
   },
   /*=====================================*/

   {
      // List
      path: `/${constant.router.setting}`,
      name: label.menu.setting,
      component: Setting,
      meta: {
         module: module.setting,
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: null,
      },
   },


   /* ========== Others =========== */
   {
      path: `${constant.router.profile}`,
      name: `Profile`,
      component: Profile,
      meta: {
         module: null,
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: null,
      },
   },
   {
      path: `/login`,
      name: `MIJ-Komp - Login`,
      component: Login,
      meta: {
         module: module.user,
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: constant.formMode.create,
      },
   },
   {
      path: `/register`,
      name: `Cloudhomes - Register`,
      component: Register,
      meta: {
         module: module.user,
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: constant.formMode.create,
      },
   },
   {
      path: `/:pathMatch(.*)*`,
      name: `Url Not Valid`,
      component: NotFound,
      meta: {
         page: "404",
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: constant.formMode.create,
      },
   },

   {
      // List
      path: `/${constant.router.referral}`,
      name: label.menu.referral,
      component: ReferralList,
      meta: {
         module: module.referral,
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: null,
      },
   }
];

/* =============================== */

const router = createRouter({
   history: createWebHistory(),
   routes,
});

router.beforeEach(async (to, from, next) => {
   if (to.path == `/`) {
      next(`/dashboard`);
   }
   document.title = to.name || "Cloud Homes Admin";
   document
      .querySelector('meta[name="description"]')
      .setAttribute("content", to.meta.description);
   document
      .querySelector('meta[name="keywords"]')
      .setAttribute("content", to.meta.keyword);

   document
      .querySelector('meta[property="og:title"]')
      .setAttribute("content", to.name);
   document
      .querySelector('meta[property="og:description"]')
      .setAttribute("content", to.meta.description);
   document
      .querySelector('meta[property="og:keywords"]')
      .setAttribute("content", to.meta.keyword);
   document
      .querySelector('meta[property="og:image"]')
      .setAttribute("content", `${window.location.host}/favicon.png`);
   // meta(to)
   next();
});
export default router;
