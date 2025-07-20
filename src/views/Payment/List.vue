<template>
   <ListPage :module="$module.payment" :canDelete="false" :showDelete="false" :showCreate="false" ref="listPage"/>

   <!-- Dialog Update Shipping Info -->
   <Dialog
         header="Update Shipping Info"
         v-model:visible="visible"
         :style="{ width: '60vw' }"
         :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
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
         <b-col cols="8" md="3" class="fw-bold">: {{ currentOrder.shippingInfo.postalCode }}</b-col>
         <b-col cols="12">Address :</b-col>
         <b-col cols="12" class="fw-bold ps-3">{{ currentOrder.shippingInfo.address ?? '-' }}</b-col>
         <b-col cols="12">Notes :</b-col>
         <b-col cols="12" class="fw-bold ps-3">{{ currentOrder.shippingInfo.notes ?? '-' }}</b-col>
      </b-row>
      
      <b-row class="border-top pt-3 border-top-3" v-if="form">
         <b-col cols="12" class="mb-2">
            <TextBox v-model="form.trackingNumber" label="Tracking Number / No Resi" labelType="out"/>
         </b-col>
         <b-col cols="12" lg="6" md="6" class="mb-2">
            <DateBox v-model="form.shippedAt" label="Shipped At" labelType="out"/>
         </b-col>
         <b-col cols="12" lg="6" md="6" class="mb-2">
            <TextBox v-model="form.shippingMethod" label="Shipping Method (JNE/J&T/Shopee Exress/etc)"/>
         </b-col>
         <b-col cols="12" lg="6" md="6" class="mb-2">
            <DateBox :required="false" v-model="form.estimatedDelivery" label="Estimate Delivery" labelType="out"/>
         </b-col>
         <b-col cols="12" lg="6" md="6" class="mb-2">
            <DateBox :required="false" v-model="form.deliveredAt" label="Delivered At" labelType="out"/>
         </b-col>
      </b-row>
      <Button @click.stop.prevent="doUpdateShippingInfo" class="mt-3" label="Update" :isLoading="isLoading"/>
   </Dialog>

   <!-- Dialog Update Payment Status -->
   <Dialog
         header="Update Payment Status"
         v-model:visible="visiblePayment"
         :style="{ width: '40vw' }"
         :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
   >
      <div class="fw-bold">Order Info :</div>
      <b-row class="mb-2 ps-2">
         <b-col cols="4" md="3">Invoice Code</b-col>
         <b-col cols="8" md="9" class="fw-bold">: {{ currentOrder.code }}</b-col>
         <b-col cols="4" md="3">Total Amount</b-col>
         <b-col cols="8" md="9" class="fw-bold">: Rp {{ $helper.ConvertNumberFormat(currentOrder.totalAmount) }}</b-col>
      </b-row>
      
      <b-row class="border-top pt-3 border-top-3">
         <b-col cols="12" class="mb-2">
            <SelectBox 
               v-model="paymentForm.newStatus" 
               label="Payment Status"
               labelType="out"
               :dataSource="[
                  { name: 'Pending', id: 'pending' },
                  { name: 'Paid', id: 'paid' },
                  { name: 'Preparing', id: 'preparing' },
                  { name: 'Shipped', id: 'shipped' },
                  { name: 'Arrived', id: 'arrived' },
                  { name: 'Completed', id: 'completed' },
                  { name: 'Cancelled', id: 'cancelled' },
               ]"
            />
         </b-col>
      </b-row>
      <Button @click.stop.prevent="doUpdatePaymentStatus" class="mt-3" label="Update" :isLoading="isLoading"/>
   </Dialog>

   <!-- Dialog Update Order Status -->
   <Dialog
         header="Update Order Status"
         v-model:visible="visibleStatus"
         :style="{ width: '40vw' }"
         :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
   >
      <div class="fw-bold">Order Info :</div>
      <b-row class="mb-2 ps-2">
         <b-col cols="4" md="3">Invoice Code</b-col>
         <b-col cols="8" md="9" class="fw-bold">: {{ currentOrder.code }}</b-col>
         <b-col cols="4" md="3">Current Status</b-col>
         <b-col cols="8" md="9" class="fw-bold">: {{ currentOrder.status }}</b-col>
      </b-row>
      
      <b-row class="border-top pt-3 border-top-3">
         <b-col cols="12" class="mb-2">
            <SelectBox 
               v-model="statusForm.newStatus" 
               label="New Status"
               :options="[
                  { label: 'Pending', value: 'pending' },
                  { label: 'Paid', value: 'paid' },
                  { label: 'Preparing', value: 'preparing' },
                  { label: 'Shipped', value: 'shipped' },
                  { label: 'Arrived', value: 'arrived' },
                  { label: 'Completed', value: 'completed' },
                  { label: 'Cancelled', value: 'cancelled' }
               ]"
            />
         </b-col>
      </b-row>
      <Button @click.stop.prevent="doUpdateStatus" class="mt-3" label="Update" :isLoading="isLoading"/>
   </Dialog>
