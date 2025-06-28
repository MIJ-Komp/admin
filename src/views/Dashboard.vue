<template>
   <div>Ini adalah halaman dashboard</div>
</template>
<script>
import { onBeforeMount, ref } from "vue";
import { AgGridVue } from "ag-grid-vue3";
import "ag-grid-enterprise";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-quartz.css";
import moment from "moment";
import module from "../constant/module";
import { mapActions } from "vuex";
export default {
   components: {
      AgGridVue,
   },
   data() {
      return {
         roomAvailabilityChart: {
            labels: [""],
            datasets: [
               {
                  type: "bar",
                  label: "Occupied",
                  backgroundColor: "#1256FD",
                  data: [],
               },
               {
                  type: "bar",
                  label: "Available",
                  backgroundColor: "#A1C8FF",
                  data: [],
               },
               {
                  type: "bar",
                  label: "Booked",
                  backgroundColor: "#0A3D99",
                  data: [],
               },
               {
                  type: "bar",
                  label: "Not Ready",
                  backgroundColor: "#FFD700",
                  data: [],
               },
            ],
         },
         bookingStateChart: {
            labels: [],
            datasets: [
               {
                  type: "bar",
                  label: "New Booking",
                  backgroundColor: "#A1C8FF",
                  data: [],
               },
               {
                  type: "bar",
                  label: "Check out",
                  backgroundColor: "#FFD700",
                  borderRadius: 10,
                  data: [],
               },
               {
                  type: "bar",
                  label: "Check in",
                  backgroundColor: "#0A3D99",
                  borderRadius: 10,
                  data: [],
               },
            ],
         },
         topAddOnChart: {
            labels: [],
            datasets: [
               {
                  data: [],
                  backgroundColor: [
                     "#1256DF",
                     "#A1C8FF",
                     "#0A3D99",
                     "#FFD700",
                     "#F1485B",
                  ],
                  hoverBackgroundColor: [
                     "#1256DF",
                     "#A1C8FF",
                     "#0A3D99",
                     "#FFD700",
                     "#F1485B",
                  ],
               },
            ],
         },
         revenueFilterYear: new Date().getFullYear() - 1,
         revenueFilterProperty: "",
         revenueChart: {
            labels: [
               "January",
               "February",
               "March",
               "April",
               "May",
               "June",
               "July",
               "August",
               "September",
               "October",
               "November",
               "December",
            ],
            datasets: [
               {
                  label: "This Year",
                  backgroundColor: "#0A3D99",
                  borderColor: "#0A3D99",
                  data: [],
               },
               {
                  label: "2023",
                  backgroundColor: "#FFD700",
                  borderColor: "#FFD700",
                  data: [],
               },
            ],
         },
         dataFilter: {
            filterProperty: "",
            Date: null,
         },
         bookingHistoryList: [],
         recentActivityList: [],
         nowData: {
            WeeklyData: [],
         },
         roomAvailabilityData: {
            Available: 0,
            Occupied: 0,
            Booked: 0,
            NotReady: 0,
         },
         totalRevenue: 0,
         topProperties: [],
         revenueState: [],
         propertyList: [],
         topAddOns: [],
      };
   },
   watch: {
      dataFilter: {
         deep: true,
         handler() {
            this.changeTopAddOnsData();
            this.changeBookingStateData();
            this.changeTotalRevenue();
            this.changeRoomAvailabilityData();
         },
      },
   },
   async mounted() {
      this.propertyList = await this.getAll();
      this.recentActivityList = await this.getRecentActivities();
      this.bookingHistoryList = await this.getBookingHistory();
      this.changeRoomAvailabilityData();
      this.changeBookingStateData();
      this.changeTotalRevenue();
      this.topProperties = await this.getTopProperty();
      this.changeRevenueFilterData();
      this.changeTopAddOnsData();
   },
   setup() {
      const defaultColDef = ref({
         flex: 1,
         minWidth: 150,
         suppressSizeToFit: true,
      });
      onBeforeMount(() => {
         autoGroupColumnDef.value = {
            minWidth: 150,
         };
         rowGroupPanelShow.value = "always";
      });

      const autoGroupColumnDef = ref(null);
      const rowGroupPanelShow = ref(null);
      return {
         defaultColDef,
         autoGroupColumnDef,
         rowGroupPanelShow,
      };
   },
   computed: {
      computedColumns() {
         return [
            { headerName: "Booking ID", field: "Code" },
            { headerName: "Nama Pemesan", field: "User" },
            { headerName: "Kode Kamar", field: "BookDetail.Room.Code" },
            { headerName: "Properti", field: "BookDetail.Room.Property.Name" },
            {
               headerName: "Check-in",
               field: "BookDetail.CheckIn",
               valueFormatter: (data) => {
                  return moment(data.value).format("DD MMM YYYY");
               },
            },
            {
               headerName: "Check-out",
               field: "BookDetail.CheckOut",
               valueFormatter: (data) => {
                  return moment(data.value).format("DD MMM YYYY");
               },
            },
            {
               headerName: "Status",
               field: "Status",
               valueFormatter: (data) => {
                  switch (data.value) {
                     case 1:
                        return "Cart";
                     case 2:
                        return "Pending";
                     case 3:
                        return "Expired";
                     case 4:
                        return "Paid";
                     default:
                        return "Failed";
                  }
               },
            },
         ];
      },
      CheckInCount() {
         if (this.nowData.WeeklyData.length == 0) {
            return 0;
         }

         return this.nowData.WeeklyData.find(
            (r) => new Date(r.date).getDate() == new Date().getDate()
         ).data.CheckIn;
      },
      CheckOutCount() {
         if (this.nowData.WeeklyData.length == 0) {
            return 0;
         }

         return this.nowData.WeeklyData.find(
            (r) => new Date(r.date).getDate() == new Date().getDate()
         ).data.CheckOut;
      },
   },
   methods: {
      // ...mapActions(module.data.name, ["getImage"]),
      // ...mapActions(module.property.name, ["getAll"]),
      // ...mapActions(module.dashboard.name, [
      //    "getRecentActivities",
      //    "getBookingHistory",
      //    "getNowData",
      //    "getRoomAvailability",
      //    "getTotalRevenue",
      //    "getTopProperty",
      //    "getRevenueState",
      //    "getTopAddOns",
      // ]),
      formatCurrency(money) {
         if (!money) {
            return "0";
         }
         return money.toLocaleString("id-ID");
      },
      getTime(time) {
         if (
            moment(time).format("DD MM YYYY") ==
            moment(new Date()).format("DD MM YYYY")
         ) {
            return moment(time).format("HH:mm");
         }

         return moment(time).format("DD MMM YYYY HH:mm");
      },
      getAvailableYear() {
         const startYear = 2021;
         const currentYear = new Date().getFullYear();
         return Array.from(
            { length: currentYear - startYear },
            (_, i) => startYear + i
         );
      },
      getPropertyImage(imageId) {
         if (imageId) {
            return this.getImage(imageId);
         }

         return "./favicon.webp";
      },
      openManualBooking() {
         this.$router.push({
            path: this.$constant.router.manualBooking,
         });
      },
      async changeTotalRevenue() {
         this.totalRevenue = await this.getTotalRevenue(this.dataFilter);
      },
      async changeRoomAvailabilityData() {
         this.roomAvailabilityData = await this.getRoomAvailability(
            this.dataFilter
         );
         this.roomAvailabilityChart.datasets[0].data[0] =
            this.roomAvailabilityData.Occupied;
         this.roomAvailabilityChart.datasets[1].data[0] =
            this.roomAvailabilityData.Available;
         this.roomAvailabilityChart.datasets[2].data[0] =
            this.roomAvailabilityData.Booked;
         this.roomAvailabilityChart.datasets[3].data[0] =
            this.roomAvailabilityData.NotReady;
      },
      async changeBookingStateData() {
         this.nowData = await this.getNowData(this.dataFilter);
         const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

         this.bookingStateChart = ref({
            labels: this.nowData.WeeklyData.map((item) => {
               const date = new Date(item.date);
               return daysOfWeek[date.getUTCDay()];
            }),
            datasets: [
               {
                  type: "bar",
                  label: "New Booking",
                  backgroundColor: "#A1C8FF",
                  data: this.nowData.WeeklyData.map(
                     (item) => item.data.NewBooking
                  ),
               },
               {
                  type: "bar",
                  label: "Check Out",
                  backgroundColor: "#FFD700",
                  data: this.nowData.WeeklyData.map(
                     (item) => item.data.CheckOut
                  ),
               },
               {
                  type: "bar",
                  label: "Check In",
                  backgroundColor: "#0A3D99",
                  data: this.nowData.WeeklyData.map(
                     (item) => item.data.CheckIn
                  ),
               },
            ],
         });
      },
      async changeTopAddOnsData() {
         this.topAddOns = await this.getTopAddOns(this.dataFilter);

         this.topAddOnChart.labels = this.topAddOns.map((r) => r.RoomAddOn);
         this.topAddOnChart.datasets[0].data = this.topAddOns.map(
            (r) => r.Total
         );
      },
      async changeRevenueFilterData() {
         const filterData = {
            filterYear: this.revenueFilterYear,
            filterProperty: this.revenueFilterProperty,
         };
         this.revenueChart.datasets[1].label = this.revenueFilterYear;
         this.revenueState = await this.getRevenueState(filterData);

         const thisYearMonthArray = Array(12).fill(0);
         this.revenueState.ThisYearRevenue.forEach(
            ({ Month, TotalRevenue }) => {
               thisYearMonthArray[Month - 1] = TotalRevenue;
            }
         );

         const filterYearMonthArray = Array(12).fill(0);
         this.revenueState.FilteredYearRevenue.forEach(
            ({ Month, TotalRevenue }) => {
               filterYearMonthArray[Month - 1] = TotalRevenue;
            }
         );

         this.revenueChart.datasets[0].data = thisYearMonthArray;
         this.revenueChart.datasets[1].data = filterYearMonthArray;
      },
      setStackedVerticalChartoption() {
         const documentStyle = getComputedStyle(document.documentElement);
         const textColor = documentStyle.getPropertyValue("--p-text-color");
         const textColorSecondary = documentStyle.getPropertyValue(
            "--p-text-muted-color"
         );
         const surfaceBorder = documentStyle.getPropertyValue(
            "--p-content-border-color"
         );

         return {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
               tooltips: {
                  mode: "index",
                  intersect: false,
               },
               legend: {
                  position: "top",
                  labels: {
                     color: textColor,
                  },
               },
            },
            scales: {
               x: {
                  stacked: true,
                  ticks: {
                     color: textColorSecondary,
                  },
                  grid: {
                     color: surfaceBorder,
                  },
               },
               y: {
                  stacked: true,
                  ticks: {
                     color: textColorSecondary,
                  },
                  grid: {
                     color: surfaceBorder,
                  },
               },
            },
         };
      },
      setStackedHorizontalChartOption() {
         const documentStyle = getComputedStyle(document.documentElement);
         const textColor = documentStyle.getPropertyValue("--p-text-color");
         const textColorSecondary = documentStyle.getPropertyValue(
            "--p-text-muted-color"
         );
         const surfaceBorder = documentStyle.getPropertyValue(
            "--p-content-border-color"
         );

         return {
            indexAxis: "y",
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
               tooltips: {
                  mode: "index",
                  intersect: false,
               },
               legend: {
                  position: "bottom",
                  labels: {
                     color: textColor,
                  },
               },
            },
            scales: {
               x: {
                  stacked: true,
                  ticks: {
                     color: textColorSecondary,
                  },
                  grid: {
                     color: surfaceBorder,
                  },
               },
               y: {
                  stacked: true,
                  ticks: {
                     color: textColorSecondary,
                  },
                  grid: {
                     color: surfaceBorder,
                  },
               },
            },
         };
      },
      setSideBySideBarOption() {
         const documentStyle = getComputedStyle(document.documentElement);
         const textColor = documentStyle.getPropertyValue("--p-text-color");
         const textColorSecondary = documentStyle.getPropertyValue(
            "--p-text-muted-color"
         );
         const surfaceBorder = documentStyle.getPropertyValue(
            "--p-content-border-color"
         );

         return {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
               legend: {
                  labels: {
                     color: textColor,
                  },
               },
            },
            scales: {
               x: {
                  ticks: {
                     color: textColorSecondary,
                     font: {
                        weight: 500,
                     },
                  },
                  grid: {
                     display: false,
                     drawBorder: false,
                  },
               },
               y: {
                  ticks: {
                     color: textColorSecondary,
                  },
                  grid: {
                     color: surfaceBorder,
                     drawBorder: false,
                  },
               },
            },
         };
      },
      setDoughnutChartOption() {
         const documentStyle = getComputedStyle(document.documentElement);
         const textColor = documentStyle.getPropertyValue("--p-text-color");

         return {
            plugins: {
               legend: {
                  position: "right",
                  labels: {
                     color: textColor,
                  },
               },
            },
         };
      },
   },
};
</script>
<style scoped>
.dashboard-container {
   display: flex;
   flex-direction: column;
   overflow: scroll;
   max-height: 100vh;
}

