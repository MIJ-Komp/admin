<template>
    <div v-if="currentUser && user" class="h-100 form-container">
        <div >
            <div class="title-form" v-if="showTitle">Edit Profile</div>
            <FileInput label="Profile Picture" v-model="currentUser.ImageId"/>
            <!-- <Camera v-model="currentUser.Images"/> -->
            <TextBox label="Name" class="mt-4 w-100" v-model="currentUser.Name"/>
        </div>
        <div class="w-100 flex-row" style="justify-content: flex-end;">
            <Button :isLoading="isLoading" :disabled="!isEdited()" label="Simpan" style="width: 300px !important;" class="mt-4" @click="save"/>
        </div>
    </div>
</template>
<script>
import { mapActions } from 'vuex'
import module from '../../constant/module'
export default{
  methods: {
    ...mapActions(module.user.name, ["update"]),
    save(){
        if(this.isLoading) return
        this.isLoading = true
        this.update(this.currentUser)
        .then(res=> {
            this.$showToast.success("Berhasil update profile")
            this.$emit('updateUser')
        })
        .catch(err=> this.$showToast.error(err))
        .finally(()=>{
            this.isLoading = false
        })
    },
    isEdited(){
        return this.user.Name != this.currentUser.Name || this.user.ImageId != this.currentUser.ImageId
    }
  },
  watch: {
    user:{
        immediate: true,
        handler(newVal){
            if(newVal){
                this.currentUser = {...newVal}
                // console.log(this.currentUser)
                // this.currentUser.Images = [newVal.ImageId]
            }
        }
    }
  },
  data () {
    return {
        isLoading: false,
        currentUser:{
            Images: [],
            Name: null,
        }
    }
  },
    props:{
        showTitle:{type: Boolean, default: true},
        user:{type: Object, default: ()=> {}},
    }
}
</script>
<style scoped>
.title-form{
    padding-bottom: 10px;
    border-bottom: 1px solid var(--grey-900);
    margin-bottom: 16px;
    font-weight: 600;
}
.form-container{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
</style>