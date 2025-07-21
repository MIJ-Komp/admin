<template>
  <div class="report-container">
    <h4>Laporan Stok</h4>
    
    <div class="report-filters">
      <select v-model="movementType">
        <option value="all">Semua Mutasi</option>
        <option value="in">Masuk</option>
        <option value="out">Keluar</option>
        <option value="adjustment">Penyesuaian</option>
      </select>
      
      <date-picker v-model="dateRange" range />
    </div>
    
    <div class="report-table">
      <table>
        <thead>
          <tr>
            <th>Tanggal</th>
            <th>Produk</th>
            <th>Jenis Mutasi</th>
            <th>Jumlah</th>
            <th>Stok Akhir</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="movement in stockMovements" :key="movement.id">
            <td>{{ formatDate(movement.date) }}</td>
            <td>{{ movement.productName }}</td>
            <td>{{ movement.type }}</td>
            <td :class="{ 
              'text-green-500': movement.type === 'in', 
              'text-red-500': movement.type === 'out'
            }">
              {{ movement.quantity }}
            </td>
            <td>{{ movement.finalStock }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div class="stock-alerts">
      <h3>Alert Stok Minimum</h3>
      <ul>
        <li v-for="alert in stockAlerts" :key="alert.productId" class="alert-item">
          {{ alert.productName }} - Stok: {{ alert.currentStock }} (Minimum: {{ alert.minStock }})
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      movementType: 'all',
      dateRange: [new Date(), new Date()],
      stockMovements: [],
      stockAlerts: []
    }
  },
  methods: {
    async fetchStockMovements() {
      try {
        const response = await this.$store.dispatch('reports/getStockMovements', {
          type: this.movementType,
          startDate: this.dateRange[0],
          endDate: this.dateRange[1]
        })
        this.stockMovements = response.data.movements
        this.stockAlerts = response.data.alerts
      } catch (error) {
        console.error('Gagal memuat mutasi stok:', error)
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('id-ID')
    }
  },
  watch: {
    movementType() { this.fetchStockMovements() },
    dateRange() { this.fetchStockMovements() }
  },
  created() { this.fetchStockMovements() }
}
</script>

<style>
@import './ReportStyles.css';
</style>