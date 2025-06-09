const columns = [
    { headerName: "Nama Properti", field:'name'},
    { headerName: "Tipe" , field:'type'},
    { headerName: "Alamat", field:'address'},
    { headerName: "Kota", field:'city'},
    { headerName: "Rooms", type: 'numericColumn', field:'rooms'},
    { headerName: "Status", field:'status'},
];

export default columns;