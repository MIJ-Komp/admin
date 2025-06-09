<template>
   <div class="rounded p-3 d-flex flex-column bg-white position-relative h-100">
      <div class="d-flex report-search-bar" style="height: 100px; flex-shrink: 1;">
         <div class="d-flex justify-content-between w-100">
            <SelectModuleBox
               v-if="activeFilter[0]"
               :module="$module.property"
               :haveAllOption="true"
               placeholder="All Property"
               labelType="out"
               class="w-100"
               label="Property"
               :required="false"
               v-model="filterData.PropertyId"
            />
            <DateBox
               v-if="activeFilter[1]"
               v-model="filterData.FromDate"
               labelType="out"
               class="w-100 mx-4"
               label="From Date"
            />
            <DateBox
               v-if="activeFilter[2]"
               v-model="filterData.ToDate"
               labelType="out"
               class="w-100"
               label="To Date"
            />
         </div>
         <Button
            @click="loadReportData"
            style="
               width: 100px !important;
               margin-left: 16px;
               height: 42px;
               margin-top: 24px;
            "
            font-size="12"
            label="View"
         />
      </div>

      <DataTable 
         :exportFilename="fileName"
         class="printable-table" ref="dataTable" :value="tableData" style="flex-grow: 1;
         max-height: calc(100% - 150px);
         overflow: auto;">
         <Column
            v-for="col in tableColumns"
            :key="col.Id"
            :field="col.field"
            :header="col.header"
         ></Column>
      </DataTable>
      <div style="flex-shrink: 1;" class="p-1">
         <Button
            @click="exportCsv"
            class="download-report-button"
            label="Download"
            
         />
      </div>
   </div>
</template>

<script>
import { mapActions } from "vuex";
import module from "../../constant/module";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import moment from "moment";
import {ref, onMounted} from 'vue';
import {useRoute } from "vue-router";

export default {
   components: {
      DataTable,
      Column,
   },
   setup(){
      const dataTable = ref();
      const route = useRoute();

      // onMounted(()=>{
      //    switch (route.params.id) {
      //       case "1": {
      //          dataTable.value.exportFilename = `Sales Per Date`
      //          break;
      //       }
      //       case "2": {
      //          dataTable.value.exportFilename = `Top Property`
      //          break;
      //       }
      //       case "3": {
      //          dataTable.value.exportFilename = `Employee Cleaning History`
      //          break;
      //       }
      //       default: {
      //          return;
      //       }
      //    }
      // })

      
      const exportCsv = () => {
         console.log(dataTable.value);
         dataTable.value.exportCSV()
         document.title = "Report File";
      };
      return{
         dataTable, exportCsv
      }
   },
   data() {
      return {
         filterData: {
            PropertyId: "",
            FromDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
            ToDate: new Date(),
         },
         activeFilter: [],
         tableData: [],
         tableColumns: [],
         fileName: 'download'
      };
   },
   mounted() {
      switch (this.$route.params.id) {
         case "1": {
            this.activeFilter = [true, true, true];
            this.tableColumns = [
               {
                  Id: 1,
                  field: "Date",
                  header: "Date",
               },
               {
                  Id: 2,
                  field: "OrderQuantity",
                  header: "Number of Orders",
               },
               {
                  Id: 3,
                  field: "Pax",
                  header: "Pax",
               },
               {
                  Id: 4,
                  field: "SubTotal",
                  header: "Sub Total",
               },
               {
                  Id: 5,
                  field: "AddOn",
                  header: "Add Ons",
               },
               {
                  Id: 6,
                  field: "Discount",
                  header: "Discount",
               },
               {
                  Id: 7,
                  field: "Total",
                  header: "Total",
               },
            ];
            break;
         }
         case "2": {
            this.activeFilter = [false, true, true];
            this.tableColumns = [
               {
                  Id: 1,
                  field: "Rank",
                  header: "Rank",
               },
               {
                  Id: 2,
                  field: "Property",
                  header: "Property",
               },
               {
                  Id: 3,
                  field: "Order",
                  header: "Number of Orders",
               },
               {
                  Id: 4,
                  field: "Revenue",
                  header: "Revenue",
               },
            ];
            break;
         }
         case "3": {
            this.activeFilter = [true, true, true];
            this.tableColumns = [
               { Id: 1, field: "CreatedOn", header: "Date" },
               { Id: 3, field: "Creator.Name", header: "Cleaner" },
               { Id: 4, field: "Room.Name", header: "Room" },
               { Id: 5, field: "Room.Property.Name", header: "Property" },
               { Id: 6, field: "StatusName", header: "Status" },
            ];
         }
         default:
            return;
      }
   },
   methods: {
      ...mapActions(module.report.name, [
         "getSalesPerDate",
         "getTopProperty",
         "getCleaningHistory",
      ]),
      downloadPage() {
         this.$nextTick(() => {
            console.log(this.dataTable.value)

            window.print();
            document.title = "Report File";
         });
      },
      async loadReportData() {
         const apiFilter = {
            PropertyId: this.filterData.PropertyId,
            FromDate: moment(this.filterData.FromDate).format("YYYY-MM-DD"),
            ToDate: moment(this.filterData.ToDate).format("YYYY-MM-DD"),
         };
         switch (this.$route.params.id) {
            case "1": {
               this.fileName = 'Sales Per Date'
               this.tableData = await this.getSalesPerDate(apiFilter);
               break;
            }
            case "2": {
               this.fileName = 'Top Property'
               this.tableData = await this.getTopProperty(apiFilter);
               break;
            }
            case "3": {
               this.fileName = 'Employee Cleaning History'
               this.tableData = await this.getCleaningHistory(apiFilter);
               break;
            }
            default: {
               return;
            }
         }
      },
   },
};
</script>

<style>
@media print {
   .side-nav-bar,
   .header-container,
   .report-search-bar,
   .download-report-button {
      display: none !important;
   }

   .printable-table {
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
   }
}
</style>
