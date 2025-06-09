import axios from "../axios";
const state = {
   salesPerDate: [],
   topProperty: [],
   cleaningHistory: [],
};

const mutations = {
   setSalesPerDate(state, data) {
      state.salesPerDate = data;
   },
   setTopProperty(state, data) {
      state.topProperty = data;
   },
   setCleaningHistory(state, data) {
      state.cleaningHistory = data;
   },
};

const actions = {
   async getSalesPerDate({ commit }, data) {
      const response = await axios.get(
         `/report/sales-per-date?propertyId=${data.PropertyId}&fromDate=${data.FromDate}&toDate=${data.ToDate}`
      );
      commit("setSalesPerDate", response);
      return response;
   },
   async getTopProperty({ commit }, data) {
      const response = await axios.get(
         `/report/top-property?fromDate=${data.FromDate}&toDate=${data.ToDate}`
      );
      commit("setTopProperty", response);
      return response;
   },
   async getCleaningHistory({ commit }, data) {
      const response = await axios.get(
         `/report/cleaning-history?fromDate=${data.FromDate}&toDate=${data.ToDate}`
      );
      commit("setCleaningHistory", response);
      return response;
   },
};

const getters = {
   salesPerdate: (state) => state.salesPerDate,
   topProperty: (state) => state.topProperty,
   cleaningHistory: (state) => state.cleaningHistory,
};

export default {
   namespaced: true,
   state,
   mutations,
   actions,
   getters,
};
