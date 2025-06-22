const state = {
    user: null,
};

const mutations = {
};

import axios from '../axios'
const actions = {
    async getAll({ commit }) {
        return await axios.get('/admin/variant-options')
    },
    async create({commit}, data){
        return await axios.post('/admin/variant-options', data)
    },
    async delete({commit}, id){
        return await axios.delete(`/admin/variant-options/${id}`)
    },
    async update({commit}, data){
        return await axios.put(`/admin/variant-options/${data.id}`, data)
    },
    async getById({commit}, id){
        return await axios.get(`/admin/variant-options/${id}`)
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