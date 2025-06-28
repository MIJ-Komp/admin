import axios from '../axios'

const state = {
    user: null,
};

const mutations = {
};

const actions = {
    async getAll({ commit }) {
        return await axios.get('/admin/compatibility-rules')
    },
    async create({commit}, data){
        return await axios.post('/admin/compatibility-rules', data)
    },
    async delete({commit}, id){
        return await axios.delete(`/admin/compatibility-rules/${id}`)
    },
    async update({commit}, data){
        return await axios.put(`/admin/compatibility-rules/${data.id}`, data)
    },
    async getById({commit}, id){
        return await axios.get(`/admin/compatibility-rules/${id}`)
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