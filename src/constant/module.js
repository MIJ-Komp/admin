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
   productCategory: {
      id: 3,
      name: "productCategory",
      form: () => import("../views/Catalog/ProductCategory/Form.vue"),
   },
   componentType: {
      id: 4,
      name: "componentType",
      form: () => import("../views/Catalog/ComponentType/Form.vue"),
   },
   compatibleRule: {
      id: 4,
      name: "compatibleRule",
      form: () => import("../views/Catalog/CompatibleRule/Form.vue"),
   },

   // facility:   { id: 4, name: "facility" },
   product: {
      id: 5,
      name: "product",
      form: async () => import("../views/Catalog/Product/Form.vue"),
   },
   productBundle: {
      id: 6,
      name: "productBundle",
      form: async () => import("../views/Catalog/Product/Form.vue"),
   },

   menu: {
      id: 7,
      name: "menu",
   },
   data: { id: 99, name: "data" },
   dashboard: {
      id: 100,
      name: "dashboard",
   },
};
export default module;
