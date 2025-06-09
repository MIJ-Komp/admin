const state = {
    user: null,
};

const mutations = {
};

import axios from '../axios'
import { CleaningType } from '../../constant/enums/RoomStatus';
const actions = {
    async getAll({ commit }, params) {
        var returnData= await axios.get('/cleaningSession/getHistory', {params: params})

        returnData = returnData.map(data=>{
                var detik = data.DurationInSeconds

                const hari = parseInt(detik / (24 * 3600))
                detik = detik - (hari * (24 * 3600))

                const jam = parseInt(detik / 3600)
                detik = detik - (jam * 3600)

                const menit = parseInt(detik / 60)
                detik = detik - (menit * 60)

                var totalDuration = []
                if (hari > 1)
                totalDuration.push(`${hari} hari`)
                if (jam > 1)
                totalDuration.push(`${jam} jam`)
                if (menit > 1)
                totalDuration.push(`${menit} menit`)
                if (detik > 0 || totalDuration.length ==0)
                totalDuration.push(`${detik} detik`)
                
                totalDuration = totalDuration.join(" ")

                return Object.assign(data, {
                    AssignOn : data.CleaningSessions.find(data=> data.Status == CleaningType.ASSIGN)?.CreatedOn,
                    ProgressOn : data.CleaningSessions.find(data=> data.Status == CleaningType.START)?.CreatedOn,
                    CompleteOn : data.CleaningSessions.find(data=> data.Status == CleaningType.FINISH)?.CreatedOn,
                    TotalDuration: totalDuration
                })
            }
        )
        return returnData
    },
    // async getById({commit}, id){
    //     return await axios.get(`/addOn/${id}`)
    // }
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