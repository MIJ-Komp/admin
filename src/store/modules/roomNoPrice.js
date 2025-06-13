const state = {};

const mutations = {};

import axios from "../axios";
const actions = {
   async getAll({}, data) {
      return await axios.get(`/room/getAll`, { params: data });
   },

   async getOccupiedRooms({}, data) {
      return await axios.get(`/room/getOccupiedRooms`, { params: data });
   },

   async getById({}, id) {
      return await axios.get(`/room/${id}`);
   },

   async create({}, data) {
      return await axios.post(`/room/addByPriceType`, data);
   },

   async update({}, data) {
      return await axios.put(`/room/editRoomByPriceType/${data.id}`, data);
   },

   async updateStatus({}, data) {
      return await axios.put(`/room/updateRoomStatus`, data);
   },

   async setRoomLock({}, data) {
      return await axios.put(`/room/setLock/${data.id}`, data);
   },

   async getLockRecords({}, roomId) {
      return await axios.get(`/room/lockRecords/${roomId}`, data);
   },

   async delete({}, id) {
      return await axios.delete(`/room/${id}`);
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
