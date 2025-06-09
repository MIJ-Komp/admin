<template>
    <div class="grid-container">
      <ag-grid-vue
        :ref="ref"
        :id="`grid-${module.name}`"
        class="ag-theme-quartz"
        :gridOptions="gridOptions"
        :columnDefs="computedColumns"
        :rowData="currentValue"
        :defaultColDef="defaultColDef"
        :autoGroupColumnDef="autoGroupColumnDef"
        :suppressDragLeaveHidesColumns="true"
        :suppressMakeColumnVisibleAfterUnGroup="true"
        :suppressRowGroupHidesColumns="true"
        :rowGroupPanelShow="rowGroupPanelShow"
        :suppressHeaderMenuButton="false"
        :paginationPageSizeSelector="[100, 200, 500, 1000]"
        :pagination="true"
        @rowDoubleClicked="rowDoubleClicked"
      />
    </div>
  </template>
  
  <script>
  import { onBeforeMount, ref, shallowRef } from "vue";
  // import "ag-grid-community/styles/ag-grid.css";
  // import "ag-grid-community/styles/ag-theme-quartz.css";
  import { AgGridVue } from "ag-grid-vue3";
  
  // import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
  // import { ModuleRegistry } from "@ag-grid-community/core";
  import "ag-grid-enterprise";
  // import { ColumnsToolPanelModule } from "@ag-grid-enterprise/column-tool-panel";
  // import { FiltersToolPanelModule } from "@ag-grid-enterprise/filter-tool-panel";
  // import { MenuModule } from "@ag-grid-enterprise/menu";
  // import { SetFilterModule } from "@ag-grid-enterprise/set-filter";
  // import { RowGroupingModule } from "@ag-grid-enterprise/row-grouping";
  
  // import { LicenseManager } from "ag-grid-enterprise";
  // LicenseManager.setLicenseKey(
  //   "ag-Grid_Evaluation_License_Not_for_Production_100Devs30_August_2037__MjU4ODczMzg3NzkyMg==9e93ed5f03b0620b142770f2594a23a2"
  // );
  
  // ModuleRegistry.registerModules([
  //   ClientSideRowModelModule,
  //   ColumnsToolPanelModule,
  //   FiltersToolPanelModule,
  //   MenuModule,
  //   SetFilterModule,
  //   RowGroupingModule,
  // ]);
  
  export default {
    async beforeMount() {
      try {
        if (this.module && this.module.name) {
          this.columns = [];
          const tmp = () =>
            import(
              /* @vite-ignore */ `../constant/columns/${this.module.name}.js`
            );
          this.columns = (await tmp()).default;
  
          // Remove the last column's resizable property if columns exist
          if (this.columns.length > 0) {
            this.columns[this.columns.length - 1].resizable = false;
          }
  
          // Remove the action column if it exists
        //   this.columns = this.columns.filter(
        //     (col) => col.headerName !== "Action"
        //   );
  
          // Add the eye icon column if it doesn't exist
          if (!this.columns.find((data) => data.headerName === "Action")) {
            this.columns.push({
              headerName: "Action",
              field: "Action",
              lockPosition: "right",
              cellClass: "view-grid",
              minWidth: 100,
              maxWidth: 100,
              filter: false,
              enableRowGroup: false,
              sortable: false,
              resizable: false,
              cellRenderer: this.eyeIconCellRenderer,
              width: 100,
              pinned: "right",
            });
          }
        } else {
          this.columns = [];
        }
        await this.refreshData();
      } catch (err) {
        console.error(err);
        this.columns = [];
      }
      this.$forceUpdate();
    },
    computed: {
      ref() {
        return `grid-${this.module.name}`;
      },
      computedColumns() {
        return this.columns;
      },
    },
    setup() {
      const gridApi = shallowRef();
      const defaultColDef = ref({
        flex: 1,
        minWidth: 150,
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
  
      const onGridReady = (params) => {
        gridApi.value = params.api;
      };
  
      const clearFilters = () => {
        gridApi.value.setFilterModel(null);
      };
  
      return {
        gridApi,
        defaultColDef,
        onGridReady,
        themeClass: "ag-theme-quartz",
        clearFilters,
        autoGroupColumnDef,
        rowGroupPanelShow,
      };
    },
    name: "AGrid",
    components: {
      AgGridVue,
    },
    props: {
      module: {
        required: false,
        default: () => ({}),
      },
      queryParams: {},
      searchKeyword: {
        type: String,
        required: false,
        default: "",
      },
      actionContext: {
        type: Object,
        required: false,
        default: null,
      },
      showActionButton: {
        type: Boolean,
        required: false,
        default: true,
      },
    },
    data() {
      return {
        currentValue: [],
        columns: [],
        gridOptions: {},
        hasLoadData: false,
        onLoad: false,
        sourceData: [],
      };
    },
    watch: {
      searchKeyword: {
        immediate: true,
        async handler(newVal) {
          if (!newVal) {
            this.currentValue = [...this.sourceData];
          }
          if (!this.hasLoadData) {
            await this.refreshData();
          }
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
        },
      },
    },
    methods: {
      // Cell renderer function for the eye icon
      eyeIconCellRenderer(params) {
        const button = document.createElement("button");
        button.classList.add("btn", "btn-link", "p-0", "m-0");
        button.innerHTML =
          'click'; // Using Bootstrap Icons
  
        button.addEventListener("click", () => {
          this.onEyeIconClick(params);
        });
  
        return button;
      },
      onEyeIconClick(params) {
        // Implement the logic you want when the eye icon is clicked
        // For example, show a modal with details, or perform an inline action
        // Here, we'll just show an alert with the row data
  
        alert(`Row Data: ${JSON.stringify(params.data)}`);
  
        // If you prefer to show a modal, you can trigger it here
        // For example:
        // this.selectedRowData = params.data;
        // this.showDetailModal = true;
      },
      async refreshData() {
        if (this.onLoad) {
          return;
        }
        this.hasLoadData = false;
        this.sourceData = await this.$store.dispatch(
          `${this.module.name}/getAll`,
          this.queryParams
        );
        this.currentValue = [...this.sourceData];
        this.hasLoadData = true;
        this.onLoad = false;
      },
      rowDoubleClicked(event) {
        // Handle double-click on row if needed
        // For now, we'll do nothing or you can implement an action
      },
    },
  };
  </script>
  
  <style scoped>
  .grid-container {
    padding: 24px;
    background: var(--grey-50);
    border-radius: 8px;
    height: 100%;
  }
  .ag-theme-quartz {
    height: 100%;
  }
  .ag-header {
    background: white !important;
  }
  .ag-header-cell-resize {
    right: 0px !important;
    width: 8px !important;
    background: white !important;
  }
  .ag-ltr .ag-header-viewport .ag-header-cell-resize::after {
    display: none !important;
  }
  .ag-column-first,
  .ag-column-last {
    background: var(--grey-300) !important;
  }
  .ag-body-viewport .ag-column-first,
  .ag-body-viewport .ag-column-last,
  .ag-column-drop {
    background: white !important;
  }
  .ag-header-viewport {
    background: var(--grey-300) !important;
    margin: 0 8px !important;
  }
  .ag-pinned-left-header,
  .ag-ltr .ag-cell {
    border-right: 0 !important;
  }
  .ag-hidden {
    visibility: visible !important;
  }
  </style>
  