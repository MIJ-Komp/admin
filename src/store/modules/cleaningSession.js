const state = {
    user: null,
};

const mutations = {
};

import axios from '../axios'
const actions = {
    async getCurrentSession({ commit }) {
        return await axios.get('/cleaningSession/getCurrentSession')
    },
    async getDirtyRooms({commit}){
        return await axios.get('/cleaningSession/getDirtyRooms')
    },
    async doCleaning({commit}, data){
        return await axios.post('/cleaningSession', data)
    }
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