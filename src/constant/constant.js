
const constant = {
   // apiURL: "https://devapich.pasifiksgroup.com:8443",
   apiURL: "https://12ab882d-51ca-45eb-8fc0-a6c7b2e215c3-00-1f1m8yy73c66d.sisko.replit.dev/api",
   // apiURL: "http://localhost:5000/api",
   baseURL: "https://admin.cloudhomes.id",
   Label: {
      EN: {
         menu: {
            dashboard: "Dashboard",
            property: "Manage Property",
            transaction: "Transaction",
            report: "Report",
            user: "User",
            member: "Member List",
            userList: "Admin",
            calendar: "Calendar",

            //catalog
            catalog: "Catalog",
            productCategory: "Product Category",
            product: "Product",
            productBundle: "Product Bundle",
            propertyList: "Property List",
            productVariant: "Product Variant",
            menu: "Menu",

            //property management
            room: "Room",
            changeStatus: "Change Status",
            roomTypePrice: "Room Type",
            roomTypeNoPrice: "Room Type",
            roomPrice: "View Room",
            roomNoPrice: "Room",

            booking: "Manual Booking",

            //payment
            payment: "Payment",
            paymentType: "Payment Type",
            paymentMethod: "Payment Method",
            paymentHistory: "Payment History",

            manualBooking: "Manual Booking",

            device: "Device",
            deviceLock: "Lock",
            deviceGateway: "Gateway",
            manualPin: "Manual Pin",

            role: "Role",

            cleaning: "Cleaning",
            cleaningSession: "Cleaning Session",
            cleaningHistories: "Cleaning Histories",

            setting: "Setting",
            generatePin: "Auto Generate Pin",

            occupiedRoom: "Occupied Room",

            referral: "Referral",
         },
         searchBar: {
            label: "What are you looking for?",
            placeHolder: "Search...",
            addButton: "+ Add",
         },
         error: {
            required: "Can not be empty",
            email: "Email '{value}' is not valid",
            minLength: "Must be at least {value} characters",
            maxLength: "Maximum only {value} characters",

            min: "Must greater than or Equals to {value}",
            max: "Must less than or Equals to {value}",
         },
         action: {
            create: "Add New",
            update: "Update",
            delete: "Delete",
            view: "View",
            edit: "View/Edit",
         },
      },
      ID: {
         menu: {
            dashboard: "Dashboard",
            property: "Manajemen Properti",
            transaction: "Transaksi",
            report: "Laporan",
            user: "User",
            calendar: "Kalender",

            device: "Perangkat",
            deviceLock: "Kunci",
            deviceGateway: "Gateway",
            manualPin: "Manual Pin",

            //Catalog
            catalog: "Katalog",
            productCategory: "Kategori Produk",
            product: "Produk",
            productBundle: "Paket Produk",
            propertyList: "Daftar Properti",
            productVariant: "Variasi Produk",
            menu: "Menu",

            manualBooking: "Booking Manual",

            //property management
            room: "Ruangan",
            changeStatus: "Mengubah Status",
            roomTypePrice: "Tipe Ruangan dengan Harga",
            roomTypeNoPrice: "Tipe Ruangan tanpa Harga",

            booking: "Booking Manual",

            payment: "Pembayaran",
            paymentType: "Tipe Pembayaran",
            paymentMethod: "Metode Pembayaran",

            role: "Hak Akses",
            cleaning: "Cleaning",
            cleaningSession: "Cleaning Session",
            cleaningHistories: "Cleaning Histories",

            setting: "Pengaturan",
            generatePin: "Generate Pin",

            occupiedRoom: "Kamar Terisi",

            referral: "Referral",
         },
         searchBar: {
            label: "Sedang cari Apa?",
            placeHolder: "Cari...",
            addButton: "+ Baru",
         },
         error: {
            required: "Tidak boleh kosong",
            email: "Email tidak valid",
            minLength: "Harus minimal {value} karakter",
            maxLength: "Maksimal hanya {value} karakter",
            min: "Harus lebih besar dari {value}",
            max: "Harus lebih kecil dari {value}",
         },
         action: {
            create: "Tambah Baru",
            update: "Ubah",
            delete: "Hapus",
            view: "Lihat",
            edit: "Ubah",
         },
      },
   },
   Languages: {
      EN: "EN",
      ID: "ID",
   },
   CompanyName: "MIJ KOMP",

   router: {
      //Untuk path index pertama pada router harus sesuai dengan nama module
      dashboard: "/dashboard",

      productCategory: "/catalog/product-category",
      product: "/catalog/products",
      productBundle: "/catalog/product-bundle",
      productVariant: "/catalog/product-variant",
      menu: "/catalog/menu",

      property: "/property/property-list",

      roomTypePrice: "/property/:id/room-type/p",
      roomTypeNoPrice: "/property/:id/room-type/np",

      //halaman sebelumnya roomType Price
      roomNoPrice: "/property/:id/room-type/p/:roomTypeId/room",

      //halaman sebelumnya roomType No Price
      roomPrice: "/property/:id/room-type/np/:roomTypeId/room",
      // manageRoom: "/property/manage-room",

      calendar: "/calendar",

      manualBooking: "/manual-booking",
      transaction: "/transactions",
      report: "/report",
      viewReport: "/report/:id",
      user: "/user",
      member: "/members",

      deviceLock: "/device/lock",
      deviceGateway: "/device/gateway",
      generatePin: "/device/generatePin",
      manualPin: "/device/manualPin",

      booking: "/booking",

      paymentType: "/payment/paymentType",
      paymentMethod: "/payment/paymentMethod",
      paymentHistory: "/payment/paymentHistory",

      role: "/role",

      cleaningSession: "/cleaning/session",
      cleaningHistories: "/cleaning/histories",

      setting: "/setting",
      occupiedRoom: "/occupied-rooms",

      profile: "/profile",

      referral: "/referral",
   },
   formMode: {
      create: 1,
      update: 2,
      history: 3,
   },
   days: [
      {
         Id: 1,
         Name: "Senin",
      },
      {
         Id: 2,
         Name: "Selasa",
      },
      {
         Id: 3,
         Name: "Rabu",
      },
      {
         Id: 4,
         Name: "Kamis",
      },
      {
         Id: 5,
         Name: "Jumat",
      },
      {
         Id: 6,
         Name: "Sabtu",
      },
      {
         Id: 7,
         Name: "Minggu",
      },
   ],
   specKeys:[
      {label: 'System Memory Type', value:'System Memory Type'},
      {label: 'Memory Channels', value:'Memory Channels'},
      {label: 'Processors', value:'Processors'},
   ]
};
export default constant;
