const state = {
    user: null,
};

const mutations = {
};

import axios from '../axios'
const actions = {
    async getAll({ commit }) {
        return await axios.get('/payment-method/getAll')
    },
    async create({commit}, data){
        return await axios.post('/payment-method', data)
    },
    async delete({commit}, id){
        return await axios.delete(`/payment-method/${id}`)
    },
    async update({commit}, data){
        return await axios.patch(`/payment-method/${data.Id}`, data)
    },
    async getById({commit}, id){
        return await axios.get(`/payment-method/${id}`)
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