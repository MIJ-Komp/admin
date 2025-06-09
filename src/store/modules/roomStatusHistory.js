// store/modules/viewRoom.js
const state = {
   user: null,
};

const mutations = {};
import moment from 'moment'

import axios from "../axios";
const actions = {

   async getAll({ commit }, data) {
      var datas = await axios.get(`/room/roomStatus/${data.roomId}`, { params: data });
      datas = datas.map(data=> Object.assign(data, ({Date: moment(data.CreatedOn).format("DD MMM yyyy")})))
      return datas;
      
      var list = [];
      for (let index = 0; index < 150; index++) {
         list.push({
            Id: "85842-38922-52123-321312",
            OwnerId: 1,
            RoomId: 1,
            Status: 1,
            Description: "Apartment",
            CreatedOn: new Date(),
            CreatedBy: "Admin King",
         });
      }
      return list;
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
