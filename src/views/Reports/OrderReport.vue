<template>
  <div class="report-container">
    <h4>Laporan Order</h4>
    
    <div class="status-filters">
      <button 
        v-for="status in orderStatuses" 
        :key="status.code"
        :class="{ active: activeStatus === status.code }"
        @click="activeStatus = status.code"
      >
        {{ status.name }}
      </button>
    </div>
    
    <div class="order-list">
      <div 
        v-for="order in filteredOrders" 
        :key="order.id" 
        class="order-card"
        :class="order.status.code"
      >
        <div class="order-header">
          <span class="order-code fw-bold">{{ order.code }}</span>
          <span class="order-date">{{ formatDate(order.orderDate) }}</span>
          <span class="order-status" :class="order.status.code">
            {{ order.status.name }}
          </span>
        </div>
        
        <div class="order-details">
          <div class="customer-info">
            <h6>{{ order?.customerInfo?.name }}</h6>
            <div>{{ order?.customerInfo?.email }}</div>
            <div>{{ order?.customerInfo?.phoneNumber }}</div>
          </div>
          
          <div class="order-items">
            <div 
              v-for="item in order.orderItems" 
              :key="item.id" 
              class="order-item"
            >
              <span class="item-name">{{ item.product.name || 'Produk tidak tersedia' }}</span>
              <span class="item-qty">{{ item.quantity }} x {{ formatCurrency(item.price) }}</span>
              <span class="item-total">{{ formatCurrency(item.quantity * item.price) }}</span>
            </div>
          </div>
        </div>
        
        <div class="order-footer">
          <button 
            v-if="order.paymentUrl" 
            class="payment-button"
            @click="openPayment(order.paymentUrl)"
          >
            Lihat Xendit Status <span class="fw-bold" v-if="order.isPaid">Sudah Dibayar</span>
          </button>
          <span v-else-if="order.isPaid" class="paid-label">
            Sudah Dibayar
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import module from '../../constant/module'
export default {
  data() {
    return {
      activeStatus: 'all',
      orderStatuses: [
        { code: 'all', name: 'Semua' },
        { code: 'pending', name: 'Pending' },
        { code: 'paid', name: 'Telah Dibayar' },
        { code: 'preparing', name: 'Diproses' },
        { code: 'shipped', name: 'Dikirim' },
        { code: 'arrived', name: 'Tiba di Tujuan' },
        { code: 'completed', name: 'Selesai' },
        { code: 'cancelled', name: 'Dibatalkan' }
      ],
      orders: [] // Data order dari props atau API
    }
  },
  computed: {
    filteredOrders() {
      if (this.activeStatus === 'all') return this.orders
      return this.orders.filter(order => order.status.code === this.activeStatus)
    }
  },
  methods: {
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' }
      return new Date(dateString).toLocaleDateString('id-ID', options)
    },
    formatCurrency(value) {
      return new Intl.NumberFormat('id-ID', { 
        style: 'currency', 
        currency: 'IDR',
        minimumFractionDigits: 0
      }).format(value)
    },
    openPayment(url) {
      window.open(url, '_blank')
    },
    ...mapActions(module.payment.name, ['getAll'])
  },
  async created() {

    this.orders = await this.getAll()
  }
}
</script>

<style scoped>
.order-report {
  padding: 20px;
}

.status-filters {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.status-filters button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 20px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.status-filters button.active {
  background: #3498db;
  color: white;
  border-color: #3498db;
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.order-card {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 15px;
  background: white;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

.order-card.pending {
  border-left: 4px solid #f39c12;
}

.order-card.preparing {
  border-left: 4px solid #3498db;
}

.order-card.completed {
  border-left: 4px solid #2ecc71;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f5f5f5;
}

.order-status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
}

.order-status.pending {
  background: #f39c12;
  color: white;
}

.order-status.preparing {
  background: #3498db;
  color: white;
}

.order-status.completed {
  background: #2ecc71;
  color: white;
}

.order-details {
  display: flex;
  gap: 20px;
}

.customer-info {
  flex: 1;
}

.order-items {
  flex: 2;
}

.order-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.order-footer {
  margin-top: 15px;
  padding-top: 10px;
  border-top: 1px solid #f5f5f5;
  text-align: right;
}

.payment-button {
  padding: 8px 16px;
  background: #27ae60;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.payment-button:hover {
  background: #219653;
}

.paid-label {
  color: #27ae60;
  font-weight: bold;
}
</style>