import axios from '../axios'

const state = {
    user: null,
};

const mutations = {
};

const actions = {
    async getAll({ commit }) {
        return await axios.get('/admin/component-types')
    },
    async create({commit}, data){
        return await axios.post('/admin/component-types', data)
    },
    async delete({commit}, id){
        return await axios.delete(`/admin/component-types/${id}`)
    },
    async update({commit}, data){
        return await axios.put(`/admin/component-types/${data.id}`, data)
    },
    async getById({commit}, id){
        return await axios.get(`/admin/component-types/${id}`)
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