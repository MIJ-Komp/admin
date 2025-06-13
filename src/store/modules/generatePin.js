const state = {
    user: null,
};

const mutations = {
};

import axios from '../axios'
const actions = {
    async getAll({ commit }) {
        return await axios.get('/generatePinSetting')
    },
    async create({commit}, data){
        return await axios.post('/generatePinSetting', data)
    },
    async update({commit}, data){
        return await axios.put(`/generatePinSetting/${data.id}`, data)
    },
    async delete({commit}, id){
        return await axios.delete(`/generatePinSetting/${id}`)
    },
    async getById({commit}, id){
        return await axios.get(`/generatePinSetting/${id}`)
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