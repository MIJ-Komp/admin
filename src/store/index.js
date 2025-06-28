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
      compatibleRule
   },
});
