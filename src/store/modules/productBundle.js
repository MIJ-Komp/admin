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
    async changeComponent({commit}, data){
        return await axios.put(`/admin/products/change-component`, data)
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