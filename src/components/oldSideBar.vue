<template>
  <div class="menu-container">
    <img class="logo" alt="logo"/>
    <div class="menu">
      <div v-for="menu in menus" :key="menu" class="menu-item" @click="openMenu(menu)">
        <div class="label-container">
          <div>
            <img class="ic-menu" :src="menu.icon"/>
            <span class="menu-label">{{ menu.label }}</span>
          </div>
          <i v-if="menu.items && menu.items.length > 0" :class="menu.isOpenItem ? 'fa fa-angle-up':'fa fa-angle-right'"/>
        </div>
        <div v-if="menu.isOpenItem" class="menu-child">
          <div v-for="item in menu.items" :key="item">
            <div>{{ item.label }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="footerMenu"></div>
  </div>
</template>
<script>
export default{
  methods: {
    openMenu(menu){
      if(menu.items){
        menu.isOpenItem = !menu.isOpenItem 
      }
      else{
        this.goto(menu.path)
      }
    },
    goto(url){
      var content = document.getElementById("content-otp");
      if(content){
        content.scrollTo({ top: 0, behavior: 'smooth' });
      }
      setTimeout(() => {
        this.$router.replace(`/${url}`);
        this.menuIsShow = false
      }, 50);
    },
  },
  data () {
    return {
      isOpenMenu: true,
      menus:[
        {
          icon: null,
          label: this.$label.menu.dashboard,
          path:''
        },
        {
          icon: null,
          label: this.$label.menu.catalog,
          items:[
            {
              icon: null,
              label: this.$label.menu.propertyType,
              path:'/property-type'
            },
          ]
        },
        {
          icon: null,
          label: this.$label.menu.property,
          path:'property'
        },
        {
          icon: null,
          label: this.$label.menu.transaction,
          items:[
            {
              icon: null,
              label: "One",
              path:'/transaction-one'
            },
          ]
        },
        {
          icon: null,
          label: this.$label.menu.paymentMethod,
          path:'paymentMethod'
        },
        {
          icon: null,
          label: this.$label.menu.report,
          path:'report'
        },
        {
          icon: null,
          label: this.$label.menu.user,
          path:'user'
        },
        {
          icon: null,
          label: this.$label.menu.device,
          path:'device'
        }
      ]
    }
  },

}
</script>
<style scoped>
.menu-child{
  margin-left: 52px;
}
.label-container{
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  width: 100%;
}
.menu-item{
  margin-bottom: 16px;
}
.ic-menu{
  width: 32px;
  height: 32px;
  margin-right: 20px;
}
.logo{
  width: 88px;
  height: 88px;
  align-self: center;
}
.menu-container{
  width: 280px;
  min-width: 280px;
  background: #F4F4F4;
  padding: 48px 24px;
  display: flex;
  flex-direction: column;
}
.read-the-docs {
  color: #888;
}
</style>
