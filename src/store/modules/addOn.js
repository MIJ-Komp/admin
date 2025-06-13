const state = {
    user: null,
};

const mutations = {
};

import axios from '../axios'
const actions = {
    async getAll({ commit }) {
        return await axios.get('/addOn/getAll')
    },
    async create({commit}, data){
        return await axios.post('/addOn', data)
    },
    async update({commit}, data){
        return await axios.put(`/addOn/${data.id}`, data)
    },
    async delete({commit}, id){
        return await axios.delete(`/addOn/${id}`)
    },
    async getById({commit}, id){
        return await axios.get(`/addOn/${id}`)
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