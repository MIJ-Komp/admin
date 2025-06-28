import { TTLockRecordStatus } from "./enums/TTLockRecordStatus";
import helper from './helper.js'
import moment from 'moment'

const columns = {
   addOn: [
      { headerName: "Name", field: "Name" },
      {
         headerName: "Price",
         field: "Price",
         valueFormatter: (params) => {
            if(params.data){
               return `Rp ${helper.ConvertNumberFormat(params.data.Price)}`;
            }
         },
      },
      {
         headerName: "Quantity",
         field: "Quantity",
         valueFormatter: (params) => {
            if(params.data){
               return helper.ConvertNumberFormat(params.data.Quantity);
            }
         },
      },
      { headerName: "Description", field: "Description" },
   ],
   productVariant: [
      { headerName: "Id", field: "id" },
      { headerName: "Name", field: "name" },
   ],
   deviceGateway: [
      { headerName: "Nama", field: "name" },
      { headerName: "Deskripsi", field: "description" },
   ],
   deviceLock: [
      { headerName: "Device Name", field: "Alias" },
      { headerName: "Name", field: "Name" },
      { headerName: "Lock Id", field: "TTLockId" },
   ],
   paymentMethod: [
      { headerName: "Nama", field: "Name" },
      { headerName: "Kode", field: "Code" },
      { headerName: "Posisi", field: "Posisi" },
      { headerName: "Akti", field: "IsActive" },
   ],
   paymentType: [{ headerName: "Name", field: "name" }],
   paymentHistory: [
      { headerName: "Status", field: "StatusText" },
      { headerName: "Booking ID", field: "Id" },
      { headerName: "Nama Pemesan", field: "OrderByName" },
      { headerName: "Nomor Hp", field: "Payment.GuestPhoneNumber" },
      { headerName: "Email", field: "Payment.GuestEmail" },
      { headerName: "Kode Kamar", field: "Code" },
      { headerName: "Property", field: "PropertyName" },
      { headerName: "Tanggal Pemesanan", field: "Payment.CreatedOn" },
      { headerName: "Tanggal Check In", field: "CheckInDate" },
      { headerName: "Tanggal Check Out", field: "CheckOutDate" },
      {
         headerName: "Poin yang digunakan",
         field: "UsedPoint",
         valueFormatter: () => {
            return 0;
         },
      },
      { headerName: "Sub Total", field: "SubTotal",
         valueFormatter: (params) => {
            if(params.data){
               return `Rp ${helper.ConvertNumberFormat(params.data.Total)}`;
            }
         },
       },
      { headerName: "Diskon", field: "Discount" ,
         valueFormatter: (params) => {
            if(params.data){
               return `Rp ${helper.ConvertNumberFormat(params.data.Discount)}`;
            }
         },
      },
      { headerName: "Total", field: "Total", 
         valueFormatter: (params) => {
            if(params.data){
               return `Rp ${helper.ConvertNumberFormat(params.data.Total)}`;
            }
         },
       },
      {
         headerName: "Metode Pembayaran",
         field: "PaymentMethodName",
      },
      {
         headerName: "Dibuat Oleh Admin",
         field: "CreatedByAdminName",
      },
      
      // {
      //    headerName: "Status",
      //    field: "Status",
      //    valueFormatter: (params) => {
      //       switch (params.data.Status) {
      //          case 1: {
      //             return "Pending";
      //          }
      //          case 2: {
      //             return "Paid";
      //          }
      //          case 3: {
      //             return "Expired";
      //          }
      //          default: {
      //             return "Failed";
      //          }
      //       }
      //    },
      // },
   ],
   property: [
      { headerName: "Nama Properti", field: "Name" },
      { headerName: "Tipe", field: "PropertyTypeName" },
      { headerName: "Harga Berdasarkan Tipe Kamar", field: "SetByRoomType" },
      { headerName: "Alamat", field: "Address" },
      { headerName: "Status", field: "Status" },
      { headerName: "Deskripsi", field: "Description" },

      // { headerName: "Jumlah Kamar", field: "RoomCount" },
      // { headerName: "Kota", field: "city" },
      // { headerName: "Created By", field: "CreatedByName" },
   ],
   product: [
      { headerName: "Name", field: "name" },
      { headerName: "Description", field: "description" },
   ],
   productCategory: [
      { headerName: "Id", field: "id" },
      { headerName: "Name", field: "name" },
      { headerName: "ParentId", field: "parentId" },
   ],
   componentType: [
      { headerName: "Id", field: "id" },
      { headerName: "Name", field: "name" },
      { headerName: "Code", field: "code" },
   ],
   compatibleRule: [
      { headerName: "Id", field: "id" },
      { headerName: "Name", field: "name" },
   ],
   role: [
      { headerName: "Role Name", field: "Name" },
      {
         headerName: "Access Level",
         field: "Level",
         cellStyle: { "text-align": "center" },
      },
   ],
   productBundle: [
      { headerName: "Name", field: "Name" },
      { headerName: "Description", field: "Description" },
   ],
   user: [
      { headerName: "Name", field: "Name" },
      { headerName: "Email", field: "Email" },
      { headerName: "Phone Number", field: "PhoneNumber" },
      // { headerName: "Role", field:'role'  },
      // { headerName: "Last Active", field:'lastActive'  },
      // { headerName: "Status", field:'sttaus'  },
   ],
   member: [
      { headerName: "Name", field: "Name" },
      { headerName: "Email", field: "Email" },
      { headerName: "Phone Number", field: "PhoneNumber" },
      { headerName: "Birth Date", field: "BirthDate" },
      { headerName: "Email is Verified?", field: "VerifiedEmail" },
      { headerName: "Phone Number is Verified?", field: "VerifiedPhoneNumber" },
   ],

   roomTypePrice: [
      { headerName: "Name", field: "Name" },
      { headerName: "Property", field: "PropertyName" },
      { headerName: "Nama pada Website", field: "AliasName" },
      { headerName: "Jumlah Kamar", field: "AmountRoom" },
   ],
   roomTypeNoPrice: [
      { headerName: "Name", field: "Name" },
      { headerName: "Property", field: "PropertyName" },
      { headerName: "Jumlah Kamar", field: "AmountRoom" },
   ],

   roomNoPrice: [
      { headerName: "Name", field: "Name" },
      { headerName: "Kode Kamar", field: "Code" },

      { headerName: "Property", field: "PropertyName" },
      { headerName: "Room Type", field: "RoomTypeName" },
      { headerName: "Lock", field: "TTLockName" },
      {
         headerName: "Status",
         field: "Status",
         valueFormatter: (params) => {
            if(params.data){
               return params.data.RoomStatuses.reduce((old, curr) => {
                  return new Date(curr.CreatedOn) > new Date(old.CreatedOn)
                     ? curr
                     : old;
               }).StatusName;
            }
         },
      },
   ],
   roomPrice: [
      { headerName: "Name", field: "Name" },
      { headerName: "Kode Kamar", field: "Code" },
      { headerName: "Property", field: "PropertyName" },
      { headerName: "Room Type", field: "RoomTypeName" },
      {
         headerName: "Lock",
         field: "TTLockName",
      },
      {
         headerName: "Range Harga",
         field: "PriceRange",
         valueFormatter: (params) => {
            if(params.data){
               var priceRange = "Rp 0 - 1000";
               return priceRange;
            }
         },
      },
      {
         headerName: "Status",
         field: "Status",
         valueFormatter: (params) => {
            if(params.data){
               return params.data.RoomStatuses.reduce((old, curr) => {
                  return new Date(curr.CreatedOn) > new Date(old.CreatedOn)
                     ? curr
                     : old;
               }).StatusName;
            }
         },
      },
   ],
   room: [
      { headerName: "Room Status", field: "StatusName" },
      { headerName: "Room", field: "Name" },
      { headerName: "Room Code", field: "Code" },
      { headerName: "Pax", field: "Pax" },
      { headerName: "Check-In Schedule", field: "CheckIn" },
      { headerName: "Check-Out Schedule", field: "CheckOut" },
      { headerName: "Checked-In At", field: "CheckedIn" },
   ],

   roomStatusHistory: [
      { headerName: "Room", field: "Room.Name" },
      { headerName: "Status", field: "StatusName" },

      { headerName: "Date", field: "Date",rowGroup : true, sort: "desc"},
      { headerName: "Status On", field:"CreatedOn", sort: "desc",
         valueFormatter: (params) => {
            if(params.data){
               return moment(params.data.CreatedOn).format("HH:mm:ss")
            }
         },
      },
      
      { headerName: "Deskripsi", field: "Description" },
      { headerName: "CreatedBy", field: "CreatedByName" },
   ],
   roomLockHistory: [
      { headerName: "Date", field: "CreatedOn" },
      { headerName: "User", field: "ReferenceId" },
      {
         headerName: "Access Method",
         field: "Type",
         valueFormatter: (params) => {
            if(params.data){
               return TTLockRecordStatus.find(
                  (tlrs) => tlrs.id == params.data.Type
               ).name;
            }
         },
      },
   ],
   transaction: [
      { headerName: "Booking Id", field: "BookingId" },
      { headerName: "Nama Pemesan", field: "User" },
      { headerName: "Kode Kamar", field: "RoomCode" },
      { headerName: "Properti", field: "RoomCode" },
      { headerName: "Tanggal Pemesanan", field: "RoomCode" },
      { headerName: "Tanggal Check-in", field: "RoomCode" },
      { headerName: "Tanggal Check-out", field: "RoomCode" },
      { headerName: "Poin yang digunakan", field: "RoomCode" },
      { headerName: "Sub Total", field: "RoomCode" },
      { headerName: "Diskon", field: "RoomCode" },
      { headerName: "Total", field: "RoomCode" },
      { headerName: "Metode Pembayaran", field: "RoomCode" },
      { headerName: "Status", field: "RoomCode" },
   ],

   cleaningHistories:[
      { headerName: "Properti", field: "PropertyName", rowGroup: true },
      { headerName: "Room", field: "RoomName", rowGroup: true},
      { headerName: "Status", field: "StatusName" },
      { headerName: "Start Cleaning", field: "StartCleaningOn" },
      { headerName: "End Cleaning", field: "EndCleaningOn", valueFormatter: (params) => {
         if(params.data){
            return params.data.EndCleaningOn || 'On Progress' 
         }
      }, },
      { headerName: 'Total Duration', field:'TotalDuration'},
      {
         headerName: 'Session',
         field:'CleaningSessions',
         children: [
               { headerName: 'Assign', field: 'AssignOn' },
               { headerName: 'Start / OnProgress', field: 'ProgressOn' },
               { headerName: 'Finish', field: 'CompleteOn' },
         ]
      }
   ],
   generatePin:[
      { headerName: "Name", field: "Name" },
      { headerName: "Interval Generate(day)", field: "GenerateEvery" },
      { headerName: "Generate Pada", field: "GenerateOn" },
      { headerName: "Role Name", field: "RoleName" },
      { headerName: "Start Date", field: "StartDate" },
      { headerName: "End Date", field: "EndDate" },
      { headerName: "Start Time", field: "StartTime" },
      { headerName: "End Time", field: "EndTime" },
   ],
   manualPin:[
      { headerName: "Name", field: "Name" },
      { headerName: "Room", field: "RoomName" },
      { headerName: "PIN", field: "PIN" },
      { headerName: "Start Date", field: "StartDate" },
      { headerName: "End Date", field: "EndDate" },
      { headerName: "Start Time", field: "StartTime" },
      { headerName: "End Time", field: "EndTime" },
   ],
   referral:[
      { headerName: "Referrer", field: "SuperAdminName", rowGroup: true,
         valueFormatter: (params) => {
            if(params.data){
               return `${params.data.AdminName} (${params.data.Code})`;
            }
         },
      },
      { headerName: "Referred Agent", field: "UserName", rowGroup: true},
      { headerName: "Commission", field: "TotalCommission",
         valueFormatter: (params) => {
            if(params.data){
               return `Rp ${helper.ConvertNumberFormat(params.data.TotalCommission)}`;
            }
         },
      },
      { headerName: "Last Updated On", field: "CreatedOn" },
   ],
};
export default columns;
