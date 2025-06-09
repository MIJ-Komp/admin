<template>
   <Dialog
      class="dialog"
      modal
      :header="`Order ID: ${bookData?.Code}`"
      v-model:visible="visible"
      style="width: 50vw"
      :pcCloseButton="true"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
   >
      <div class="d-flex mb-4">
         <img />
         <div class="d-flex flex-column">
            <label class="text-muted">
               {{ bookData.BookDetails?.Rooms.Property.Provinces.Name }} -
               {{ bookData.PropertyName }}
            </label>
            <h4>
               <!-- {{ bookData.BookDetails?.Rooms.RoomTypes.Name }} - -->
               {{ bookData.RoomName }}
            </h4>
            <label
               >{{ formatDate(bookData.CheckInDate) }} -
               {{ formatDate(bookData.CheckOutDate) }}</label
            >
            <label>{{ bookData.BookDetails?.Pax }} Guests</label>
         </div>
      </div>
      <div class="d-flex flex-column">
         <div
            class="d-flex justify-content-between"
            @click="openGuestDetail = !openGuestDetail"
         >
            <h5 class="mb-0">Guest Details</h5>
            <img class="mini-icon" :src="getChevronGuestDetail()" />
         </div>
         <hr />
         <template v-if="openGuestDetail">
            <div class="d-flex justify-content-between">
               <div class="d-flex flex-column w-50">
                  <div class="info-box">
                     <label>Name</label>
                     <label>{{ bookData.Payment.GuestName }}</label>
                  </div>
                  <div class="info-box">
                     <label>Email Address</label>
                     <label>{{ bookData.Payment.GuestEmail }}</label>
                  </div>
               </div>
               <div class="d-flex flex-column w-50">
                  <div class="info-box">
                     <label>Phone Number</label>
                     <label>{{ bookData.Payment.GuestPhoneNumber }}</label>
                  </div>
                  <div class="info-box">
                     <label>Country</label>
                     <label>{{ bookData.Users?.PhoneNumber }}</label>
                  </div>
               </div>
            </div>
         </template>
      </div>
      <div class="d-flex flex-column">
         <div
            class="d-flex justify-content-between"
            @click="openPriceDetail = !openPriceDetail"
         >
            <h5 class="mb-0">Price Details</h5>
            <img class="mini-icon" :src="getChevronPriceDetail()" />
         </div>
         <hr />
         <template v-if="openPriceDetail">
            <div class="d-flex justify-content-between">
               <label>
                  {{ formatCurrency(bookData.SubTotal) }} x
                  {{
                     getDaysDifference(
                        bookData.CheckInDate,
                        bookData.CheckOutDate
                     )
                  }}
                  nights
               </label>
               <label>{{ formatCurrency(bookData.SubTotal) }} </label>
            </div>
            <div class="d-flex justify-content-between">
               <label>Deposit</label>
               <label>{{
                  formatCurrency(bookData.Total)
               }}</label>
            </div>
            <div
               v-for="charge in bookData.BookDetailCharges"
               :key="charge.Id"
               class="d-flex justify-content-between"
            >
               <label>{{ charge.RoomCharges.Charges.Name }}</label>
               <label>{{
                  formatCurrency(charge.RoomCharges.Charges.Amount)
               }}</label>
            </div>

            <label class="text-muted">Add-on</label>
            <div
               v-for="addOn in bookData.BookDetailAddOns"
               :key="addOn.Id"
               class="d-flex justify-content-between"
            >
               <label>{{ addOn.RoomAddOns.AddOns.Name }}</label>
               <label>{{
                  formatCurrency(addOn.RoomAddOns.AddOns.Price)
               }}</label>
            </div>
            <hr />
            <div class="d-flex justify-content-between">
               <label>Voucher</label>
               <label>- {{ formatCurrency(bookData.Payment.Discount) }}</label>
            </div>
            <div class="d-flex justify-content-between">
               <label>Poin</label>
               <label>- {{ formatCurrency(bookData.Payment.UsePoint) }}</label>
            </div>
            <hr />
         </template>
         <div
            class="d-flex justify-content-between mb-4"
            style="font-weight: 600"
         >
            <label>Total</label>
            <label>- {{ formatCurrency(bookData.Total) }}</label>
         </div>

         <div class="d-flex justify-content-between">
            <h5 class="mb-0">Payment Details</h5>
            <img class="mini-icon" :src="getChevronPaymentDetail()" />
         </div>
         <hr />
         <template v-if="openPaymentDetail">
            <div class="d-flex justify-content-between mb-3">
               <div class="d-flex flex-column w-50">
                  <label class="text-muted"> Tanggal Pembayaran </label>
                  <label>{{ bookData.Payment.PaidAt || '-' }}</label>
               </div>
               <div class="d-flex flex-column w-50">
                  <label class="text-muted"> Metode Pembayaran </label>
                  <label>{{
                     bookData.PaymentMethodName
                  }}</label>
               </div>
            </div>
            <div class="total-payment-container">
               <label>Nominal (Rp)</label>
               <label>{{ formatCurrency(bookData.Total) }}</label>
            </div>
         </template>
         <Button label="Bayar" />
      </div>
   </Dialog>
