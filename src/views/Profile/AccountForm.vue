<template>
    <div class="h-100 form-container w-100" v-if="user">
        <div>
            <div class="title-form" v-if="showTitle">Account Setting</div>
            <TextBox label="Email" class="w-100" :disabled="true" v-model="user.Email" :showEditButton="true" @editClicked="showChangeEmail"/>
            <div class="flex-row mt-4" style="color: var(--blue-500); align-items: center; cursor: pointer; width: fit-content;"
                @click="()=>{changePassword.show = true}">
                <i class="fa fa-lock"/> <div class="ms-2">Change Password</div>
            </div>
        </div>
    </div>

    <Dialog
        class="change-email-dialog"
        modal
        :header="`Change Email`"
        v-model:visible="changeEmail.show"
        style="width: 50vw"
        :pcCloseButton="true"
        :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    >
        <div>Current Email</div>
        <div style="color: black;">{{ user.Email }}</div>
        <Form
            ref="observer"
        >
            <TextBox label="New Email" type="email" v-model="changeEmail.NewEmail" class="mt-4" :disabled="changeEmail.hasSendOTP"/>

            <div v-if="changeEmail.hasSendOTP">
                <div>Kami telah mengirimkan kode OTP ke email <span style="color: black;">{{ changeEmail.NewEmail }}</span></div>
                <TextBox label="OTP Code" type="password" class="mt-4" v-model="changeEmail.VerificationCode"/>

                <div class="flex-row" 
                    style="width: fit-content;" 
                    :style="duration <= 0 ? 'cursor:pointer; color: black;': 'color: var(--grey-800)'" @click.prevent="sendOTP">
                    <i class="fa fa-key"/> <div>Resend OTP Code <span v-if="changeEmail.duration > 0">({{ getTimer(changeEmail.duration) }})</span></div>
                </div>

                <TextBox label="Password" type="password" class="mt-4" v-model="changeEmail.Password"/>
            </div>

            <div style="width: 100%; justify-content: end; display: flex;">
                <Button :isLoading="isLoading" @click.prevent="sendOTP" v-if="!changeEmail.hasSendOTP" :disabled="!changeEmail.NewEmail" label="Send OTP Code" iconFa="fa fa-key" class="mt-4" style="width: fit-content !important;"/>
                
                <Button :isLoading="isLoading" @click.prevent="doChangeEmail" v-else :disabled="!changeEmail.VerificationCode || !changeEmail.Password" label="Change Email" class="mt-4" style="width: fit-content !important;"/>
            </div>
        </Form>
    </Dialog>

    <Dialog
        class="change-email-dialog"
        modal
        :header="`Change Password`"
        v-model:visible="changePassword.show"
        style="width: 50vw"
        :pcCloseButton="true"
        :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    >
    <TextBox label="Current Password" type="password" class="mt-4" v-model="changePassword.CurrentPassword"/>
    <TextBox label="New Password" type="password" class="mt-4" v-model="changePassword.NewPassword"/>
    <TextBox label="Confirm New Password" type="password" class="mt-4" v-model="changePassword.ConfirmNewPassword"/>

    <div style="width: 100%; justify-content: end; display: flex;">
        <Button 
        @click.prevent="doChangePassword" 
        :isLoading="isLoading"
        :disabled="!changePassword.CurrentPassword || !changePassword.NewPassword || !changePassword.ConfirmNewPassword" 
        label="Change Password" class="mt-4" style="width: fit-content !important;"/>
    </div>
    </Dialog>
</template>
<script>
import { Form } from "vee-validate";
import Dialog from 'primevue/dialog';
import {mapActions} from 'vuex'
import module from '../../constant/module';
export default{
  watch: {
    'changeEmail.show':{
        immediate: false,
        handler(newVal){
            if(!newVal){
                this.changeEmail= {
                    show: false,
                    NewEmail: null,
                    Password: null,
                    VerificationCode: null,
                    hasSendOTP: false,
                    duration: 0
                }
            }
        }
    },
    'changePassword.show':{
        immediate: false,
        handler(newVal){
            if(!newVal){
                this.changePassword= {
                    show: false,
                    CurrentPassword: null,
                    NewPassword: null,
                    ConfirmNewPassword: null,
                }
            }
        }
    }
  },
  components:{Dialog, Form},
  methods: {
    doChangePassword(){
        if(this.isLoading) return

        if(this.changePassword.NewPassword != this.changePassword.ConfirmNewPassword){
            this.$showToast.error("New Password and Confirm New Password not match!")
            return;
        }
        this.isLoading = true

        this.userChangePassword(this.changePassword)
        .then(res=>{
            this.changePassword.show = false
            this.$showToast.success("Success Change Password")
            this.$emit('updateUser')
        })
        .catch(err=>{
            this.$showToast.error(err)
        })
        .finally(()=>{ this.isLoading= false})
    },
    showChangeEmail(){
        this.changeEmail.show = true
    },
    getTimer(duration){
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    },
    setOTPInterval(){
        const timerInterval = setInterval(() => {
            this.changeEmail.duration -= 1;
            if (this.changeEmail.duration < 0) {
                clearInterval(timerInterval);
            }
        }, 1000);
    },
    doChangeEmail(){
        if(this.isLoading) return
        this.isLoading = true
        this.userChangeEmail(this.changeEmail)
        .then(res=>{
            this.changeEmail.show = false
            this.$showToast.success("Berhasil mengubah email")
            this.$emit('updateUser')
        })
        .catch(err=>{
            this.$showToast.error(err)
        })
        .finally(()=>{ this.isLoading= false})
    },
    async sendOTP(){
        if(this.changeEmail.duration > 0 || this.isLoading) return
        const validator = this.$refs.observer;
        const result = await validator.validate();
        if (!result) return

        if(this.user.Email.toLowerCase().trim() == this.changeEmail.NewEmail.toLowerCase().trim()){
            this.$showToast.error("Email tidak boleh sama")
            return
        }
        this.isLoading = true

        this.sendOTPChangeEmail(this.changeEmail.NewEmail)
        .then(res=>{
            console.log(res)
            this.changeEmail.hasSendOTP = true
            this.changeEmail.duration = 300;
            this.$showToast.success("Berhasil mengirim OTP, periksa email Anda")
        })
        .catch(err=> {
            if(err.code == 5){
                const minutes = Math.floor(err.data / 60);
                const seconds = err.data % 60;
                this.$showToast.error(`Tidak dapat mengirim OTP, coba lagi dalam ${minutes} menit ${seconds} detik`)
            }
            console.log(err)
        })
        .finally(()=>{ this.isLoading= false})
    },   
    ...mapActions(module.user.name, ['sendOTPChangeEmail', 'userChangeEmail', 'userChangePassword'])
  },
  data () {
    return {
        changeEmail: {
            show: false,
            NewEmail: null,
            Password: null,
            VerificationCode: null,
            hasSendOTP: false,
            duration: 0
        },
        changePassword: {
            show: false,
            CurrentPassword: null,
            NewPassword: null,
            ConfirmNewPassword: null,
        },
        isLoading: false
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