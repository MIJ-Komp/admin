<template>
    <div class="calendar-page-container fadeIn">
        <b-row class="calendar-filter-container">
            <b-col cols="12">
                <div class="font-button">Filter:</div>
                <div class="line"></div>
                <b-row class="pt-2">
                    <b-col>
                        <SelectBox :dataSource="properties"
                        v-model="form.PropertyId"
                        label="Property" labelType="out"/>
                    </b-col>
                    <b-col>
                        <SelectBox :dataSource="roomTypes"
                        :disabled="!form.PropertyId"
                        :placeholder="form.PropertyId? 'Pilih Tipe Kamar':'Pilih properti terlebih dahulu'"
                        v-model="form.RoomTypeId" label="Room Type" labelType="out"/>
                    </b-col>
                    <b-col v-if="currentProperty && !currentProperty.SetByRoomType">
                        <SelectBox 
                        :disabled="!form.RoomTypeId"
                        :placeholder="form.RoomTypeId? 'Pilih Kamar':'Pilih tipe kamar terlebih dahulu'"
                        :dataSource="rooms"
                        v-model="form.RoomId"
                        label="Room" labelType="out"/>
                    </b-col>
                </b-row>
            </b-col>
        </b-row>
        <b-row class="calender-container">
            <b-col class="mt-3">
                <Calendar class="calendar-picker w-100" v-model="form.StartDate" inline  @month-change="changeMonth"/>
            </b-col>
            <b-col cols="auto" class="slide-left mt-3 left-container" v-if="form.StartDate && form.EndDate">
                <div class="calender-info-container">
                    <div class="p-3">Info</div>
                    <div class="line"></div>
                    <div v-if="!currentProperty || !form.RoomTypeId || (!currentProperty.SetByRoomType && !form.RoomId)" 
                    class="mt-4 text-danger" style="font-size: 12px;">Harap pilih seluruh data filter terlebih dahulu</div>
                    
                    <div v-else class="calender-info-input-container">
                        <div>
                            <b-row>
                                <b-col cols="6"><DateBox v-model="form.StartDate" 
                                    :minDate="new Date(selectedMonth.year,selectedMonth.month-1, 1)" label="Dari Tanggal" :disabled="true" labelType="out"
                                    :maxDate="new Date(selectedMonth.year,selectedMonth.month, 0)"
                                    /></b-col>
                                <b-col cols="6"><DateBox v-model="form.EndDate" :minDate="form.StartDate" label="Sampai Tanggal" labelType="out" :required="false"/></b-col>
                            </b-row>
                            <div class="line mt-3 mb-3"></div>
                            <div>Status :</div>
                            <RadioButton label="Available" v-model="form.Status" :value="1" class="status-picker"/>
                            <RadioButton label="Out of Service" v-model="form.Status" :value="2" class="status-picker mt-2"/>
                            <div class="line mt-3 mb-3"></div>

                            <!-- <Switch label="Penurunan Harga?"/> -->

                            <CheckBox label="Ada perubahan harga?" class="mb-2 mt-2" v-model="priceChange"/>

                            <div v-if="priceChange">
                                <CheckBox label="Penurunan Harga" v-model="form.IsPriceDeducted" :value="false" class="status-picker"/>
                                <!-- <RadioButton label="Harga Turun" v-model="form.IsPriceDeducted" :value="true" class="status-picker mt-2"/> -->
                                <b-row class="mt-2">
                                    <b-col cols="auto">
                                        <SelectBox :required="true" label="" labelType="out" class="mt-2" v-model="form.PriceMultiplierType" :dataSource="PriceType"/>
                                    </b-col>
                                    <b-col style="align-content: flex-end;">
                                        <TextBox height="50" :required="false" labelType="out" placeholder="nominal" label=" " type="number" :min="1" v-model="form.PriceMultiplier"/>
                                    </b-col>
                                </b-row>

                            </div>

                            <TextArea class="mt-4" label="deskripsi" v-model="form.Notes" :required="false"/>
                        </div>
                        <div>
                            <b-row class="mt-3">
                                <b-col cols="6"><Button label="Cancel" buttonType="secondary" @click="cancel"/></b-col>
                                <b-col cols="6"><Button label="Save" @click="save()"/></b-col>
                            </b-row>
                        </div>
                    </div>
                </div>
            </b-col>
        </b-row>
    </div>
