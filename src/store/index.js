import { createStore } from "vuex";

import data from "./modules/data";
import paymentHistory from "./modules/paymentHistory";
import product from "./modules/product";
import productCategory from "./modules/productCategory";
import productBundle from "./modules/productBundle";
import transaction from "./modules/transaction";
import menu from "./modules/menu";
import user from "./modules/user";
import componentType from "./modules/componentType";
import compatibleRule from "./modules/compatibleRule";
import brand from "./modules/brand.js";
import payment from "./modules/payment.js";
import dashboard from "./modules/dashboard.js";
import reports from "./modules/reports.js";

export default createStore({
   modules: {
      data,
      paymentHistory,
      product,
      productCategory,
      productBundle,
      transaction,
      menu,
      user,
      componentType,
      compatibleRule,
      brand,
      payment,
      dashboard,
      reports
   },
});
