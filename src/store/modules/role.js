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
    async getAll({ commit }) {
        return await axios.get('/role/getAll')
    },
    async create({commit}, data){
        if(data) data.Type = 1
        return await axios.post('/role', data)
    },
    async delete({commit}, id){
        return await axios.delete(`/role/${id}`)
    },
    async update({commit, dispatch}, data){
        if(data) data.Type = 1
        var response = await axios.patch(`/role/${data.Id}`, data)

        const user = await dispatch('user/getCurrentUser', null, { root: true });

        if(user.RoleId == data.Id){
            await dispatch('user/resetUserRole', null, { root: true });
        }
        return response;
    },
    async getById({commit}, id){
        return await axios.get(`/role/${id}`)
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