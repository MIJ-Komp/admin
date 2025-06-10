<template>
    <MIJForm
      :formData="formData"
      :createAction="doCreate"
      :updateAction="doUpdate"
      :showCancel="showCancel"
      @cancel="$emit('cancel')">
        <b-row>
            <b-col sm="6" class="mt-4">
                <TextBox label="Role Name" v-model="form.Name"/>
            </b-col>
            <b-col sm="6" class="mt-4">
                <TextBox label="Access Level" type="number" :min="1" v-model="form.Level"/>
            </b-col>
        </b-row>
        <b-row class="mt-4">
            <b-col cols="12" class="mb-4">
                <div>Hak Akses yang diberikan :</div>
            </b-col>

            <b-tabs v-model="tabIndex">
                <b-tab title="Module" active>
                    <div class="flex-column mt-2">
                        <table>
                            <thead>
                                <tr>
                                    <td>
                                        <div class="t-header">
                                            <CheckBox v-model="isAllModule" 
                                            @change="checkedAllModule(false)"
                                            :checked="isAllModule"/>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="t-header">Module Name</div></td>
                                    <td>
                                        <div class="t-header">
                                            <div>View</div>
                                            <CheckBox v-model="isAllView" :checked="isAllView"
                                            @change="checkedAllView(false)"/>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="t-header">
                                            <div>Add</div>
                                            <CheckBox v-model="isAllCreate" :checked="isAllCreate"
                                            @change="checkedAllAdd(false)"/>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="t-header">
                                            <div>Edit</div>
                                            <CheckBox v-model="isAllUpdate" :checked="isAllUpdate"
                                            @change="checkedAllEdit(false)"/>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="t-header">
                                            <div>Delete</div>
                                            <CheckBox v-model="isAllDelete" :checked="isAllDelete"
                                            @change="checkedAllDelete(false)"/>
                                        </div>
                                    </td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="key in Object.keys(this.Modules)" :key="key">
                                    <td>
                                        <div class="t-body">
                                        <CheckBox v-model="roleAccesses[key].IsSelected" 
                                            :checked="roleAccesses[key].IsSelected" 
                                            @change="checked(key, 'IsSelected', false)"/></div>
                                    </td>
                                    <td>
                                        <div>{{Modules[key].label}}</div>
                                    </td>
                                    <td>
                                        <div class="t-body">
                                        <CheckBox v-model="roleAccesses[key].View" 
                                            :checked="roleAccesses[key].View"
                                            @change="checked(key, 'View', false)"/></div>
                                    </td>
                                    <td>
                                        <div class="t-body">
                                        <CheckBox v-model="roleAccesses[key].Create" 
                                            :checked="roleAccesses[key].Create"
                                            @change="checked(key, 'Create', false)"/></div>
                                    </td>
                                    <td>
                                        <div class="t-body">
                                        <CheckBox v-model="roleAccesses[key].Update" 
                                            :checked="roleAccesses[key].Update"
                                            @change="checked(key, 'Update', false)"/></div>
                                    </td>
                                    <td>
                                        <div class="t-body">
                                        <CheckBox v-model="roleAccesses[key].Delete" 
                                            :checked="roleAccesses[key].Delete"
                                            @change="checked(key, 'Delete', false)"/></div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </b-tab>
                <b-tab title="Other Module">
                    <div class="flex-column mt-2">
                        <table>
                            <thead>
                                <tr>
                                    <td>
                                        <div class="t-header">
                                            <CheckBox v-model="isOtherAllModule" 
                                            @change="checkedAllModule(true)"
                                            :checked="isOtherAllModule"/>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="t-header">Module Name</div></td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="key in Object.keys(this.OtherModules)" :key="key">
                                    <td>
                                        <div class="t-body">
                                        <CheckBox v-model="roleOtherAccesses[key].IsSelected" 
                                            :checked="roleOtherAccesses[key].IsSelected" 
                                            @change="checked(key, 'IsSelected', true)"/></div>
                                    </td>
                                    <td>
                                        <div>{{OtherModules[key].label}}</div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </b-tab>

                <b-tab title="Property">
                    <div class="flex-column mt-2">
                        <table>
                            <thead>
                                <tr>
                                    <td>
                                        <div class="t-header">
                                            <CheckBox v-model="isAllProperties" 
                                            @change="checkedAllProperties()"
                                            :checked="isAllProperties"/>
                                        </div>
                                    </td>
                                    <td><div class="t-header">Name</div></td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="property in properties" :key="property">
                                    <td>
                                        <div class="t-body">
                                        <CheckBox v-model="property.Selected" 
                                            @change="checkSelectedProperty()"
                                            :checked="property.Selected"/></div>
                                    </td>
                                    <td>
                                        <div>{{property.Name}}</div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </b-tab>
            </b-tabs>
            
            
        </b-row>
    </MIJForm>
