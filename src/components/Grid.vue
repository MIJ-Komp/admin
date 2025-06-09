<template>
   <div class="grid-container">
      <!-- <DataTable 
      removableSort 
      :value="currentValue" 
      paginator :rows="100" 
      showGridLines
      v-model:selection="selectedItems"
      >
        <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
        <Column v-for="column in columns" :key="column" 
          :field="column.field" 
          :header="column.headerName"
          sortable
        />
        <Column header="Action" bodyClass="text-center">
          <template #body="{ data }">
            <GridActionButton
              :data="data"
              :module="module"
              :contexts="actionContext"/>
            <i class="pi" :class="{ 'pi-check-circle text-green-500': data.verified, 'pi-times-circle text-red-400': !data.verified }"></i>
        </template>
          
        </Column>
    </DataTable> -->

      <div v-if="showSearchBar">
         <!-- <span class="font-body">{{ $label.searchBar.label }}</span> -->
         <div class="search-input-container">
            <i class="fa fa-search" />
            <input
               id="filter-text-box"
               :placeholder="$label.searchBar.placeHolder"
               class="font-body"
               @input="onFilterTextBoxChanged"
            />
         </div>
      </div>

      <ag-grid-vue
         :style="showSearchBar? 'height: calc(100% - 54px) !important':''"
         :ref="ref"
         :id="`grid-${module.name}`"
         class="ag-theme-quartz grid-pc"
         :theme="theme"
         :gridOptions="gridOptions"
         :columnDefs="computedColumns"
         :rowData="getRowData"
         :defaultColDef="defaultColDef"
         :autoGroupColumnDef="autoGroupColumnDef"
         :suppressAutoSize="true"
         :suppressDragLeaveHidesColumns="true"
         :suppressMakeColumnVisibleAfterUnGroup="true"
         :suppressRowGroupHidesColumns="true"
         :rowGroupPanelShow="rowGroupPanelShow"
         :suppressHeaderMenuButton="false"
         :rowSelection="computedRowSelection"
         :selectionColumnDef="{ pinned: 'left' }"
         :paginationPageSizeSelector="[100, 200, 500, 1000]"
         :pagination="true"
         :groupDefaultExpanded="1"
         @selection-changed="onSelectionChanged"
         @rowDoubleClicked="rowDoubleClicked"
         @grid-ready="onGridReady"
         :autoSizeStrategy="
         {
            type: autoSizeStrategy
         }"
         :loading="isLoading"
         :noRowsOverlayComponent="noRowsOverlayComponent"
         :noRowsOverlayComponentParams="noRowsOverlayComponentParams"
      />

      <div
         style="padding-bottom: 32px;"
         class="grid-card-container"
         :style="showSearchBar? 'height: calc(100% - 54px) !important':'height: 100%'">
         <div v-if="getRowData.length <=0" style="width: 100%;text-align: center; margin-top: 100px;">Tidak Ada Data..</div>

         <div v-for="data in getRowData" :key="data" 
            class="grid-card" 
            @dblclick="rowDoubleClicked" 
            :class="data.selected? 'selected':''">
            <!-- @click="selectItem(data)" -->
            
            <div style="margin-top: 8px;margin-right: 10px;" v-if="this.showDelete">
               <CheckBox v-model="data.selected" @change="checkSelectedItems"/>
            </div>

            <div class="grid-card-data">
               <b-row v-for="column in computedColumns.filter(c=> c.headerName != 'Action')" :key="column" class="item">
                  <b-col cols="4">
                     <div class="font-label">{{ column.headerName }}</div>
                  </b-col>
                  <b-col cols="8">
                     <div v-if="!column.children || column.children.length <=0"><span class="ms-2">:</span> {{ data[column.field] || '-' }}</div>
                     <div v-else class="ms-2">:</div>
                  </b-col>
                  
                  <div v-for="child in column.children" :key="child" class="ps-3">
                     <b-col cols="12">
                        <b-row>
                           <b-col cols="5" class="font-label">{{ child.headerName }}</b-col>
                           <b-col cols="7">{{ data[child.field] || '-' }}</b-col>
                        </b-row>
                     </b-col>
                  </div>
                  
               </b-row>
            </div>
            <div @click="(event)=> {
               event.stopPropagation()
               event.preventDefault()
               }">
               <GridActionButton 
                  :params="getParams(data)" :endElement="false"/>
            </div>
         </div>

         <div style="position: fixed; padding: 4px; bottom: 0px; width: 100%;left: 0; text-align: center; background: white;">({{ getRowData.length }}) data</div>
      </div>
   </div>

