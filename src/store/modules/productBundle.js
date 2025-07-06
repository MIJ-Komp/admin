const state = {
    user: null,
};

const mutations = {
};

import constant from '../../constant/constant';
import axios from '../axios'

const actions = {
    async getAll({ commit }) {
        const products = (await axios.get('/admin/products'))?.items
        return products.filter(data=> data.productType.code == constant.productType.group)
    },
    async create({commit}, data){
        if(data) data.Type = 1
        return await axios.post('/facilities', data)
    },
    async delete({commit}, id){
        return await axios.delete(`/facilities/${id}`)
    },
    async update({commit}, data){
        if(data) data.Type = 1
        return await axios.put(`/facilities/${data.id}`, data)
    },
    async getById({commit}, id){
        return await axios.get(`/facilities/${id}`)
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