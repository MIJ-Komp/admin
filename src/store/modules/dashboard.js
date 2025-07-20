import axios from '../axios'
import moment from 'moment/moment';
const state = {
   totalSales: 0,
   totalOrder: 0,
   totalPendingOrder: 0,
   totalActiveProduct: 0,
   stockAlert: [],
   bestSellingProduct: []
};

const mutations = {
   setDashboardData(state, data) {
      state.totalSales = data.totalSales;
      state.totalOrder = data.totalOrder;
      state.totalPendingOrder = data.totalPendingOrder;
      state.totalActiveProduct = data.totalActiveProduct;
      state.stockAlert = data.stockAlert;
      state.bestSellingProduct = data.bestSellingProduct;
   }
};

const actions = {
   async getDashboardData({ commit }, params) {
      const response = await axios.get('/admin/dashboard', { 
         params: {
            fromDate: params?.startDate ? moment(params?.startDate).format("yyyy-MM-DD") : null,
            toDate: params?.endDate ? moment(params?.endDate).format("yyyy-MM-DD") : null,
            // filterCategory: params?.filterCategory
         }
      });
      commit('setDashboardData', response);
      return response;
   }
};

export default {
   namespaced: true,
   state,
   mutations,
   actions
};