</template>

<script>
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import ColumnGroup from "primevue/columngroup"; // optional
import Row from "primevue/row"; // optional

import columns from "../constant/columns";
import {inject} from 'vue'
import { mapActions } from "vuex";
import { onBeforeMount, ref } from "vue";
// import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
// import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
import { AgGridVue } from "ag-grid-vue3"; // Vue Data Grid Component

import {
  ClientSideRowModelModule,
  ModuleRegistry,
  QuickFilterModule,
  themeQuartz, DateFilterModule,
  ValidationModule, NumberFilterModule,
  ColumnAutoSizeModule, TextFilterModule,
  ClientSideRowModelApiModule
} from "ag-grid-community";

import {
   ColumnsToolPanelModule, FiltersToolPanelModule, MenuModule, SetFilterModule, MultiFilterModule,
   RowGroupingModule, RowGroupingPanelModule, PaginationModule, RowSelectionModule, CellStyleModule
} from "ag-grid-enterprise";


import GridActionButton from "./button/GridActionButton.vue";
import GridCustomActionButton from "./button/GridCustomActionButton.vue";
import GridLockButton from "./button/GridLockButton.vue";
import LinkRenderer from "./utils/LinkRenderer.vue";

import { LicenseManager } from "ag-grid-enterprise";
import CustomNoRowsOverlayVue from './CustomNoRowsOverlay.vue';
// LicenseManager.setLicenseKey('SHI_UK_on_behalf_of_Lenovo_Sweden_MultiApp_1Devs6_November_2019__MTU3Mjk5ODQwMDAwMA==e27a8fba6b8b1b40e95ee08e9e0db2cb');
LicenseManager.setLicenseKey(
   "ag-Grid_Evaluation_License_Not_for_Production_100Devs30_August_2037__MjU4ODczMzg3NzkyMg==9e93ed5f03b0620b142770f2594a23a2"
);

ModuleRegistry.registerModules([
   ClientSideRowModelModule,
   ColumnsToolPanelModule,
   FiltersToolPanelModule,
   MenuModule,
   SetFilterModule,
   RowGroupingModule,
   QuickFilterModule,
   ValidationModule,
   ColumnAutoSizeModule,
   RowGroupingPanelModule,
   PaginationModule,
   RowSelectionModule,
   CellStyleModule,
   MultiFilterModule,
   TextFilterModule, NumberFilterModule, DateFilterModule,
   ClientSideRowModelApiModule
]);

