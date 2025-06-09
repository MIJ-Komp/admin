const state = {
    user: null,
};

const mutations = {
};

import axios from '../axios'
const actions = {
    async getAll({ commit }) {
        const facilities = await axios.get('/facilities/getAll')
        if(facilities && facilities.length > 0){
            return facilities.filter(data=> data.Type == 2) // 2 adalah tipe fasilitas property
        }
        return []
    },
    async create({commit}, data){
        if(data) data.Type = 2
        return await axios.post('/facilities', data)
    },
    async delete({commit}, id){
        return await axios.delete(`/facilities/${id}`)
    },
    async update({commit}, data){
        if(data) data.Type = 2
        return await axios.put(`/facilities/${data.Id}`, data)
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