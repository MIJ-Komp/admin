<template>
   <div class="login-page-container" style="height: 99vh">
      <div class="login-container h-100">
         <div class="text-center form-container">
            <img class="logo" :src="$assets.logo" />
            <Form @submit="doLogin" ref="form">
               <div class="font-h2 mb-4">
                  Login Admin
               </div>
               <TextBox
                  label="Email"
                  type="email"
                  v-model="form.Email"
                  style="margin-bottom: 24px"
               />
               <TextBox
                  label="Password"
                  type="password"
                  v-model="form.Password"
                  style="margin-bottom: 17px"
               />
               <div
                  class="w-100 d-flex font-body"
                  style="justify-content: end; margin-bottom: 40px;"
               >
                  <div style="cursor: pointer; color: var(--primary-color)">
                     Forgot Password?
                  </div>
               </div>
               <Button label="Login" buttonType="primary" type="submit" />
            </Form>
            <!-- <div class="mt-5">Ingin bergabung sebagai Agent? <span @click="goto('register')" class="button-register">Daftar Sekarang!</span></div> -->
         </div>
         <div class="footer mt-4">
            {{ $moment().format("YYYY") }} {{ $constant.CompanyName }}, All
            Rights reserved
         </div>
      </div>
   </div>
</template>
<script>
import { mapActions, mapMutations } from "vuex";
import module from "../constant/module";
import { Form } from "vee-validate";
export default {
   setup() {
      const handleSubmit = (values) => {
         // console.log(values);
      };

      return { handleSubmit };
   },
   components: {
      Form,
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
      async doLogin() {
         const isError = await this.$refs.form.validate();
         await this.login(this.form)
            .then((res) => {
               // const user = { email: this.form.Email };
               localStorage.setItem("authorization", `Bearer ${res}`);
               // localStorage.setItem("user", JSON.stringify(user));
               // this.setUser(user);

               this.$showToast.success("Login Success", "");
               setTimeout(() => {
               window.location.href =`/dashboard`;
               }, 1000);
            })
            .catch((err) => {
               // console.log(err)
               this.$showToast.error("Login Failed", err);
            });
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

      ...mapActions(module.user.name, ["login"]),
      ...mapMutations(module.user.name, ["setUser"]),
   },
   data() {
      return {
         form: {
            Email: "",
            Password: "",
         },
      };
   },
};
</script>

<style scoped>
.banner img {
   object-fit: contain;
}
.banner {
   width: 50%;
}
.login-page-container {
   display: flex;
   justify-content: center;
   padding: 32px;
   background-color: var(--primary-color);
}
.form-container {
   width: 100%;
   align-self: center;
}
.login-container {
   width: 600px;
   max-width: 90%;
   padding: 24px;
   display: flex;
   flex-direction: column;
   background: white;
   border-radius: 8px;
   justify-content: space-between;
}
.login-container .logo {
   width: 140px;
   height: auto;
   margin-bottom: 24px;
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
.button-register{
   color: var(--blue-500);
   cursor: pointer;
}
</style>
