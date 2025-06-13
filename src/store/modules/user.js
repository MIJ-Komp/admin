const state = {
   user: null,
   userRole: null,
};

const mutations = {
   setUser(state, user) {
      state.user = user;
   },
   setUserRole(state, role) {
      state.userRole = role;
   },
};
import axios from "../axios";
const actions = {
   async getById({ commit }, id) {
      return await axios.get(`/admin/${id}`);
   },
   async getAllMember({ commit }) {
      return await axios.get("/user/getAllUser?Page=-1&Limit=-1");
   },
   async userChangeEmail({commit}, data){
      return await axios.put("/user/change-email", data);
   },
   async userChangePassword({commit}, data){
      return await axios.put("/user/change-password", data);
   },
   async sendOTPChangeEmail({ commit, dispatch }, email) {
      const user = await dispatch("getCurrentUser");

      return await axios.post("/user/sendOTP", {
         PhoneNumber : user.PhoneNumber,
         Email : email,
         SendBy: 3, // email
         Type : 3 //change Email
      });
   },
   async getAll({ commit }) {
      return await axios.get("/admin/getAll?Page=-1&Limit=-1");
   },
   async linkToCHM({ commit }, data) {
      return await axios.post("/admin/linkToCHM", data);
   },
   async unlinkToCHM({ commit }) {
      return await axios.post("/admin/unlinkCHM");
   },
   async create({ commit }, data) {
      return await axios.post("/admin", data);
   },
   async suspend({ commit }, adminId) {
      return await axios.put(`/admin/suspend/${adminId}`);
   },
   async update({ commit, dispatch }, data) {
      const user = await dispatch("getCurrentUser");
      const response = await axios.put(`/admin/${data.id}`, data);

      if (user.Id == data.Id) {
         commit("setUser", (await dispatch("getMe")));

         if (user.RoleId != data.RoleId) await dispatch("resetUserRole");
      }
      return response;
   },
   async logout({ commit }, data) {
      // axios.
      localStorage.removeItem("authorization");
      localStorage.removeItem("user");

      commit("setUser", null);
      // await axios.post("/admin/logout");
   },
   async login({ commit }, data) {
      return await axios.post("/auth/login", data);
   },
   async getRoleById({ commit }, id) {
      try{
         if(import.meta.env.VITE_IS_DEVELOPMENT){
            return true
         }
         return await axios.get(`/role/${id}`)
      }
      catch(err){
         console.log(err)
      }
   },
   async resetUserRole({ commit, dispatch }) {
      var user = await dispatch("getCurrentUser");

      const currentRole = await dispatch("getRoleById", user.RoleId);
      commit("setUserRole", currentRole);
   },
   async getUserRole({ commit, state, dispatch }) {
      if (!state.userRole) {
         var user = await dispatch("getCurrentUser");
         if (!user) {
            return null;
         }

         try {
            const currentRole = await dispatch("getRoleById", user.RoleId);

            commit("setUserRole", currentRole);
            return currentRole;
         } catch (error) {
            return null;
         }
      } else {
         return state.userRole;
      }
   },
   async hasRole({ commit, dispatch }, accessId) {
      return true
      if(import.meta.env.VITE_IS_DEVELOPMENT){
         return true
      }
      var currentRole = await dispatch("getUserRole");
      if (
         !currentRole ||
         currentRole.RoleAccesses.length == 0 ||
         !currentRole.RoleAccesses.find(
            (data) =>
               data.AccessId == accessId &&
               (data.Create || data.Update || data.View || data.Delete)
         )
      )
         return false;
      return true;
   },
   async hasViewRole({ commit, dispatch }, accessId) {
      return true
      if(import.meta.env.VITE_IS_DEVELOPMENT){
         return true
      }

      var currentRole = await dispatch("getUserRole");
      if (
         !currentRole ||
         currentRole.RoleAccesses.length == 0 ||
         !currentRole.RoleAccesses.find(
            (data) => data.AccessId == accessId && data.View
         )
      )
         return false;
      return true;
   },
   async hasCreateRole({ commit, dispatch }, accessId) {
      return true
      if(import.meta.env.VITE_IS_DEVELOPMENT){
         return true
      }
      var currentRole = await dispatch("getUserRole");
      if (
         !currentRole ||
         currentRole.RoleAccesses.length == 0 ||
         !currentRole.RoleAccesses.find(
            (data) => data.AccessId == accessId && data.Create
         )
      )
         return false;
      return true;
   },
   async hasUpdateRole({ commit, dispatch }, accessId) {
      return true
      if(import.meta.env.VITE_IS_DEVELOPMENT){
         return true
      }
      var currentRole = await dispatch("getUserRole");
      // console.log(!currentRole.RoleAccesses.find(data=> data.AccessId == accessId && data.Update))
      if (
         !currentRole ||
         currentRole.RoleAccesses.length == 0 ||
         !currentRole.RoleAccesses.find(
            (data) => data.AccessId == accessId && data.Update
         )
      )
         return false;
      return true;
   },
   async hasDeleteRole({ commit, dispatch }, accessId) {
      return true
      if(import.meta.env.VITE_IS_DEVELOPMENT){
         return true
      }
      var currentRole = await dispatch("getUserRole");
      if (
         !currentRole ||
         currentRole.RoleAccesses.length == 0 ||
         !currentRole.RoleAccesses.find(
            (data) => data.AccessId == accessId && data.Delete
         )
      )
         return false;
      return true;
   },
   async hasOtherRole({ commit, dispatch }, otherAccessId) {
      return true
      if(import.meta.env.VITE_IS_DEVELOPMENT){
         return true
      }
      var currentRole = await dispatch("getUserRole");
      if (
         !currentRole ||
         currentRole.RoleOtherAccesses.length == 0 ||
         !currentRole.RoleOtherAccesses.find(
            (data) => data.OtherAccessId == otherAccessId
         )
      )
         return false;

      return true;
   },
   async getMe(){
      return await axios.get("/user/me");
   },
   async getCurrentUser({ commit, state }) {

      // if(import.meta.env.VITE_IS_DEVELOPMENT){
      //    var userDev={ email: 'admin@mail.com', name: 'Admin'}
      //    commit("setUser", userDev);

      //    return userDev;
      // }
      if (!state.user) {
         const token = localStorage.getItem("authorization");

         // const user = localStorage.getItem('user');

         if (!token) {
            commit("setUser", null);
            return null;
         } else {
            try {
               var currentUser = await axios.get("/user/me");

               localStorage.setItem("user", JSON.stringify(currentUser));
               // var userTmp = await axios.get('/admin/me');
               // console.log(`User : ${user}`);
               commit("setUser", JSON.parse(JSON.stringify(currentUser)));
               return state.user;
            } catch (err) {
               console.log(err);
               commit("setUser", null);
               return null;
            }
         }
      } else {
         return state.user;
      }
   },
   async registerAgent({ commit }, data) {
      return await axios.post("/admin/register", data);
   },
   async requestOtpAgent({ commit }, data) {
      return await axios.post("/admin/sendVerification", data);
   },
};

const getters = {
   user: (state) => state.user,
   userRole: (state) => state.userRole,
};

export default {
   namespaced: true,
   state,
   mutations,
   actions,
   getters,
};
