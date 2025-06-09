const state = {
    user: null,
};

const mutations = {
};

import axios from '../axios'
const actions = {
    async bulkUpdate({ commit }, data) {
        return await axios.put('/setting/bulkUpdate', data)
    },
    async updateSetting({ commit }, data) {
        return await axios.put('/setting', data)
    },
    async getOwnerSetting({commit}){
        return await axios.get('/setting/getOwnerSettings')
    },
    async getPropertySetting({commit}, propertyId){
        return await axios.get(`/setting/getPropertySettings/${propertyId}`)
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