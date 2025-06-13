const state = {};

const mutations = {};

import axios from "../axios";
const actions = {
   async getAll({}, data) {
      return await axios.get(`/roomType/getAll`, { params: data });
   },

   async create({}, data) {
      return await axios.post("/roomType", data);
   },
   async delete({}, id) {
      return await axios.delete(`/roomType/${id}`);
   },
   async update({}, data) {
      return await axios.put(`/roomType/${data.id}`, data);
   },
   async getById({}, id) {
      return await axios.get(`/roomType/${id}`);
   },
};

const getters = {};

export default {
   namespaced: true,
   state,
   mutations,
   actions,
   getters,
};
