const state = {
   user: null,
};

const mutations = {};

import axios from "../axios";
const actions = {
   async getAll({ commit }) {
      console.log('masuk')
      return [
         {Id : 1, Name: 'BCA Virtual Account'},
         {Id : 2, Name: 'Xendit'},
      ]
      return await axios.get("/payment-method-type");
   },
   async create({ commit }, data) {
      return await axios.post("/payment-method-type", data);
   },
   async delete({ commit }, id) {
      return await axios.delete(`/payment-method-type/${id}`);
   },
   async update({ commit }, data) {
      return await axios.patch(`/payment-method-type/${data.Id}`, data);
   },
   async getById({ commit }, id) {
      return await axios.getById(`/payment-method-type/${id}`);
   },
};

const getters = {
   user: (state) => state.user,
};

export default {
   namespaced: true,
   state,
   mutations,
   actions,
   getters,
};
