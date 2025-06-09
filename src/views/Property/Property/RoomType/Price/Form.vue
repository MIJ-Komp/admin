<template>
   <ChForm
      :formData="formData"
      :createAction="doCreate"
      :updateAction="doUpdate"
      :redirect="redirectLink"
      :showCancel="showCancel"
      @cancel="$emit('cancel')"
   >
      <b-row>
         <b-col>
            <label><strong>Informasi Tipe Kamar</strong></label>
            <hr />
         </b-col>
      </b-row>

      <b-row>
         <b-col>
            <TextBox v-model="roomTypeData.Name" label="Nama Tipe" />
         </b-col>
      </b-row>
      <b-row>
         <b-col>
            <TextBox
               v-model="roomTypeData.AliasName"
               label="Nama Pada Website"
               :required="false"
            />
         </b-col>
      </b-row>
      <b-row>
         <b-col>
            <TextBox
               v-model="roomTypeData.AmountRoom"
               type="number"
               label="Jumlah Kamar"
            />
         </b-col>
      </b-row>
      <b-row>
         <b-col>
            <TextBox
               type="number"
               label="Jumlah Pax per Kamar"
               v-model="roomTypeData.Pax"
            />
         </b-col>
         <b-col>
            <TextBox
               type="number"
               label="Maksimal Pax per Kamar"
               v-model="roomTypeData.MaxAmountPaxRoom"
               :required="false"
            />
         </b-col>
      </b-row>
      <b-row>
         <b-col>
            <label>{{ paxErrorMsg }}</label>
         </b-col>
      </b-row>
      <b-row>
         <b-col>
            <CheckBox
               v-model="roomTypeData.HavePaxCharge"
               :checked="roomTypeData.HavePaxCharge"
               label="Kenakan biaya tambahan untuk penambahan jumlah Pax"
            />
         </b-col>
      </b-row>
      <b-row v-if="roomTypeData.HavePaxCharge">
         <b-col>
            <TextBox
               type="number"
               v-model="roomTypeData.PaxChargeAmount"
               label="Harga per Pax"
            />
         </b-col>
      </b-row>
      <b-row>
         <b-col>
            <div class="d-flex">
               <TextBox
                  class="w-100"
                  style="margin-right: 8px"
                  label="Kode Kamar"
                  :minLength="3"
                  v-model="roomTypeData.Code"
               />
               <TextBox
                  class="w-100"
                  type="number"
                  style="margin-left: 8px"
                  label="Luas Kamar (m2)"
                  v-model="roomTypeData.SizeRoom"
                  :required="false"
               />
            </div>
         </b-col>
      </b-row>
      <b-row>
         <b-col>
            <TextBox
               label="Deposit Kamar (Rp)"
               type="number"
               v-model="roomTypeData.DepositNominal"
               :required="false"
            />
         </b-col>
      </b-row>
      <b-row>
         <b-col>
            <SelectBox
               :dataSource="roomFacilityList"
               label="Fasilitas Kamar"
               optionLabel="Name"
               optionValue="Id"
               :multiSelect="true"
               v-model="roomTypeData.FacilityIds"
               :required="false"
            />
         </b-col>
      </b-row>
      <b-row>
         <b-col>
            <FileInput
               multiple
               v-model="roomTypeData.ImageIds"
               width="100%"
               :value="roomTypeData.RoomTypeImages"
            />
         </b-col>
      </b-row>
      <b-row>
         <b-col>
            <label><strong>Harga</strong></label>
            <hr />
         </b-col>
      </b-row>
      <b-row>
         <b-col>
            <CheckBox
               v-model="roomTypeData.HasPriceDaily"
               :checked="roomTypeData.HasPriceDaily"
               label="Harga Harian"
            />
            <hr />
            <b-row v-show="roomTypeData.HasPriceDaily" class="m-2">
               <b-col>
                  <b-row
                     class="p-2 rounded border"
                  >
                     <b-col>
                        <label>Pilih hari pada Weekday</label>
                        <b-row>
                           <b-col lg="auto" cols="12">
                              <CheckBox
                                 style="margin-right: 16px"
                                 class="mt-2"
                                 label="Select All"
                                 @change="checkIsAllWeekdays"
                                 v-model="isAllWeekdays"
                              />
                           </b-col>
                           <b-col lg="auto" cols="6" v-for="d in dayList" :key="d.Id">
                              <CheckBox
                                 style="margin-right: 16px"
                                 class="mt-2"
                                 :label="d.Day"
                                 v-model="roomTypeData.Weekdays[d.Id]"
                                 @change="selectAllWeekday(d)"
                              />
                           </b-col>
                        </b-row>
                        <b-row class="mt-3" style="min-height: 80px;">
                           <b-col cols="auto" style="align-content: center;">
                              <Switch
                                 v-model="roomTypeData.HasPriceWeekday"
                                 label="Set Harga"
                              />
                           </b-col>
                           
                           <b-col lg="" cols="12">
                              <TextBox
                                 type="number"
                                 v-model="roomTypeData.PriceWeekday"
                                 class="mt-2"
                                 label="Harga Weekday"
                                 v-if="roomTypeData.HasPriceWeekday"
                              />
                           </b-col>
                        </b-row>
                     </b-col>
                  </b-row>
               </b-col>
            </b-row>
            <b-row v-show="roomTypeData.HasPriceDaily" class="m-2">
               <b-col>
                  <b-row
                     class="p-2 rounded border"
                  >
                     <b-col>
                        <label>Pilih hari pada Weekend</label>
                        <b-row>
                           <b-col lg="auto" cols="12">
                              <CheckBox
                                 style="margin-right: 16px"
                                 class="mt-2"
                                 label="Select All"
                                 @change="checkIsAllWeekends"
                                 v-model="isAllWeekends"
                              />
                           </b-col>
                           <b-col lg="auto" cols="6" v-for="d in dayList" :key="d.Id">
                              <CheckBox
                                 style="margin-right: 16px"
                                 class="mt-2"
                                 :label="d.Day"
                                 v-model="roomTypeData.Weekends[d.Id]"
                                 @change="selectAllWeekend(d)"
                              />
                           </b-col>
                        </b-row>
                        <b-row class="mt-3" style="min-height: 80px;">
                           <b-col cols="auto" style="align-content: center;">
                              <Switch
                                 v-model="roomTypeData.HasPriceWeekend"
                                 label="Set Harga"
                              />
                           </b-col>
                           
                           <b-col lg="" cols="12">
                              <TextBox
                                 type="number"
                                 v-model="roomTypeData.PriceWeekend"
                                 class="mt-2"
                                 label="Harga Weekend"
                                 v-if="roomTypeData.HasPriceWeekend"
                              />
                           </b-col>
                        </b-row>
                     </b-col>
                  </b-row>
               </b-col>
            </b-row>
         </b-col>
      </b-row>
      <b-row>
         <b-col>
            <CheckBox
               v-model="roomTypeData.HasPriceMonthly"
               :checked="roomTypeData.HasPriceMonthly"
               label="Harga Bulanan"
            />
            <hr />
            <TextBox
               v-if="roomTypeData.HasPriceMonthly"
               type="number"
               class="mt-2"
               v-model="roomTypeData.PriceMonthly"
               label="Harga Bulanan"
            />
         </b-col>
      </b-row>
      <b-row>
         <b-col>
            <CheckBox
               v-model="roomTypeData.HasPriceAnnually"
               :checked="roomTypeData.HasPriceAnnually"
               label="Harga Tahunan"
            />
            <hr />
            <TextBox
               v-if="roomTypeData.HasPriceAnnually"
               type="number"
               class="mt-2"
               v-model="roomTypeData.PriceAnnually"
               label="Harga Tahunan"
            />
         </b-col>
      </b-row>
      <b-row>
         <b-col>
            <label><strong>Charges</strong></label>
            <hr />
         </b-col>
      </b-row>
      <b-row>
         <b-col>
            <SelectBox
               label="Select Charges"
               optionLabel="Name"
               optionValue="Id"
               v-model="roomTypeData.SelectedCharges"
               :multiSelect="true"
               :required="false"
               :dataSource="chargeList"
            />
         </b-col>
      </b-row>
      <b-row
         v-for="rCharge in roomTypeData.Charges"
         :key="rCharge.Id"
         class="m-2"
      >
         <b-col>
            <div class="d-flex align-items-center">
               <label>
                  <strong>{{ getChargeName(rCharge.ChargeId) }}</strong>
               </label>
               <img
                  @click="removeCharge(rCharge.ChargeId)"
                  :src="$assets.icons.trash"
                  class="trash-icon"
               />
            </div>

            <div class="d-flex align-items-center mt-2 p-3 border rounded">
               <Select
                  class="charge-selector"
                  v-model="rCharge.Type"
                  :options="chargeTypeList"
                  optionLabel="Name"
                  optionValue="Id"
               />
               <TextBox
                  v-model="rCharge.Amount"
                  type="number"
                  class="w-100"
                  label="Nilai"
               />
            </div>
         </b-col>
      </b-row>
      <b-row class="mt-4">
         <b-col>
            <label><strong>Add On</strong></label>
            <hr />
         </b-col>
      </b-row>
      <b-row>
         <b-col>
            <SelectBox
               label="Select Add On"
               optionLabel="Name"
               optionValue="Id"
               v-model="roomTypeData.SelectedAddOns"
               :multiSelect="true"
               :required="false"
               :dataSource="addOnList"
            />
         </b-col>
      </b-row>
      <b-row
         v-for="rAddOn in roomTypeData.AddOns"
         :key="rAddOn.AddOnId"
         class="m-2"
      >
         <b-col>
            <div class="d-flex align-items-center">
               <label>
                  <strong>{{ getAddOnName(rAddOn.AddOnId) }}</strong>
               </label>
               <img
                  @click="removeAddOn(rAddOn.AddOnId)"
                  :src="$assets.icons.trash"
                  class="trash-icon text-danger"
               />
            </div>
            <div class="d-flex align-items-center mt-2 p-3 border rounded">
               <TextBox
                  type="number"
                  v-model="rAddOn.Price"
                  class="w-100"
                  label="Harga (Rp)"
               />
            </div>
         </b-col>
      </b-row>
   </ChForm>
