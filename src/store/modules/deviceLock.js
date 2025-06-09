const state = {
    user: null,
};

const mutations = {
};

import axios from '../axios'
const actions = {
    async getAll({ commit }) {
        return await axios.get('/charge/getAll')
    },
    async create({commit}, data){
        return await axios.post('/charge', data)
    },
    async delete({commit}, id){
        return await axios.delete(`/charge/${id}`)
    },
    async update({commit}, data){
        return await axios.patch(`/charge/${data.Id}`, data)
    },
    async getById({commit}, id){
        return await axios.get(`/charge/${id}`)
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