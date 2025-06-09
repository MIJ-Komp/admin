const state = {
    user: null,
};

const mutations = {
};

import axios from '../axios'
const actions = {
    async getAll({ commit }) {
        return await axios.get('/pinRoom/getAll')
    },
    async create({commit}, data){
        return await axios.post('/pinRoom', data)
    },
    async update({commit}, data){
        return await axios.put(`/pinRoom/${data.Id}`, data)
    },
    async delete({commit}, id){
        return await axios.delete(`/pinRoom/${id}`)
    },
    async getById({commit}, id){
        return await axios.get(`/pinRoom/${id}`)
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