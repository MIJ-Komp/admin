
const constant = {
   // apiURL: "https://devapich.pasifiksgroup.com:8443",
   // apiURL: "https://12ab882d-51ca-45eb-8fc0-a6c7b2e215c3-00-1f1m8yy73c66d.sisko.replit.dev/api",
   apiURL: "http://localhost:5000/api",
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
            componentType: "Component Type",
            compatibleRule: "Compatible Rule",

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
      compatibleRule: "/catalog/compatibe-rule",
      componentType: "/catalog/component-type",
      product: "/catalog/products",
      productBundle: "/catalog/product-bundle",
      productVariant: "/catalog/product-variant",
      menu: "/catalog/menu",

      transaction: "/transactions",
      report: "/report",
      user: "/user",
      member: "/members",
      paymentHistory: "/payment/paymentHistory",
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
   specKeys: [
      // 🔹 PROCESSOR
      { label: 'CPU Brand', value: 'brand', groupId: 'PROCESSOR' },
      { label: 'CPU Model', value: 'model', groupId: 'PROCESSOR' },
      { label: 'CPU Socket', value: 'socket', groupId: 'PROCESSOR' },
      { label: 'CPU Generation', value: 'generation', groupId: 'PROCESSOR' },
      { label: 'CPU Cores', value: 'cores', groupId: 'PROCESSOR' },
      { label: 'CPU Threads', value: 'threads', groupId: 'PROCESSOR' },
      { label: 'Base Clock Speed (GHz)', value: 'base_clock', groupId: 'PROCESSOR' },
      { label: 'Boost Clock Speed (GHz)', value: 'boost_clock', groupId: 'PROCESSOR' },
      { label: 'TDP (Watt)', value: 'tdp_watt', groupId: 'PROCESSOR' },
      { label: 'Supported RAM Type', value: 'supported_ram_type', groupId: 'PROCESSOR' },
      { label: 'Max Memory Supported (GB)', value: 'max_memory', groupId: 'PROCESSOR' },
      { label: 'PCIe Version Supported', value: 'pcie_version', groupId: 'PROCESSOR' },
      { label: 'Integrated Graphics', value: 'integrated_graphics', groupId: 'PROCESSOR' },
      { label: 'Supported Chipsets', value: 'supported_chipsets', groupId: 'PROCESSOR' },

      // 🔹 MOTHERBOARD
      { label: 'Motherboard Socket', value: 'socket', groupId: 'MOTHERBOARD' },
      { label: 'Motherboard Chipset', value: 'chipset', groupId: 'MOTHERBOARD' },
      { label: 'Form Factor', value: 'form_factor', groupId: 'MOTHERBOARD' },
      { label: 'RAM Type Supported', value: 'supported_ram_type', groupId: 'MOTHERBOARD' },
      { label: 'Number of RAM Slots', value: 'ram_slots', groupId: 'MOTHERBOARD' },
      { label: 'Max RAM per Slot (GB)', value: 'max_ram_per_slot', groupId: 'MOTHERBOARD' },
      { label: 'Total Max RAM (GB)', value: 'total_max_ram', groupId: 'MOTHERBOARD' },
      { label: 'Max RAM Speed (MHz)', value: 'max_ram_speed', groupId: 'MOTHERBOARD' },
      { label: 'PCIe Version', value: 'pci_version', groupId: 'MOTHERBOARD' },
      { label: 'Storage Interfaces', value: 'storage_interfaces', groupId: 'MOTHERBOARD' },
      { label: 'Supported CPU Generations', value: 'supported_generations', groupId: 'MOTHERBOARD' },

      // 🔹 RAM
      { label: 'RAM Type', value: 'ram_type', groupId: 'RAM' },
      { label: 'RAM Capacity (GB)', value: 'capacity', groupId: 'RAM' },
      { label: 'RAM Speed (MHz)', value: 'ram_speed', groupId: 'RAM' },
      { label: 'RAM Voltage (V)', value: 'ram_voltage', groupId: 'RAM' },
      { label: 'RAM Module Count', value: 'module_count', groupId: 'RAM' },
      { label: 'RAM Module Type', value: 'module_type', groupId: 'RAM' },

      // 🔹 GPU
      { label: 'GPU PCIe Version', value: 'pci_version', groupId: 'GPU' },
      { label: 'GPU Length (mm)', value: 'length_mm', groupId: 'GPU' },
      { label: 'Recommended PSU Wattage', value: 'recommended_psu_watt', groupId: 'GPU' },
      { label: 'VRAM (GB)', value: 'vram', groupId: 'GPU' },

      // 🔹 PSU
      { label: 'PSU Wattage', value: 'wattage', groupId: 'PSU' },
      { label: 'PSU Form Factor', value: 'form_factor', groupId: 'PSU' },
      { label: 'PSU Efficiency Rating', value: 'efficiency', groupId: 'PSU' },

      // 🔹 STORAGE
      { label: 'Storage Interface', value: 'interface', groupId: 'STORAGE' },
      { label: 'Storage Form Factor', value: 'form_factor', groupId: 'STORAGE' },
      { label: 'Storage Capacity (GB)', value: 'capacity', groupId: 'STORAGE' },
      { label: 'NVMe Version', value: 'nvme_version', groupId: 'STORAGE' },

      // 🔹 COOLER
      { label: 'Supported Sockets', value: 'supported_sockets', groupId: 'COOLER' },
      { label: 'Cooler Height (mm)', value: 'height_mm', groupId: 'COOLER' },
      { label: 'Max TDP Supported (W)', value: 'max_tdp_supported', groupId: 'COOLER' },

      // 🔹 CASE
      { label: 'Supported Mobo Sizes', value: 'supported_form_factors', groupId: 'CASE' },
      { label: 'Max GPU Length (mm)', value: 'max_gpu_length', groupId: 'CASE' },
      { label: 'Max Cooler Height (mm)', value: 'max_cooler_height', groupId: 'CASE' },
      { label: 'PSU Form Factor', value: 'psu_form_factor', groupId: 'CASE' },
      { label: 'Drive Bay Sizes Supported', value: 'drive_bay_support', groupId: 'CASE' },

      // 🔹 SYSTEM (Virtual)
      { label: 'Total Power Requirement (W)', value: 'total_power_requirement', groupId: 'SYSTEM' }
   ],

   productType:{
      single: 'single',
      group: 'group'
   },
   conditionRule:{
      equals: 'Equals',
      one_of: 'One Of',
      min:'Max',
      max: 'Min',
   }
};
export default constant;
