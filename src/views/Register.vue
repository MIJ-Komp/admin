<template>
   <div class="login-page-container" style="height: 99vh">
      <div class="banner">
         <img />
      </div>
      <div class="login-container h-100">
         <img class="logo" :src="$assets.logo" />
         <div class="mb-4 text-center form-container">
            <Form @submit="doRequestOtp" ref="form">
               <div class="font-h3" style="margin-bottom: 80px">
                  Cloudhomes Register
               </div>
               <TextBox
                  label="Email"
                  type="email"
                  v-model="form.Email"
                  style="margin-bottom: 24px"
               />
               <TextBox
                  label="Nomor Telepon"
                  v-model="form.PhoneNumber"
                  mustStartWith="+62"
                  placeholder="+628xxxx"
                  style="margin-bottom: 24px"
               />

               <TextBox
                  label="Nama"
                  v-model="form.Name"
                  style="margin-bottom: 24px"
               />
               <TextBox
                  label="Kata Sandi"
                  type="password"
                  v-model="form.Password"
                  style="margin-bottom: 17px"
               />
               <TextBox
                  label="Konfirmasi Kata Sandi"
                  type="password"
                  v-model="form.ConfirmPassword"
                  style="margin-bottom: 17px"
               />
               <TextBox
                  label="Referral Code"
                  v-model="form.ReferralCode"
                  style="margin-bottom: 24px"
               />
               <Button label="Daftar" buttonType="primary" type="submit" :disabled="process.sendOtp" :isLoading="process.sendOtp"/>
            </Form>
            <div class="mt-2 mb-2">Sudah punya akun? <span @click="goto('login')" class="button-register">Masuk Sekarang!</span></div>
         </div>
         <div class="footer">
            {{ $moment().format("YYYY") }} {{ $constant.CompanyName }}, All
            Rights reserved
         </div>
      </div>
      <Dialog
         class="dialog"
         modal
         header="Verifikasi Kode OTP"
         v-model:visible="showVerifOtp"
         :style="{ width: '50vw' }"
         :visible="visible"
         :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
      >
      <div>Kami telah mengirimkan kode OTP ke {{ form.Email? 'Email' :'Whatsapp' }} <span style="color: black;">{{ form.Email|| form.PhoneNumber }}</span></div>
      <TextBox label="OTP Code" type="password" class="mt-4" v-model="form.VerificationCode" :maxLength="6"/>

      <div class="flex-row" 
         style="width: fit-content;" 
         :style="form.duration <= 0 ? 'cursor:pointer; color: black;': 'color: var(--grey-800)'" @click.prevent="doRequestOtp">
         <div>Resend OTP Code <span v-if="form.duration > 0">({{ getTimer(form.duration) }})</span></div>
      </div>
      <Button :isLoading="process.register" 
         @click.prevent="doRegister" :disabled="process.register" label="Verifikasi dan Lanjutkan" iconFa="fa fa-key" class="mt-4" 
         style="width: fit-content !important; justify-self: right;"/>

   </Dialog>
   </div>
</template>
<script>
import { mapActions, mapMutations } from "vuex";
import module from "../constant/module";
import { Form } from "vee-validate";
import Dialog from "primevue/dialog";

export default {
   setup() {
      const handleSubmit = (values) => {
         // console.log(values);
      };

      return { handleSubmit };
   },
   components: {
      Form, Dialog
   },
   watch: {
      // 'form.email':{
      //     immediate: true,
      //     handler(newVal) {
      //         // console.log(newVal)
      //     }
      // }
   },
   methods: {
      getTimer(duration, isDetail){
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        if(isDetail){
           return `${minutes} menit, ${seconds} detik`;
        }
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    },
      goto(url) {
         var content = document.getElementById("mij-content");
         if (content) {
            content.scrollTo({ top: 0, behavior: "smooth" });
         }

         setTimeout(() => {
            this.$router.replace(`/${url}`);
         }, 50);
      },
      doRequestOtp(){
         if(this.form.Password != this.form.ConfirmPassword){
            this.$showToast.error("Kata Sandi dan Konfirmasi Kata Sandi harus sama", "");
            return
         }
         if(this.process.sendOtp) return
         if(this.tempEmail == this.form.Email && this.form.duration > 0){
            this.$showToast.error(`Tunggu ${this.getTimer(this.form.duration, true)} untuk mengirim ulang kode OTP`, "");
            return
         }
         this.tempEmail = this.form.Email;

         this.process.sendOtp = true
         this.requestOtpAgent({
            EmailPhoneNumber : this.form.Email,
            SendBy: 3, //email
            Type: 1 //verification
         }).then((res)=>{
            this.showVerifOtp = true
            this.form.duration = 300;
            this.$showToast.success("Berhasil mengirim kode OTP", "");
            
            const timerInterval = setInterval(() => {
                  this.form.duration -= 1;
                  if (this.form.duration < 0) {
                     clearInterval(timerInterval);
                  }
            }, 1000);
         }
         ).catch((err)=>{
            this.$showToast.error("Gagal mengirim kode OTP", 
            err.code == 5 ? `Tunggu ${this.getTimer(err.data, true)} untuk mengirim ulang kode OTP` : err);
            this.showVerifOtp = false
         })
         .finally(()=>{
            setTimeout(() => {
               this.process.sendOtp = false
            }, 100);
         })
      },
      async doRegister() {
         // this.showVerifOtp = true

            this.registerAgent(this.form)
            .then((res) => {
               // const user = { email: this.form.Email };
               // localStorage.setItem("authorization", `Bearer ${res}`);
               // localStorage.setItem("user", JSON.stringify(user));
               // this.setUser(user);

               this.$showToast.success("Berhasil Mendaftar, silahkan login", "");
               setTimeout(() => {
                  this.showVerifOtp = false
                  this.goto("login")
               }, 1000);
            })
            .catch((err) => {
               // console.log(err)
               this.$showToast.error("Login Failed", err);
            });
      },

      ...mapActions(module.user.name, ["registerAgent", "requestOtpAgent"]),
      ...mapMutations(module.user.name, ["setUser"]),
   },
   created() {
      const referralCode = this.$route.query.ref;
      if (referralCode) {
         // alert(`aweawd ${referralCode}`
         console.log('REFERAL CODE', referralCode);
         this.form.ReferralCode = referralCode
      }
   },
   data() {
      return {
         showVerifOtp: false,
         process: {
            sendOtp: false,
            register: false
         },
         tempEmail: "",
         form: {
            Email: "",
            PhoneNumber:null,
            Name:"",
            Password: "",
            duration: 0,
            ConfirmPassword: "",
            VerificationCode: "",
            ReferralCode: "",
         },
      };
   },
};
</script>

<style scoped>
.button-register{
   color: var(--blue-500);
   cursor: pointer;
}
.banner img {
   object-fit: contain;
}
.banner {
   border-right: 1px solid var(--grey-500);
   width: 50%;
}
.login-page-container {
   display: flex;
}
.form-container {
   width: 100%;
   max-width: 512px;
   align-self: center;
   overflow: auto;
}
.login-container {
   width: 50%;
   padding: 48px 40px 40px 55px;
   display: flex;
   flex-direction: column;
   background: white;
   justify-content: space-between;
}
.login-container .logo {
   width: 88px;
   height: 88px;
   min-height: 88px;
}
@media screen and (max-width: 900px) {
   .banner {
      display: none;
   }
   .login-container {
      width: 100%;
      padding: 48px 40px 40px 40px;
   }
}
@media screen and (max-width: 400px) {
   .login-container {
      padding: 20px;
   }
}
</style>