export default {
   inject: ['openModal'],

   async beforeMount() {
      try {
         if (this.module && this.module.name) {
            this.columns = [];
            // var tmp = ()=> import(/* @vite-ignore */`../constant/columns/${this.module.name}.js`);
            this.columns = columns[this.module.name];
            // console.log("Columns imported in Grid.vue:", this.columns); // Tambahkan log ini untuk memeriksa kolom
            if (!this.columns.find((data) => data.headerName == "Created On") && this.showDefaultColumn) {
               this.columns.push({
                  headerName: "Created On",
                  field: "CreatedOn",
                  valueFormatter: (params) => {
                     if (params.data) {
                        return this.$moment(params.data.CreatedOn).format(
                           "DD MMM yyyy HH:mm:ss"
                        );
                     }
                  },
               });
               this.columns.push({
                  headerName: "Created By",
                  field: "CreatedByName",
                  valueFormatter: (params) => {
                     if (params.data) {
                        return params.data.CreatedByName || "-";
                     }
                  },
               });
               this.columns.push({
                  headerName: "Updated On",
                  field: "UpdatedOn",
                  valueFormatter: (params) => {
                     if (params.data) {
                        return params.data.UpdatedOn
                           ? this.$moment(params.data.UpdatedOn).format(
                                "DD MMM yyyy HH:mm:ss"
                             )
                           : "-";
                     }
                  },
               });
               this.columns.push({
                  headerName: "Updated By",
                  field: "UpdatedByName",
                  valueFormatter: (params) => {
                     if (params.data) {
                        return params.data.UpdatedByName || "-";
                     }
                  },
               });
            }
            if (this.columns.length > 0) {
               this.columns[this.columns.length - 1].resizable = false;
            }
            
            if (
               this.showActionButton &&
               !this.columns.find((data) => data.headerName == "Action") &&

               (this.showEdit || this.showDelete || (this.actionContext && this.actionContext.length > 0))
            ) {

               this.columns.push({
                  headerName: "Action",
                  lockPosition: "right",
                  cellClass: "action-grid",
                  minWidth: 100,
                  filter: false,
                  enableRowGroup: false,
                  menu: false,
                  sortable: false,
                  resizable: false,
                  suppressColumnsToolPanel: false,
                  suppressHeaderMenuButton: true,
                  suppressHeaderFilterButton: false,
                  suppressHeaderContextMenu: false,
                  columnGroupShowType: "closed",
                  cellRenderer: GridActionButton,
                  width: 100,
                  cellRendererParams: (params) => {
                     return {
                        item: params,
                        canCreate: this.canCreate,
                        canUpdate: this.canUpdate,
                        canDelete: this.canDelete,
                        showEdit: this.showEdit,
                        showDelete: this.showDelete,
                        module: this.module,
                        contexts: this.actionContext.filter((ac) => !ac.isLock),
                        context: {
                           componentParent: this,
                        },
                        openEditModal: (id) => {
                           if (this.simpleEdit) {
                              console.log(this.showPopUp)
                              if (this.showPopUp) {
                                 this.$emit("close");
                              } else {
                                 if(this.openModal){
                                    this.openModal(id)
                                 }
                                 this.$emit("openModal", id);
                              }
                           }
                           return this.simpleEdit;
                        },
                        // refreshList:()=>{
                        //   setTimeout(async() => {
                        //     await this.refreshData()
                        //   }, 100);
                        // }
                     };
                  },
                  pinned: "right",
               });
            }
            let LockColumn = this.columns.find(
               (data) => data.headerName == "Lock"
            );
            if (LockColumn) {
               LockColumn.cellRenderer = GridLockButton;
               LockColumn.cellRendererParams = (params) => {
                  return {
                     item: params,
                     module: this.module,
                     contexts: this.actionContext,
                     context: {
                        componentParent: this,
                     },
                  };
               };
            }

            if (this.simpleAction.Active) {
               const oldColumn = this.columns.find(
                  (data) => data.headerName == "Action"
               );
               if (oldColumn) {
                  this.columns.splice(
                     this.columns.findIndex((c) => c.headerName == "Action"),
                     1
                  );
               }
               this.columns.push({
                  headerName: this.simpleAction.Header,
                  lockPosition: "right",
                  cellClass: "action-grid",
                  minWidth: 100,
                  filter: false,
                  enableRowGroup: false,
                  menu: false,
                  sortable: false,
                  resizable: false,
                  suppressColumnsToolPanel: false,
                  suppressHeaderMenuButton: false,
                  suppressHeaderFilterButton: false,
                  suppressHeaderContextMenu: false,
                  columnGroupShowType: "closed",
                  cellRenderer: GridCustomActionButton,
                  width: 100,
                  pinned: "right",
                  cellRendererParams: (params) => {
                     return {
                        item: params,
                        module: this.module,
                        contexts: this.actionContext,
                        context: {
                           componentParent: this,
                        },
                     };
                  },
               });
            }
         } else {
            this.columns = [];
         }
      } catch (err) {
         console.error(err);
         this.columns = [];
      }
      // this.$forceUpdate();
   },
   mounted() {

   },
   computed: {
      getRowData() {
         return this.currentValue;
      },
      ref() {
         return `grid-${this.module.name}`;
      },
      computedColumns() {
         // Map columns untuk mengganti cellRendererFramework menjadi komponen yang sebenarnya
         return this.columns.map((column) => {
            if (column.cellRendererFramework === "LinkRenderer") {
               return {
                  ...column,
                  cellRenderer: "LinkRenderer",
                  cellRendererParams: {
                     ...column.cellRendererParams,
                     action: this[column.cellRendererParams.action], // Bind ke fungsi di bawah
                  },
               };
            }

            return column;
         });
      },
      computedRowSelection() {
         
         // Returns row selection object based on the prop
         return this.enableMultiRow && (this.showEdit || this.showDelete) ? { mode: "multiRow" } : false;
      },
   },

   setup(props) {
      const actionContext = inject("actionContext") || []

      const defaultColDef = ref({
         flex: 1,
         minWidth: 150,
         suppressSizeToFit: true,
         filter: "agMultiColumnFilter",
         enableRowGroup: true,
         filterParams: {
            filters: [
               { filter: "agTextColumnFilter" },
               { filter: "agNumberColumnFilter" },
               { filter: "agDateColumnFilter" },
            ],
         },
      });
      onBeforeMount(() => {
         autoGroupColumnDef.value = {
            minWidth: 150,
         };
         rowGroupPanelShow.value = "always";
      });
      

      const autoGroupColumnDef = ref(null);
      const rowGroupPanelShow = ref(null);

      const noRowsOverlayComponent = ref("CustomNoRowsOverlay");
      const noRowsOverlayComponentParams = ref({
         noRowsMessageFunc: () =>
         "No rows found at: " + new Date().toLocaleTimeString(),
      });

      return {
         theme:themeQuartz,
         defaultColDef,
         autoGroupColumnDef,
         rowGroupPanelShow,
         actionContext,
         noRowsOverlayComponent,
         noRowsOverlayComponentParams,
      };
   },
   created() {},
   name: "Grid-View",
   components: {
      AgGridVue, // Add Vue Data Grid component
      GridActionButton,
      GridCustomActionButton,
      GridLockButton,
      LinkRenderer,
      DataTable,
      Column,
      ColumnGroup,
      Row,
      CustomNoRowsOverlayVue
   },
   props: {
      showSearchBar:{default: false},
      optionId:{type: String, default: 'Id'},
      showDefaultColumn:{type:Boolean, default: true},
      autoSizeStrategy:{type: String, default: null}, //fitCellContents //fitGridWidth
      module: {
         required: false,
         default: () => {},
      },
      queryParams: {},
      dataSource: {default: null},
      searchKeyword: {
         type: String,
         required: false,
         default: "",
      },
      
      showActionButton: {
         type: Boolean,
         required: false,
         default: true,
      },
      simpleAction: {
         type: Object,
         required: false,
         default: {
            Active: false,
            Header: "",
            Icon: "",
         },
      },
      enableMultiRow: {
         // New boolean prop for controlling row selection mode
         type: Boolean,
         default: true,
      },
      simpleEdit: {
         type: Boolean,
      },
      showPopUp: { type: Boolean, default: false },
      keepLoading: { type: Boolean, default: false },
      ignoreSearch: { type: Boolean, default: false },

      canCreate: { type: Boolean, default: true },
      canDelete: { type: Boolean, default: true },
      canUpdate: { type: Boolean, default: true },
      
      showEdit: { type: Boolean, default: true },
      showDelete: { type: Boolean, default: true },
   },
   data() {
      return {
         currentValue: [],
         columns: [],
         gridOptions: {
            // autoSizeStrategy: {
            //    type: 'fitCellContents'
            // },
            // loading: true
         }, // Inisialisasi opsi grid jika diperlukan
         hasLoadData: false,
         onLoad: false,

         sourceData: [],
         selectedItems: [],
         gridApi: null,
         isLoading: false,
         windowWidth: 0
      };
   },
   watch: {
      searchKeyword: {
         immediate: true,
         async handler(newVal) {
            if (!newVal) {
               this.currentValue = [...this.sourceData];
               return;
            }
            if (!this.hasLoadData || this.keepLoading) {
               await this.refreshData();
            }
            if (!this.ignoreSearch) {
               const fields = this.columns.map((data) => data.field);

               this.currentValue = this.sourceData.filter((data) => {
                  return fields.some((field) => {
                     return (
                        data[field] &&
                        data[field]
                           .toString()
                           .trim()
                           .toLowerCase()
                           .includes(newVal.trim().toLowerCase())
                     );
                  });
               });
            }

            // this.currentValue = JSON.parse(JSON.stringify(newVal));
         },
      },
   },
   async mounted() {
      // this.setLoading(true)
      this.refreshData()
      
      this.windowWidth = window.outerWidth
      window.addEventListener("resize", (data)=>{
         this.windowWidth = window.outerWidth
      });
   },
   methods: {
      checkSelectedItems(){
         this.selectedItems = this.getRowData.filter(data=> data.selected)
      },
      getParams(data){
         return ({
                     data: data,
                     item: {data: data},
                     canCreate: this.canCreate,
                     canUpdate: this.canUpdate,
                     canDelete: this.canDelete,
                     showEdit: this.showEdit,
                     showDelete: this.showDelete,
                     module: this.module,
                     contexts: this.actionContext.filter((ac)=>{ !ac.isLock}),
                     openEditModal: (id) => {
                        if (this.simpleEdit) {
                           console.log(this.showPopUp)
                           if (this.showPopUp) {
                              this.$emit("close");
                           } else {
                              console.log(this.openModal)
                              if(this.openModal){
                                 this.openModal(id)
                              }
                              this.$emit("openModal", id);
                           }
                        }
                        return this.simpleEdit;
                     }
                  })
      },
      onGridReady(value){
         this.gridApi = value.api
         // console.log(this.gridApi)

         this.refreshData(); // Memanggil aksi untuk mengambil data
      },
      onFilterTextBoxChanged() {
         if(this.gridApi){
            this.gridApi.setGridOption(
            "quickFilterText",
               (document.getElementById("filter-text-box")).value,
            );
         }
      },
      setLoading(value) {
         // setTimeout(() => {
            // console.log(value)
            this.isLoading = value
         // }, 200);
      },
      rowDoubleClicked(event) {
         console.log(event)
         if(!this.showEdit || !event.data){
            return
         }
         if (!this.canUpdate) {
            this.$dialog.Alert.confirm({
               title: "Edit Gagal",
               message: "Anda tidak memiliki Akses",
            });
            return;
         }
         if (this.simpleEdit) {
            if (this.showPopUp) {
               this.$emit("close");
            } else {
               console.log(this.openModal)
               if(this.openModal){
                  this.openModal(event.data.Id)
               }
               this.$emit("openModal", event.data.Id);
            }
         }
         else{
            if (event.data[this.optionId]) {
               this.$router.push({
                  path: `${this.$route.path}/update/${event.data[this.optionId]}`,
               });
            } else {
               this.$showToast.error(
                  "Tidak Ditemukan",
                  "Data tidak memiliki Id yang valid"
               );
            }
         }
      },
      selectedData() {
         return this.selectedItems;
      },
      onSelectionChanged(event) {
         var selected = event.api.getSelectedNodes();
         this.selectedItems = selected.map((data) => data.data);
      },
      selectItem(data){
         data.selected = !data.selected ? true : false

         this.selectedItems = this.getRowData.filter(data=> data.selected)
      },

      refreshData() {
         try {
            this.setLoading(true)

            this.$nextTick(async () => {
               this.hasLoadData = false;

               try{
                  this.sourceData = this.dataSource ? this.dataSource : await this.$store.dispatch(
                     `${this.module.name}/getAll`,
                     this.queryParams
                  );
               }
               catch(err){
                  this.$showToast.error(err)
               }

               this.currentValue = JSON.parse(JSON.stringify(this.sourceData));

               setTimeout(() => {
                  if(this.gridApi){
                     this.gridApi.expandAll()
                     if(this.sourceData.length == 0){
                        this.gridApi.showNoRowsOverlay()
                     }
                  }
               }, 100);

               // this.$forceUpdate();

               this.hasLoadData = true;
               this.onLoad = false;
               this.setLoading(false)
            })
         } catch (err) {
            console.log(err);
            this.$showToast.error("Failed Load Data", `API response : ${err}`);
         }
      },
   },
};
</script>
<style>
.grid-card-data .item{
   border-bottom: 1px solid var(--grey-200);
   padding: 1px 0;
   justify-content: space-between;
}
.grid-card-data .item .font-label{
   color: var(--grey-800);
}
.grid-card-data{
   overflow-y: auto;
   overflow-x: hidden;
   margin-right: 10px;
   width: 100%;
}
.grid-card-container{
   display: none;
   flex-direction: column;
   gap: 28px;
   margin-top: 12px;
   overflow: auto;
   padding-right: 8px;
}
.grid-card{
   border-radius: 8px;
   background: white;
   border: 2px solid var(--grey-500);
   padding: 10px;
   height: 200px;
   min-height: 200px;
   overflow: hidden;
   display: flex;
   flex-direction: row;
   justify-content: space-between;
   box-shadow: 2px 2px 8px -1px var(--grey-600);
}
.grid-card.selected{
   border: 2px solid var(--grey-600);
}
.search-input-container {
   margin-top: 12px;
   border-radius: 8px;
   background: var(--grey-50);
   border: 1px solid var(--grey-900);
   display: flex;
   height: 56px;
}
.search-input-container input {
   height: auto;
   width: 100%;
   padding-left: 10px;
   border-radius: 8px;
   background: white;
}

