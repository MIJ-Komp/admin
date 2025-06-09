<template>
    <div class="setting-container">
        <b-tabs v-model="tabIndex">
            <b-tab title="General" active>
                <b-row>
                    <b-col/>
                    <b-col lg="3" cols="6" class="flex-row">
                        <Button buttonType=danger v-if="allowEdit.general" label="Cancel" @click="toggleEdit(1, false)"/>
                        <Button label="Save" v-if="allowEdit.general" class="ms-3" @click="save(1)" :isLoading="isLoading"/>
                        <Button label="Edit" buttonType="secondary" v-if="!allowEdit.general" class="ms-3" @click="toggleEdit(1, true)"/>
                    </b-col>
                </b-row>
                <b-row  v-for="setting in settings" :key="setting">
                    <b-col cols="12" class="mt-4">
                        <div >
                            <SelectBox :label="setting.Name" :disabled="!allowEdit.general" v-if="setting.Type == settingType.ROUNDING" v-model="setting.Value" :dataSource="RoundingType"/>

                            <TimePicker :stepMinute="30" :label="setting.Name" :disabled="!allowEdit.general" v-else-if="setting.Type == settingType.Time" v-model="setting.Value"/>
                            <TextBox :label="setting.Name" :disabled="!allowEdit.general" v-else v-model="setting.Value" :type="setting.Type == settingType.CURRENCY ? 'number' : 'text'"/>
                        </div>
                    </b-col>
                    <!-- <b-col lg="3" cols="6" style="align-content: center" class="mt-4">
                        <Switch style="justify-content: start;" label="Tampilkan?" v-model="setting.Show" :disabled="!allowEdit.general"/>
                    </b-col>
                    <b-col cols="6" lg="3" style="align-content: center" class="mt-4">
                        <Switch style="justify-content: start;" label="Aktif?" v-model="setting.IsActive" :disabled="!allowEdit.general"/>
                    </b-col> -->

                    <!-- <b-col cols="12" class="mt-4">
                        <div>
                            <Button label="RESET ORDER" buttonType="danger" class="" @click="showResetOrder()"/>
                        </div>
                    </b-col> -->
                </b-row>
            </b-tab>
            <b-tab title="Property">
                <b-row>
                    <b-col/>
                    <b-col lg="3" cols="6" class="flex-row" v-show="propertyId">
                        <Button buttonType=danger v-if="allowEdit.property" label="Cancel" @click="toggleEdit(2, false)"/>
                        <Button label="Save" v-if="allowEdit.property" class="ms-3" @click="save(2)" :isLoading="isLoading"/>
                        <Button label="Edit" buttonType="secondary" v-if="!allowEdit.property" class="ms-3" @click="toggleEdit(2, true)"/>
                    </b-col>
                </b-row>
                <b-row class="mt-4">
                    <b-col>
                        <SelectModuleBox :disabled="allowEdit.property" label="Select Property" :module="$module.property" v-model="propertyId"/>
                    </b-col>
                </b-row>
                <b-row style="border-bottom: 1px solid var(--grey-600);
                    padding-bottom: 20px;">
                    <b-col lg="6" cols="6" class="mt-4" v-for="setting in propertySettings" :key="setting">
                        <div>
                            <SelectBox 
                                :label="setting.Name" 
                                :disabled="!allowEdit.property" 
                                v-if="setting.Type == settingType.ROUNDING" 
                                v-model="setting.Value" 
                                :dataSource="RoundingType"
                            />
                            <TimePicker 
                                :stepMinute="30" 
                                :label="setting.Name" 
                                :disabled="!allowEdit.property" 
                                v-else-if="setting.Type == settingType.TIME" 
                                v-model="setting.Value"
                            />
                            <TextBox 
                                :label="setting.Name" 
                                :disabled="!allowEdit.property" 
                                v-else-if="setting.Type == settingType.VALUE" 
                                v-model="setting.Value" 
                                :type="setting.Type == settingType.CURRENCY || setting.Type == settingType.VALUE ? 'number' : 'text'"
                            />
                            <div v-else-if="setting.Type == settingType.WHATSAPP_TEXT">
                                <TextEditor 
                                    :label="setting.Name"
                                    :disabled="!allowEdit.property" 
                                    v-model="setting.Value" 
                                    :value="setting.Value"
                                    :modules="{
                                        toolbar: [
                                            ['bold', 'italic', 'strike'],
                                        ],
                                    }"
                                >
                                <template v-slot:hints>
                                    <div v-if="setting.Code == 'MSG_TEMPLATE_WHATSAPP_PAYMENT_SUCCESS'" class="font-small mt-2">
                                        <div>Petunjuk:</div>
                                        <div>{booking_code}: kode pemesanan</div>
                                        <div>{room_name}: nama ruangan</div>
                                        <div>{pin_code}: kode PIN pintu</div>
                                        <div>{checkin_date}: tanggal checkin</div>
                                        <div>{checkout_date}: tanggal checkout</div>
                                        <div>{booking_url}: URL pemesanan</div>
                                        <div>{how_to_url}: URL cara membuka doorlock</div>
                                    </div>
                                    <div v-else-if="setting.Code == 'MSG_TEMPLATE_WHATSAPP_BOOKING_SUCCESS'" class="font-small mt-2">
                                        <div>Petunjuk:</div>
                                        <div>{booking_code}: kode pemesanan</div>
                                        <div>{expired_date}: tanggal checkin</div>
                                        <div>{booking_url}: URL pemesanan</div>
                                    </div>
                                </template>
                            </TextEditor>
                            </div>
                        </div>
                    </b-col>
                    <!-- <b-col cols="6" lg="3" style="align-content: center" class="mt-4">
                        <Switch style="justify-content: start;" label="Tampilkan?" v-model="setting.Show" :disabled="!allowEdit.property"/>
                    </b-col>
                    <b-col cols="6" lg="3" style="align-content: center" class="mt-4">
                        <Switch style="justify-content: start;" label="Aktif?" v-model="setting.IsActive" :disabled="!allowEdit.property"/>
                    </b-col> -->
                </b-row>
            </b-tab>
            <b-tab title="Doorlock Device">
                <div class="mt-5" v-if="user && user.Id != user.OwnerId">Hanya Owner yang dapat mengakses Doorlock Device setting</div>

                <b-row v-if="user && !user.CHMLinkedOn">
                    <div class="mt-3 font-disabled">Belum terhubung ke TTLock</div>
                    <b-col cols="12" class="mt-3">
                        <TextBox label="Email or Phone Number" :disabled="ttLockProcess" v-model="chmForm.EmailPhoneNumber"/>
                    </b-col>
                    <b-col cols="12" class="mt-3">
                        <TextBox label="Password" type="password" :disabled="ttLockProcess" v-model="chmForm.Password"/>
                    </b-col>
                    <b-col class="mt-5" cols="12">
                        <Button label="Link to TTLock" :isLoading="ttLockProcess" :disabled="ttLockProcess" @click="linkTTLock"/>
                    </b-col>
                </b-row>
                <b-row v-else-if="user">
                    <b-col cols="6" style="align-content: center;">
                        <Switch 
                            label="TTLock terhubung?"
                            class="mt-3" 
                            :value="user.CHMLinkedOn != null" 
                            disabled="true"
                        />
                    </b-col>
                    <!-- <b-col v-show="true" cols="12" lg="6">
                        <Button label="Unlink" class="mt-3" @click="unlinkTTLock" :isLoading="ttLockProcess" :disabled="ttLockProcess"/>
                    </b-col> -->
                </b-row>
                <b-row>
                    <b-col cols="6" style="align-content: center;">
                        <Switch 
                            label="Tuya terhubung?"
                            class="mt-3" 
                            :value="false" 
                            disabled="true"
                        />
                    </b-col>
                    <b-col v-show="true" cols="12" lg="6">
                        <Button label="Hubungkan" class="mt-3" @click="showTuyaLink()" :isLoading="ttLockProcess" :disabled="ttLockProcess"/>
                    </b-col>
                </b-row>
            </b-tab>
        </b-tabs>
    </div>
