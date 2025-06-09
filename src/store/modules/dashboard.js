import axios from "../axios";
const state = {
   totalRevenue: 0,
   nowData: [],
   topProperty: [],
   revenueState: [],
   topAddOns: [],
   recentActivity: [],
   bookingHistory: [],
};

const mutations = {
   setTotalRevenue(state, data) {
      state.totalRevenue = data;
   },
   setNowData(state, data) {
      state.nowData = data;
   },
   setTopProperty(state, data) {
      state.topProperty = data;
   },
   setRevenueState(state, data) {
      state.revenueState = data;
   },
   setTopAddOns(state, data) {
      state.topAddOns = data;
   },
   setRecentActivity(state, activities) {
      state.recentActivity = activities;
   },
   setBookingHistory(state, bookings) {
      state.bookingHistory = bookings;
   },
};

const actions = {
   async getTotalRevenue({ commit }, data) {
      const response = await axios.get(
         `/dashboard/total-revenue?filterProperty=${data.filterProperty}`
      );
      commit("setTotalRevenue", response);
      return response;
   },
   async getNowData({ commit }, data) {
      const response = await axios.get(
         `/dashboard/now-data?filterProperty=${data.filterProperty}`
      );
      commit("setNowData", response);
      return response;
   },
   async getRoomAvailability({ commit }, data) {
      const response = await axios.get(
         `/dashboard/room-availability?filterProperty=${data.filterProperty}`
      );
      return response;
   },
   async getTopProperty({ commit }) {
      const response = await axios.get(`/dashboard/top-property`);
      commit("setTopProperty", response);
      return response;
   },
   async getRevenueState({ commit }, data) {
      const response = await axios.get(
         `/dashboard/revenue-state?filterYear=${data.filterYear}&filterProperty=${data.filterProperty}`
      );
      commit("setRevenueState", response);
      return response;
   },
   async getTopAddOns({ commit }, data) {
      const response = await axios.get(
         `/dashboard/top-add-ons?filterProperty=${data.filterProperty}`
      );
      commit("setTopAddOns", response);
      return response;
   },
   async getBookingHistory({ commit }) {
      const response = await axios.get(`/dashboard/booking-history`);
      commit("setBookingHistory", response);
      return response;
   },
   async getRecentActivities({ commit }) {
      const response = await axios.get(`/dashboard/recent-activity`);
      commit("setRecentActivity", response);
      return response;
   },
};

const getters = {
   totalRevenue: (state) => state.totalRevenue,
   recentActivity: (state) => state.recentActivity,
   topProperty: (state) => state.topProperty,
   revenueState: (state) => state.revenueState,
   topAddOns: (state) => state.topAddOns,
   bookingHistory: (state) => state.bookingHistory,
   nowData: (state) => state.nowData,
};

export default {
   namespaced: true,
   state,
   mutations,
   actions,
   getters,
};