</template>
<script>
import Dialog from "primevue/dialog";
import module from '../../../constant/module'
import {mapActions} from 'vuex'
export default {
   components: {
      Dialog,
   },
   props: {
      showPopUp: {
         type: Boolean,
         default: false,
      },
   },
   data() {
      return {
         visible: false,
         openGuestDetail: true,
         openPriceDetail: false,
         openPaymentDetail: true,
      };
   },
   watch: {
     
      // visible: {
      //    handler() {
      //       this.$emit("updatePopUp", this.visible);
      //    },
      // },
   },
   methods: {
      ...mapActions(module.booking.name, ["getOneBooking"]),
      async openModal(data){
         this.bookData = data;

         // console.log(this.bookData)
         this.visible = true
         var data = await this.getOneBooking(this.bookData.Code)
      },
      formatDate(date) {
         switch (localStorage.getItem("language")) {
            case "ID": {
               return this.$moment(date)
                  .locale("id-ID")
                  .format("ddd, DD MMM YYYY");
            }
            case "EN": {
               return this.$moment(date)
                  .locale("en-US")
                  .format("ddd, DD MMM YYYY");
            }
            default: {
               return this.$moment(date)
                  .locale("en-US")
                  .format("ddd, DD MMM YYYY");
            }
         }
      },
      getDaysDifference(date1, date2) {
         const oneDay = 24 * 60 * 60 * 1000;

         const diffInMilliseconds = Math.abs(new Date(date2) - new Date(date1));
         return Math.ceil(diffInMilliseconds / oneDay);
      },
      getChevronGuestDetail() {
         return this.openGuestDetail
            ? this.$assets.icons.chevron_up
            : this.$assets.icons.chevron_down;
      },
      getChevronPriceDetail() {
         return this.openPriceDetail
            ? this.$assets.icons.chevron_up
            : this.$assets.icons.chevron_down;
      },
      getChevronPaymentDetail() {
         return this.openPaymentDetail
            ? this.$assets.icons.chevron_up
            : this.$assets.icons.chevron_down;
      },
      formatCurrency(money) {
         if (!money) {
            return 0;
         }
         return money.toLocaleString("id-ID", {
            style: "currency",
            currency: "IDR",
         });
      },
   },
};
</script>
<style lang="scss" scoped>
.p-dialog-header-actions {
   display: none !important;
}
.dialog .actionButton {
   display: flex;
   justify-content: end;
}
.dialog .actionButton .mij-button {
   width: 150px !important;
   margin-left: 20px;
}
.info-box {
   display: flex;
   flex-direction: column;
   margin-bottom: 16px;
}
.mini-icon {
   width: 24px;
   height: 24px;
}

.total-payment-container {
   display: flex;
   flex-direction: column;
   padding: 16px;
   margin-bottom: 16px;
   background-color: whitesmoke;
   border-radius: 8px;
}
</style>
