<template>
    <b-row class="h-100">
       <b-col cols="12" lg="6" class="card-container">
          <div>
            <div class="profile-card" @click="changeForm(0)" :class="active == 0 ?'card-active': ''">
                <div class="font-body">Edit Profile</div>
                <i class="fa fa-angle-right"/>
                <i class="fa fa-angle-up" v-if="active ==0 && showForm"/>
                <i class="fa fa-angle-down" v-else/>
            </div>
            <div class="profile-form" v-if="active== 0 && showForm">
              <ProfileForm @updateUser="checkUser" :showTitle="false" :user="user"/>
            </div>
          </div>
          <div class="mt-3">
            <div class="profile-card" @click="changeForm(1)" :class="active == 1?'card-active': ''">
                <div class="font-body">Account Setting</div>
                <i class="fa fa-angle-right"/>
                <i class="fa fa-angle-up" v-if="active ==1 && showForm"/>
                <i class="fa fa-angle-down" v-else/>
            </div>
            <div class="profile-form" v-if="active==1 && showForm">
              <AccountForm @updateUser="checkUser" :showTitle="false" :user="user"/>
            </div>
          </div>
      </b-col>
      <b-col>
        <div class="profile-form-container h-100">
            <ProfileForm @updateUser="checkUser"  v-show="active==0" :user="user"/>
            <AccountForm @updateUser="checkUser"  v-if="active==1" :user="user"/>
        </div>
      </b-col>
    </b-row>
</template>

<script>
import {mapGetters, mapActions, mapMutations} from 'vuex'
import AccountForm from './AccountForm.vue';
import ProfileForm from './ProfileForm.vue';
import module from '../../constant/module'
export default {
components:{
    AccountForm,
    ProfileForm,
},
name: 'Profile',
data() {
    return {
      runningImagesContainer: null,
      currentPosition: 0,
      activeIndex:0,
      featureCards: null,
      active: 0,
      showForm: true
    };
},
async mounted(){
  if(!this.user){
    this.checkUser()
  }
},
computed:{
  ...mapGetters(module.user.name, ["user"])
},
methods:{
  async checkUser(){
      const user = await this.getMe()
      console.log(user)
      this.setUser(user)
  },
  ...mapMutations(module.user.name, ["setUser"]),
  ...mapActions(module.user.name, ["getMe"]),
  changeForm(index){
    if(index == this.active){
      this.showForm = !this.showForm
    }
    else{
      this.active = index
      this.showForm = true
    }
  },
  
}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .profile-card{
      border: 1px solid var(--grey-600);
      border-radius: 8px;
      display: flex;
      align-items: center;
      padding: 24px;
      justify-content: space-between;
      color: var(--grey-800);
      cursor: pointer;
    }
    .profile-card i{
      font-size: 32px;
    }
    .profile-card-container:hover{
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
    .profile-card-container{
      margin-bottom: 24px;
      cursor: pointer;
    }
    .card-content{
      padding: 0 24px;
    }
    .card-active{
      border-left: 8px solid var(--blue-500);
      color: var(--blue-500);
    }
    .titleContent{
      display: flex;
    }
   .profile-container{
      /* padding: 80px; */
      display: flex;
      justify-content: space-between;
   }
   .profile-form-container{
      padding: 16px;
      background: white;
      border: 1px solid var(--grey-600);
      border-radius: 8px;
   }
   .card-container{
      padding: 24px;
      background: white;
      border: 1px solid var(--grey-600);
      border-radius: 8px;
      height: fit-content;
      width: 400px;
      max-width: 100%;
   }
   
   .profile-form{
    display: none;
    }
   .mobile{display: none}
   .fa-angle-up, .fa-angle-down{
    display: none;
   }

   @media (max-width: 991px) {
    .profile-form{
      margin-top: 24px;
      display: flex !important;
      flex-direction: column;
      align-items: center;
      padding: 24px 8px;
      border: 1px solid var(--grey-600);
   }
    .profile-form-container{
      display: none;
    }
    .fa-angle-right{
      display: none;
    }
    .fa-angle-up, .fa-angle-down{
      display: block;
    }
    .website{
      display: none
    }
    .mobile{display: block}
    .profile-container{
      padding: 20px;
    }
    .card-container{
      width: 100%;
      min-width: 100%;
      height: 100%;
    }
    .profile-card-container:hover{
      transform: scale(1);
      box-shadow: unset;
    }
    .card-content{
      margin: 12px 0;
      padding: 0 12px;
    }
   }
</style>