.search-input-container i {
   color: var(--blue-500);
   font-size: 20px;
   padding: 16px;
   margin-right: 10px;
}

.ag-header,
.ag-advanced-filter-header,
.ag-column-drop-horizontal {
   border-bottom: 0;
}
.ag-pinned-right-header,
.ag-cell.ag-cell-first-right-pinned:not(.ag-cell-range-left):not(
      .ag-cell-range-single-cell
   ) {
   border-left: 0;
}
/* .p-datatable-tbody{ */
/* height: 500px !important; */
/* } */
.ag-root-wrapper {
   border: 0 !important;
}
/* .ag-row:hover{ */
/* transform: scale(1.05) !important; */
/* } */
.grid-container {
   padding: 24px;
   background: var(--grey-50);
   border-radius: 8px;
   height: 100%;
}
.grid-container .ag-theme-quartz,
.ag-root-wrapper-body.ag-layout-normal {
   height: 100% !important;
}

/* .ag-header-cell-comp-wrapper{
  padding:0 12px !important;
  background: var(--grey-300) !important;
} */
.ag-header {
   background: white !important;
}
.ag-header-cell-resize {
   /* right: 0px !important; */
   /* width: 8px !important; */
   background: white !important;
}
.ag-ltr .ag-header-viewport .ag-header-cell-resize::after,
.ag-ltr .ag-header-viewport .ag-header-cell-resize::before {
   display: none !important;
}
.ag-column-first,
.ag-column-last,
.ag-header-cell {
   background: var(--grey-300) !important;
}
.ag-body-viewport .ag-column-first,
.ag-body-viewport .ag-column-last,
.ag-column-drop {
   background: white !important;
}
.ag-header-viewport {
   background: var(--grey-300) !important;
   margin: 0 5px !important;
}
.ag-cell {
   margin: 0 5px !important;
}
.ag-column-first {
   margin: 0 !important;
}
.ag-pinned-left-header,
.ag-ltr .ag-cell {
   border-right: 0 !important;
}
.ag-hidden {
   /* display: block !important; */
   /* visibility: visible !important; */
}

.grid-container .ag-popup {
   height: 0px !important;
}

@media screen and (max-width: 600px) {
   .grid-pc{
      display: none;
   }
   .grid-card-container{
      display: flex;
   }
}
</style>