import axios from '../axios'

const state = {
    user: null,
};

const mutations = {
};

const actions = {
    async getAll({ commit }) {
        return await axios.get('/admin/orders', {params:{
            page: 1,
            pageSize: 1000000000
        }})
    },
    async create({commit}, data){
        return await axios.post('/admin/orders', data)
    },
    async delete({commit}, id){
        return await axios.delete(`/admin/orders/${id}`)
    },
    async update({commit}, data){
        return await axios.put(`/admin/orders/${data.id}`, data)
    },
    async getById({commit}, id){
        return await axios.get(`/admin/orders/${id}`)
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