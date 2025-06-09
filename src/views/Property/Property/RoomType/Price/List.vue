<template>
   <ListPage :module="$module.roomTypePrice" :queryParams="queryParams" />

   <!-- <div class="d-flex flex-column" v-if="userHasRole">
      <SearchBar
         v-if="propertyData"
         v-model="searchKeyword"
         :module="$module.roomTypePrice"
         :canCreate="canCreate"
         :canUpdate="canUdate"
         :canDelete="canDelete"
      />
   </div>
   <div class="mt-2 h-100" v-if="propertyData && userHasRole" >
      <Grid
         :module="$module.roomTypePrice"
         :searchKeyword="searchKeyword"
         :queryParams="queryParams"
      />
   </div>
   <div v-if="!userHasRole" style="height: 100%;">
        <div class="notHaveAccess text-center">You don't have access to view this page</div>
    </div> -->
</template>

<script>
import { mapActions } from "vuex";
import access from '../../../../../constant/accessModule'
import module from "../../../../../constant/module";
import { provide, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import constant from "../../../../../constant/constant";

export default {
   setup() {
      const router = useRouter();
      const route = useRoute();

      provide("actionContext", 
      [
         {
            label: "View Room",
            action: (data) => {
               router.push({
                  path: constant.router.roomNoPrice
                     .replace(":id", route.params.id)
                     .replace(":roomTypeId", data.Id),
               });
            },
         },
      ])
   },
   data() {
      return {
         searchKeyword: "", 
         propertyData: null,
         queryParams: {
            page: 1,
            limit: 100,
            propertyId: this.$route.params.id,
         },
         userHasRole: false,
         canDelete: false,
         canUpdate: false,
         canCreate: false,
      };
   },
   async mounted() {
      this.propertyData = await this.getById(this.$route.params.id);

      this.userHasRole = await this.hasViewRole(access.module.room.Id)
      this.canCreate = await this.hasCreateRole(access.module.room.Id)
      this.canDelete = await this.hasDeleteRole(access.module.room.Id)
      this.canUpdate = await this.hasUpdateRole(access.module.room.Id)
   },
   methods: {
      ...mapActions(module.user.name, ["hasViewRole","hasViewRole", "hasCreateRole", "hasUpdateRole", "hasDeleteRole"]),
      ...mapActions(module.property.name, ["getById"]),
   },
};
</script>

<style scoped>
.notHaveAccess{
    height: 100%;
    border-radius: 8px;
    background: white;
    padding-top: 100px;
}
</style>
