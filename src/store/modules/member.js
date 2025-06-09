const state = {
};

const mutations = {
};
import axios from "../axios";
const actions = {
   async getAll({ commit }) {
      return await axios.get("/user/getAllUser?Page=-1&Limit=-1");
   },
};

const getters = {
};

export default {
   namespaced: true,
   state,
   mutations,
   actions,
   getters,
};
