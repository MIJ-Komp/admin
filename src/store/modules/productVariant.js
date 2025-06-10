const state = {
    user: null,
};

const mutations = {
};

import axios from '../axios'
const actions = {
    async getAll({ commit }) {
        return await axios.get('/productVariant/getAll')
    },
    async create({commit}, data){
        return await axios.post('/productVariant', data)
    },
    async delete({commit}, id){
        return await axios.delete(`/productVariant/${id}`)
    },
    async update({commit}, data){
        return await axios.put(`/productVariant/${data.Id}`, data)
    },
    async getById({commit}, id){
        return await axios.get(`/productVariant/${id}`)
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