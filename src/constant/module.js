//Ini adalah Modul pada Frontend
//Agar frontend dapat memilah-milah setiap menu dan aksi
//id disini tidak terlalu dbutuhkan

const module = {
   user: {
      id: 1,
      name: "user",
      form: async () => import("../views/User/Admin/Form.vue"),
   },
   role: {
      id: 2,
      name: "role",
      form: async () => import("../views/User/Role/Form.vue"),
   },
   propertyType: {
      id: 3,
      name: "propertyType",
      form: () => import("../views/Catalog/PropertyType/Form.vue"),
   },

   // facility:   { id: 4, name: "facility" },
   propertyFacility: {
      id: 4,
      name: "propertyFacility",
      form: async () => import("../views/Catalog/PropertyFacility/Form.vue"),
   },
   roomFacility: {
      id: 4,
      name: "roomFacility",
      form: async () => import("../views/Catalog/RoomFacility/Form.vue"),
   },

   charge: {
      id: 5,
      name: "charge",
      form: async () => import("../views/Catalog/Charge/Form.vue"),
   },
   addOn: {
      id: 6,
      name: "addOn",
      form: async () => import("../views/Catalog/AddOn/Form.vue"),
   },
   property: {
      id: 7,
      name: "property",
      form: async () => import("../views/Property/Property/Form.vue"),
   },
   room: {
      id: 8,
      name: "room",
   },
   paymentType: {
      id: 9,
      name: "paymentType",
      form: () => import("../views/Transaction/PaymentType/Form.vue"),
   },
   paymentMethod: {
      id: 10,
      name: "paymentMethod",
      form: () => import("../views/Transaction/PaymentMethod/Form.vue"),
   },
   // device: { id: 11, name: "device" }, `
   deviceLock: {
      id: 11,
      name: "deviceLock",
      form: async () => import("../views/Device/Lock/Form.vue"),
   },
   deviceGateway: {
      id: 11,
      name: "deviceGateway",
      form: async () => import("../views/Device/Gateway/Form.vue"),
   },

   booking: { id: 12, name: "booking" },

   calendar: {
      id: 6,
      name: "calendar",
      form: async () => import("../views/Calendar/index.vue"),
   },

   roomNoPrice: {
      id: 14,
      name: "roomNoPrice",
      form: null,
   },
   roomPrice: {
      id: 15,
      name: "roomPrice",
      form: () => import("../views/Property/Property/Room/Price/Form.vue"),
   },
   roomTypePrice: {
      id: 16,
      name: "roomTypePrice",
      form: () => import("../views/Property/Property/RoomType/Price/Form.vue"),
   },
   roomTypeNoPrice: {
      id: 17,
      name: "roomTypeNoPrice",
   },
   roomStatusHistory: {
      id: 18,
      name: "roomStatusHistory",
   },
   roomLockHistory: {
      id: 19,
      name: "roomLockHistory",
   },
   roomAvailability: {
      id: 20,
      name: "roomAvailability",
   },
   transaction: {
      id: 21,
      name: "transaction",
   },
   paymentHistory: {
      id: 22,
      name: "paymentHistory",
   },
   booking: {
      id: 23,
      name: "booking",
   },
   report: {
      id: 24,
      name: "report",
   },
   cleaningSession :{id: 25, name:'cleaningSession'},
   cleaningHistories :{id: 26, name:'cleaningHistories'},
   setting: {id: 27, name: "setting",},
   generatePin: {id: 28, name: "generatePin",},
   member: {id: 29, name: "member",},
   manualPin: {id: 28, name: "manualPin",},
   referral: {Id: 29, name: "referral",},

   data: { id: 99, name: "data" },
   
   dashboard: {
      id: 100,
      name: "dashboard",
   },
};
export default module;
