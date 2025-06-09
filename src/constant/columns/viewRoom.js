// constant/columns/viewRoom.js
const columns = [
  { headerName: "Kode Kamar", field: 'name' },
  { 
    headerName: "Lock", 
    field: 'locks',
    cellRendererFramework: "LinkRenderer", // Nama cell renderer
    cellRendererParams: {
      text: 'Select Lock',
      action: 'onSelectLockClick', // Nama fungsi yang didefinisikan di halaman
    }
  },
  { headerName: "Status", field: 'status' },
];

export default columns;