</template>

<script>
import { sassNull } from 'sass';
import module from '../../constant/module';
import {mapActions, mapGetters, mapMutations} from 'vuex'

export default{
  watch: {
    tabIndex:{
        immediate:true,
        async handler(newVal){
            this.toggleEdit(1, false)
            this.toggleEdit(2, false)
        }
    },
    propertyId:{
        immediate:true,
        async handler(newVal){
            if(newVal){
                try{
                    this.basePropertySettings = await this.getPropertySetting(newVal)
                    this.propertySettings = JSON.parse(JSON.stringify(this.basePropertySettings))
                }
                catch(err){
                    this.$showToast.error(err)
                }
            }
        }
    }
  },
  computed:{
    ...mapGetters(module.user.name, ["user"]),
  },
  methods: {
    ...mapActions(module.user.name, ["unlinkToCHM","linkToCHM","getMe"]),
    ...mapActions(module.setting.name, 
                  ["getOwnerSetting", 
                   "getPropertySetting", 
                   "bulkUpdate"
                  ]),
    ...mapMutations(module.user.name, ["setUser"]),
    linkTTLock(){
        if(this.ttLockProcess) return
        this.ttLockProcess = true

        this.linkToCHM(this.chmForm)
        .then(async (res)=> {
            this.$showToast.success(res)

            this.setUser(await this.getMe())
            this.ttLockProcess = false
        })
        .catch(err=> {
            this.$showToast.error(err)
            this.ttLockProcess = false    
        })
    },
    async unlinkTTLock(){
        var confirm = await this.$dialog.Confirmation.confirm({
            title: "Konfirmasi",
            message: "Apakah Anda yakin ingin memutuskan hubungan akun Anda dari TT Lock?",
         });
         if(!confirm) return

         this.unlinkToCHM()
        .then(async (res)=> {
            this.$showToast.success("Sukses")

            this.setUser(await this.getMe())
            this.ttLockProcess = false
        })
        .catch(err=> {
            this.$showToast.error(err)
            this.ttLockProcess = false
        })
    },
    async refresh(){
        if(this.propertyId){
            this.basePropertySettings = await this.getPropertySetting(this.propertyId)
            this.propertySettings = JSON.parse(JSON.stringify(this.basePropertySettings))
        }
        this.baseSettings = await this.getOwnerSetting()
        this.settings= JSON.parse(JSON.stringify(this.baseSettings))
    },

    toggleEdit(type, value){
        switch (type) {
            case 1:
                this.allowEdit.general = value
                if(!value){
                    this.settings = JSON.parse(JSON.stringify(this.baseSettings))
                }
                break;
            case 2:
                this.allowEdit.property = value   
                if(!value){
                    this.propertySettings = JSON.parse(JSON.stringify(this.basePropertySettings))
                }
                break
            default:
                break;
        }
        
    },
    async save(type){
        if(this.isLoading) return
        this.isLoading = true

        try{
        var error = null
        var anySuccess = false

        var value = []
        switch (type) {
            case 1: //general
                value = JSON.parse(JSON.stringify(this.settings));
                break;
            case 2: //property
                value =JSON.parse(JSON.stringify(this.propertySettings));
                break
            default:
                break;
                
        }

        value.forEach(setting => {
            if(setting.Type == 3){
                setting.Value = this.$moment(setting.Value).format("HH:mm:ss").toString()
            }
            else{
                setting.Value = setting.Value.toString()
            }
            console.log(setting)
        });
       
        console.log(value)

        this.bulkUpdate({Settings: value}).then(res=> 
            {
                this.$showToast.success("Sukses mengubah pengaturan")
                this.toggleEdit(1, false)
                this.toggleEdit(2, false)
                this.refresh()
            }
        )
        .catch(err=>{
            this.$showToast.error(err)
        })
        .finally(()=>{ this.isLoading= false})
        }
        catch(err){
            this.isLoading = false
            this.$showToast.error(err)
        }
    },
    showResetOrder() {
        const result = window.confirm("RESET ALL ORDER? ARE YOU SURE?");
        if (result) {
            console.log("User clicked Yes");
            // Handle Yes click
        } else {
            console.log("User clicked No");
            // Handle No click
        }
    },
    showTuyaLink() {
        this.$dialog.Alert.confirmSendWA(
            {
                title: 'Link Ke Tuya', 
                message: `Silakan hubungi customer service kami di WhatsApp: +62 811-1623-222 untuk mendapatkan panduan tentang cara menghubungkan ke Tuya`,
                messageWA: `Permintaan Panduan Link akun Cloudhomes ke TUYA`,
                number: `628111623222`,
                buttonLabel: `Hubungi`
            },
        );
    }

  },
  async created () {
    try{
        this.baseSettings = await this.getOwnerSetting()
        this.settings= JSON.parse(JSON.stringify(this.baseSettings))
    }
    catch(err){
        this.$showToast.error(err)
    }

  },
  data () {
    return {
        tabIndex: 0,
        settings: [],
        baseSettings: [],
        basePropertySettings: [],
        propertySettings: [],

        propertyId: null,

        allowEdit:{
            general: false,
            property: false
        },

        settingType:{
            GENERAL : 1,
            ROUNDING : 2,
            TIME : 3,
            CURRENCY : 4,
            VALUE : 5,
            WHATSAPP_TEXT : 6,
        },
        RoundingType:[
            {Name : 'HUNDREDS', Id: '1'},
            {Name : 'THOUSANDS', Id : '2'},
            {Name : 'UNITS', Id : '3'},
        ],
        chmForm:{
            EmailPhoneNumber: null,
            Password: null,
        },
        waFormat: null,
    }
  },

}
</script>

<style>
.setting-container{
    padding: 24px;
    background: white;
    border-radius: 8px;
    height: 100%;
    overflow: auto;
}

.setting-container .tab-content{
    padding-top: 20px;
}
</style>