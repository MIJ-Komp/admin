import axios from '../axios'

const state = {
    user: null,
};

const mutations = {
};

const actions = {
    async getAll({ commit }) {
        return await axios.get('/admin/product-categories')
    },
    async create({commit}, data){
        return await axios.post('/admin/product-categories', data)
    },
    async delete({commit}, id){
        return await axios.delete(`/admin/product-categories/${id}`)
    },
    async update({commit}, data){
        return await axios.put(`/admin/product-categories/${data.id}`, data)
    },
    async getById({commit}, id){
        return await axios.get(`/admin/product-categories/${id}`)
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