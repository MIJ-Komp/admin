//Ini adalah Akses Modul yang ada di Backend/Database

const module = {
    user:           { Id: 1, label: "User"},
    productCategory:   { Id: 3, label: "Property Type"},
    componentType:       { Id: 4, label: "Component Type"},
    product:       { Id: 7, label: "Product"},
    compatibleRule:       { Id: 8, label: "Compatible Rule"},
    transaction:{ Id: 16, label: "Transaction"},
    report :{ Id: 20, label: "Report"},
 }
 const otherModule={
   report:{ Id: 1, label: "Report"},
 }

 export default {
    module, otherModule
 }