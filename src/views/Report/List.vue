<template>
   <div class="fadeIn" style="display: flex; flex-direction: column; height: 100%;">
      <div class="header" v-if="userHasRole">
         <SearchBar
            :showDelete="false"
            :showCreate="false"
            :showRefresh="false"
         ></SearchBar>
      </div>
      <div class="content" v-if="userHasRole">
         <div
            @click="openReport(rep.Id)"
            class="d-flex justify-content-between align-items-center p-3 rounded bg-white mb-3 border"
            style="cursor: pointer"
            v-for="rep in reportList"
            :key="rep.Id"
         >
            <label style="cursor: inherit">{{ rep.Name }}</label>
            <img style="width: 24px" :src="$assets.icons.chevron_right" />
         </div>
      </div>
      <div v-if="!userHasRole" style="height: 100%">
         <div class="notHaveAccess text-center">
            You don't have access to view this page
         </div>
      </div>
   </div>
</template>
<script>
import access from "../../constant/accessModule";
import module from "../../constant/module";
import { mapActions } from "vuex";
export default {
   data() {
      return {
         access,
         userHasRole: false,
         reportList: [
            {
               Id: 1,
               Name: "Sales per Date",
            },
            {
               Id: 2,
               Name: "Top Property",
            },
            {
               Id: 3,
               Name: "Employee Cleaning History",
            },
         ],
      };
   },
   async mounted() {
      const roleId = this.access.otherModule.report.Id;

      this.userHasRole = await this.hasOtherRole(roleId);
   },
   methods: {
      ...mapActions(module.user.name, ["hasOtherRole"]),

      openReport(id) {
         this.$router.push({
            path: this.$constant.router.viewReport.replace(`:id`, id),
         });
      },
   },
};
</script>

<style scoped>
.notHaveAccess {
   height: 100%;
   border-radius: 8px;
   background: white;
   padding-top: 100px;
}
.header {
   flex-shrink: 1;
   margin-bottom: 8px;
}

.content {
   flex-grow: 1;
   overflow: auto;
   height: 100%;
   background-color: white;
   padding: 20px;
   border-radius: 8px;
}
</style>
