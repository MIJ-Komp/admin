const state = {
    user: null,
};

const mutations = {
};

import axios from '../axios'
import { CleaningType } from '../../constant/enums/RoomStatus';
const actions = {
    async getAll({ commit }, params) {
        var returnData= await axios.get('/referral/commission', {params: params})
        // return returnData;

        const getLatestCommissions = (data) => {
            const userMap = new Map();
            const commissionSum = new Map();
          
            data.forEach((entry) => {
              const commissionValue = parseFloat(entry.Commission);
              commissionSum.set(
                entry.UserId,
                (commissionSum.get(entry.UserId) || 0) + commissionValue
              );
          
              const existingEntry = userMap.get(entry.UserId);
              if (!existingEntry || new Date(entry.CreatedOn) > new Date(existingEntry.CreatedOn)) {
                userMap.set(entry.UserId, { ...entry, TotalCommission: commissionSum.get(entry.UserId) });
              }
            });
          
            return Array.from(userMap.values());
        };

        const latestCommissions = getLatestCommissions(returnData);
        return latestCommissions;
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