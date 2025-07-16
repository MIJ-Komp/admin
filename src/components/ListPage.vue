<template>
    <div class="list-container fadeIn">
        <div class="header" v-if="userHasRole">
            <SearchBar v-model="searchKeyword" :module="module" @delete="doDelete" @refreshList="refreshData"
                :canCreate="canCreate"
                :canUpdate="canUdate"
                :canDelete="canDelete"
                :showCreate="showCreate"
                :showDelete="showDelete"
                :simpleAdd="simpleAdd"
                :actions="actions"
                :selectedItems="$refs.grid ? $refs.grid.selectedData() :[]"
            >
                <template v-slot:buttons>
                    <slot name="buttons"></slot>
                </template>
            </SearchBar>
        </div>
        <div style="margin-top: 8px" class="content" v-if="userHasRole">
            <Grid :module="module" :searchKeyword="searchKeyword" ref="grid"
                :autoSizeStrategy="autoSizeStrategy"
                :canCreate="canCreate"
                :canUpdate="canUpdate"
                :dataSource="dataSource"
                :showEdit="showEdit"
                :showDelete="showDelete"
                :showDefaultColumn="showDefaultColumn"
                :queryParams="queryParams"
                :canDelete="canDelete"
                :simpleEdit="simpleEdit"
                :showPopUp="showPopUp"/>
        </div>
        <div v-if="!userHasRole" style="height: 100%;">
            <div class="notHaveAccess text-center">You don't have access to view this page</div>
        </div>
    </div>
</template>
<script>
import access from '../constant/accessModule'
import module from '../constant/module'
import {mapActions, mapGetters} from 'vuex'
import {inject, onMounted} from 'vue'

export default {
    setup(){
        var actionContext = inject("actionContext") || []
        onMounted(()=>{
            console.log(actionContext)
        })
        return {
            actionContext
        }
    },
  props: {
    actions:{default: ()=>[]},
    queryParams: {},
    showPopUp:{type: Boolean,default: false},
    simpleEdit:{type: Boolean,default: false},
    simpleAdd:{type: Boolean,default: false},
    showDefaultColumn:{type: Boolean,default: true},
    refresh:{default: null},
    autoSizeStrategy:{type: String, default: 'fitGridWidth'},
    module:{
        type: Object,
        default: ()=> {}
    },
    showCreate:{default: true},
    dataSource:{default: null},
    showDelete:{default: true},
    showEdit:{default: true}
  },
    methods: {
        selectedData(){
            return this.$refs.grid ? this.$refs.grid.selectedData() : []
        },
        async refreshData(){
            if(this.$refs.grid){
                if(this.refresh) this.refresh();

                this.$refs.grid.refreshData()
            }
        },
        async doDelete() {
            if(!this.canDelete){
                this.$dialog.Alert.confirm({ title: 'Gagal Hapus', message: 'Anda tidak memiliki Akses' })
                return
            }
            const selectedData = this.$refs.grid ? this.$refs.grid.selectedData() : []
            if(!selectedData || selectedData.length<= 0){
                this.$dialog.Alert.confirm({ title: 'Gagal Hapus', message: 'Tidak ada data yang dipilih' })
            }
            else{
                const confirm = await this.$dialog.Confirmation.confirm({ title: 'Konfirmasi', message: `Anda yakin akan menghapus data ini? (${selectedData.length} data)` })
                if (confirm) {
                    var success = 0
                    var error = null
                    for (let i = 0; i < selectedData.length; i++) {
                        try{
                            const request = await this.$store.dispatch(`${this.module.name}/delete`, selectedData[i].Id)
                            success += 1
                        }
                        catch(err){
                            error = err
                        }
                    }
                    if(success == selectedData.length){
                        this.$showToast.success(`Success`, `${success} data successfully deleted`)
                    }
                    else if(success > 0){
                        this.$showToast.warn('Only Partly Deleted', `${success} out of ${selectedData.length} data successfully deleted`)
                    }
                    if(error){
                        this.$showToast.error('Failed to Delete', error)
                    }
                    this.$refs.grid.refreshData()
                }
            }
        },
        ...mapActions(module.user.name, ["hasViewRole", "hasCreateRole", "hasUpdateRole", "hasDeleteRole"])
    },
    data() {
        return {
            searchKeyword: null,
            userHasRole: true,
            canDelete: true,
            canUpdate: true,
            canCreate: true
        }
    },
    computed: {
        
    },
    async mounted() {
        // const roleId = this.module == module.product || this.module == module.productBundle ?
        //                 access.module.facility.Id :

        //                 this.module == module.roomTypePrice || this.module == module.roomTypeNoPrice || this.module == module.roomPrice || this.module == module.roomNoPrice ?
        //                 access.module.room.Id :
                        
        //                 this.module == module.deviceLock || this.module == module.deviceGateway ?
        //                 access.module.device.Id :

        //                 this.module == module.member ? access.module.user.Id :

        //                 this.module == module.manualPin ? access.module.generatePin.Id :

        //                 this.module == module.paymentHistory ?
        //                 access.module.transaction.Id :

        //                 access.module[this.module.name].Id

        // this.userHasRole = await this.hasViewRole(roleId)

        // this.canCreate = await this.hasCreateRole(roleId)
        // this.canDelete = await this.hasDeleteRole(roleId)
        // this.canUpdate = await this.hasUpdateRole(roleId)

    }
}
</script>

<style scoped>
.notHaveAccess{
    height: 100%;
    border-radius: 8px;
    background: white;
    padding-top: 100px;
}
.header {
    flex-shrink: 1;
}

.content {
    flex-grow: 1;
    overflow: auto;
    height: 100%;
}


.list-container{
    height: 100%;
    display: flex;
    flex-direction: column;
}
</style>