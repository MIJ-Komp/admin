<template>
  <div class="dashboard-container">
    <!-- Filter Section -->
    <div class="filter-container">
      <b-row>
        <!-- <b-col lg="4">
          <SelectModuleBox 
            label="Kategori Produk" 
            v-model="dataFilter.filterCategory"
            :module="$module.productCategory"
          />
        </b-col> -->
        <b-col lg="12">
          <b-row>
            <b-col md="6" class="mb-2">
              <DateBox 
               labelType="out"
                label="Dari Tanggal" 
                v-model="dataFilter.startDate"
                :max="dataFilter.endDate"
              />
            </b-col>
            <b-col md="6" class="mb-2">
              <DateBox 
               labelType="out"
                label="Sampai Tanggal" 
                v-model="dataFilter.endDate"
                :min="dataFilter.startDate"
              />
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </div>

    <!-- Summary Cards -->
    <b-row class="mb-4">
      <b-col md="3" class="mb-2" v-for="(card, index) in summaryCards" :key="index">
        <div class="content-container summary-card" :class="card.class">
          <div class="card-icon">
            <i :class="card.icon"></i>
          </div>
          <div class="card-content">
            <h6>{{ card.title }}</h6>
            <h4 v-if="card.isCurrency">Rp {{ formatCurrency(card.value) }}</h4>
            <h4 v-else>{{ card.value }}</h4>
          </div>
        </div>
      </b-col>
    </b-row>

    <!-- Stock Alert & Best Selling Products -->
    <b-row>
      <b-col lg="6" class="mb-2">
        <div class="content-container table-card">
          <div class="card-header">
            <h6>Stok Menipis</h6>
            <b-badge variant="warning" pill>{{ dashboardData.stockAlert.length }}</b-badge>
          </div>
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>Nama Produk</th>
                  <th>Stok</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in dashboardData.stockAlert" 
                    :key="item.id"
                    class="table-row-animate">
                  <td>{{ item.name }}</td>
                  <td>
                    <b-badge variant="danger">{{ item.stock }}</b-badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </b-col>
      <b-col lg="6" class="mb-2">
        <div class="content-container table-card">
          <div class="card-header">
            <h6>Produk Terlaris</h6>
            <b-badge variant="success" pill>{{ dashboardData.bestSellingProduct.length }}</b-badge>
          </div>
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>Nama Produk</th>
                  <th>Terjual</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in dashboardData.bestSellingProduct" 
                    :key="item.id"
                    class="table-row-animate">
                  <td>{{ item.name }}</td>
                  <td>
                    <b-badge variant="success">{{ item.sold }}</b-badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import module from '../constant/module';

export default {
  data() {
    return {
      dataFilter: {
      //   filterCategory: null,
        startDate: this.getFirstDayOfMonth(),
        endDate: this.getLastDayOfMonth()
      }
    };
  },
  computed: {
    ...mapState(module.dashboard.name, {
      dashboardData: state => ({
        totalSales: state.totalSales,
        totalOrder: state.totalOrder,
        totalPendingOrder: state.totalPendingOrder,
        totalActiveProduct: state.totalActiveProduct,
        stockAlert: state.stockAlert,
        bestSellingProduct: state.bestSellingProduct
      })
    }),
    summaryCards() {
      return [
        {
          title: 'Total Penjualan',
          value: this.dashboardData.totalSales,
          icon: 'fas fa-money-bill-wave',
          class: 'sales-card',
          isCurrency: true
        },
        {
          title: 'Total Order',
          value: this.dashboardData.totalOrder,
          icon: 'fas fa-shopping-cart',
          class: 'order-card',
          isCurrency: false
        },
        {
          title: 'Order Pending',
          value: this.dashboardData.totalPendingOrder,
          icon: 'fas fa-clock',
          class: 'pending-card',
          isCurrency: false
        },
        {
          title: 'Produk Aktif',
          value: this.dashboardData.totalActiveProduct,
          icon: 'fas fa-box',
          class: 'product-card',
          isCurrency: false
        }
      ];
    }
  },
  methods: {
    ...mapActions(module.dashboard.name, ['getDashboardData']),
    formatCurrency(money) {
      if (!money) return '0';
      return money.toLocaleString('id-ID');
    },
    getFirstDayOfMonth() {
      const date = new Date();
      return new Date(date.getFullYear(), date.getMonth(), 1);
    },
    getLastDayOfMonth() {
      const date = new Date();
      return new Date(date.getFullYear(), date.getMonth() + 1, 0);
    },
    async fetchDashboardData() {
      await this.getDashboardData(this.dataFilter);
    }
  },
  async mounted() {
    await this.fetchDashboardData();
  },
  watch: {
    dataFilter: {
      deep: true,
      async handler() {
        await this.fetchDashboardData();
      }
    }
  }
};
</script>

<style scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  overflow: auto;
  max-height: 100vh;
  padding: 16px;
}

.filter-container {
  max-width: 100%;
  padding: 20px 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 24px;
  transition: all 0.3s ease;
}

.content-container {
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-radius: 12px;
  background-color: white;
  height: 100%;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.summary-card {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 24px;
  transform: translateY(0);
  transition: all 0.3s ease;
}

.summary-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.card-icon {
  font-size: 2rem;
  margin-right: 16px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.sales-card .card-icon { background-color: rgba(76, 175, 80, 0.1); color: #4CAF50; }
.order-card .card-icon { background-color: rgba(33, 150, 243, 0.1); color: #2196F3; }
.pending-card .card-icon { background-color: rgba(255, 152, 0, 0.1); color: #FF9800; }
.product-card .card-icon { background-color: rgba(156, 39, 176, 0.1); color: #9C27B0; }

.card-content {
  flex-grow: 1;
}

.card-content h6 {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.card-content h4 {
  margin: 8px 0 0;
  font-weight: 600;
  color: #333;
}

.table-card {
  margin-bottom: 24px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
}

.table-responsive {
  overflow-x: auto;
  margin: 0 -20px;
  padding: 0 20px;
}

.table {
  width: 100%;
  margin-bottom: 0;
}

.table th {
  border-top: none;
  font-weight: 600;
  color: #666;
  padding: 12px 16px;
}

.table td {
  padding: 16px;
  vertical-align: middle;
  border-top: 1px solid #eee;
}

.table-row-animate {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Responsive Adjustments */
@media (max-width: 992px) {
  .dashboard-container {
    padding: 12px;
  }
  
  .summary-card {
    margin-bottom: 16px;
  }
}
</style>