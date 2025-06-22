const state = {
    user: null,
};

const mutations = {
};

import axios from '../axios'
const actions = {
    async getAll({ commit }) {
        return (await axios.get('/admin/products'))?.items
    },
    async create({commit}, data){
        if(data) data.Type = 2
        return await axios.post('/facilities', data)
    },
    async delete({commit}, id){
        return await axios.delete(`/facilities/${id}`)
    },
    async update({commit}, data){
        if(data) data.Type = 2
        return await axios.put(`/facilities/${data.id}`, data)
    },
    async getById({commit}, id){
        return await axios.get(`/admin/products/${id}`)
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