const state = {
    // transactions: [],
};

import axios from '../axios'

const mutations = {
    // setTransactions(state, transactions) {
    //     state.transactions = transactions;
    // },
};
const actions = {
    async getAll({ commit }, data) {
        return await axios.get('/roomAvailability/getAll', { params: data })
    },
    async create({commit}, data){
        return await axios.post('/roomAvailability', data)
    },
    async delete({commit}, id){
        return await axios.delete(`/roomAvailability/${id}`)
    },
    // async update({commit}, data){
    //     if(data) data.Type = 1
    //     return await axios.put(`/roomAvailability/${data.id}`, data)
    // },
    async getById({commit}, id){
        return await axios.get(`/roomAvailability/${id}`)
    },
    async check({commit}, data){
        return await axios.get(`/roomAvailability/check`, {params: data})
    }
};

const getters = {
    // transactions: (state) => state.transactions,
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};