<template>
  <div class="container">
    <header class="header">
      <h1>Order Confirmation</h1>
    </header>
    <div v-if="loading" class="spinner"></div>
    <div v-else>
      <!-- Order Confirmation Details -->
      <div class="confirmation-details">
        <h2>Thank You for Your Purchase!</h2>
        <p>Your order has been successfully placed.</p>

        <h3>Order Summary:</h3>
        <ul class="list-group">
          <li v-for="item in order.items" :key="item.id" class="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <h5>{{ item.name }}</h5>
              <p>${{ item.price }} x {{ item.quantity }}</p>
            </div>
          </li>
        </ul>

        <div class="order-details">
          <p><strong>Order Number:</strong> {{ order.orderNumber }}</p>
          <p><strong>Estimated Delivery Date:</strong> {{ order.estimatedDeliveryDate }}</p>
        </div>

        <div class="shipping-address">
          <h3>Shipping Address</h3>
          <p>{{ order.shippingAddress }}</p>
          <button @click="editAddress" class="btn btn-secondary mt-3">Edit Address</button>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
  name: 'OrderConfirmationPage',
  setup() {
    const order = ref({
      orderNumber: '',
      estimatedDeliveryDate: '',
      items: [],
      shippingAddress: ''
    });
    const loading = ref(true);

    const fetchOrderDetails = async () => {
      const orderId = getOrderIdFromURL(); // Extract orderId from URL
      try {
        const response = await axios.get(`http://localhost:8080/api/orders/${orderId}`);
        order.value = response.data;
      } catch (error) {
        console.error('Error fetching order details:', error);
      } finally {
        loading.value = false;
      }
    };

    const editAddress = () => {
      // Redirect to address editing page or show an address edit modal
      window.location.href = `/edit-address/${order.value.orderNumber}`;
    };

    const getOrderIdFromURL = () => {
      // Extract orderId from URL
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('orderId');
    };

    onMounted(fetchOrderDetails);

    return {
      order,
      loading,
      editAddress
    };
  }
};
</script>

<style scoped>
:root {
  --primary-color: rgba(6, 237, 23, 0.9);
  --danger-color: #dc3545;
  --secondary-color: #6c757d;
  --link-color: #17a2b8;
  --background-color: #f9f9f9;
  --text-color: #333;
  --font-family: 'Georgia', serif;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 30px;
  background-color: var(--background-color);
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
  background-image: url('https://wallpaperaccess.com/full/1880033.jpg');
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  padding: 20px;
  border-radius: 10px;
  position: relative;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.header::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
}

h1 {
  font-family: var(--font-family);
  color: #a8f4ff;
  position: relative;
  z-index: 1;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: var(--primary-color);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.confirmation-details {
  padding: 20px;
  background-color: var(--background-color);
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.shipping-address {
  margin-top: 20px;
}

.shipping-address p {
  margin: 0;
  font-size: 1em;
}

.btn-secondary {
  background-color: var(--secondary-color);
  color: black;
}

.btn-secondary:hover {
  background-color: #5a6268;
}

.list-group-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-bottom: 10px;
  background-color: #fff;
  transition: background-color 0.3s, transform 0.3s;
}

.list-group-item:hover {
  background-color: #f1f1f1;
  transform: scale(1.02);
}

.list-group-item h5 {
  margin: 0;
  font-size: 1.1em;
  color: var(--text-color);
}

.list-group-item p {
  margin: 0;
  color: #555;
}

@media (max-width: 768px) {
  .container {
    padding: 20px;
  }

  .header {
    flex-direction: column;
    text-align: center;
  }

  .list-group-item {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>