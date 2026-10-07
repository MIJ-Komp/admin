const state = {
    user: null,
};

const mutations = {
};

import axios from '../axios'
const actions = {
    async getAll({ commit }) {
        return (await axios.get('/admin/menus'))
    },
    async create({commit}, data){
        return await axios.post(`/admin/menus`, data)
    },
    async deleteItem({commit}, id){
        return await axios.delete(`/admin/menus/delete-item/${id}`)
    },
    async delete({commit}, id){
        return await axios.delete(`/admin/menus/${id}`)
    },
    async update({commit}, data){
        return await axios.put(`/admin/menus/${data.id}`, data)
    },
    async getById({commit}, id){
        return await axios.get(`/admin/menus/${id}`)
    },
    async createMenuItem({commit}, data){
        console.log(data)
        return await axios.post(`/admin/menus/${data?.menuId}`, data)
    },
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