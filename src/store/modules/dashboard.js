import axios from '../axios'
import moment from 'moment';

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
            fromDate: moment(params?.startDate).format('YYYY-MM-DD'),
            toDate: moment(params?.endDate).format('YYYY-MM-DD'),
            filterCategory: params?.filterCategory
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