</template>
<script>
import { provide, ref, onMounted } from "vue";
import Dialog from "primevue/dialog";
import { mapActions } from "vuex";
import module from "../../constant/module";
import moment from "moment/moment";

export default {
   components:{
      Dialog
   },
   setup(){
      const currentOrder = ref(null)
      const form = ref(
         {
            deliveredAt: new Date(),
            estimatedDelivery: new Date(moment().add(3, 'days')),
            shippedAt: null,
            shippingMethod: null,
            trackingNumber: null
         }
      )
      const paymentForm = ref({
         status: 'pending'
      })
      const visible = ref(false)
      const visiblePayment = ref(false)

      provide("actionContext", [
            {
                label: 'Update Shipping Info', 
                action: (data) => {
                  currentOrder.value = data
                  form.value = JSON.parse(JSON.stringify(currentOrder.value.shippingInfo))
                  console.log(form.value)

                  setTimeout(() => {
                     visible.value = true;
                  }, 10);
                }
            },
            {
                label: 'Update Payment Status', 
                action: (data) => {
                  currentOrder.value = data
                  paymentForm.value = {
                     newStatus: data.status?.name || 'pending'
                  }
                  setTimeout(() => {
                     visiblePayment.value = true;
                  }, 10);
                }
            },
      ])

      return {
         visible, visiblePayment, currentOrder, form, paymentForm
      }
   },

   watch:{
      visible:{
         immediate: true,
         handler(newVal){
            if(!newVal){
               // this.currentOrder = null
               this.form = {
                  deliveredAt: null,
                  estimatedDelivery: new Date(moment().add(3, 'days')),
                  shippedAt: new Date(),
                  shippingMethod: null,
                  trackingNumber: null
               }
            }
         }
      },
      visiblePayment:{
         immediate: true,
         handler(newVal){
            if(!newVal){
               this.paymentForm = {
                  newStatus: 'pending'
               }
            }
         }
      }
   },

   data() {
      return {
         isLoading: false,
         actions: []
      };
   },

   methods:{
      doUpdateShippingInfo(){
         console.log(this.form)

         if(this.isLoading || !this.form.trackingNumber || !this.form.shippingMethod) return
         this.isLoading = true

         var params = JSON.parse(JSON.stringify(this.form))
         params.id = this.currentOrder.id
         params.deliveredAt = !params.deliveredAt ? null : this.$moment(params.deliveredAt)
         params.estimatedDelivery = !params.estimatedDelivery ? null : this.$moment(params.estimatedDelivery)
         params.shippedAt = !params.shippedAt ? null : this.$moment(params.deliveredAt)
         console.log(params)

         this.updateShippingInfo(params)
         .then((res)=>{
               this.$refs['listPage'].refreshData()
               this.visible = false
               this.isLoading = false
               this.$showToast.success("Berhasil mengubah info pengiriman");
             })
             .catch((err)=>{
               this.$showToast.error("Gagal mengubah info pengiriman", err);
               this.isLoading = false
             })
      },

      doUpdatePaymentStatus(){
         if(this.isLoading || !this.paymentForm.newStatus) return
         this.isLoading = true

         var params = JSON.parse(JSON.stringify(this.paymentForm))
         params.id = this.currentOrder.id

         this.updateOrderStatus(params)
         .then((res)=>{
               this.$refs['listPage'].refreshData()
               this.visiblePayment = false
               this.isLoading = false
               this.$showToast.success("Berhasil mengubah status Ordera");
             })
             .catch((err)=>{
               this.$showToast.error("Gagal mengubah status Orderan", err);
               this.isLoading = false
             })
      },

      doUpdateStatus(){
         if(this.isLoading || !this.statusForm.newStatus) return
         this.isLoading = true

         var params = {
            id: this.currentOrder.id,
            newStatus: this.statusForm.newStatus
         }

         this.updateStatus(params)
         .then((res)=>{
               this.$refs['listPage'].refreshData()
               this.visibleStatus = false
               this.isLoading = false
               this.$showToast.success("Berhasil mengubah status order");
             })
             .catch((err)=>{
               this.$showToast.error("Gagal mengubah status order", err);
               this.isLoading = false
             })
      },

      ...mapActions(module.payment.name, ['updateShippingInfo', 'updateOrderStatus'])      
   }
};
</script>