</template>
<script>
import Select from "primevue/select";
import { mapActions } from "vuex";
import module from "../../../../../constant/module";
import helper from "../../../../../constant/helper";
export default {
   props: {
      showCancel: { type: Boolean, default: false },
   },
   components: {
      Select,
   },
   computed:{
      disableAllWeekdays(){
         return this.isAllWeekends || this.roomTypeData.Weekends.filter(data=> data == true).length != 0
      },
      disableAllWeekends(){
         return this.isAllWeekdays || this.roomTypeData.Weekdays.filter(data=> data == true).length != 0
      }
   },
   data() {
      return {
         formData: {
            module: this.$module.roomTypePrice,
         },
         redirectLink: this.$router.path,
         paxErrorMsg: "",
         chargeTypeList: [
            {
               Id: 1,
               Name: "%",
            },
            {
               Id: 2,
               Name: "Rp",
            },
         ],
         dayList: [
            {
               Id: 0,
               Day: "Senin",
            },
            {
               Id: 1,
               Day: "Selasa",
            },
            {
               Id: 2,
               Day: "Rabu",
            },
            {
               Id: 3,
               Day: "Kamis",
            },
            {
               Id: 4,
               Day: "Jumat",
            },
            {
               Id: 5,
               Day: "Sabtu",
            },
            {
               Id: 6,
               Day: "Minggu",
            },
         ],
         roomTypeData: {
            PropertyId: parseInt(this.$route.params.id),
            Type: 1,
            Name: "",
            AliasName: "",
            Code: "",
            Pax: "",
            SizeRoom: "",
            AmountRoom: "",
            DepositNominal: null,

            PaxChargeAmountType: 1,
            PaxChargeAmount: null,
            MaxAdditionalPax: null,
            MaxAmountPaxRoom: null,
            HavePaxCharge: false,

            ImageIds: [],
            FacilityIds: [],

            SelectedCharges: [],
            Charges: [],

            SelectedAddOns: [],
            AddOns: [],

            HasPriceDaily: false,

            HasPriceWeekday: false,
            PriceWeekday: "",
            Weekdays: [],

            HasPriceWeekend: false,
            PriceWeekend: null,
            Weekends: [],

            HasPriceMonthly: false,
            PriceMonthly: "",

            HasPriceAnnually: false,
            PriceAnnually: "",
         },
         roomFacilityList: [],
         chargeList: [],
         addOnList: [],

         isAllWeekdays: false,
         isAllWeekends: false
      };
   },
   watch: {
      "roomTypeData.AmountPaxRoom"() {
         this.handleRoomDataChange();
      },
      "roomTypeData.MaxAmountPaxRoom"() {
         this.handleRoomDataChange();
      },
      "roomTypeData.HasPriceDaily"() {
         if (this.roomTypeData.HasPriceDaily === false) {
            this.roomTypeData.HasPriceWeekday = false;
            this.roomTypeData.HasPriceWeekend = false;
         }
      },
      "roomTypeData.SelectedCharges"() {
         const selectedChargeIds = new Set(this.roomTypeData.SelectedCharges);

         this.roomTypeData.SelectedCharges.forEach((c) => {
            if (!this.roomTypeData.Charges.find((r) => r.ChargeId === c)) {
               const chargeData = this.chargeList.find((chg) => chg.Id === c);
               if(chargeData)
               this.roomTypeData.Charges.push({
                  ChargeId: chargeData.Id,
                  Type: chargeData.Type,
                  Amount: chargeData.Amount,
               });
            }
         });

         this.roomTypeData.Charges = this.roomTypeData.Charges.filter((r) =>
            selectedChargeIds.has(r.ChargeId)
         );
      },
      "roomTypeData.SelectedAddOns"() {
         const selectedAddOnIds = new Set(this.roomTypeData.SelectedAddOns);
         this.roomTypeData.SelectedAddOns.forEach((addOn) => {
            if (!this.roomTypeData.AddOns.find((r) => r.AddOnId === addOn)) {
               const addOnData = this.addOnList.find((ao) => ao.Id === addOn);
               if(addOnData)
               this.roomTypeData.AddOns.push({
                  AddOnId: addOnData.Id,
                  Price: addOnData.Price,
               });
            }
         });

         this.roomTypeData.AddOns = this.roomTypeData.AddOns.filter((r) =>
            selectedAddOnIds.has(r.AddOnId)
         );
      },
   },
   async created() {
      this.chargeList = await this.getChargeAll();
      this.addOnList = await this.getAddOnAll();
      this.roomFacilityList = await this.getRoomFacilityAll();

      this.roomTypeData.Weekdays = this.dayList.map(data=> false) 
      this.roomTypeData.Weekends = this.dayList.map(data=> false)

      if (
         this.$route.name ==
         `${helper.GetLabel().action.create}${
            helper.GetLabel().menu.roomTypePrice
         }`
      ) {
         this.redirectLink = this.$route.path.replace("/add", "");
      }

      if(this.$route.meta.formMode == this.$constant.formMode.update){

         const tmpForm = await this.getById(this.$route.params.roomTypeId);

         this.roomTypeData = JSON.parse(JSON.stringify(Object.assign(this.roomTypeData, tmpForm)));
         console.log(this.roomTypeData)

         this.redirectLink = this.$route.path.replace(/\/update\/\d+$/, "");

         this.roomTypeData.Pax = this.roomTypeData.AmountPaxRoom;
         this.roomTypeData.MaxAmountPaxRoom =
            this.roomTypeData.AmountPaxRoom +
            this.roomTypeData.MaxAdditionalPax;
         this.roomTypeData.HavePaxCharge =
            this.roomTypeData.PaxChargeAmount != null;
         this.roomTypeData.DepositNominal =
            this.roomTypeData.RoomDeposit?.Nominal;

         this.roomTypeData.Charges = this.roomTypeData.RoomCharges;
         this.roomTypeData.SelectedCharges = this.roomTypeData.Charges.map(
            (c) => c.ChargeId
         );

         this.roomTypeData.AddOns = this.roomTypeData.RoomAddOns;
         this.roomTypeData.SelectedAddOns = this.roomTypeData.AddOns.map(
            (a) => a.AddOnId
         );
         this.roomTypeData.AddOns = this.roomTypeData.AddOns.map((add) => ({
            AddOnId: add.AddOnId,
            Price: add.AddOn.Price,
         }));

         this.roomTypeData.HasPriceWeekday = this.roomTypeData.RoomPrices.some(
            (rp) => rp.Type == 1
         );
         this.roomTypeData.HasPriceWeekend = this.roomTypeData.RoomPrices.some(
            (rp) => rp.Type == 2
         );
         this.roomTypeData.HasPriceMonthly = this.roomTypeData.RoomPrices.some(
            (rp) => rp.Type == 3
         );
         this.roomTypeData.HasPriceAnnually = this.roomTypeData.RoomPrices.some((rp) => rp.Type == 4);
         this.roomTypeData.HasPriceDaily = this.roomTypeData.HasPriceWeekday || this.roomTypeData.HasPriceWeekend;

         this.roomTypeData.PriceWeekday = this.roomTypeData.RoomPrices.find(
            (rp) => rp.Type == 1
         )?.Price;
         this.roomTypeData.PriceWeekend = this.roomTypeData.RoomPrices.find(
            (rp) => rp.Type == 2
         )?.Price || null;
         this.roomTypeData.PriceMonthly = this.roomTypeData.RoomPrices.find(
            (rp) => rp.Type == 3
         )?.Price;
         this.roomTypeData.PriceAnnually = this.roomTypeData.RoomPrices.find(
            (rp) => rp.Type == 4
         )?.Price;


         this.roomTypeData.Weekdays = this.dayList.map(data=> this.roomTypeData.Weekdays[data.Id] == true ? true : false) 
         this.roomTypeData.Weekends = this.roomTypeData.Weekdays.map(data=> !data)

         this.isAllWeekdays = this.roomTypeData.Weekdays.filter(data=> !data).length == 0
         this.isAllWeekends = this.roomTypeData.Weekends.filter(data=> !data).length == 0
      }
   },
   methods: {
      checkIsAllWeekdays(){
         this.roomTypeData.Weekdays = this.dayList.map(data=> this.isAllWeekdays)
         this.roomTypeData.Weekends = this.roomTypeData.Weekdays.map(data=> !data)

         this.isAllWeekends = !this.isAllWeekdays
      },
      checkIsAllWeekends(){
         this.roomTypeData.Weekends = this.dayList.map(data=> this.isAllWeekdays)
         this.roomTypeData.Weekdays = this.roomTypeData.Weekends.map(data=> !data)
         this.isAllWeekdays = !this.isAllWeekends
      },
      ...mapActions(module.roomTypePrice.name, ["create", "update", "getById"]),
      ...mapActions(module.charge.name, { getChargeAll: "getAll" }),
      ...mapActions(module.addOn.name, { getAddOnAll: "getAll" }),
      ...mapActions(module.roomFacility.name, {
         getRoomFacilityAll: "getAll",
      }),
      doCreate() {
         if (
            this.roomTypeData.HasPriceWeekday ||
            this.roomTypeData.HasPriceMonthly ||
            this.roomTypeData.HasPriceAnnually ||
            this.roomTypeData.HasPriceWeekend
         ) {
            let formData = JSON.parse(JSON.stringify(this.roomTypeData));


            if(!formData.HasPriceWeekend){
                                 // senin selasa  rabu   kamis  jumat  sabtu minggu
               formData.Weekends = [false, false, false, false, false, false, false]
            }

            if(!formData.HasPriceWeekday){
                                 // senin selasa  rabu   kamis  jumat  sabtu minggu
               formData.Weekdays = [false, false, false, false, false, false, false]
            }
            
            // formData.Weekends =  formData.Weekends.slice(1, formData.Weekends.length);
            return this.create(formData);
         } else {
            return Promise.reject("Please select at least one type of price");
         }
      },
      doUpdate() {
         if (
            this.roomTypeData.HasPriceWeekday ||
            this.roomTypeData.HasPriceMonthly ||
            this.roomTypeData.HasPriceAnnually ||
            this.roomTypeData.HasPriceWeekend
         ) {
            let formData = JSON.parse(JSON.stringify(this.roomTypeData));

            if(!formData.HasPriceWeekend){
                                 // senin selasa  rabu   kamis  jumat  sabtu minggu
               formData.Weekends = [false, false, false, false, false, false, false]
            }

            if(!formData.HasPriceWeekday){
                                 // senin selasa  rabu   kamis  jumat  sabtu minggu
               formData.Weekdays = [false, false, false, false, false, false, false]
            }
            // formData.Weekdays = formData.Weekdays.slice(1, formData.Weekdays.length);
            // formData.Weekends =  formData.Weekends.slice(1, formData.Weekends.length);
            return this.update(formData);
         }
         else {
            return Promise.reject("Please select at least one type of price");
         }
      },
      handleRoomDataChange() {
         if (this.roomTypeData.Pax > this.roomTypeData.MaxAmountPaxRoom) {
            this.paxErrorMsg =
               "Jumlah Pax tidak boleh melebihi jumlah maksimal Pax";
         } else {
            this.paxErrorMsg = "";
            this.roomTypeData.MaxAdditionalPax =
               this.roomTypeData.MaxAmountPaxRoom - this.roomTypeData.Pax;
         }
      },
      findWeekday(day) {
         return this.roomTypeData.Weekdays[day.Id];
      },
      selectAllWeekday(day) {
         setTimeout(() => {
            if(this.roomTypeData.Weekdays[day.Id] == true){
               this.roomTypeData.Weekends[day.Id] = false
               this.isAllWeekends = false
            }
            this.roomTypeData.Weekdays = this.dayList.map(data=> this.roomTypeData.Weekdays[data.Id] ? true : false) 
            this.roomTypeData.Weekends = this.roomTypeData.Weekdays.map(data=> !data)

            this.isAllWeekdays = this.roomTypeData.Weekdays.length == 7 && this.roomTypeData.Weekdays.filter(data=> !data).length == 0

         }, 20);
      },
      selectAllWeekend(day) {
         setTimeout(() => {
            if(this.roomTypeData.Weekends[day.Id] == true){
               this.roomTypeData.Weekdays[day.Id] = false
               this.isAllWeekdays = false
            }
            this.roomTypeData.Weekends = this.dayList.map(data=> this.roomTypeData.Weekends[data.Id] ? true : false) 
            this.roomTypeData.Weekdays = this.roomTypeData.Weekends.map(data=> !data)

            this.isAllWeekends = this.roomTypeData.Weekends.length == 7 && this.roomTypeData.Weekends.filter(data=> !data).length == 0
         }, 20);
      },
      getChargeName(chargeId) {
         return this.chargeList.find((c) => c.Id == chargeId).Name;
      },
      removeCharge(chargeId) {
         this.roomTypeData.SelectedCharges.splice(
            this.roomTypeData.SelectedCharges.findIndex((c) => c == chargeId),
            1
         );
         this.roomTypeData.Charges.splice(
            this.roomTypeData.Charges.findIndex((c) => c.ChargeId == chargeId),
            1
         );
      },
      getAddOnName(addOnId) {
         return this.addOnList.find((o) => o.Id == addOnId).Name;
      },
      removeAddOn(addOnId) {
         this.roomTypeData.SelectedAddOns.splice(
            this.roomTypeData.SelectedAddOns.findIndex((a) => a == addOnId),
            1
         );
         this.roomTypeData.AddOns.splice(
            this.roomTypeData.AddOns.findIndex((a) => a.AddOnId == addOnId),
            1
         );
      },
      findWeekend(day) {
         return this.roomTypeData.Weekends[day.Id];
      },
   },
};
</script>
<style scoped>
.row {
   margin-bottom: 16px;
}
.charge-selector {
   width: 96px;
   margin-right: 16px;
}
.p-select-open {
   border: 1px solid var(--blue-400) !important;
}
.trash-icon {
   width: 18px;
   height: 19px;
   margin-left: 16px;
   cursor: pointer;
}
</style>
