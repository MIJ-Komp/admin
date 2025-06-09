const state = {
    user: null,
};

const mutations = {
};

const actions = {
    getAll({ commit }) {
        //request API
        var list = []
        for (let index = 0; index < 1000; index++) {
            list.push({
                name: 'Property S',
                type: 'Apartment',
                address: 'Jalan jalan',
                city: 'Jakarta',
                rooms: '10',
                status: 'Active',
            })
        }
        return list
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