const state = {
   user: null,
};

const mutations = {};

import axios from "../axios";
const actions = {
   async getAll({ commit }) {
      return await axios.get("/property/getAll");
   },
   async create({ commit }, data) {
      return await axios.post("/property", data);
   },
   async delete({ commit }, id) {
      return await axios.delete(`/property/${id}`);
   },
   async update({ commit }, data) {
      return await axios.put(`/property/${data.id}`, data);
   },
   async getById({ commit }, id) {
      return await axios.get(`/property/${id}`);
   },
   async getLocks({}) {
      return await axios.get(`/property/locks`);
   },
   async syncLocks({}) {
      return await axios.get(`/property/syncLocks`);
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
