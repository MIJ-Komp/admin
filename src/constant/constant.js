
const constant = {
   apiURL: "http://51.79.255.146:5000/api",
   // apiURL: "https://12ab882d-51ca-45eb-8fc0-a6c7b2e215c3-00-1f1m8yy73c66d.sisko.replit.dev/api",
   // apiURL: "http://localhost:5000/api",
   baseURL: "https://dev-admin.mijkomp.id",
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
            brand: "Brand",

            //payment
            payment: "Order",
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
            salesReport: "Sales Report",
            orderReport: "Order Report",
            productReport: "Product Report",
            stockReport: "Stock Report",
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
      brand: "/catalog/brand",
      payment: "/order",
      salesReport: "/sales-report",
      orderReport: "/payment-report",
      // productReport: "/product-report",
      // stockReport: "/stock-report",


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
  { label: 'CPU Brand', value: 'processor_brand', groupId: 'CPU' },
  { label: 'CPU Model', value: 'processor_model', groupId: 'CPU' },
  { label: 'CPU Socket', value: 'processor_socket', groupId: 'CPU' },
  { label: 'CPU Generation', value: 'processor_generation', groupId: 'CPU' },
  { label: 'CPU Cores', value: 'processor_cores', groupId: 'CPU' },
  { label: 'CPU Threads', value: 'processor_threads', groupId: 'CPU' },
  { label: 'Base Clock Speed (GHz)', value: 'processor_base_clock', groupId: 'CPU' },
  { label: 'Boost Clock Speed (GHz)', value: 'processor_boost_clock', groupId: 'CPU' },
  { label: 'TDP (Watt)', value: 'processor_tdp_watt', groupId: 'CPU' },
  { label: 'Supported RAM Type', value: 'processor_supported_ram_type', groupId: 'CPU' },
  { label: 'Max Memory Supported (GB)', value: 'processor_max_memory', groupId: 'CPU' },
  { label: 'PCIe Version Supported', value: 'processor_pcie_version', groupId: 'CPU' },
  { label: 'Integrated Graphics', value: 'processor_integrated_graphics', groupId: 'CPU' },
  { label: 'Supported Chipsets', value: 'processor_supported_chipsets', groupId: 'CPU' },

  // 🔹 MOTHERBOARD
  { label: 'Motherboard Socket', value: 'motherboard_socket', groupId: 'MOTHERBOARD' },
  { label: 'Motherboard Chipset', value: 'motherboard_chipset', groupId: 'MOTHERBOARD' },
  { label: 'Form Factor', value: 'motherboard_form_factor', groupId: 'MOTHERBOARD' },
  { label: 'RAM Type Supported', value: 'motherboard_supported_ram_type', groupId: 'MOTHERBOARD' },
  { label: 'Number of RAM Slots', value: 'motherboard_ram_slots', groupId: 'MOTHERBOARD' },
  { label: 'Max RAM per Slot (GB)', value: 'motherboard_max_ram_per_slot', groupId: 'MOTHERBOARD' },
  { label: 'Total Max RAM (GB)', value: 'motherboard_total_max_ram', groupId: 'MOTHERBOARD' },
  { label: 'Max RAM Speed (MHz)', value: 'motherboard_max_ram_speed', groupId: 'MOTHERBOARD' },
  { label: 'PCIe Version', value: 'motherboard_pci_version', groupId: 'MOTHERBOARD' },
  { label: 'Storage Interfaces', value: 'motherboard_storage_interfaces', groupId: 'MOTHERBOARD' },
  { label: 'Supported CPU Generations', value: 'motherboard_supported_generations', groupId: 'MOTHERBOARD' },
  { label: 'Motherboard Ram Voltage', value: 'motherboard_ram_voltage', groupId: 'MOTHERBOARD' },

  // 🔹 RAM
  { label: 'RAM Type', value: 'ram_ram_type', groupId: 'RAM' },
  { label: 'RAM Capacity (GB)', value: 'ram_capacity', groupId: 'RAM' },
  { label: 'RAM Speed (MHz)', value: 'ram_ram_speed', groupId: 'RAM' },
  { label: 'RAM Voltage (V)', value: 'ram_ram_voltage', groupId: 'RAM' },
  { label: 'RAM Module Count', value: 'ram_module_count', groupId: 'RAM' },
  { label: 'RAM Module Type', value: 'ram_module_type', groupId: 'RAM' },

  // 🔹 GPU
  { label: 'GPU PCIe Version', value: 'gpu_pci_version', groupId: 'GPU' },
  { label: 'GPU Length (mm)', value: 'gpu_length_mm', groupId: 'GPU' },
  { label: 'Recommended PSU Wattage', value: 'gpu_recommended_psu_watt', groupId: 'GPU' },
  { label: 'VRAM (GB)', value: 'gpu_vram', groupId: 'GPU' },

  // 🔹 PSU
  { label: 'PSU Wattage', value: 'psu_wattage', groupId: 'PSU' },
  { label: 'PSU Form Factor', value: 'psu_form_factor', groupId: 'PSU' },
  { label: 'PSU Efficiency Rating', value: 'psu_efficiency', groupId: 'PSU' },

  // 🔹 STORAGE
  { label: 'Storage Interface', value: 'storage_interface', groupId: 'STORAGE' },
  { label: 'Storage Form Factor', value: 'storage_form_factor', groupId: 'STORAGE' },
  { label: 'Storage Capacity (GB)', value: 'storage_capacity', groupId: 'STORAGE' },
  { label: 'NVMe Version', value: 'storage_nvme_version', groupId: 'STORAGE' },

  // 🔹CPU Cooler
  { label: 'Supported Sockets', value: 'CpuCooler_supported_sockets', groupId: 'CpuCooler' },
  { label: 'CpuCooler Height (mm)', value: 'CpuCooler_height_mm', groupId: 'CpuCooler' },
  { label: 'Max TDP Supported (W)', value: 'CpuCooler_max_tdp_supported', groupId: 'CpuCooler' },

  // 🔹 CASE FAN
{ label: 'Fan Size (mm)', value: 'casefan_size_mm', groupId: 'CASEFAN' },
{ label: 'Fan Speed (RPM)', value: 'casefan_speed_rpm', groupId: 'CASEFAN' },
{ label: 'Airflow (CFM)', value: 'casefan_airflow_cfm', groupId: 'CASEFAN' },
{ label: 'Noise Level (dBA)', value: 'casefan_noise_dba', groupId: 'CASEFAN' },
{ label: 'Connector Type', value: 'casefan_connector', groupId: 'CASEFAN' },
{ label: 'RGB Lighting', value: 'casefan_rgb', groupId: 'CASEFAN' },
{ label: 'Bearing Type', value: 'casefan_bearing_type', groupId: 'CASEFAN' },
{ label: 'Rated Voltage (V)', value: 'casefan_voltage_v', groupId: 'CASEFAN' },
{ label: 'Static Pressure (mmH₂O)', value: 'casefan_static_pressure', groupId: 'CASEFAN' },

  // 🔹 CASE
  { label: 'Supported Mobo Sizes', value: 'case_supported_form_factors', groupId: 'CASE' },
  { label: 'Max GPU Length (mm)', value: 'case_max_gpu_length', groupId: 'CASE' },
  { label: 'Max CpuCooler Height (mm)', value: 'case_max_CpuCooler_height', groupId: 'CASE' },
  { label: 'PSU Form Factor', value: 'case_psu_form_factor', groupId: 'CASE' },
  { label: 'Drive Bay Sizes Supported', value: 'case_drive_bay_support', groupId: 'CASE' },

  // 🔹 SYSTEM (Virtual)
  { label: 'Total Power Requirement (W)', value: 'system_total_power_requirement', groupId: 'SYSTEM' }
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
      includes: 'Includes',
   }
};
export default constant;
