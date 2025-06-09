const assets = {
   favicon: () => import("./favicon.webp"),
   logo: () => import("./logo.webp"),
   icons: {
      upPrice: () => import("./icons/up-price.png"),
      downPrice: () => import("./icons/down-price.png"),
      bell: () => import("./icons/bell.png"),
      plus: () => import("./icons/plus.webp"),
      trash: () => import("./icons/remove_icon.webp"),
      xmark: () => import("./icons/xmark.webp"),
      calendar: () => import("./icons/calendar.webp"),
      chevron_down: () => import("./icons/chevron-down.webp"),
      chevron_up: () => import("./icons/chevron-up.webp"),
      chevron_left: () => import("./icons/chevron-left.webp"),
      chevron_right: () => import("./icons/chevron-right.webp"),
      share: () => import("./icons/share.webp"),

      dashboard: () => import("./icons/icon-dashboard.webp"),
      calendar: () => import("./icons/icon-calendar.webp"),
      catalog: () => import("./icons/icon-catalog.webp"),
      property: () => import("./icons/icon-property.webp"),
      manualBooking: () => import("./icons/icon-manual-booking.webp"),
      payment: () => import("./icons/icon-payment.webp"),
      report: () => import("./icons/icon-report.webp"),
      user: () => import("./icons/icon-user.webp"),
      device: () => import("./icons/icon-device.webp"),
      logout: () => import("./icons/icon-logout.webp"),
      booking: () => import("./icons/icon-report.webp"),
      cleaning: () => import("./icons/icon-cleaning.webp"),
      setting: () => import("./icons/icon-setting.webp"),

      pax: () => import("./icons/icon-pax.webp"),
      roomSize: () => import("./icons/icon-room-size.webp"),
      paperPlane: () => import("./icons/paper-plane.webp"),

      pencilEdit: () => import("./icons/icon-pencil-edit.webp"),
   },
   iconPropertyFacility: {
      icon1: () => import("./icons/propertyFacility/1.png"),
      icon2: () => import("./icons/propertyFacility/1.png"),
      icon3: () => import("./icons/propertyFacility/1.png"),
      icon4: () => import("./icons/propertyFacility/1.png"),
   },

   iconRoomFacility: {
      icon1: () => import("./icons/propertyFacility/1.png"),
      icon2: () => import("./icons/propertyFacility/1.png"),
      icon3: () => import("./icons/propertyFacility/1.png"),
      icon4: () => import("./icons/propertyFacility/1.png"),
   },
};
export default assets;