</template>
<script>
import Calendar from 'primevue/calendar'
import { mapActions } from 'vuex';
import module from '../../constant/module'
export default{
  methods: {
    ...mapActions(module.roomAvailability.name, ["create"]),

    cancel(){
        this.form.StartDate = null
        this.form.EndDate = null
        this.form.Type = null
        this.form.Status = 2
        this.form.PriceMultiplierType = null
        this.form.PriceMultiplier = null
        this.checkSelectedDate()
    },
    save(){
        this.form.Type = this.currentProperty.SetByRoomType ? 2 : 1

        const formData = JSON.parse(JSON.stringify(this.form))

        formData.StartDate = this.$moment(formData.StartDate).format("YYYY-MM-DD")
        formData.EndDate = this.$moment(formData.EndDate).format("YYYY-MM-DD")

        if(this.priceChange && !formData.PriceMultiplier){
            this.$showToast.error("Gagal", "Harap isi nominal perubahan")
            return
        }
        if(!this.priceChange){
            formData.PriceMultiplier = null
            formData.PriceMultiplierType = null
            formData.IsPriceDeducted = null
        }
        else{
            formData.PriceMultiplier = parseInt(formData.PriceMultiplier)
        }

        this.create(formData)
        .then(async (res)=>{
            this.$showToast.success("Success", "")
            await this.getAvailabilities()
            this.refreshPage()
            const tmp = JSON.parse(JSON.stringify(this.form.StartDate))
            this.form.StartDate = null
            this.form.EndDate = null
            this.form.Type = null
            this.form.Status = 2
            this.form.PriceMultiplierType = null
            this.form.PriceMultiplier = null
            this.checkSelectedDate()
        })
        .catch(err=>{
            this.$showToast.error("Failed", err)
        })
    },
    checkSelectedDate(){
        var date = document.getElementsByClassName('p-datepicker-day-cell') 

        // console.log(this.form.StartDate)
        var roomSetting = this.selectedDate(this.form.StartDate)

        if(roomSetting){
            this.form.Status = roomSetting.Status
            this.form.Notes = roomSetting.Notes
            this.priceChange = roomSetting.PriceMultiplier || roomSetting.PriceMultiplierType ? true: false
            this.form.PriceMultiplier = roomSetting.PriceMultiplier ? parseInt(roomSetting.PriceMultiplier) : null
            this.form.PriceMultiplierType = roomSetting.PriceMultiplierType
            this.form.IsPriceDeducted = roomSetting.IsPriceDeducted
        }
        else{
            this.form.Status = 2
            this.form.PriceMultiplierType = null
            this.form.PriceMultiplier = null
        }
        for (let i = 0; i < date.length; i++) {
            const element = date[i];
            const isDisabled =  element.getElementsByClassName('p-disabled')[0]

            if(!isDisabled){
                const elDate =  element.getElementsByClassName('p-datepicker-day')[0].innerText
                const elDateValue = new Date(this.selectedMonth.year,this.selectedMonth.month-1,parseInt(elDate))

                let child = element.getElementsByClassName("date-custom")[0]
                if(child){
                    if(this.form.StartDate <= elDateValue && this.form.EndDate >= elDateValue){
                        child.classList.add("selected")
                    }
                    else{
                        child.classList.remove("selected")
                    }
                }
            }
        }
    },
    async getAvailabilities(){
        try{
            const fromDate = new Date(this.selectedMonth.year, this.selectedMonth.month - 1, 1);
            const toDate = new Date(this.selectedMonth.year, this.selectedMonth.month, 0);
                
            this.roomAvailabilities= await this.$store.dispatch(
            `roomAvailability/getAll`, {
                fromDate: this.$moment(fromDate).format("YYYY-MM-DD"),
                toDate:this.$moment(toDate).format("YYYY-MM-DD"),
                propertyId: this.form.PropertyId,
                type: this.currentProperty.SetByRoomType ? 2 : 1
            });
        }
        catch(err){
            console.log(err)
            this.$showToast.error(err)
         }
    },
    selectedDate(date){
        return this.roomAvailabilities.find(data=> 
            this.$moment(data.StartDate).startOf('day').isSame(this.$moment(date).startOf('day')) &&
            (this.currentProperty.SetByRoomType ?
                data.RoomTypeId == this.form.RoomTypeId
            :   data.Room.RoomTypeId == this.form.RoomTypeId && data.Room.Id == this.form.RoomId)
        )
    },
    async changeMonth(value){
        console.log(value)
        this.selectedMonth = value
        

        if(this.form.PropertyId && this.form.RoomTypeId && (this.currentProperty.SetByRoomType || this.form.RoomId)){
            await this.getAvailabilities()
        }
        await this.refreshPage()
    }, 
    async refreshPage(){
        // console.log(this.roomAvailabilities)

        this.$nextTick(async () => {
            
            // this.form.StartDate = null
            // this.form.EndDate = null
            console.log(this.selectedMonth)
            if(!this.selectedMonth){
                this.selectedMonth = {month: parseInt(this.$moment().format('M')), year: parseInt(this.$moment().format('yyyy'))}
            }

            var date = document.getElementsByClassName('p-datepicker-day-cell') 

            for (let index = 0; index < date.length; index++) {
                const element = date[index];
                const isDisabled =  element.getElementsByClassName('p-disabled')[0]

                if(!isDisabled){
                    const elDate =  element.getElementsByClassName('p-datepicker-day')[0].innerText

                    const elDateValue = new Date(this.selectedMonth.year,this.selectedMonth.month-1,parseInt(elDate))

                    var roomSetting = this.selectedDate(elDateValue)

                    var hasAvailable = roomSetting && roomSetting.Status == 1;

                    var icon = roomSetting && roomSetting.IsPriceDeducted ? this.$assets.icons.downPrice: this.$assets.icons.upPrice
                    // console.log(icon)
                    var oldEl = element.getElementsByClassName("date-custom")
                    if(oldEl && oldEl.length > 0){
                        oldEl[0].remove()
                    }
                    element.innerHTML = `<div 
                        class="date-custom ${hasAvailable? 'available': 'notAvailable'}" 
                        style="font-size:12px; display:flex;height: 100%; flex-direction: column; justify-content: space-between">
                        <div style="display:flex; justify-content: space-between;">
                            ${roomSetting && roomSetting.PriceMultiplier ? '<img id="image-price" style="height:20px;"/>' : '<img/>'}
                            <div style="font-size:14px;font-weight:bold;" class="p-datepicker-day">${elDate}</div>
                        </div>
                        <div>${roomSetting && roomSetting.PriceDaily ? 'Rp ' + this.$helper.ConvertNumberFormat(roomSetting.PriceDaily) : '-'}</div>
                    </div>`

                    const image = element.querySelector("#image-price")
                    if(image){
                        image.src = icon
                    }

                    // element.classList = ['p-datepicker-day-cell']
                    element.addEventListener("click", ()=>{
                        const selectedDate = new Date(this.selectedMonth.year,this.selectedMonth.month-1,parseInt(elDate))

                        if(!this.form.StartDate){
                            this.form.StartDate = selectedDate
                            this.form.EndDate = selectedDate
                        }
                        else{
                            if(selectedDate >= this.form.StartDate && selectedDate <= this.form.StartDate){
                            }
                            else{
                                this.form.StartDate = selectedDate
                                this.form.EndDate = selectedDate
                            }
                        }
                    })
                }
            }
            if(this.form.StartDate){
                this.checkSelectedDate()
            }
        })
    }
  },
  async created () {
    this.properties = await this.$store.dispatch(`property/getAll`);
  },
  mounted(){
    this.refreshPage()
  },
  watch: {
    date:{ immediate: true,
        async handler(newVal) {
            
        }
    },
    'form.PropertyId':{ immediate: true,
        async handler(newVal) {
            this.form.RoomTypeId = null
            this.form.RoomId = undefined
            this.roomAvailabilities = []

            if(newVal){
                this.roomTypes = await this.$store.dispatch(`roomTypePrice/getAll`, {propertyId: newVal});
                this.currentProperty = this.properties.find(data=> data.Id == newVal)
               
                this.form.Type = this.currentProperty.SetByRoomType ? 2: 1;
                 this.refreshPage()
            }
        }
    },
    'form.RoomTypeId':{ immediate: true,
        async handler(newVal) {
            this.form.RoomId = undefined
            this.roomAvailabilities = []

            if(newVal){
                this.rooms = await this.$store.dispatch(`roomPrice/getAll`, 
                    {
                        propertyId: this.form.PropertyId,
                        roomTypeId: newVal
                });
                if(this.currentProperty.SetByRoomType){
                    await this.getAvailabilities()
                    this.refreshPage()
                }
            }
        }
    },
    'form.RoomId':{ immediate: true,
        async handler(newVal) {
            this.roomAvailabilities = []

            if(newVal){
                await this.getAvailabilities()
                this.refreshPage()
            }
        }
    },
    // selectedMonth:{ immediate: true,
    //     async handler(newVal) {
    //         if(this.form.PropertyId && this.form.RoomTypeId && (this.currentProperty.SetByRoomType || this.form.RoomId)){
    //             await this.getAvailabilities()
    //             this.refreshPage()
    //         }
    //     }
    // },
    'form.EndDate':{ immediate: true,
        async handler(newVal) {
            this.checkSelectedDate()
        }
    },
    'form.PriceMultiplier':{ immediate: true,
        async handler(newVal) {
            if(newVal){
                this.priceChange = true
            }else{
                this.priceChange = false
            }
        }
    },
    'form.StartDate':{ immediate: true,
        async handler(newVal) {
            if(this.form.StartDate > this.form.EndDate){
                this.form.EndDate = JSON.parse(JSON.stringify(this.form.StartDate))
            }
            this.checkSelectedDate()
        }
    }
  },
  data () {
    return {
        selectedMonth: {month: parseInt(this.$moment().format('M')), year: parseInt(this.$moment().format('yyyy'))},

        currentProperty: null,
        roomTypes:[],
        rooms:[],
        roomAvailabilities:[],
        form:{
            StartDate: null,
            EndDate: null,
            PropertyId: null,
            RoomTypeId: null,
            RoomId: undefined,
            Type: null,
            Status: 2,
            PriceMultiplierType:1,
            PriceMultiplier: null,
            IsPriceDeducted: null
        },
        FilterTypes: [
            { Id: 1, Name: "By Room Type" },
            { Id: 2, Name: "By Room" },
         ],
         PriceType: [
            { Id: 1, Name: "%" },
            { Id: 2, Name: "Rp" },
         ],
         properties:[],
         priceChange: false
    }
  },
    components:{Calendar},
    
}
</script>

