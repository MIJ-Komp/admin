<template>
   <MIJForm
      :formData="formData"
      :showCancel="showCancel"
      :showSave="false"
      @cancel="$emit('cancel')"
      class="ps-4 pe-4"
      v-if="currentOrder"
   >
      <div class="fw-bold">Order Info :</div>
      <b-row class="mb-2 ps-2">
         <b-col cols="4" md="3">Invoice Code</b-col>
         <b-col cols="8" md="3" class="fw-bold">: {{ currentOrder.code }}</b-col>
         <b-col cols="4" md="3">Total Paid</b-col>
         <b-col cols="8" md="3" class="fw-bold">: {{ currentOrder.totalPaid ? `Rp ${$helper.ConvertNumberFormat(currentOrder.totalPaid)}` : 'Belum Dibayar' }}</b-col>
         <b-col cols="4" md="3">Paid At</b-col>
         <b-col cols="8" md="3" class="fw-bold">: {{ currentOrder.padAt ? `${$moment(currentOrder.paidAt).format('DD MMM yyyy HH:mm')}` : 'Belum Dibayar' }}</b-col>
      </b-row>
      <div class="fw-bold">Customer Info :</div>
      <b-row class="mb-2 ps-2">
         <b-col cols="4" md="3">Name</b-col>
         <b-col cols="8" md="3" class="fw-bold">: {{ currentOrder.customerInfo.name }}</b-col>
         <b-col cols="4" md="3">Recepient Name</b-col>
         <b-col cols="8" md="3" class="fw-bold">: {{ currentOrder.shippingInfo.recepientName }}</b-col>
         <b-col cols="4" md="3">Phone</b-col>
         <b-col cols="8" md="3" class="fw-bold">: {{ currentOrder.customerInfo.phoneNumber }}</b-col>
         <b-col cols="4" md="3">Email</b-col>
         <b-col cols="8" md="3" class="fw-bold">: {{ currentOrder.customerInfo.email }}</b-col>
         <b-col cols="4" md="3">Province</b-col>
         <b-col cols="8" md="3" class="fw-bold">: {{ currentOrder.shippingInfo.province ?? '-' }}</b-col>
         <b-col cols="4" md="3">City</b-col>
         <b-col cols="8" md="3" class="fw-bold">: {{ currentOrder.shippingInfo.city ?? '-' }}</b-col>
         <b-col cols="4" md="3">Postal Code</b-col>
         <b-col cols="8" md="9" class="fw-bold">: {{ currentOrder.shippingInfo.postalCode }}</b-col>
         <b-col cols="4" md="3">Address</b-col>
         <b-col cols="8" md="9" class="fw-bold">: {{ currentOrder.shippingInfo.address ?? '-' }}</b-col>
         <b-col cols="4" md="3">Notes</b-col>
         <b-col cols="8" md="9" class="fw-bold">: {{ currentOrder.shippingInfo.notes ?? '-' }}</b-col>
      </b-row>
  
      <div class="fw-bold">Order Items :</div>
      <table class="custom-table">
         <thead>
            <tr>
               <td class="text-center">Product</td>
               <td class="text-center">Qty</td>
               <td class="text-center">Price</td>
               <td class="text-center">Total Price</td>
            </tr>
         </thead>
         <tbody>
            <tr v-for="item in currentOrder.orderItems">
               <td>{{ item.product.name }}</td>
               <td>{{ item.quantity }}</td>
               <td class="text-right">Rp {{ $helper.ConvertNumberFormat(item.price) }}</td>
               <td class="text-right">Rp {{ $helper.ConvertNumberFormat(item.price*item.quantity) }}</td>
            </tr>
            <tr>
               <td colspan="3" class="fw-bold text-right">TOTAL</td>
               <td colspan="3" class="fw-bold text-right">{{$helper.ConvertNumberFormat(currentOrder.orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0))}}</td>
            </tr>
         </tbody>
      </table>
   </MIJForm>
</template>
<script>
import module from "../../constant/module";
import { mapActions } from "vuex";
export default {
   props: {
      showCancel: { type: Boolean, default: false },
   },
   methods: {
      ...mapActions(module.payment.name, ["create", "getById", "update"]),
   },
   created() {},
   watch: {},
   data() {
      return {
         formData: {
            module: this.$module.payment,
         },
         currentOrder: null
      };
   },
   async mounted() {
      // // console.log(this.$route)
      if (this.$route.meta.formMode == this.$constant.formMode.update) {
         const tmpForm = await this.getById(this.$route.params.id);
         this.currentOrder= JSON.parse(JSON.stringify(tmpForm));
      }
   },
};
</script>

<style>
table.custom-table thead tr{
   background: var(--primary-color);
   color: white;
}
</style>
