<template>
<div style="height: 100%;" class="fadeIn">
    <div class="filter-container">
        <b-row>
            <b-col class="mt-2"
                :lg="monthly? 4:3" cols="6">
                <SelectBox 
                    label="Property" 
                    :required="false" 
                    labelType="out" 
                    :dataSource="properties"
                    :module="$module.property" 
                    v-model="filter.PropertyId"/>
            </b-col>
            <b-col class="mt-2" :lg="monthly? 2:3" cols="6">
                <!--- <div style="width: fit-content;">
                    <Switch label="Bulanan" v-model="monthly"/>
                </div> --->
                <SelectBox labelType="out" :dataSource="orderTypes" v-model="monthly" :disabled="cart" :required="false" label="Stay Option"/>
            </b-col>
            <b-col class="mt-2" :lg="monthly? 2:3" :cols="monthly? 4:6" v-if="monthly">
                <TextBox :min="1" label="Duration (Month)" :disabled="cart" labelType="out" :required="false" v-model="filter.Month"/>
            </b-col>

            <b-col class="mt-2" :lg="monthly? 2:3" :cols="monthly? 4:6">
                <DateBox label="Check-In" :disabled="cart" :required="false" labelType="out" v-model="filter.FromDate"/>
            </b-col>
            <b-col class="mt-2" :lg="monthly? 2:3" :cols="monthly? 4:6">
                <DateBox label="Check-Out" :minDate="getMinDate()" :disabled="cart || !filter.FromDate || monthly" labelType="out" :required="false" v-model="filter.ToDate"/>
            </b-col>
            
        </b-row>
    </div>

    <div class="content-container">
        <div class="filter-result-container">
            <!-- <div class="font-button text-grey" 
                style="height: 100%;
                text-align: center;
                align-content: center;"
            v-if="!filter.PropertyId || !filter.FromDate || !filter.ToDate">Please select a Property and dates</div> -->

            <div >
                <b-row>
                    <b-col cols="12">
                        <SelectBox label="Room Type" labelType="out" v-model="filter.RoomTypeId" :dataSource="roomTypes"/>
                    </b-col>
                    <!-- <b-col cols="6">
                        <TextBox label="Pax" type="number" labelType="out"/>
                    </b-col> -->
                </b-row>
                <div style="margin-top: 12px;">
                    <div class="font-button text-grey" style="margin-top: 24px;">Select an Available room to create booking</div>
                    <div class="room-container">
                        <div class="room-card" 
                            :class="(room.Available ? 'available ': 'notAvailable ') + (room.Selected ? 'selected' : '')" 
                            v-for="room in rooms" :key="room" @click="selectRoom(room)">
                            <img style="height: 80px; width: 80px; border-radius: 8px; margin-right: 16px;" :src="getImage(room)"/>
                            <div>
                                <div style="font-size: 16px;">{{room.Code}}</div>
                                <div style="font-size: 12px;" class="price">Start From IDR {{ room.Available && room.Available.PriceStart ? $helper.ConvertNumberFormat(room.Available.PriceStart) : 
                                    room.MinPrice ?  $helper.ConvertNumberFormat(room.MinPrice) : '-'}}</div>
                                <div class="flex-row" style="margin-top: 10px">
                                    <div class="flex-row" style="margin-right: 16px; align-items: center">
                                        <img class="me-1" :src="$assets.icons.pax" style="height: 20px; width: 20px;"/>
                                        <div class="font-12">{{room.Pax}}</div>
                                    </div>
                                    <div class="flex-row" style="align-items: center">
                                        <img class="me-1" :src="$assets.icons.roomSize" style="height: 20px; width: 20px;"/>
                                        <div class="font-12">{{ room.SizeRoom||'-' }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- <div class="cart-icon">
            <i class="fa fa-shopping-cart"/>
        </div> -->
        <div class="selected-container" v-if="cart">
            <div class="text-center">Selected Room</div>
            <div class="selected-item-container">
                <div style="flex-grow: 1; overflow: auto; margin-bottom: 20px">
                    <div class="selected-room-card" v-for="selectedRoom in cart.BookDetails" :key="selectedRoom">
                        <CheckBox style="margin-top: 30px;" class="me-3" v-model="selectedRoom.Checked"/>
                        
                        <div style="width: 100%;">
                            <div class="flex-between room-detail">
                                <div class="flex-row">
                                    
                                    <img style="height: 80px; width: 80px; border-radius: 8px; margin-right: 16px;" :src="getImage(selectedRoom)"/>
                                    <div>
                                        <div style="font-size: 16px;">{{selectedRoom.Room.Code}}</div>
                                        <div style="font-size: 12px;" class="price">IDR {{ $helper.ConvertNumberFormat(selectedRoom.PricePerNight) }} /night</div>
                                        <div class="flex-row" style="margin-top: 10px">
                                            <div class="flex-row" style="margin-right: 16px; align-items: center">
                                                <img class="me-1" :src="$assets.icons.pax" style="height: 20px; width: 20px;"/>
                                                <div class="font-12">{{selectedRoom.Room?.Pax}}</div>
                                            </div>
                                            <div class="flex-row" style="align-items: center">
                                                <img class="me-1 font-12" :src="$assets.icons.roomSize" style="height: 20px; width: 20px;"/>
                                                <div class="font-12">{{ selectedRoom.Room.SizeRoom||'-' }}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="flex-row" style="align-items: center;">
                                    <div style="margin-right: 16px">Pax</div>
                                    <input style="width: 56px;" type="number" v-model="selectedRoom.Pax">
                                </div>
                            </div>
                            <div class="price-detail font-14 slide-bottom" v-if="selectedRoom.OpenDetail">
                                <div>
                                    <div>IDR {{ $helper.ConvertNumberFormat(selectedRoom.PricePerNight) }} x {{ selectedRoom.TotalNights }} night</div>
                                    <div>Deposit</div>
                                    <div v-for="charge in selectedRoom.BookDetailCharges" :key="charge">{{ charge.Name }}</div>
                                    <div>Add-on</div>
                                    <div class="ps-3" v-for="addOn in selectedRoom.BookDetailAddOns" :key="addOn">{{ addOn.Name }}</div>
                                </div>
                                <div style="text-align: right;">
                                    <div>IDR {{ $helper.ConvertNumberFormat(selectedRoom.SubTotal) }}</div>
                                    <div>IDR {{ $helper.ConvertNumberFormat(selectedRoom.BookDetailDeposit.Total) }}</div>
                                    <div v-for="charge in selectedRoom.BookDetailCharges" :key="charge">IDR {{ $helper.ConvertNumberFormat(charge.Total) }} </div>
                                    <div style="height: 26px"></div>
                                    <div v-for="addOn in selectedRoom.BookDetailAddOns" :key="addOn">IDR {{ $helper.ConvertNumberFormat(addOn.Total) }}</div>
                                </div>
                            </div>
                            <div class="flex-between total-price">
                                <div class="addOn-button flex-row" :style="selectedRoom.AddOns.length <= 0 ? 'visibility: hidden': ''" @click="showAddOn(selectedRoom)">
                                    <div class="me-2 flex-row" style="align-items: center">
                                        <i class="fa fa-pencil me-1"/>
                                        <div>Add On</div>
                                    </div> 
                                    <div v-if="selectedRoom.BookDetailAddOns.length > 0" class="quantity">{{selectedRoom.BookDetailAddOns.length}}</div>
                                </div>
                                <div class="flex-row" style="cursor: pointer;" @click="selectedRoom.OpenDetail = !selectedRoom.OpenDetail">
                                    <div>IDR {{$helper.ConvertNumberFormat(selectedRoom.Total)}}</div>
                                    <i :class="selectedRoom.OpenDetail? 'fa fa-angle-up' :'fa fa-angle-down'" 
                                        style="cursor: pointer;
                                            align-content: center; 
                                            font-size: 20px; 
                                            margin-left: 16px" 
                                        />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="footer-section">
                    <Button buttonType="danger" v-if="cart.BookDetails.filter(data=> data.Checked).length > 0" 
                    :label="`Delete (${cart.BookDetails.filter(data=> data.Checked).length})`" iconFa="fa fa-trash"
                    style="width: 200px !important;" class="me-2"
                    @click="clearCart"/>

                    <div class="button-booking font-14" @click="openCheckOutModal">
                        <div>Total</div>
                        <div class="flex-row" style="align-items: center;">
                            <div class="me-3">IDR {{$helper.ConvertNumberFormat(cart.Total)}}</div>
                            <img style="height: 24px;width: 24px;" :src="$assets.icons.paperPlane">
                        </div>
                    </div>
                </div>
                
            </div>
        </div>

        <div class="cart-mobile" v-if="cart">
            <div class="cart-icon" @click="openCart = true">
                <i class="fa-solid fa fa-shopping-cart"/>
                <div>{{ cart.BookDetails.length }} Item</div>
            </div>

            <div class="selected-container-mobile slide-top" v-if="openCart">
                <i class="fa fa-times icon-close-cart" @click="openCart= false"></i>
                <div class="text-center font-label" style="border-bottom: 1px solid var(--grey-800); padding-bottom: 20px; font-size: 16px !important;">Selected Room</div>
                <div class="selected-item-container">
                <div style="flex-grow: 1; overflow: auto; margin-bottom: 20px">
                    <div class="selected-room-card" v-for="selectedRoom in cart.BookDetails" :key="selectedRoom">
                        <CheckBox style="margin-top: 30px;" class="me-3" v-model="selectedRoom.Checked"/>
                        
                        <div style="width: 100%;">
                            <div class="flex-between room-detail">
                                <div class="flex-row">
                                    
                                    <img style="height: 80px; width: 80px; border-radius: 8px; margin-right: 16px;" :src="getImage(selectedRoom)"/>
                                    <div>
                                        <div style="font-size: 16px;">{{selectedRoom.Room.Code}}</div>
                                        <div style="font-size: 12px;" class="price">IDR {{ $helper.ConvertNumberFormat(selectedRoom.PricePerNight) }} /night</div>
                                        <div class="flex-row" style="margin-top: 10px">
                                            <div class="flex-row" style="margin-right: 16px; align-items: center">
                                                <img class="me-1" :src="$assets.icons.pax" style="height: 20px; width: 20px;"/>
                                                <div class="font-12">{{selectedRoom.Room?.Pax}}</div>
                                            </div>
                                            <div class="flex-row" style="align-items: center">
                                                <img class="me-1 font-12" :src="$assets.icons.roomSize" style="height: 20px; width: 20px;"/>
                                                <div class="font-12">{{ selectedRoom.Room.SizeRoom||'-' }}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="flex-row" style="align-items: center;">
                                    <div style="margin-right: 16px">Pax</div>
                                    <input style="width: 56px;" type="number" v-model="selectedRoom.Pax">
                                </div>
                            </div>
                            <div class="price-detail font-14 slide-bottom" v-if="selectedRoom.OpenDetail">
                                <div>
                                    <div>IDR {{ $helper.ConvertNumberFormat(selectedRoom.PricePerNight) }} x {{ selectedRoom.TotalNights }} night</div>
                                    <div>Deposit</div>
                                    <div v-for="charge in selectedRoom.BookDetailCharges" :key="charge">{{ charge.Name }}</div>
                                    <div>Add-on</div>
                                    <div class="ps-3" v-for="addOn in selectedRoom.BookDetailAddOns" :key="addOn">{{ addOn.Name }}</div>
                                </div>
                                <div style="text-align: right;">
                                    <div>IDR {{ $helper.ConvertNumberFormat(selectedRoom.SubTotal) }}</div>
                                    <div>IDR {{ $helper.ConvertNumberFormat(selectedRoom.BookDetailDeposit.Total) }}</div>
                                    <div v-for="charge in selectedRoom.BookDetailCharges" :key="charge">IDR {{ $helper.ConvertNumberFormat(charge.Total) }} </div>
                                    <div style="height: 26px"></div>
                                    <div v-for="addOn in selectedRoom.BookDetailAddOns" :key="addOn">IDR {{ $helper.ConvertNumberFormat(addOn.Total) }}</div>
                                </div>
                            </div>
                            <div class="flex-between total-price">
                                <div class="addOn-button flex-row" :style="selectedRoom.AddOns.length <= 0 ? 'visibility: hidden': ''" @click="showAddOn(selectedRoom)">
                                    <div class="me-2 flex-row" style="align-items: center">
                                        <i class="fa fa-pencil me-1"/>
                                        <div>Add On</div>
                                    </div> 
                                    <div v-if="selectedRoom.BookDetailAddOns.length > 0" class="quantity">{{selectedRoom.BookDetailAddOns.length}}</div>
                                </div>
                                <div class="flex-row" style="cursor: pointer;" @click="selectedRoom.OpenDetail = !selectedRoom.OpenDetail">
                                    <div>IDR {{$helper.ConvertNumberFormat(selectedRoom.Total)}}</div>
                                    <i :class="selectedRoom.OpenDetail? 'fa fa-angle-up' :'fa fa-angle-down'" 
                                        style="cursor: pointer;
                                            align-content: center; 
                                            font-size: 20px; 
                                            margin-left: 16px" 
                                        />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="footer-section">
                    <Button buttonType="danger" v-if="cart.BookDetails.filter(data=> data.Checked).length > 0" 
                    :label="`Delete (${cart.BookDetails.filter(data=> data.Checked).length})`" iconFa="fa fa-trash"
                    style="width: 200px !important;" class="me-2"
                    @click="clearCart"/>

                    <div class="button-booking font-14" @click="openCheckOutModal">
                        <div>Total</div>
                        <div class="flex-row" style="align-items: center;">
                            <div class="me-3">IDR {{$helper.ConvertNumberFormat(cart.Total)}}</div>
                            <img style="height: 24px;width: 24px;" :src="$assets.icons.paperPlane">
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
        </div>
    </div>

    <Dialog
      class="dialog"
      modal
      header="Add-on"
      v-model:visible="showAddOnModal"
      :style="{ width: '50vw' }"
      :visible="visible"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
   >
        <div class="flex-row" style="margin-bottom: 34px">
            <img style="height: 80px; width: 80px; border-radius: 8px; margin-right: 16px;" :src="getImage(selectedCart)"/>
            <div>
                <div style="font-size: 16px;">{{selectedCart.Room.Code}}</div>
                <div style="font-size: 12px;" class="price">{{ $moment(selectedCart.CheckIn).format("ddd, DD MMM YYYY") }} - {{ $moment(selectedCart.CheckOut).format("ddd, DD MMM YYYY") }}</div>
                <div class="flex-row" style="margin-top: 10px">
                    <div class="flex-row" style="margin-right: 16px; align-items: center">
                        <img class="me-1" :src="$assets.icons.pax" style="height: 20px; width: 20px;"/>
                        <div class="font-12">{{selectedCart.Pax}} Guests</div>
                    </div>
                    <div class="flex-row" style="align-items: center">
                        <img class="me-1 font-12" :src="$assets.icons.roomSize" style="height: 20px; width: 20px;"/>
                        <div class="font-12">{{ selectedCart.Room.SizeRoom||'-' }} sqm</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="addOn-content-container">
            <div class="addOn-card-container">
                <div v-for="addOn in selectedCart.AddOns" :key="addOn" class="addOnCard">
                    <div class="flex-row" style="align-items: center;">
                        <CheckBox class="addOn-checkbox" v-model="addOn.Checked" :checked="addOn.Checked" @change="checkedAddOn(addOn)"/>
                        <div>
                            <div class="flex-row" style="align-items: center;">
                                <div class="me-1">{{addOn.Name}} - </div>
                                <div class="price font-14">IDR {{ $helper.ConvertNumberFormat(addOn.Price) }}</div>
                            </div>
                            <div class="font-12">{{addOn.Description||'-'}}</div>
                        </div>
                    </div>
                    <div class="addOnQuantity-container" v-if="addOn.Checked">
                        <div class="minButton" @click="decreaseAddOn(addOn)">-</div>
                        <input class="addOnQuantity" :max="addOn.MaxQuantity" type="number" v-model="addOn.Quantity" :readonly="true">
                        <div class="plusButton" @click="increaseAddOn(addOn)">+</div>
                    </div>
                </div>
            </div>
            <div style="flex-shrink: 1; margin-top: 20px;display: flex; align-self: end;">
                <Button label="Save" @click="updateAddOn" style="width: 82px !important"/>
            </div>
        </div>
   </Dialog>

   <Dialog 
      class="checkout-dialog"
      modal
      header="Add New Booking"
      v-model:visible="showCheckOutModal"
      :style="{ width: '70vw' }"
      :visible="visible"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
   >
    <div class="checkout-container">
        <b-row class="m-0 h-100">
            <b-col lg="6" class="p-0 side">
                <div class="checkout-data">
                    <div class="checkout-section font-h4">Guest Details</div>
                    <TextBox v-model="customer.Name" class="mt-3" label="Nama Lengkap (Sesuai KTP/Paspor)"/>
                    <SelectBox v-model="customer.UserId" :dataSource="members" class="mt-4" label="Membership" :required="false"/>
                    <TextBox v-model="customer.PhoneNumber" class="mt-4" type="phone" label="Nomor Ponsel (Whatsapp)" :mustStartWith="'+'" placeholder="+628xxxxx"/>
                    <TextBox v-model="customer.Email" class="mt-4" label="Alamat Email" type="email"/>
                    <div class="mt-4">
                        Konfirmasi pemesanan akan dikirimkan melalui Whatsapp dan Email. 
                        Pastikan nomor ponsel dan alamat email dalam kondisi aktif.
                    </div>

                    <div class="mt-4 checkout-section font-h4">Pembayaran</div>
                    <b-row class="mt-4" v-if="false">
                        <b-col>
                            <TextBox label="Voucher Code" :required="false" labelType="out" v-model="customer.PromoCode" @change="checkPromo()"/>
                            <div class="font-14" v-if="!$helper.IsEmpty(customer.PromoCode)">
                                <div v-if="isValidVoucher"><img/> Anda telah hemat {{  }}</div>
                                <div v-else-if="isValidVoucher == false" class="text-danger"> Voucher not found</div>
                            </div>
                        </b-col>
                        <b-col cols="auto" style="align-content: end">
                            <Button buttonType="secondary" label="Use" style="height: 42px;" @click="checkPromo()"/>
                        </b-col>
                    </b-row>
                    <b-row class="mt-4" v-if="false">
                        <b-col cols="auto"><CheckBox v-model="customer.UsePoint"/></b-col>
                        <b-col>
                            <div>Gunakan Poin</div>
                            <div class="font-12 font-disabled">Poin saat ini : {{  }}</div>
                            <b-row class="mt-3">
                                <b-col cols="6">
                                    <TextBox label="" labelType="out" :required="false"/>
                                </b-col>
                                <b-col cols="6">
                                    <div class="flex-row">Senilai : <div style="margin-left: 10px;font-weight: 500">IDR {{  }}</div></div>
                                </b-col>
                            </b-row>
                        </b-col>
                    </b-row>
                    <SelectModuleBox class="mt-4" label="Metode Pembayaran" :module="$module.paymentMethod" v-model="customer.PaymentMethodId"/>
                </div>
            </b-col>
            <b-col lg="6" class="p-0 side">
                <div class="selected-checkout-item-container">
                    <div style="flex-grow: 1; overflow: auto; margin-bottom: 20px">
                        <div class="font-h4 checkout-section mb-3">Book Details</div>
                        <div class="selected-room-card" v-for="selectedRoom in cart.BookDetails" :key="selectedRoom">
                            <div style="width: 100%;">
                                <div class="flex-between room-detail">
                                    <div class="flex-row">
                                        
                                        <img style="height: 80px; width: 80px; border-radius: 8px; margin-right: 16px;" :src="getImage(selectedRoom)"/>
                                        <div>
                                            <div style="font-size: 16px;">{{selectedRoom.Room.Code}}</div>
                                            <div style="font-size: 12px;" class="price">IDR {{ $helper.ConvertNumberFormat(selectedRoom.PricePerNight) }} /night</div>
                                            <div class="flex-row" style="margin-top: 10px">
                                                <div class="flex-row" style="margin-right: 16px; align-items: center">
                                                    <img class="me-1" :src="$assets.icons.pax" style="height: 20px; width: 20px;"/>
                                                    <div class="font-12">{{selectedRoom.Room?.Pax}}</div>
                                                </div>
                                                <div class="flex-row" style="align-items: center">
                                                    <img class="me-1 font-12" :src="$assets.icons.roomSize" style="height: 20px; width: 20px;"/>
                                                    <div class="font-12">{{ selectedRoom.Room.SizeRoom||'-' }}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="flex-row" style="align-items: center;">
                                        <div style="margin-right: 16px">{{selectedRoom.Pax}} Pax</div>
                                        <i :class="selectedRoom.OpenDetailCheckOut? 'fa fa-angle-up' :'fa fa-angle-down'" 
                                            @click="selectedRoom.OpenDetailCheckOut = !selectedRoom.OpenDetailCheckOut"
                                            style="cursor: pointer;
                                                align-content: center; 
                                                font-size: 20px; 
                                                margin-left: 16px" 
                                            />
                                    </div>
                                </div>
                                <div class="price-detail font-14" v-if="selectedRoom.OpenDetailCheckOut">
                                    <div>
                                        <div>IDR {{ $helper.ConvertNumberFormat(selectedRoom.PricePerNight) }} x {{ selectedRoom.TotalNights }} night</div>
                                        <div>Deposit</div>
                                        <div v-for="charge in selectedRoom.BookDetailCharges" :key="charge">{{ charge.Name }}</div>
                                        <div>Add-on</div>
                                        <div class="ps-3" v-for="addOn in selectedRoom.BookDetailAddOns" :key="addOn">{{ addOn.Name }}</div>
                                    </div>
                                    <div style="text-align: right;">
                                        <div>IDR {{ $helper.ConvertNumberFormat(selectedRoom.SubTotal) }}</div>
                                        <div>IDR {{ $helper.ConvertNumberFormat(selectedRoom.BookDetailDeposit.Total) }}</div>
                                        <div v-for="charge in selectedRoom.BookDetailCharges" :key="charge">IDR {{ $helper.ConvertNumberFormat(charge.Total) }} </div>
                                        <div style="height: 26px"></div>
                                        <div v-for="addOn in selectedRoom.BookDetailAddOns" :key="addOn">IDR {{ $helper.ConvertNumberFormat(addOn.Total) }}</div>
                                    </div>
                                </div>
                                <div class="flex-between total-price font-body">
                                    <div>Sub Total</div>
                                    <div class="flex-row" style="cursor: pointer;">
                                        <div>IDR {{$helper.ConvertNumberFormat(selectedRoom.Total)}}</div>
                                        <!-- <i :class="selectedRoom.OpenDetail? 'fa fa-angle-up' :'fa fa-angle-down'" 
                                            style="cursor: pointer;
                                                align-content: center; 
                                                font-size: 20px; 
                                                margin-left: 16px" 
                                            /> -->
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style="flex-shrink: 1;
                        width: 100%;">
                        <div class="flex-between price mb-2">
                            <div>Total</div>
                            <div>IDR {{$helper.ConvertNumberFormat(cart.Total)}}</div>
                        </div>
                        <Button label="Book Now" :disabled="!canCheckOut" @click="doCheckout()" />

                        <!-- <div class="button-booking font-14" @click="openCheckOutModal">
                            <div>Total</div>
                            <div class="flex-row" style="align-items: center;">
                                <div class="me-3">IDR {{$helper.ConvertNumberFormat(cart.Total)}}</div>
                                <img style="height: 24px;width: 24px;" :src="$assets.icons.paperPlane">
                            </div>
                        </div> -->
                    </div>
                </div>
            </b-col>
        </b-row>
    </div>
   </Dialog>
</div>

    
</template>

<script>
import Dialog from "primevue/dialog";
import constant from '../../constant/constant'
import module from '../../constant/module'
import { mapActions } from 'vuex';

export default{
  components:{Dialog},
  created () {
  },
  props: {
  },
  data () {
    return {
        selectedRooms: [],
        customer:{
            Name:null,
            UserId:null,
            PhoneNumber:null,
            Email:null,
            PaymentMethodId:null,
            UsePoint: false
        },
        showAddOnModal: false,
        showCheckOutModal : false,

        monthly: false,
        orderTypes:
        [
            { Id: false, Name: "Daily" },
            { Id: true, Name: "Monthly" },
        ],

        filter:{
            PropertyId: null,
            FromDate: null,
            ToDate: null,
            RoomTypeId: null,
            Month: 1, 
        },
        roomTypes:[],
        roomAvailabilities:[],
        rooms:[],
        currentProperty: null,
        properties:[],

        imageInterval: 0,

        cart: null,
        selectedCart: null,
        hasGetCart: false,
        isValidVoucher: null,
        onTypingVoucher: null,
        members:[],
        openCart : false
    }
  },
  async created () {
    this.properties = await this.$store.dispatch(`property/getAll`);
    this.members = await this.$store.dispatch(`user/getAllMember`);
    
  },
  computed: {
    canCheckOut(){
        console.log("trigger")
        return !this.$helper.IsEmpty(this.customer.Name) && 
               !this.$helper.IsEmpty(this.customer.PhoneNumber) && 
               !this.$helper.IsEmpty(this.customer.Email) && 
               this.customer.PaymentMethodId
    }
  },
  watch: {
    'customer.UserId':{
        immediate: true,
        handler(newVal){
            const member = this.members.find(data=>data.Id == newVal)
            if(member){
                this.customer = Object.assign(this.customer, member)
            }
            else{
                this.customer = Object.assign(this.customer, 
                {
                    Name:null,
                    PhoneNumber:null,
                    Email:null,
                })
            }
        }
    },
    showAddOnModal:{
        handler(newVal){
            console.log(newVal)
            if(!newVal){
                this.selectedCart = null
            }
            console.log(this.selectedCart)
        }
    },
    "filter.PropertyId": {
        immediate: true,
        async handler(newVal, prevVal) {
            if(newVal){
                this.roomTypes = await this.$store.dispatch(`roomTypePrice/getAll`, {propertyId: newVal});

                if(!prevVal && this.cart){
                    this.filter.RoomTypeId = this.cart.BookDetails[0].RoomTypeId
                }
                else{
                    this.filter.RoomTypeId =  null;
                }

                this.currentProperty = this.properties.find(data=> data.Id == newVal)
                
                this.rooms = []
                this.selectedRooms = []
                await this.checkAvaibility()   
            }
        }
    },
    'filter.RoomTypeId':{ immediate: true,
        async handler(newVal) {
            if(newVal){
                if(this.filter.PropertyId && this.filter.RoomTypeId){
                    this.rooms = await this.$store.dispatch(`roomPrice/getAll`, 
                    {
                        propertyId: this.filter.PropertyId,
                        roomTypeId: newVal
                    });
                }
                await this.checkAvaibility()
                if(this.rooms.length > 0 && this.cart && this.cart.BookDetails.length > 0){
                    this.rooms = this.rooms.map(data=> Object.assign(data, {Selected : this.cart.BookDetails.find(bo=> bo.RoomId == data.Id && bo.RoomTypeId == data.RoomTypeId)}))
                }
            }
        }
    },
    'filter.FromDate':{
        immediate: true,
        async handler(newVal) {
            if(newVal){ 
                if(this.monthly){
                    this.filter.ToDate = new Date(
                        this.$moment(newVal).add('days', this.filter.Month * 30)
                    )
                }
                if(!this.filter.ToDate || this.filter.ToDate <= newVal){
                    this.filter.ToDate = new Date(
                        this.$moment(newVal).add(1, 'days')
                    )
                }
                await this.checkAvaibility()
            }
        }
    },
    'filter.Month':{
        immediate: true,
        async handler(newVal) {
            if(newVal && this.monthly && this.filter.FromDate){ 
                this.filter.ToDate = new Date(
                    this.$moment(this.filter.FromDate).add('days', this.filter.Month * 30)
                )
            }
            await this.checkAvaibility()
        }
    },
    monthly:{
        immediate: true,
        async handler(newVal) {
            if(this.monthly && this.filter.FromDate && this.filter.Month > 0){ 
                this.filter.ToDate = new Date(
                    this.$moment(this.filter.FromDate).add('days', this.filter.Month * 30)
                )
            }
            await this.checkAvaibility()
        }
    },
    'filter.ToDate':{
        immediate: true,
        async handler(newVal) {
            await this.checkAvaibility()
        }
    },
    imageInterval:{
        immediate: true,
        async handler(newVal) {
            if(newVal){ this.checkAvaibility()}
        }
    }
  },
  async mounted(){
    await this.refreshCart()
    if(this.cart){
        this.$nextTick(async ()=>{
            this.filter.FromDate = new Date(this.cart.CheckInDate)
            this.filter.ToDate = new Date(this.cart.CheckOutDate)
            this.filter.PropertyId = this.cart.PropertyId
            
            this.filter.RoomTypeId = this.cart.BookDetails[0].RoomTypeId

            this.rooms = await this.$store.dispatch(`roomPrice/getAll`, 
            {
                propertyId: this.filter.PropertyId,
                roomTypeId: this.filter.RoomTypeId
            });
            this.rooms = this.rooms.map(data=> Object.assign(data, {Selected : this.cart.BookDetails.find(bo=> bo.RoomId == data.Id && bo.RoomTypeId == data.RoomTypeId)}))
            console.log(this.rooms)
            this.checkAvaibility()
            // await this.refreshCart()
        })
    }
  },
  methods: {
    async doCheckout(){
        this.checkout(Object.assign(this.customer, {
            CartId : this.cart.Id,
            Period: this.cart.Period,
        }))
        .then(async(res)=> {
            this.$showToast.success("Berhasil", "Berhasil membuat pesanan")
            this.showCheckOutModal = false;
            await this.refreshCart()
        })
        .catch(err=> this.$showToast.error("Gagal membuat Booking", err))
    },
    checkPromo(){
        clearTimeout(this.onTypingVoucher); 
        // if(this.customer.PromoCode)
        
        this.onTypingVoucher = setTimeout(() => {
            if(this.$helper.IsEmpty(this.customer.PromoCode)){
                this.isValidVoucher = null
                return
            }

            this.isValidVoucher = false
        }, 1000);
    },
    openCheckOutModal(){
        this.showCheckOutModal = true;
    },
    async clearCart(){
        var confirm = await this.$dialog.Confirmation.confirm({
            title: "Action Confirmation",
            message: "Are you sure you want to delete this item?",
        });
        if (!confirm) return

        var deletes = this.cart.BookDetails.filter(data=> data.Checked).map(data=> data.Id)

        for (let index = 0; index < deletes.length; index++) {
            const id = deletes[index];
            await this.removeCartDetail(id)
        }
        await this.refreshCart()
    },
    async updateAddOn(){
        await this.updateCartDetail({
            CartDetailId : this.selectedCart.Id,
            RoomAddOns: this.selectedCart.AddOns.filter(data=> data.Checked)
        })
        await this.refreshCart()
        this.showAddOnModal = false
    },
    decreaseAddOn(addOn){
        if(addOn > 1){
            addOn.Quantity -= 1
        }
        else{
            addOn.Quantity = 0
            addOn.Checked = false
        }
    },
    increaseAddOn(addOn){
        if(addOn < addOn.MaxQuantity){
            addOn.Quantity += 1
        }
    },
    checkedAddOn(addOn){
        if(addOn.Checked){
            addOn.Quantity = 1
        }
        else{
            addOn.Quantity = 0
        }
    },
    ...mapActions(module.booking.name, [
        "getCart", "addCart", "addRoomToCart", "updateCartDetail", "removeCartDetail", "checkout"
    ]),
    getMinDate(){
        if(this.filter.FromDate){
            return new Date(this.$moment(this.filter.FromDate).add(1, 'days'))
        }
        return this.filter.FromDate
    },
    async checkAvaibility(){
        this.$nextTick(async ()=>{
            if(!this.filter.PropertyId || !this.filter.RoomTypeId || !this.filter.FromDate || !this.filter.ToDate)
                return
 
            if(this.filter.FromDate && this.filter.ToDate && this.currentProperty){
                this.roomAvailabilities = await this.$store.dispatch(
                    `roomAvailability/check`, {
                        page:1,
                        isFromAdmin: true,
                        limit: 10000,
                        period: this.monthly ? 2 : 1,
                        checkIn: this.$moment(this.filter.FromDate).format("YYYY-MM-DD"),
                        checkOut:this.$moment(this.filter.ToDate).format("YYYY-MM-DD"),
                        propertyId: this.filter.PropertyId,
                });
                var availables = this.rooms.filter(data=>  this.roomAvailabilities.find(ava=> ava.RoomId == data.Id)).map(data=> 
                    Object.assign(data, {Available : this.roomAvailabilities.find(ava=> ava.RoomId == data.Id)})
                )
                var notAvailables = this.rooms.filter(data=>  !this.roomAvailabilities.find(ava=> ava.RoomId == data.Id))

                this.rooms = [...availables, ...notAvailables]

            }
        })
    },
    getAvailableRoom(){
        return []
    },
    getImage(room){
        var image = room.RoomImages && room.RoomImages.length > 0 ?
                    room.RoomImages[0].ImageId :
                    room.Available && room.Available.Images.length > 0 ?
                    room.Available.Images[0].ImageId :
                    room.Images && room.Images.length > 0 ? 
                    room.Images[0].ImageId : null
        if(!image) {
            return ''
        }

        return `${constant.apiURL}/image/${image}`
    },
    async refreshCart(){
        this.cart = (await this.getCart())
        if(this.cart){
            if(!this.filter.RoomTypeId){
                this.filter.RoomTypeId = this.cart.BookDetails[0].RoomTypeId
            }
            if(this.rooms.length > 0 && this.cart.BookDetails.length > 0){
                this.rooms = this.rooms.map(data=> Object.assign(data, {Selected : this.cart.BookDetails.find(bo=> bo.RoomId == data.Id && bo.RoomTypeId == data.RoomTypeId)}))
            }
            this.cart.BookDetails.forEach(cart => {
                if(cart.AddOns.length > 0){
                    cart.AddOns = cart.AddOns.map(data=> {
                        let existAddOn = cart.BookDetailAddOns.find(ao => ao.RoomAddOnId == data.RoomAddOnId)
                        if(existAddOn){
                            data.Checked = true,
                            data.Quantity = existAddOn.Quantity
                        }
                        return data
                    })
                }
            });
        }
        else{
            this.rooms = this.rooms.map(data=> Object.assign(data, {Selected : false}))
        }
    },
    showAddOn(roomCart){
        this.selectedCart = JSON.parse(JSON.stringify(roomCart));
        this.showAddOnModal = true
    },
    
    async selectRoom(room){
        if(!room.Available) return
        if(this.cart && room.PropertyId != this.cart.PropertyId){
            var confirm = await this.$dialog.Confirmation.confirm({
                title: "Pilih dari properti yang berbeda?",
                message: "Data booking yang sudah kamu pilih pada properti sebelumnya akan dihapus",
            });
            if (!confirm) return

            this.cart = null
        }

        var exist = this.cart && this.cart.BookDetails.find(data=> data.RoomId == room.Id && data.RoomTypeId == room.RoomTypeId)
        if(exist) return
        
        if(!this.cart){
            try{
                await this.addCart({
                    CheckIn: this.$moment(this.filter.FromDate).format("YYYY-MM-DD"),
                    CheckOut:this.$moment(this.filter.ToDate).format("YYYY-MM-DD"),
                    Pax: room.Pax,
                    RoomTypeId : room.RoomTypeId,
                    RoomId: room.Id,
                    Period: this.monthly ? 2 : 1,
                })
            }
            catch(err){
                this.$showToast.error(`Failed`,err);
            }
        }
        else{
            try{
                await this.addRoomToCart({
                    BookingId: this.cart.Id,
                    Pax: room.Pax,
                    RoomTypeId : room.RoomTypeId,
                    RoomId: room.Id,
                    Period: this.monthly ? 2 : 1,
                })
            }
            catch(err){
                this.$showToast.error(`Failed`,err);
            }
        }
        await this.refreshCart()
    }
  },
}
</script>

<style>
.addOn-content-container{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    max-height: 50vh;
    overflow: hidden;
}
.addOn-card-container{
    flex-grow: 1;
    overflow: auto;
}
.addOn-checkbox{
    margin-right: 20px; 
}
.addOn-checkbox .p-checkbox-input{
    width: 32px !important; 
    height: 32px !important;
}
.minButton, .plusButton{
    width: 40px;
    height: 40px;
    color: var(--blue-500);
    border-radius: 8px;
    border: 1px solid var(--blue-500);
    align-content: center;
    cursor: pointer;
}
.addOnQuantity{
    width: 56px;
    height: 56px;
    margin: 0 16px;
    border: 1px solid var(--grey-900);
    padding: 16px;
    justify-items: center;
    border-radius: 8px;
}
.addOnQuantity-container{
    display: flex;
    align-items: center;
    text-align: center
}
.addOnCard{
    border: 1px solid var(--grey-600);
    border-radius: 8px;
    padding: 16px;
    background: var(--grey-50);
    display: flex;
    align-items: center;
    height: 90px;
    justify-content: space-between;
}
.text-grey{
    color: var(--grey-800);
}
.filter-container{
    padding: 20px 24px;
    background: white;
    border-radius: 8px;
    margin-bottom: 8px;
    /* height: 106px; */
}
.content-container{
    display: flex;
    width: 100%;
    height: calc(100% - 114px);
}
.filter-result-container{
    padding: 24px;
    background: white;
    border-radius: 8px;
    width: 100%;
    overflow: auto;
}
.selected-container{
    padding: 24px;
    background: white;
    border-radius: 8px;
    min-width: 528px;
    max-width: 528px;
    margin-left: 16px;
}
.room-container{
    margin-top: 16px;
}
.room-card{
    display: flex;
    padding: 20px;
    border: 1px solid var(--grey-900);
    border-radius: 8px;
    height: 120px;
}
.room-card.available{
    cursor: pointer;
}
.room-card.notAvailable{
    filter: opacity(0.5);
    border: 1px solid var(--grey-600) !important;
}
.room-card.selected{
    border: 2px solid var(--blue-500) !important;
    cursor: default !important;
}
.room-container{
    display: grid;
   gap: 20px;
   grid-template-columns: repeat(auto-fit, 244px);
}
.selected-room-card input{
    width: 56px;
    height: 56px;
    border: 1px solid var(--grey-900);
    border-radius: 8px;
    justify-items: center;
}
.selected-room-card{
    padding: 16px;
    border-radius: 8px;
    border: 1px solid var(--grey-600);
    margin-bottom: 14px;
    display: flex;
}
.price{
    color: var(--blue-500);
}
.flex-between{
    display: flex; justify-content: space-between; width: 100%;
}

.room-detail{
    display: flex;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--grey-600);
}
.price-detail{
    border-bottom: 1px solid var(--grey-600);
    margin: 16px 0;
    display: flex;
    width: 100%;
    justify-content: space-between;
    color: var(--grey-800);
    line-height: 26px;
}
.total-price{
    margin-top: 16px;
}
.addOn-button{
    cursor: pointer;
    color: var(--blue-500);
}
.addOn-button .quantity{
    color: white;
    background: blue;
    height: 24px;
    width: 24px;
    text-align: center;
    border-radius: 50%;
}
.footer-section{
    display: flex;
    flex-shrink: 1;
    width: 100%;
}
.button-booking{
    border-radius: 8px;
    background: var(--blue-500);
    padding: 16px;
    display: flex;
    width: 100%;
    justify-content: space-between;
    color: white;
    align-items: center;
    cursor: pointer;
}
.selected-item-container{
    margin-top: 40px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: calc(100% - 64px);
    overflow: hidden;
}
.selected-checkout-item-container{
    border-left: 4px solid var(--grey-600);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    overflow: hidden;
    padding-top: 20px;
    padding-bottom: 40px;
    padding-left: 32px;
}
.checkout-dialog .p-dialog-content{
    overflow: hidden;
    border-top: 1px solid var(--grey-800);
    margin: 0px 40px;
    max-height: 90vh;
    height: 80vh !important;
    padding: 0 !important;
}
.checkout-container{
    overflow: auto;
    height: 100%;
}
.checkout-data{
    padding-top: 20px;
    padding-bottom: 40px;
    padding-right: 32px;
    height: calc(100% - 40px);
}
.checkout-section{
    padding-bottom: 8px;
    border-bottom: 1px solid var(--grey-600);
}
.checkout-container .side{
    height: 100%;
}
.cart-mobile{
    display: none;
}
.cart-icon{
    width: 80px;
    padding: 12px;
    border-radius: 50%;
    background: var(--blue-500);
    text-align: center;
    position: fixed;
    right: 24px;
    bottom: 24px;
    height: 80px;
    color: white;
   box-shadow: 2px 2px 8px -1px var(--grey-900);
}
.cart-icon i{
    font-size: 28px;
}
.selected-container-mobile{
    height: calc(100% - 145px);
    position: fixed;
    top: 145px;
    z-index: 99;
    background: white;
    width: 100%;
    left: 0;
    padding: 20px;
    padding-bottom: 36px;
   box-shadow: 0px 0px 20px 0px var(--grey-700);
}
.icon-close-cart{
    width: 32px;
    height: 32px;
    font-size: 24px;
    font-weight: 200;
    color: white;
    border-radius: 50%;
    text-align: center;
    align-content: center;
    position: absolute;
    right: 12px;
    top: 10px;
    background: var(--blue-500);
}
@media screen and (max-width: 900px) {
    .cart-mobile{
       display: block;
    }
    .selected-container{
        display: none;
    }
    .checkout-dialog .p-dialog-content{
        margin: 12px;
    }
    .filter-result-container{
        padding: 12px !important;
    }
    .checkout-container .side{
        height: auto;
    }
    .selected-checkout-item-container, .checkout-data{
        border: 0;
        padding: 20px 0;
    }

    .content-container{
        flex-direction: column;
        height: calc(100% - 180px);
    }

    .selected-container{
        max-width: 100%;
        min-width: 100%;
        margin: 20px 0;
        padding: 12px !important;
    }

    .room-container{
        grid-template-columns: repeat(auto-fit, 100%) !important;
    }

}
</style>