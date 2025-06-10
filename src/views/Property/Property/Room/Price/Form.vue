<template>
   <MIJForm
      :formData="formData"
      :createAction="doCreate"
      :updateAction="doUpdate"
      :redirect="redirectLink"
      :showCancel="showCancel"
      @cancel="$emit('cancel')"
   >
      <b-row>
         <b-col>
            <label><strong>Informasi Kamar</strong></label>
            <hr />
         </b-col>
      </b-row>
      <b-row>
         <b-col>
            <TextBox label="Kode Kamar" v-model="RoomData.Code" :minLength="3" />
         </b-col>
      </b-row>
      <b-row>
         <b-col>
            <TextBox v-model="RoomData.Name" label="Nama" />
         </b-col>
      </b-row>
      <b-row>
         <b-col>
            <TextBox v-model="RoomData.AliasName" label="Nama Pada Website" />
         </b-col>
      </b-row>

      <b-row>
         <b-col>
            <TextBox
               type="number"
               label="Jumlah Pax per Kamar"
               v-model="RoomData.Pax"
            />
         </b-col>
         <b-col>
            <TextBox
               type="number"
               label="Maksimal Pax per Kamar"
               v-model="RoomData.MaxAmountPaxRoom"
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
               v-model="RoomData.HavePaxCharge"
               :checked="RoomData.HavePaxCharge"
               label="Kenakan biaya tambahan untuk penambahan jumlah Pax"
            />
         </b-col>
      </b-row>
      <b-row v-if="RoomData.HavePaxCharge">
         <b-col>
            <TextBox
               type="number"
               v-model="RoomData.PaxChargeAmount"
               label="Harga per Pax"
            />
         </b-col>
      </b-row>
      <b-row>
         <b-col>
            <div class="d-flex">
               <TextBox
                  class="w-100"
                  type="number"
                  style="margin-right: 8px"
                  label="Luas Kamar (m2)"
                  v-model="RoomData.SizeRoom"
                  :required="false"
               />
               <TextBox
                  class="w-100"
                  style="margin-left: 8px"
                  label="Deposit Kamar (Rp)"
                  type="number"
                  v-model="RoomData.DepositNominal"
                  :required="false"
               />
            </div>
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
               v-model="RoomData.FacilityIds"
               :required="false"
            />
         </b-col>
      </b-row>
      <b-row>
         <b-col>
            <SelectBox
               :dataSource="lockList"
               label="Select Lock"
               optionLabel="Alias"
               optionValue="TTLockId"
               v-model="RoomData.TTLockId"
               :required="false"
            />
         </b-col>
      </b-row>
      <b-row>
         <b-col>
            <FileInput
               multiple
               v-model="RoomData.ImageIds"
               width="100%"
               :value="RoomData.RoomImages"
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
               v-model="RoomData.HasPriceDaily"
               :checked="RoomData.HasPriceDaily"
               label="Harga Harian"
            />
            <hr />
            <b-row v-show="RoomData.HasPriceDaily" class="m-2">
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
                                 v-model="RoomData.Weekdays[d.Id]"
                                 @change="selectAllWeekday(d)"
                              />
                           </b-col>
                        </b-row>
                        <b-row class="mt-3" style="min-height: 80px;">
                           <b-col cols="auto" style="align-content: center;">
                              <Switch
                                 v-model="RoomData.HasPriceWeekday"
                                 label="Set Harga"
                              />
                           </b-col>
                           
                           <b-col lg="" cols="12">
                              <TextBox
                                 type="number"
                                 v-model="RoomData.PriceWeekday"
                                 class="mt-2"
                                 label="Harga Weekday"
                                 v-if="RoomData.HasPriceWeekday"
                              />
                           </b-col>
                        </b-row>
                     </b-col>
                  </b-row>
               </b-col>
            </b-row>
            <b-row v-show="RoomData.HasPriceDaily" class="m-2">
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
                                 v-model="RoomData.Weekends[d.Id]"
                                 @change="selectAllWeekend(d)"
                              />
                           </b-col>
                        </b-row>
                        <b-row class="mt-3" style="min-height: 80px;">
                           <b-col cols="auto" style="align-content: center;">
                              <Switch
                                 v-model="RoomData.HasPriceWeekend"
                                 label="Set Harga"
                              />
                           </b-col>
                           
                           <b-col lg="" cols="12">
                              <TextBox
                                 type="number"
                                 v-model="RoomData.PriceWeekend"
                                 class="mt-2"
                                 label="Harga Weekend"
                                 v-if="RoomData.HasPriceWeekend"
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
               v-model="RoomData.HasPriceMonthly"
               :checked="RoomData.HasPriceMonthly"
               label="Harga Bulanan"
            />
            <hr />
            <TextBox
               v-if="RoomData.HasPriceMonthly"
               type="number"
               class="mt-2"
               v-model="RoomData.PriceMonthly"
               label="Harga Bulanan"
            />
         </b-col>
      </b-row>
      <b-row>
         <b-col>
            <CheckBox
               v-model="RoomData.HasPriceAnnually"
               :checked="RoomData.HasPriceAnnually"
               label="Harga Tahunan"
            />
            <hr />
            <TextBox
               v-if="RoomData.HasPriceAnnually"
               type="number"
               class="mt-2"
               v-model="RoomData.PriceAnnually"
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
               v-model="RoomData.SelectedCharges"
               :multiSelect="true"
               :required="false"
               :dataSource="chargeList"
            />
         </b-col>
      </b-row>
      <b-row
         v-for="rCharge in RoomData.Charges"
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
                  class="productVariant-selector"
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
               v-model="RoomData.SelectedAddOns"
               :multiSelect="true"
               :required="false"
               :dataSource="addOnList"
            />
         </b-col>
      </b-row>
      <b-row
         v-for="rAddOn in RoomData.AddOns"
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
                  class="trash-icon"
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
   </MIJForm>
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
   data() {
      return {
         formData: {
            module: this.$module.roomPrice,
         },
         redirectLink: this.$route.path,
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
         RoomData: {
            RoomTypeId: parseInt(this.$route.params.roomTypeId),
            Type: 1,
            Name: "",
            AliasName: "",
            Code: "",
            Pax: "",
            SizeRoom: "",
            AmountRoom: "",
            DepositNominal: null,
            TTLockId: null,

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
            PriceWeekend: "",
            Weekends: [],

            HasPriceMonthly: false,
            PriceMonthly: "",

            HasPriceAnnually: false,
            PriceAnnually: "",
         },
         roomFacilityList: [],
         chargeList: [],
         addOnList: [],
         lockList: [],

         isAllWeekdays: false,
         isAllWeekends: false
      };
   },
   watch: {
      "RoomData.AmountPaxRoom"() {
         this.handleRoomDataChange();
      },
      "RoomData.MaxAmountPaxRoom"() {
         this.handleRoomDataChange();
      },
      "RoomData.HasPriceDaily"() {
         if (this.RoomData.HasPriceDaily === false) {
            this.RoomData.HasPriceWeekday = false;
            this.RoomData.hasPriceWeekend = false;
         }
      },
      "RoomData.SelectedCharges"() {
         const selectedChargeIds = new Set(this.RoomData.SelectedCharges);
         this.RoomData.SelectedCharges.forEach((c) => {
            if (!this.RoomData.Charges.find((r) => r.ChargeId === c)) {
               const chargeData = this.chargeList.find((chg) => chg.Id === c);
               this.RoomData.Charges.push({
                  ChargeId: chargeData.Id,
                  Type: chargeData.Type,
                  Amount: chargeData.Amount,
               });
            }
         });

         this.RoomData.Charges = this.RoomData.Charges.filter((r) =>
            selectedChargeIds.has(r.ChargeId)
         );
      },
      "RoomData.SelectedAddOns"() {
         const selectedAddOnIds = new Set(this.RoomData.SelectedAddOns);
         this.RoomData.SelectedAddOns.forEach((addOn) => {
            if (!this.RoomData.AddOns.find((r) => r.AddOnId === addOn)) {
               const addOnData = this.addOnList.find((ao) => ao.Id === addOn);
               this.RoomData.AddOns.push({
                  AddOnId: addOnData.Id,
                  Price: addOnData.Price,
               });
            }
         });

         this.RoomData.AddOns = this.RoomData.AddOns.filter((r) =>
            selectedAddOnIds.has(r.AddOnId)
         );
      },
   },
   async created() {
      this.chargeList = await this.getChargeAll();
      this.addOnList = await this.getAddOnAll();
      this.roomFacilityList = await this.getRoomFacilityAll();

      this.RoomData.Weekdays = this.dayList.map(data=> false) 
      this.RoomData.Weekends = this.dayList.map(data=> false)

      try{
         this.lockList = await this.getLockAll();
      }
      catch(err){
         this.$showToast.error("Failed Get Locks", err)
         console.log(err)
      }
      

      if (
         this.$route.name ==
         `${helper.GetLabel().action.create} ${
            helper.GetLabel().menu.roomPrice
         }`
      ) {
         this.redirectLink = this.$route.path.replace("/add", "");
      }

      // console.log(this.$route.name)

      if(this.$route.meta.formMode == this.$constant.formMode.update){
         // console.log(this.$route.params)
         // this.RoomData = await this.getById(this.$route.params.roomId);
         const tmpForm = await this.getById(this.$route.params.roomId);
         this.RoomData = Object.assign(this.RoomData, tmpForm);
         console.log(this.RoomData)
         
         this.redirectLink = this.$route.path.replace(/\/update\/\d+$/, "");

         // this.RoomData.Pax = this.RoomData.AmountPaxRoom;
         this.RoomData.MaxAmountPaxRoom = this.RoomData.Pax + this.RoomData.MaxAdditionalPax;
         this.RoomData.HavePaxCharge = this.RoomData.PaxChargeAmount != null;
         this.RoomData.DepositNominal = this.RoomData.RoomDeposit?.Nominal;

         this.RoomData.Charges = this.RoomData.RoomCharges;
         this.RoomData.SelectedCharges = this.RoomData.Charges.map((c) => c.ChargeId);

         this.RoomData.AddOns = this.RoomData.RoomAddOns;
         this.RoomData.SelectedAddOns = this.RoomData.AddOns.map((a) => a.AddOnId);
         this.RoomData.AddOns = this.RoomData.AddOns.map((add) => ({
            AddOnId: add.AddOnId,
            Price: add.AddOn.Price,
         }));

         this.RoomData.HasPriceWeekday = this.RoomData.RoomPrices.some(
            (rp) => rp.Type == 1
         );
         this.RoomData.HasPriceWeekend = this.RoomData.RoomPrices.some(
            (rp) => rp.Type == 2
         );
         this.RoomData.HasPriceMonthly = this.RoomData.RoomPrices.some(
            (rp) => rp.Type == 3
         );
         this.RoomData.HasPriceAnnually = this.RoomData.RoomPrices.some(
            (rp) => rp.Type == 4
         );
         this.RoomData.HasPriceDaily =
            this.RoomData.HasPriceWeekday || this.RoomData.HasPriceWeekend;

         this.RoomData.PriceWeekday = this.RoomData.RoomPrices.find(
            (rp) => rp.Type == 1
         )?.Price;
         this.RoomData.PriceWeekend = this.RoomData.RoomPrices.find(
            (rp) => rp.Type == 2
         )?.Price;
         this.RoomData.PriceMonthly = this.RoomData.RoomPrices.find(
            (rp) => rp.Type == 3
         )?.Price;
         this.RoomData.PriceAnnually = this.RoomData.RoomPrices.find(
            (rp) => rp.Type == 4
         )?.Price;
         
         this.RoomData.FacilityIds = this.RoomData.RoomFacilities.map(data=> data.Facility.Id)

         this.RoomData.Weekdays = this.dayList.map(data=> this.RoomData.Weekdays[data.Id] == true ? true : false) 
         this.RoomData.Weekends = this.RoomData.Weekdays.map(data=> !data)

         this.isAllWeekdays = this.RoomData.Weekdays.filter(data=> !data).length == 0
         this.isAllWeekends = this.RoomData.Weekends.filter(data=> !data).length == 0
      }
   },
   methods: {
      checkIsAllWeekdays(){
         this.RoomData.Weekdays = this.dayList.map(data=> this.isAllWeekdays)
         this.RoomData.Weekends = this.RoomData.Weekdays.map(data=> !data)

         this.isAllWeekends = !this.isAllWeekdays
      },
      checkIsAllWeekends(){
         this.RoomData.Weekends = this.dayList.map(data=> this.isAllWeekdays)
         this.RoomData.Weekdays = this.RoomData.Weekends.map(data=> !data)
         this.isAllWeekdays = !this.isAllWeekends
      },
      ...mapActions(module.roomPrice.name, ["create", "update", "getById"]),
      ...mapActions(module.productVariant.name, { getChargeAll: "getAll" }),
      ...mapActions(module.addOn.name, { getAddOnAll: "getAll" }),
      ...mapActions(module.productBundle.name, {
         getRoomFacilityAll: "getAll",
      }),
      ...mapActions(module.property.name, { getLockAll: "getLocks" }),
      doCreate() {
         if (
            this.RoomData.HasPriceWeekday ||
            this.RoomData.HasPriceMonthly ||
            this.RoomData.HasPriceAnnually ||
            this.RoomData.HasPriceWeekend
         ) {
            let formData = JSON.parse(JSON.stringify(this.RoomData));
            
            if(!formData.HasPriceWeekend){
                                 // senin selasa  rabu   kamis  jumat  sabtu minggu
               formData.Weekends = [false, false, false, false, false, false, false]
            }

            if(!formData.HasPriceWeekday){
                                 // senin selasa  rabu   kamis  jumat  sabtu minggu
               formData.Weekdays = [false, false, false, false, false, false, false]
            }
                        return this.create(formData);
         } else {
            return Promise.reject("Please select at least one type of price");
         }
      },
      doUpdate() {
         let formData = JSON.parse(JSON.stringify(this.RoomData));

         
         if(!formData.HasPriceWeekend){
            // senin selasa  rabu   kamis  jumat  sabtu minggu
            formData.Weekends = [false, false, false, false, false, false, false]
         }

         if(!formData.HasPriceWeekday){
            // senin selasa  rabu   kamis  jumat  sabtu minggu
            formData.Weekdays = [false, false, false, false, false, false, false]
         }         
         return this.update(formData);
      },
      handleRoomDataChange() {
         if (this.RoomData.Pax > this.RoomData.MaxAmountPaxRoom) {
            this.paxErrorMsg =
               "Jumlah Pax tidak boleh melebihi jumlah maksimal Pax";
         } else {
            this.paxErrorMsg = "";
            this.RoomData.MaxAdditionalPax =
               this.RoomData.MaxAmountPaxRoom - this.RoomData.Pax;
         }
      },
      findWeekday(day) {
         return this.RoomData.Weekdays[day.Id];
      },
      selectAllWeekday(day) {
         setTimeout(() => {
            if(this.RoomData.Weekdays[day.Id] == true){
               this.RoomData.Weekends[day.Id] = false
               this.isAllWeekends = false
            }
            this.RoomData.Weekdays = this.dayList.map(data=> this.RoomData.Weekdays[data.Id] ? true : false) 
            this.RoomData.Weekends = this.RoomData.Weekdays.map(data=> !data)

            this.isAllWeekdays = this.RoomData.Weekdays.length == 7 && this.RoomData.Weekdays.filter(data=> !data).length == 0

         }, 20);
      },
      selectAllWeekend(day) {
         setTimeout(() => {
            if(this.RoomData.Weekends[day.Id] == true){
               this.RoomData.Weekdays[day.Id] = false
               this.isAllWeekdays = false
            }
            this.RoomData.Weekends = this.dayList.map(data=> this.RoomData.Weekends[data.Id] ? true : false) 
            this.RoomData.Weekdays = this.RoomData.Weekends.map(data=> !data)

            this.isAllWeekends = this.RoomData.Weekends.length == 7 && this.RoomData.Weekends.filter(data=> !data).length == 0
         }, 20);
      },
      getChargeName(chargeId) {
         return this.chargeList.find((c) => c.Id == chargeId).Name;
      },
      removeCharge(chargeId) {
         this.RoomData.SelectedCharges.splice(
            this.RoomData.SelectedCharges.findIndex((c) => c == chargeId),
            1
         );
         this.RoomData.Charges.splice(
            this.RoomData.Charges.findIndex((c) => c.ChargeId == chargeId),
            1
         );
      },
      getAddOnName(addOnId) {
         return this.addOnList.find((o) => o.Id == addOnId).Name;
      },
      removeAddOn(addOnId) {
         this.RoomData.SelectedAddOns.splice(
            this.RoomData.SelectedAddOns.findIndex((a) => a == addOnId),
            1
         );
         this.RoomData.AddOns.splice(
            this.RoomData.AddOns.findIndex((a) => a.AddOnId == addOnId),
            1
         );
      },
      findWeekend(day) {
         return this.RoomData.Weekends[day.Id];
      },
   },
};
</script>
<style scoped>
.row {
   margin-bottom: 16px;
}
.productVariant-selector {
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