.filter-container {
   max-width: 100vw;
   padding: 20px 24px;
   background: white;
   border-radius: 8px;
   flex-shrink: 1;
   margin-bottom: 16px;
}

.dashboard-container .card {
   padding: 10px;
   height: 100%;
}

.body-container {
   display: flex;
   flex-direction: column;
   border-radius: 16px;
   padding: 16px;
   background-color: white;
}

.content-container {
   display: flex;
   flex-direction: column;
   padding: 16px;
   border-radius: 8px;
   border: 1px solid var(--grey-800);
   background-color: white;
}

.circle-indicator {
   min-width: 8px;
   max-width: 8px;
   min-height: 8px;
   max-height: 8px;
   border-radius: 4px;
   background-color: var(--blue-500);
   margin-right: 16px;
   margin-top: 16px;
}
.line-indicator {
   width: 1px;
   height: calc(100% + 20px);
   top: 20px;
   left: 3.5px;
   background-color: var(--blue-500);
   position: absolute;
}
.scrollable {
   overflow: scroll;
   max-height: 328px;
   min-height: 328px;
   height: 100%;
}

.recent-activity-header {
   font-size: 12px;
   color: var(--blue-500);
}

.recent-activity-time {
   font-size: 12px;
   color: var(--grey-800);
}
.property-font {
   font-size: 12px;
}
.property-image {
   min-width: 28px;
   max-width: 28px;
   min-height: 28px;
   max-height: 28px;
   border-radius: 50%;
   margin: 0 8px;
   object-fit: cover;
}
</style>
