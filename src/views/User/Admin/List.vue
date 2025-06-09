<template>
   <ListPage :module="$module.user" ref="List" />
</template>
<script>
import {mapActions} from 'vuex'
import module from '../../../constant/module'
import { provide, ref, onMounted, inject, computed } from "vue";
import { useStore } from 'vuex'; // Import useStore dari Vuex

export default {
   setup() {
      const store = useStore();

      const List = ref(null)
      const user = computed(() => store.state.user.user);
      
      const dialog = inject("dialog")
      const showToast = inject("showToast")

      provide("actionContext", 
      [
         {
            label: 'Suspend', 
            getLabel: (data)=>{
               if(!data.IsSuspended) return 'Suspend'
               return 'UnSuspend'
            },
            action: async (data) => {
               if(data.Id == user.Id){
                  await dialog.Alert.confirm({ title: 'Gagal', message: `Anda tidak dapat mensuspend diri Anda sendiri` })
                  return
               }
               const confirm = await dialog.Confirmation.confirm({ title: 'Konfirmasi', message: `Anda yakin akan ${!data.IsSuspended ? 'Mensuspend' : 'Unsuspend'} ${data.Name}` })
               if (!confirm) return
               
               store.dispatch('user/suspend', data.Id).then(res=> {
                  showToast.success(`Berhasil ${!data.IsSuspended ? 'Suspend' : 'Unsuspend'} User`)
                  List.value.refreshData()
               })
               .catch(err=> showToast.error("Failed", err))
            }
         },
      ])

      return{
         List, user
      }
   },

  methods: {
   ...mapActions(module.user.name, ["suspend"])
  },
  computed:{
  },
   data() {
      return {
      };
   },
};
</script>
