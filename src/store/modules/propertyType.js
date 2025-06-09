import axios from '../axios'

const state = {
    user: null,
};

const mutations = {
};

const actions = {
    async getAll({ commit }) {
        return await axios.get('/property-type/getAll')
    },
    async create({commit}, data){
        return await axios.post('/property-type', data)
    },
    async delete({commit}, id){
        return await axios.delete(`/property-type/${id}`)
    },
    async update({commit}, data){
        return await axios.patch(`/property-type/${data.Id}`, data)
    },
    async getById({commit}, id){
        return await axios.get(`/property-type/${id}`)
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