</template>
<script>
import Access from '../../../constant/accessModule'
import {mapActions, mapGetters} from 'vuex';
import module from '../../../constant/module'

export default {
  watch: {
    // tabIndex:{
    //     immediate: true,
    //     handler(newVal) {
    //         if(newVal){
    //             setTimeout(() => {
    //                 this.checkedAllModule(newVal != 1)
    //             }, 100);
    //         }
    //     }
    // }
  },
  data () {
    return {
        tabIndex: 0,
        Modules: Access.module,
        OtherModules : Access.otherModule,
        form:{
            Name: null,
            Level: null,
            RoleAccesses: [],
            RoleOtherAccesses: [],
            RoleProperties: []
        },
        roleAccesses:{},
        roleOtherAccesses:{},
        modules: [],

        isAllModule: false,
        isAllView: false,
        isAllCreate: false,
        isAllUpdate: false,
        isAllDelete: false,

        isOtherAllModule: false,
        isOtherAllView: false,
        isOtherAllCreate: false,
        isOtherAllUpdate: false,
        isOtherAllDelete: false,

        isAllProperties: false,

        formData: {
            module: this.$module.role,
         },

         properties:[]
    }
  },
  props: {
      showCancel: { type: Boolean, default: false },
   },
  methods: {
    checkedAllProperties(){
        this.properties = this.properties.map(data=> Object.assign(data, {Selected: this.isAllProperties}))
    },
    checkSelectedProperty(){

        this.isAllProperties = !this.properties.find(data=> !data.Selected)
    },
    doCreate() {
        this.form.RoleAccesses = Object.keys(this.roleAccesses).map(key => { return this.roleAccesses[key] });
        this.form.RoleOtherAccesses = Object.keys(this.roleOtherAccesses).map(key => { return this.roleOtherAccesses[key] }).filter(data=> data.IsSelected);
        this.form.RoleProperties = this.properties.filter(data=> data.Selected).map(data=> {return {PropertyId: data.Id}})
        return this.create(this.form);
    },
    doUpdate() {
        this.form.RoleAccesses = Object.keys(this.roleAccesses).map(key => { return this.roleAccesses[key] });
        this.form.RoleOtherAccesses = Object.keys(this.roleOtherAccesses).map(key => { return this.roleOtherAccesses[key] }).filter(data=> data.IsSelected);
        this.form.RoleProperties = this.properties.filter(data=> data.Selected).map(data=> {return {PropertyId: data.Id}})

        return this.update(this.form);
    },
    checkedAllView(isOther){
        if(!isOther){
            Object.keys(this.Modules).map((key) => {
                this.roleAccesses[key].AccessId = this.Modules[key].Id;
                this.roleAccesses[key].View = this.isAllView

                if(this.isAllView)
                    this.roleAccesses[key].IsSelected = this.isAllView;
                else{
                    this.roleAccesses[key].IsSelected =
                    this.roleAccesses[key].Create == true || this.roleAccesses[key].Update == true
                    this.roleAccesses[key].Delete == true || this.roleAccesses[key].View == true;
                }
                this.isAllModule = !Object.keys(this.Modules).find(key=> !this.roleAccesses[key].IsSelected)
            })
        }
        else{
            Object.keys(this.OtherModules).map((key) => {
                this.roleOtherAccesses[key].OtherAccessId = this.OtherModules[key].Id;
                this.roleOtherAccesses[key].View = this.isOtherAllView

                if(this.isOtherAllView)
                    this.roleOtherAccesses[key].IsSelected = this.isOtherAllView;
                else{
                    this.roleOtherAccesses[key].IsSelected =
                    this.roleOtherAccesses[key].Create == true || this.roleOtherAccesses[key].Update == true
                    this.roleOtherAccesses[key].Delete == true || this.roleOtherAccesses[key].View == true;
                }
                this.isOtherAllModule = !Object.keys(this.OtherModules).find(key=> !this.roleOtherAccesses[key].IsSelected)
            })
        }
    },
    checkedAllAdd(isOther){
        if(!isOther){
            Object.keys(this.Modules).map((key) => {
                this.roleAccesses[key].AccessId = this.Modules[key].Id;
                this.roleAccesses[key].Create = this.isAllCreate

                if(this.isAllCreate)
                    this.roleAccesses[key].IsSelected = this.isAllCreate;
                else{
                    this.roleAccesses[key].IsSelected =
                    this.roleAccesses[key].Create == true || this.roleAccesses[key].Update == true
                    this.roleAccesses[key].Delete == true || this.roleAccesses[key].View == true;
                }
                this.isAllModule = !Object.keys(this.Modules).find(key=> !this.roleAccesses[key].IsSelected)
            })
        }
        else{
            Object.keys(this.OtherModules).map((key) => {
                this.roleOtherAccesses[key].OtherAccessId = this.OtherModules[key].Id;
                this.roleOtherAccesses[key].Create = this.isOtherAllCreate

                if(this.isOtherAllCreate)
                    this.roleOtherAccesses[key].IsSelected = this.isOtherAllCreate;
                else{
                    this.roleOtherAccesses[key].IsSelected =
                    this.roleOtherAccesses[key].Create == true || this.roleOtherAccesses[key].Update == true
                    this.roleOtherAccesses[key].Delete == true || this.roleOtherAccesses[key].View == true;
                }
                this.isOtherAllModule = !Object.keys(this.OtherModules).find(key=> !this.roleOtherAccesses[key].IsSelected)
            })
        }
    },
    checkedAllEdit(isOther){
        if(!isOther){
            Object.keys(this.Modules).map((key) => {
                this.roleAccesses[key].AccessId = this.Modules[key].Id;
                this.roleAccesses[key].Update = this.isAllUpdate

                if(this.isAllUpdate)
                    this.roleAccesses[key].IsSelected = this.isAllUpdate;
                else{
                    this.roleAccesses[key].IsSelected =
                    this.roleAccesses[key].Create == true || this.roleAccesses[key].Update == true
                    this.roleAccesses[key].Delete == true || this.roleAccesses[key].View == true;
                }
                this.isAllModule = !Object.keys(this.Modules).find(key=> !this.roleAccesses[key].IsSelected)
            })
        }
        else{
            Object.keys(this.OtherModules).map((key) => {
                this.roleOtherAccesses[key].OtherAccessId = this.Modules[key].Id;
                this.roleOtherAccesses[key].Update = this.isOtherAllUpdate

                if(this.isAllUpdate)
                    this.roleOtherAccesses[key].IsSelected = this.isOtherAllUpdate;
                else{
                    this.roleOtherAccesses[key].IsSelected =
                    this.roleOtherAccesses[key].Create == true || this.roleOtherAccesses[key].Update == true
                    this.roleOtherAccesses[key].Delete == true || this.roleOtherAccesses[key].View == true;
                }
                this.isOtherAllModule = !Object.keys(this.OtherModules).find(key=> !this.roleOtherAccesses[key].IsSelected)
            })
        }
    },
    checkedAllDelete(isOther){
        if(!isOther){
            Object.keys(this.Modules).map((key) => {
                this.roleAccesses[key].AccessId = this.Modules[key].Id;
                this.roleAccesses[key].Delete = this.isAllDelete

                if(this.isAllDelete)
                    this.roleAccesses[key].IsSelected = this.isAllDelete;
                else{
                    this.roleAccesses[key].IsSelected =
                    this.roleAccesses[key].Create == true || this.roleAccesses[key].Update == true
                    this.roleAccesses[key].Delete == true || this.roleAccesses[key].View == true;
                }
                this.isAllModule = !Object.keys(this.Modules).find(key=> !this.roleAccesses[key].IsSelected)
            })
        }
        else{
            Object.keys(this.OtherModules).map((key) => {
                this.roleOtherAccesses[key].OtherAccessId = this.OtherModules[key].Id;
                this.roleOtherAccesses[key].Delete = this.isOtherAllDelete

                if(this.isOtherAllDelete)
                    this.roleOtherAccesses[key].IsSelected = this.isOtherAllDelete;
                else{
                    this.roleOtherAccesses[key].IsSelected =
                    this.roleOtherAccesses[key].Create == true || this.roleOtherAccesses[key].Update == true
                    this.roleOtherAccesses[key].Delete == true || this.roleOtherAccesses[key].View == true;
                }
                this.isOtherAllModule = !Object.keys(this.OtherModules).find(key=> !this.roleOtherAccesses[key].IsSelected)
            })
        }
    },
    checkedAllModule(isOther){
        if(!isOther){
            Object.keys(this.Modules).map((key) => {
                this.roleAccesses[key] = {}
                this.roleAccesses[key].AccessId = this.Modules[key].Id;
                this.roleAccesses[key].IsSelected = this.isAllModule;
                this.roleAccesses[key].Create = this.isAllModule;
                this.roleAccesses[key].Update = this.isAllModule;
                this.roleAccesses[key].Delete = this.isAllModule;
                this.roleAccesses[key].View = this.isAllModule
            })
            this.isAllCreate = this.isAllModule
            this.isAllView = this.isAllModule
            this.isAllUpdate = this.isAllModule
            this.isAllDelete = this.isAllModule
        }
        else{
            Object.keys(this.OtherModules).map((key) => {
                this.roleOtherAccesses[key] = {}
                this.roleOtherAccesses[key].OtherAccessId = this.OtherModules[key].Id;
                this.roleOtherAccesses[key].IsSelected = this.isOtherAllModule;
            })
        }
    },
    checked(key, type, isOther){
        var value = !isOther ? this.roleAccesses[key][type] : this.roleOtherAccesses[key][type]

        if(isOther){
            this.roleOtherAccesses[key].OtherAccessId = this.OtherModules[key].Id;
            this.roleOtherAccesses[key].IsSelected = value;
        }
        else{
            this.roleAccesses[key].AccessId = this.Modules[key].Id;
            this.roleAccesses[key].IsSelected = value ? value : this.roleAccesses[key].IsSelected;
        }

        // this.roleAccesses[key].IsSelected = value;

        switch (type) {
            case 'IsSelected':
                if(!isOther){
                    this.roleAccesses[key].Create = value;
                    this.roleAccesses[key].Update = value;
                    this.roleAccesses[key].Delete = value;
                    this.roleAccesses[key].View = value;
                }
                // else{
                //     this.roleOtherAccesses[key].Create = value;
                //     this.roleOtherAccesses[key].Update = value;
                //     this.roleOtherAccesses[key].Delete = value;
                //     this.roleOtherAccesses[key].View = value;
                // }
                this.checkView(isOther)
                this.checkCreate(isOther)
                this.checkUpdate(isOther)
                this.checkDelete(isOther)
                break;
            case 'View':
                this.checkView(isOther)
                break;
            case 'Create':
                this.checkCreate(isOther)
                break;
            case 'Update':
                this.checkUpdate(isOther)
                break;
            case 'Delete':
                this.checkDelete(isOther)
                break;
            default:
                break;
        }

        if(isOther){
            // if(!value && !this.roleOtherAccesses[key].Create && 
            //     !this.roleOtherAccesses[key].Update && 
            //     !this.roleOtherAccesses[key].Delete && 
            //     !this.roleOtherAccesses[key].View 
            // ){
            //     this.roleOtherAccesses[key].IsSelected = false
            // }
            this.isOtherAllModule = !Object.keys(this.OtherModules).find(key=> !this.roleOtherAccesses[key].IsSelected)
        }
        else{
            if(!value && !this.roleAccesses[key].Create && 
                !this.roleAccesses[key].Update && 
                !this.roleAccesses[key].Delete && 
                !this.roleAccesses[key].View 
            ){
                this.roleAccesses[key].IsSelected = false
            }
            this.isAllModule = !Object.keys(this.Modules).find(key=> !this.roleAccesses[key].IsSelected)
        }
        
  },
  checkView(isOther){
    if(!isOther){
        this.isAllView  = !Object.keys(this.Modules).find(key=> !this.roleAccesses[key].View)
    }
    else{
        // this.isOtherAllView  = !Object.keys(this.OtherModules).find(key=> !this.roleOtherAccesses[key].View)
    }
  },
  checkCreate(isOther){
    if(!isOther){
        this.isAllCreate  = !Object.keys(this.Modules).find(key=> !this.roleAccesses[key].Create)
    }
    else{
        // this.isOtherAllCreate  = !Object.keys(this.OtherModules).find(key=> !this.roleOtherAccesses[key].Create)
    }
  },
  checkUpdate(isOther){
    if(!isOther){
        this.isAllUpdate  = !Object.keys(this.Modules).find(key=> !this.roleAccesses[key].Update)
    }
    else{
        // this.isOtherAllUpdate  = !Object.keys(this.OtherModules).find(key=> !this.roleOtherAccesses[key].Update)
    }
  },
  checkDelete(isOther){
    if(!isOther){
        this.isAllDelete  = !Object.keys(this.Modules).find(key=> !this.roleAccesses[key].View)
    }
    else{
        // this.isOtherAllDelete  = !Object.keys(this.OtherModules).find(key=> !this.roleOtherAccesses[key].Delete)
    }
  },
    ...mapActions(module.role.name, ["create", "update","getById"]),
  },
  
  created () {
    Object.keys(this.Modules).map((key) => {
        this.roleAccesses[key] = {}
        this.roleAccesses[key].AccessId = this.Modules[key].Id,
        this.roleAccesses[key].Create = false,
        this.roleAccesses[key].Update = false,
        this.roleAccesses[key].Delete = false,
        this.roleAccesses[key].View = false
    })
    Object.keys(this.OtherModules).map((key) => {
        this.roleOtherAccesses[key] = {}
        this.roleOtherAccesses[key].OtherAccessId = this.OtherModules[key].Id
        this.roleOtherAccesses[key].IsSelected = false
        // this.roleOtherAccesses[key].Create = false,
        // this.roleOtherAccesses[key].Update = false,
        // this.roleOtherAccesses[key].Delete = false,
        // this.roleOtherAccesses[key].View = false
    })

  },
computed:{
    ...mapGetters(module.user.name, ["user"]),

},
async mounted(){
    // console.log(this.$route)
    this.properties = await this.$store.dispatch(`property/getAll`);

    // console.log(this.user)
    if(this.$route.meta.formMode == this.$constant.formMode.update)
    {
      const tmpForm = await this.getById(this.$route.params.id)
      this.form = Object.assign(this.form, tmpForm)
        Object.keys(this.Modules).map((key) => {
            var access = this.form.RoleAccesses.find(data=> data.AccessId == this.Modules[key].Id)
            this.roleAccesses[key] = {}
            this.roleAccesses[key].AccessId = access? access.AccessId : this.Modules[key].Id,
            this.roleAccesses[key].Create = access?.Create||false,
            this.roleAccesses[key].Update = access?.Update||false,
            this.roleAccesses[key].Delete = access?.Delete||false,
            this.roleAccesses[key].View = access?.View||false

            this.roleAccesses[key].IsSelected = this.roleAccesses[key].Create ||
                                                this.roleAccesses[key].Update ||
                                                this.roleAccesses[key].Delete ||
                                                this.roleAccesses[key].View

            if(access){
                this.checked(key, 'Create', false)
                this.checked(key, 'Update', false)
                this.checked(key, 'Delete', false)
                this.checked(key, 'View', false)
            }
        })
        // this.isOtherAllModule = true
        Object.keys(this.OtherModules).map((key) => {
            var access = this.form.RoleOtherAccesses.find(data=> data.OtherAccessId == this.OtherModules[key].Id)

            console.log(access)
            this.roleOtherAccesses[key] = {}
            this.roleOtherAccesses[key].OtherAccessId = access? access.OtherAccessId : this.OtherModules[key].Id
            if(access){
                this.roleOtherAccesses[key].IsSelected = true
                this.checked(key, 'IsSelected', true)
            }
            else{
                this.isOtherAllModule = false
            }
            // this.roleOtherAccesses[key].Create = access?.Create||false,
            // this.roleOtherAccesses[key].Update = access?.Update||false,
            // this.roleOtherAccesses[key].Delete = access?.Delete||false,
            // this.roleOtherAccesses[key].View = access?.View||false
        })

        if(this.form.RoleProperties){
            this.properties = this.properties.map(data=> Object.assign(data, {
                Selected: this.form.RoleProperties.find(roleProperty=> roleProperty.PropertyId == data.Id) ? true : false
            }))
            this.checkSelectedProperty()
        }
        // this.checkView(false)
        // this.checkCreate(false)
        // this.checkUpdate(false)
        // this.checkDelete(false)
        
    }

    // console.log(this.roleAccesses)
    // console.log(this.roleOtherAccesses)
  },
}
</script>

<style scoped>
tr{
    height: 72px;
    background: white;
}
thead tr td .t-header{
    background: var(--grey-300);
}
.t-header, .t-body{
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 72px;
    justify-content: center;
}
td {
  padding-right: 8px;
}
td:first-child{
    width: auto;
}
td:first-child{
    width: 64px;
    justify-items: center;
}
td:last-child {
  padding: 0;
}
td:nth-child(2) div{
    align-items: start !important;
    padding-left: 12px;
}

tbody tr{
    border-bottom: 1px solid var(--grey-600);
}
</style>
