const state = {
    user: null,
};

const mutations = {
};

import axios from '../axios'
const actions = {
    async getAll({ commit }) {
        return await axios.get('/booking/getAllBooking')
    },
    async getCart({ commit }) {
        return await axios.get('/booking/cart')
    },
    async addCart({commit}, data){
        return await axios.post('/booking/cart', data)
    },
    async addRoomToCart({commit}, data){
        return await axios.post(`/booking/addRoomToCart`, data)
    },
    async removeCartDetail({commit}, cartDetailId){
        return await axios.delete(`/booking/removeCartDetail/${cartDetailId}`)
    },
    async clearCart({commit}){
        return await axios.delete(`/booking/clearCart`)
    },
    async updateCartDetail({commit}, data){
        return await axios.post(`/booking/updateCartDetail`, data)
    },
    async checkout({commit}, data){
        return await axios.post(`/booking/checkout`, data)
    },
    async getOneBooking({commit}, code){
        return await axios.get(`/booking/getOneBooking/${code}`) 
    },
    async cancel({commit}, bookingCode){
        return await axios.put(`/booking/cancel/${bookingCode}`)
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