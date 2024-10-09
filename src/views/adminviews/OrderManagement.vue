<template>
  <div class="management-section">
    <h3>Manage Orders</h3>
    <table>
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Customer Name</th>
          <th>Order Date</th>
          <th>Amount</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id">
          <td>{{ order.id }}</td>
          <td>{{ order.customer.userName }}</td>
          <td>{{ formatDate(order.date) }}</td>
          <td>{{ order.product.price }}</td>
          <td>Delivered</td>
          <td><button @click="deleteOrder(order.id)">Delete</button></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      orders: [] // Will hold the orders fetched from the API
    };
  },
  methods: {
    // Fetch orders from the API
    async fetchOrders() {
      try {
        const response = await axios.get('http://localhost:8080/ecommerce/api/product-customer/done-processed?customerId=4');
        this.orders = response.data;
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    },
    
    // Delete order from the list (This is frontend only, backend API needed for actual delete)
    deleteOrder(id) {
      this.orders = this.orders.filter(order => order.id !== id);
    },

    // Format date
    formatDate(date) {
      if (date) {
        const formattedDate = new Date(date);
        return formattedDate.toLocaleDateString();
      }
      return 'N/A';
    }
  },
  mounted() {
    this.fetchOrders(); // Fetch orders when the component is mounted
  }
};
</script>

<style scoped>
.management-section {
  background-color: #fff;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  text-align: left;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

button {
  padding: 5px 10px;
  background-color: #e74c3c;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #c0392b;
}
</style>
