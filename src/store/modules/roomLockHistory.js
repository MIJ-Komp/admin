// store/modules/viewRoom.js
const state = {
   user: null,
};

const mutations = {};

import axios from "../axios";
const actions = {
   async getAll({}, data) {
      return await axios.get(`/room/lockRecords/${data.roomId}`, {
         params: data,
      });
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