<style>
.calendar-page-container{
    height: 100%;
}
.calender-container{
    height: calc(100% - 143px);
    margin-top: 16px;
}
.calender-container .p-datepicker{
    height: 100%;
}
.calendar-filter-container{
    background: white;
    padding: 14px;
    border-radius: 8px;
}
.calender-info-input-container{
    padding: 14px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: calc(100% - 58px);
}
.status-picker{
    width: 100%;
}
.calender-info-container{
    background: white;
    width: 380px;
    justify-items: center;
    height: 100%;
    border-radius: 8px;
}
.line{
    width: 100%;
    height: 1px;
    background: var(--grey-500);
}
.calendar-picker .p-datepicker-panel{
    width: 100% !important;
    background: white;
    border: 0;
    color: black;
}
.calendar-picker .p-datepicker-day-cell{
    height: 11vh;
    width: 14%;
    align-content: start;
}
.calendar-picker .p-disabled{
    display: none;
}
.date-custom{
    border: 0.5px solid var(--grey-700) !important;
    padding: 10px;
    cursor: pointer;
}
.notAvailable{
    background: var(--grey-400);
    border: 0 !important;
}
.available{
    background: white;
    border: 0.5px solid var(--grey-700) !important;
}
.hasSetting{
    /* background: var(--blue-300) !important; */
}

.calendar-picker .p-datepicker-day{
    /* display: none !important; */
    align-items: start;
    justify-content: end !important;
    border-radius: 0 !important;
    width: 100% !important;
}
.calendar-picker .p-datepicker-day:hover{
    background: none !important;
}
.calendar-picker .p-datepicker-day-cell .selected{
    border:2px solid var(--blue-300) !important;
}
.calendar-picker .p-datepicker-header{
    border-block-end: 0;
    background: white;
    color: black !important;
}
.p-datepicker-month, .p-datepicker-select-month, .p-datepicker-select-year, .p-datepicker-weekday, 
.p-button-text.p-button-secondary{
    color: black !important;
}

.calendar-picker .p-datepicker-day-view{
    margin: 0 !important;
}
.calendar-picker thead{
    background: var(--grey-600) !important;
    text-align: center;
}
.calendar-picker thead th{
    padding: 14px 0;
}

@media screen and (max-width: 600px) {
   .left-container {
      width: 100% !important;
   }
   .calender-info-container {
      width: 100%;
   }
}
</style>
