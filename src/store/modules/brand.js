import axios from '../axios'

const state = {
    user: null,
};

const mutations = {
};

const actions = {
    async getAll({ commit }) {
        return await axios.get('/admin/brands')
    },
    async create({commit}, data){
        return await axios.post('/admin/brands', data)
    },
    async delete({commit}, id){
        return await axios.delete(`/admin/brands/${id}`)
    },
    async update({commit}, data){
        return await axios.put(`/admin/brands/${data.id}`, data)
    },
    async getById({commit}, id){
        return await axios.get(`/admin/brands/${id}`)
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