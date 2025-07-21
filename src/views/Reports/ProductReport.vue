<template>
  <div class="report-container">
    <h4>Laporan Produk</h4>
    
    <div class="report-tabs">
      <button @click="activeTab = 'bestSeller'" :class="{ active: activeTab === 'bestSeller' }">Produk Terlaris</button>
      <button @click="activeTab = 'lowStock'" :class="{ active: activeTab === 'lowStock' }">Stok Menipis</button>
      <button @click="activeTab = 'inactive'" :class="{ active: activeTab === 'inactive' }">Tidak Aktif</button>
    </div>
    
    <div v-if="activeTab === 'bestSeller'">
      <table>
        <thead>
          <tr>
            <th>Produk</th>
            <th>Kategori</th>
            <th>Terjual</th>
            <th>Pendapatan</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in bestSellers" :key="product.id">
            <td>{{ product.name }}</td>
            <td>{{ product.category }}</td>
            <td>{{ product.sold }}</td>
            <td>{{ formatCurrency(product.revenue) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div v-if="activeTab === 'lowStock'">
      <table>
        <thead>
          <tr>
            <th>Produk</th>
            <th>Stok Tersedia</th>
            <th>Stok Minimum</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in lowStockProducts" :key="product.id">
            <td>{{ product.name }}</td>
            <td :class="{ 'text-red-500': product.stock < product.minStock }">{{ product.stock }}</td>
            <td>{{ product.minStock }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div v-if="activeTab === 'inactive'">
      <table>
        <thead>
          <tr>
            <th>Produk</th>
            <th>Kategori</th>
            <th>Status</th>
            <th>Terakhir Dilihat</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in inactiveProducts" :key="product.id">
            <td>{{ product.name }}</td>
            <td>{{ product.category }}</td>
            <td>{{ product.status }}</td>
            <td>{{ formatDate(product.lastSeen) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeTab: 'bestSeller',
      bestSellers: [],
      lowStockProducts: [],
      inactiveProducts: []
    }
  },
  methods: {
    async fetchBestSellers() {
      try {
        const response = await this.$store.dispatch('reports/getBestSellers')
        this.bestSellers = response.data
      } catch (error) {
        console.error('Gagal memuat produk terlaris:', error)
      }
    },
    async fetchLowStock() {
      try {
        const response = await this.$store.dispatch('reports/getLowStock')
        this.lowStockProducts = response.data
      } catch (error) {
        console.error('Gagal memuat stok menipis:', error)
      }
    },
    async fetchInactive() {
      try {
        const response = await this.$store.dispatch('reports/getInactiveProducts')
        this.inactiveProducts = response.data
      } catch (error) {
        console.error('Gagal memuat produk tidak aktif:', error)
      }
    },
    formatCurrency(value) {
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value)
    },
    formatDate(date) {
      return date ? new Date(date).toLocaleDateString('id-ID') : '-' 
    }
  },
  watch: {
    activeTab() {
      if (this.activeTab === 'bestSeller') this.fetchBestSellers()
      else if (this.activeTab === 'lowStock') this.fetchLowStock()
      else this.fetchInactive()
    }
  },
  created() {
    this.fetchBestSellers()
  }
}
</script>


<style>
@import './ReportStyles.css';
</style>