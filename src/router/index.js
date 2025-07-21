import { defineAsyncComponent } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import NotFound from "../views/404.vue";

//Catalog
import ProductCategory from "../views/Catalog/ProductCategory/List.vue";
import ProductCategoryForm from "../views/Catalog/ProductCategory/Form.vue";

import ComponentType from "../views/Catalog/ComponentType/List.vue";
import ComponentTypeForm from "../views/Catalog/ComponentType/Form.vue";

// import CompatibleRule from "../views/Catalog/CompatibleRule/List.vue";
import CompatibleRuleForm from "../views/Catalog/CompatibleRule/Form.vue";

import Brand from "../views/Catalog/Brand/List.vue";
import BrandForm from "../views/Catalog/Brand/Form.vue";

import Product from "../views/Catalog/Product/List.vue";
import ProductBundle from "../views/Catalog/ProductBundle/List.vue";
import ProductForm from "../views/Catalog/Product/Form.vue";

import Transaction from "../views/Transaction/paymentHistory/List.vue";

import Menu from "../views/Catalog/Menu/List.vue";
import constant from "../constant/constant";
import helper from "../constant/helper";


import Payment from "../views/Payment/List.vue";
import PaymentForm from "../views/Payment/Form.vue";

import SalesReport from "../views/Reports/SalesReport.vue";
import OrderReport from "../views/Reports/OrderReport.vue";
import ProductReport from "../views/Reports/ProductReport.vue";
import StockReport from "../views/Reports/StockReport.vue";



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
   // CATALOG
   /* ========== Product Category =========== */
   {
      //List
      path: `/${constant.router.productCategory}`,
      name: label.menu.productCategory,
      component: ProductCategory,
      meta: {
         module: module.productCategory,
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: null,
      },
   },
   {
      // Create
      path: `/${constant.router.productCategory}/add`,
      name: `${label.action.create} ${label.menu.productCategory}`,
      component: ProductCategoryForm,
      meta: {
         module: module.productCategory,
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: constant.formMode.create,
      },
   },
   {
      //Update
      path: `/${constant.router.productCategory}/update/:id`,
      name: `${label.action.update} ${label.menu.productCategory}`,
      component: ProductCategoryForm,
      meta: {
         module: module.productCategory,
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: constant.formMode.update,
      },
   },
   /*=====================================*/


   /* ========== Component Type =========== */
   {
      //List
      path: `/${constant.router.componentType}`,
      name: label.menu.componentType,
      component: ComponentType,
      meta: {
         module: module.componentType,
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: null,
      },
   },
   {
      // Create
      path: `/${constant.router.componentType}/add`,
      name: `${label.action.create} ${label.menu.componentType}`,
      component: ComponentTypeForm,
      meta: {
         module: module.componentType,
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: constant.formMode.create,
      },
   },
   {
      //Update
      path: `/${constant.router.componentType}/update/:id`,
      name: `${label.action.update} ${label.menu.componentType}`,
      component: ComponentTypeForm,
      meta: {
         module: module.componentType,
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: constant.formMode.update,
      },
   },
   /*=====================================*/

   /* ========== Product =========== */
   {
      //List
      path: `/${constant.router.product}`,
      name: label.menu.product,
      component: Product,
      meta: {
         module: module.product,
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: null,
      },
   },
   {
      // Create
      path: `/${constant.router.product}/add`,
      name: `${label.action.create} ${label.menu.product}`,
      component: ProductForm,
      meta: {
         module: module.product,
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: constant.formMode.create,
      },
   },
   {
      //Update
      path: `/${constant.router.product}/update/:id`,
      name: `${label.action.update} ${label.menu.product}`,
      component: ProductForm,
      meta: {
         module: module.product,
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: constant.formMode.update,
      },
   },
   /*=====================================*/

   /* ========== ProductBundle =========== */
   {
      //List
      path: `/${constant.router.productBundle}`,
      name: label.menu.productBundle,
      component: ProductBundle,
      meta: {
         module: module.productBundle,
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: null,
      },
   },
   {
      // Create
      path: `/${constant.router.productBundle}/add`,
      name: `${label.action.create} ${label.menu.productBundle}`,
      component: ProductForm,
      meta: {
         module: module.productBundle,
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: constant.formMode.create,
      },
   },
   {
      //Update
      path: `/${constant.router.productBundle}/update/:id`,
      name: `${label.action.update} ${label.menu.productBundle}`,
      component: ProductForm,
      meta: {
         module: module.productBundle,
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: constant.formMode.update,
      },
   },
   /*=====================================*/

   /* ========== Compatible Rule =========== */
   {
      //List
      path: `/${constant.router.compatibleRule}`,
      name: label.menu.compatibleRule,
      component: CompatibleRuleForm,
      meta: {
         module: module.compatibleRule,
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: null,
      },
   },
   /*=====================================*/

      /* ========== Brand =========== */
   {
      //List
      path: `/${constant.router.brand}`,
      name: label.menu.brand,
      component: Brand,
      meta: {
         module: module.brand,
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: null,
      },
   },
   {
      // Create
      path: `/${constant.router.brand}/add`,
      name: `${label.action.create} ${label.menu.brand}`,
      component: BrandForm,
      meta: {
         module: module.brand,
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: constant.formMode.create,
      },
   },
   {
      //Update
      path: `/${constant.router.brand}/update/:id`,
      name: `${label.action.update} ${label.menu.brand}`,
      component: BrandForm,
      meta: {
         module: module.brand,
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: constant.formMode.update,
      },
   },
   /*=====================================*/

   {
      //List
      path: `/${constant.router.menu}`,
      name: label.menu.menu,
      component: Menu,
      meta: {
         module: module.menu,
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: null,
      },
   },
   /*=====================================*/

   /* ============ Transaction ============== */
   {
      path: `/${constant.router.transaction}`,
      name: label.menu.transaction,
      component: Transaction,
      meta: {
         module: module.transaction,
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: null,
      },
   },
   /* ================================== */
     /* ========== Payment =========== */
   {
      //List
      path: `/${constant.router.payment}`,
      name: label.menu.payment,
      component: Payment,
      meta: {
         module: module.payment,
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: null,
      },
   },
   {
      // Create
      path: `/${constant.router.payment}/update/:id`,
      name: `${label.action.create} ${label.menu.payment}`,
      component: PaymentForm,
      meta: {
         module: module.payment,
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: constant.formMode.update,
      },
   },
   //Reportss
   {
      //List
      path: `/${constant.router.salesReport}`,
      name: label.menu.salesReport,
      component: SalesReport,
      meta: {
         module: module.report,
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: null,
      },
   },
   {
      //List
      path: `/${constant.router.orderReport}`,
      name: label.menu.orderReport,
      component: OrderReport,
      meta: {
         module: module.report,
         description: ``,
         keyword: "", // pemisah pakai koma
         formMode: null,
      },
   },
   // {
   //    //List
   //    path: `/${constant.router.productReport}`,
   //    name: label.menu.productReport,
   //    component: ProductReport,
   //    meta: {
   //       module: module.report,
   //       description: ``,
   //       keyword: "", // pemisah pakai koma
   //       formMode: null,
   //    },
   // },
   // {
   //    //List
   //    path: `/${constant.router.stockReport}`,
   //    name: label.menu.stockReport,
   //    component: StockReport,
   //    meta: {
   //       module: module.report,
   //       description: ``,
   //       keyword: "", // pemisah pakai koma
   //       formMode: null,
   //    },
   // },

   /* ========== Others =========== */
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
