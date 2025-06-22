<template>
   <div class="side-nav-bar">
      <div class="btn-menu" @click="toggleMenu">
         <i class="fa fa-bars" />
      </div>
      <div :class="isOpenMenu ? 'bg-menu-mobile w-100 h-100' : 'bg-menu h-100'">
         <div
            class="menu-mobile-active slide-right"
            v-click-outside="hideMenu"
            :class="isOpenMenu ? `menu-mobile h-100` : 'menu-container'"
            ref="menu"
         >
            <img class="logo pc-section" :src="$assets.favicon" />

            <!-- <div class="mobile-section profile">
               <b-row>
                  <b-col cols="auto" style="align-content: center;">
                     <img :src="`${this.$constant.apiURL}/image/${user.ImageId}`" style="height: 40px; border-radius: 8px;"/>
                  </b-col>
                  <b-col style="align-content: center;" @click="gotoProfile">
                     <div class="font-label" style="text-wrap-style: balance;">{{ user.Name }} <i class="fa fa-edit ms-2"/></div>
                     <div style="font-size: 14px;">{{ user.Email }}</div>
                  </b-col>
               </b-row>
            </div> -->
            <div class="menu">
               <div style="flex-grow: 1; overflow: auto; overflow-x: hidden">
                  <div
                     v-for="menu in menus"
                     :key="menu"
                     class="menu-item"
                     :class="activePage(null, menu)"
                  >
                     <div v-if="menu.visible" class="label-container w-100" @click="openMenu(menu)">
                        <div class="d-flex align-i-center">
                           <img class="ic-menu" :src="menu.icon" />
                           <span class="menu-label font-label">{{
                              menu.label
                           }}</span>
                        </div>
                        <i
                           class="font-label"
                           v-if="menu.items && menu.items.length > 0"
                           :class="
                              menu.isOpenItem
                                 ? 'fa fa-angle-up'
                                 : 'fa fa-angle-down'
                           "
                        />
                     </div>
                     <div v-if="menu.isOpenItem" class="">
                        <div v-for="(item, i) in menu.items" :key="i">
                           <div
                              v-if="item.visible"
                              @click="openMenu(item)"
                              class="menu-child"
                              :class="activePage(i, item)"
                           >
                              <div v-if="i != 0" class="line"></div>
                              <i class="fa fa-circle" />
                              <div class="font-label">
                                 <div>{{ item.label }}</div>
                                 <!-- <div style="font-size: 8px;line-height: 0; font-weight: 400;">Do not Have Access</div> -->
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
               <div class="footerMenu" style="flex-shrink: 1">
                  <div class="menu-item m-0">
                     <div class="label-container m-0" @click="doLogout">
                        <div class="d-flex align-i-center">
                           <img class="ic-menu" :src="$assets.icons.logout" />
                           <span class="menu-label">Log Out</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import module from "../constant/module";
import accessModule from "../constant/accessModule";
import constant from '../constant/constant';

