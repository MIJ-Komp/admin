<template>
   <ListPage :module="$module.member"
   :showCreate="false"
   :showDelete="false"
   :showEdit="false"
   />
</template>
<script>
import {mapActions} from 'vuex'
import module from '../../../constant/module'
import { provide, ref, onMounted } from "vue";

export default {
   setup() {
      provide("actionContext", 
      [
         // {
         //    label: "Customer Detail",
         //    action: () => {},
         // },
      ])
   },
  async created () {
   this.members = await this.$store.dispatch(`user/getAllMember`);
  },
  methods: {
   ...mapActions(module.user.name, ["suspend"])
  },
  computed:{
   user(){
      return this.$store.state.user.user;
   }
  },
   data() {
      return {
         members:[],
      };
   },
};
</script>
