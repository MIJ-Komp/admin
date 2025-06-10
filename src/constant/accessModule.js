//Ini adalah Akses Modul yang ada di Backend/Database

const module = {
    user:           { Id: 1, label: "User"},
    role:           { Id: 2, label: "Role"},
    productCategory:   { Id: 3, label: "Property Type"},
    facility:       { Id: 4, label: "Facility"},
    productVariant:         { Id: 5, label: "ProductVariant"},
    addOn:          { Id: 6, label: "Add On"},
    property:       { Id: 7, label: "Property"},
    room:           { Id: 8, label: "Room"},
    paymentType:    { Id: 9, label: "Payment Type"},
    paymentMethod:  { Id: 10, label: "Payment Method"},
    device:         { Id: 11, label: "Device"},
    booking:        { Id: 12, label: "Booking"},
    city:           { Id: 13, label: "City"},
    province:       { Id: 14, label: "Province"},
    cleaningSession:{ Id: 15, label: "Cleaning Session"},
    transaction:{ Id: 16, label: "Transaction"},
    generatePin :{ Id: 17, label: "Generate PIN"},

    calendar :{ Id: 18, label: "Calendar"},
    setting :{ Id: 19, label: "Setting"},

    report :{ Id: 20, label: "Report"},


   //  setting:{ Id: 17, label: "Setting"},
 }
 const otherModule={
   report:{ Id: 1, label: "Report"},
 }

 export default {
    module, otherModule
 }