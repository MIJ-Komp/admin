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
        return products.filter(data=> data.productType.code == constant.productType.single)
    },
    async create({commit}, data){
        return await axios.post(`/admin/products/${data.id}`, data)
    },
    async delete({commit}, id){
        return await axios.delete(`/admin/products/${id}`)
    },
    async update({commit}, data){
        return await axios.put(`/admin/products/${data.id}`, data)
    },
    async getById({commit}, id){
        return await axios.get(`/admin/products/${id}`)
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