export default {
  async created () {
   this.menus = [
            {
               icon: this.$assets.icons.dashboard,
               label: this.$label.menu.dashboard,
               path: this.$constant.router.dashboard,
               visible: true
            },
            {
               icon: this.$assets.icons.catalog,
               label: this.$label.menu.catalog,
               visible: await this.hasViewRole(accessModule.module.productCategory.Id) ||
                        await this.hasViewRole(accessModule.module.facility.Id) ||
                        await this.hasViewRole(accessModule.module.addOn.Id) ||
                        await this.hasViewRole(accessModule.module.productVariant.Id),
               items: [
                  {
                     // icon: this.$assets.icons.plus,
                     label: this.$label.menu.productCategory,
                     path: this.$constant.router.productCategory,
                     visible: await this.hasViewRole(accessModule.module.productCategory?.Id)
                  },
                  {
                     // icon: this.$assets.icons.plus,
                     label: this.$label.menu.product,
                     path: this.$constant.router.product,
                     visible: await this.hasViewRole(accessModule.module.facility.Id)
                  },
                  {
                     // icon: this.$assets.icons.plus,
                     label: this.$label.menu.productBundle,
                     path: this.$constant.router.productBundle,
                     visible: await this.hasViewRole(accessModule.module.facility.Id)
                  },
                  {
                     // icon: this.$assets.icons.plus,
                     label: this.$label.menu.menu,
                     path: this.$constant.router.menu,
                     visible: true //await this.hasViewRole(accessModule.module.addOn.Id)
                  },
               ],
            },
            {
               icon: this.$assets.icons.transaction,
               label: this.$label.menu.transaction,
               path: this.$constant.router.transaction,
               visible: await this.hasViewRole(accessModule.module.transaction.Id)
            },
            {
               icon: this.$assets.icons.report,
               label: this.$label.menu.report,
               path: this.$constant.router.report,
               visible: await this.hasViewRole(accessModule.module.report.Id)
            },
         ]
  },
   watch: {
      path: {
         immediate: true,
         handler(newVal) {
            if (newVal)
               for (let index = 0; index < this.menus.length; index++) {
                  const menu = this.menus[index];
                  if (
                     menu.items &&
                     menu.items.filter((data) =>
                        this.path.includes(
                           data.path.replace("/", "").trim().toLocaleLowerCase()
                        )
                     ).length > 0
                  ) {
                     this.menus[index].isOpenItem = true;
                  } else {
                     this.menus[index].isOpenItem = false;
                  }
               }
         },
      },
   },
   computed: {
      path() {
         return this.$route.path.trim().toLocaleLowerCase().replace("/", "");
      },
      ...mapGetters(module.user.name, ["user"]),
   },

   mounted() {},
   methods: {
      gotoProfile(){
         this.$router.push({path: `/profile`})
         this.hideMenu()
      },
      toggleMenu(event) {
         event.stopPropagation()
         this.isOpenMenu = !this.isOpenMenu;
         setTimeout(() => {
            if (this.$refs.menu) {
               if (this.isOpenMenu) {
                  this.$refs.menu.style.left = "0px !important";
               } else {
                  this.$refs.menu.style.left = "-300px !important";
               }
            }
         }, 200);
      },
      hideMenu() {
         this.isOpenMenu = false;
         setTimeout(() => {
            if (this.$refs.menu) {
               this.$refs.menu.style.left = "-300px !important";
            }
         }, 200);
      },
      activePage(child, menu) {
         if (this.$route.meta.page == "404") {
            return false;
         }
         console.log(this.path)
         if (this.path) {
            if(menu.path && 
               this.path?.includes(menu.path.replace("/", "").trim().toLocaleLowerCase())
            ){
               return "active";
            }
            else if(!menu.isOpenItem && menu.items && menu.items.find(data=> 
               this.path?.includes(data.path
                  .replace("/", "")
                  .trim()
                  .toLocaleLowerCase())
            )){
               return "active"
            }
            return ""
            const hasChild =
               child != null &&
               menu.items &&
               menu.items &&
               menu.items[child].isOpenItem;

            const isParent =
               !hasChild &&
               menu.path &&
               ((menu.path.includes("property") && this.path.split('/')[0]) == 'property'||
                  this.path.includes(
                     menu.path.replace("/", "").trim().toLocaleLowerCase()
                  ));


            // // console.log(`${!menu.items || !child ? menu.path : menu.items[child].path.trim().toLocaleLowerCase()} X ${this.path}`)
            var index = child;
            if (index == -1) {
               index += 1;
            }
            console.log(menu, hasChild)
            // if(index){
            //   // // console.log(menu.items[index].path)
            // }
            // // console.log(`${menu.path} X ${this.path}`)
            if (
               (index == null && isParent) ||
               (index != null &&
                  menu.items[index] &&
                  this.path.includes(
                     menu.items[index].path
                        .replace("/", "")
                        .trim()
                        .toLocaleLowerCase()
                  ) && ((isParent && !menu.isOpenItem) || (!isParent && menu.isOpenItem)))
            ) {
               return "active";
            } else return "";
         }
      },
      openMenu(menu) {
         if (menu.items) {
            const old = menu.isOpenItem;
            for (let index = 0; index < this.menus.length; index++) {
               const menu = this.menus[index];
               if (menu.items && menu.items.length > 0) {
                  this.menus[index].isOpenItem = false;
               }
            }
            menu.isOpenItem = !old;
         } else {
            this.hideMenu()
            this.goto(menu.path);
         }
      },
      goto(url) {
         var content = document.getElementById("content-otp");
         if (content) {
            content.scrollTo({ top: 0, behavior: "smooth" });
         }
         setTimeout(() => {
            this.$router.push({
               path : `${url}`,
            });
            // this.$forceUpdate();
            this.menuIsShow = false;
         }, 50);
      },
      async doLogout() {
         var confirm = await this.$dialog.Confirmation.confirm({
            title: "Konfirmasi",
            message: "Apakah Anda ingin Logout?",
         });
         if (confirm) {
            await this.logout().then((res) => {
               this.$showToast.success("Logout Success", "");
               // setTimeout(() => {
               this.$router.replace("/login");
               // }, 2000);
            });
         } else {
            // console.log('User chose to cancel logout.');
         }
      },
      ...mapActions(module.user.name, ["logout", "hasViewRole", "hasOtherRole"]),
   },
   data() {
      return {
         isOpenMenu: false,
         menus: []
      };
   },
};
</script>
<style scoped>
.profile{
   border-bottom: 1px solid white;
   padding-bottom: 20px;
   margin-bottom: 10px;
}
.footerMenu {
   border-top: 1px solid var(--grey-50);
   padding-top: 16px;
}
.menu-child {
   margin: 4px 0px;
   margin-left: 22px;
   display: flex;
   position: relative;
   width: calc(100% - 44px);
   cursor: pointer;
}
.menu-child .font-label:hover,
.label-container:hover {
   /* transform: scale(1.05); */
   border: 1px solid var(--blue-700);
   border-radius: 4px;
   background: var(--blue-600);
}
.menu-child i {
   font-size: 8px;
   margin-right: 32px;
   display: flex;
   align-self: center;
   z-index: 1;
   color: var(--blue-200);
}
.menu-child .font-label {
   width: 100%;
   white-space: nowrap;
   overflow: hidden;
   text-overflow: ellipsis;
   border: 1px solid transparent;
}
.menu-child .line {
   position: absolute;
   height: 47px;
   width: 2px;
   left: 2.4px;
   background: var(--blue-700);
   top: -27px;
}
.label-container i {
   font-size: 22px !important;
}
.menu-label {
   white-space: nowrap;
   overflow: hidden;
   text-overflow: ellipsis;
}
.label-container {
   display: flex;
   justify-content: space-between;
   align-items: center;
   cursor: pointer;
   width: 100%;
   padding: 8px;
   padding-right: 16px;
   margin-bottom: 8px;
   border: 1px solid transparent;
}
.menu-item {
   margin-bottom: 16px;
}
.menu-item .font-label {
   color: var(--grey-50);
   padding: 4px;
}
.menu-child.active i {
   color: var(--grey-50);
}
.active .label-container,
.menu-child.active .font-label {
   border: 1px solid var(--blue-700);
   border-radius: 4px;
   background: var(--blue-800);
}
.ic-menu {
   width: 18px;
   height: 18px;
   margin-right: 16px;
}
.logo {
   width: 60px;
   min-width: 60px;
   height: 60px;
   min-height: 60px;
   justify-self: center;
   margin-bottom: 32px;
   align-self: center;
}
.menu-container,
.menu-mobile {
   width: 220px;
   min-width: 220x;
   background: var(--primary-color);
   padding: 8px;
   display: flex;
   flex-direction: column;
   justify-content: space-between;
   height: 100%;
   color: white;
}
.read-the-docs {
   color: #888;
}
.btn-menu {
   display: none;
}

.menu-mobile {
   display: flex;
   flex-direction: column;
   position: absolute;
   z-index: 110;
   top: 0;
   left: 0 !important;
   transition: left 1s ease;
   border-radius: 0;
}
.bg-menu-mobile {
   background: #65656580;
   position: absolute;
   z-index: 100;
   top: 0;
   left: 0;
}

.menu {
   display: flex;
   flex-direction: column;
   height: 100%;
   overflow: hidden;
}

@media screen and (max-width: 900px) {
   .pc-section{
      display: none;
   }
   .menu-mobile-active {
      left: -300px;
      transition: left 1s ease;
      padding: 20px 12px;
   }
   .menu-container {
      display: none;
   }
   .btn-menu {
      height: 60px;
      font-size: 28px;
      /* width: 100px; */
      animation: slideBottom 0.5s ease-out;
      position: absolute;
      z-index: 100;
      display: block;
      display: flex;
      padding: 12px;
      align-items: center;
      border-radius: 8px;
      background: white;
      color: var(--primary-color);
      /* box-shadow: 0 0.8px 2px 0px var(--grey-800); */
   }
}
</style>
