<template>
  <div class="container">
    <header class="header">
      <h1>Checkout</h1>
    </header>

    <!-- Delivery Method Section -->
    <section class="section">
      <h2>Delivery Method</h2>
      <div class="form-group delivery-methods">
        <label>
          <input type="radio" v-model="deliveryMethod" value="shipping" />
          <span class="custom-radio"></span>
          Shipping
        </label>
        <label>
          <input type="radio" v-model="deliveryMethod" value="pickup" />
          <span class="custom-radio"></span>
          Pick up order in store
        </label>
      </div>
    </section>

    <!-- Shipping Information Section (Visible only if 'Shipping' is selected) -->
    <section class="section" v-if="deliveryMethod === 'shipping'">
      <h2>Shipping Information</h2>
      <div class="form-group">
        <label for="shippingAddress">Shipping Address:</label>
        <input v-model="shippingAddress" type="text" id="shippingAddress" required />
      </div>

      <div class="form-group">
        <label for="city">City:</label>
        <input v-model="city" type="text" id="city" required />
      </div>

      <div class="form-group">
        <label for="postalCode">Postal Code:</label>
        <input v-model="postalCode" type="text" id="postalCode" required />
      </div>

      <div class="form-group">
        <label for="province">Province:</label>
        <input v-model="province" type="text" id="province" required />
      </div>
    </section>

    <!-- Payment Method Section -->
    <section class="section">
      <h2>Payment Method</h2>
      <div class="form-group payment-methods">
        <label>
          <input type="radio" v-model="paymentMethod" value="creditCard" />
          Credit Card
        </label>

        <label>
          <input type="radio" v-model="paymentMethod" value="debitCard" />
          Debit Card
        </label>

        <label>
          <input type="radio" v-model="paymentMethod" value="visa" />
          Visa
        </label>

        <label>
          <input type="radio" v-model="paymentMethod" value="masterCard" />
          MasterCard
        </label>

        <label>
          <input type="radio" v-model="paymentMethod" value="americanExpress" />
          American Express
        </label>
      </div>

      <!-- Card details fields always visible -->
      <div class="form-group card-details">
        <label for="cardNumber">Card Number:</label>
        <input v-model="cardNumber" type="text" id="cardNumber" @input="validateCardNumber" placeholder="Enter your card number" required />
        <small v-if="cardType">{{ cardType }} detected</small>
        <small v-if="cardError" class="error-msg">{{ cardError }}</small>

        <label for="expiryDate">Expiry Date:</label>
        <input v-model="expiryDate" type="text" id="expiryDate" required />

        <label for="cvv">CVV:</label>
        <input v-model="cvv" type="text" id="cvv" required />
      </div>
    </section>

    <!-- Total Amount -->
    <div class="total">
      <strong>Total: ${{ total }}</strong>
    </div>

    <!-- Place Order and Back Buttons -->
    <div class="actions">
      <button @click="goBack" class="btn btn-secondary">Back</button>
      <button @click="placeOrder" class="btn btn-primary">Place Order</button>
    </div>

    <!-- Display success message -->
    <div v-if="successMsg" class="success-msg">{{ successMsg }}</div>
    <!-- Display error message -->
    <div v-if="errorMsg" class="error-msg">{{ errorMsg }}</div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

export default {
  name: 'CheckoutPage',
  setup() {
    const shippingAddress = ref('');
    const city = ref('');
    const postalCode = ref('');
    const province = ref('');
    const paymentMethod = ref('');
    const cardNumber = ref('');
    const expiryDate = ref('');
    const cvv = ref('');
    const cardType = ref('');
    const cardError = ref('');
    const deliveryMethod = ref('');
    const orderItems = ref([]);
    const total = ref(0);
    const errorMsg = ref('');
    const successMsg = ref('');

    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/getAll');
        const orders = response.data;
        if (orders.length > 0) {
          const order = orders[0];
          orderItems.value = order.items;
          total.value = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
      }
    };

    const placeOrder = async () => {
      if (!deliveryMethod.value) {
        errorMsg.value = 'Please select a delivery method.';
        return;
      }

      if (total.value > 0) {
        const orderData = {
          shippingAddress: deliveryMethod.value === 'shipping' ? shippingAddress.value : null,
          city: deliveryMethod.value === 'shipping' ? city.value : null,
          postalCode: deliveryMethod.value === 'shipping' ? postalCode.value : null,
          province: deliveryMethod.value === 'shipping' ? province.value : null,
          paymentMethod: paymentMethod.value,
          cardNumber: requiresCardDetails.value ? cardNumber.value : null,
          expiryDate: requiresCardDetails.value ? expiryDate.value : null,
          cvv: requiresCardDetails.value ? cvv.value : null,
          deliveryMethod: deliveryMethod.value,
          items: orderItems.value,
          totalAmount: total.value,
        };

        try {
          const response = await axios.post('http://localhost:8080/api/create', orderData);

          if (response.status === 200) {
            successMsg.value = 'Order placed successfully!';
            errorMsg.value = '';

            setTimeout(() => {
              window.location.href = '/orderconfirmation';
            }, 1000);
          } else {
            throw new Error('Failed to place the order');
          }
        } catch (error) {
          errorMsg.value = 'Error placing the order.';
          successMsg.value = '';
          console.error('There was a problem with the order placement:', error);
        }
      } else {
        errorMsg.value = 'Your order is empty!';
      }
    };

    const goBack = () => {
      window.history.back();
    };

    const validateCardNumber = () => {
      const number = cardNumber.value.trim();
      if (number.length > 0) {
        if (luhnsAlgorithm(number)) {
          identifyCardType(number);
          cardError.value = '';
        } else {
          cardError.value = 'Invalid card number';
          cardType.value = '';
        }
      } else {
        cardError.value = '';
        cardType.value = '';
      }
    };

    const luhnsAlgorithm = (number) => {
      let sum = 0;
      let shouldDouble = false;

      for (let i = number.length - 1; i >= 0; i--) {
        let digit = parseInt(number[i]);

        if (shouldDouble) {
          digit *= 2;
          if (digit > 9) digit -= 9;
        }
        sum += digit;
        shouldDouble = !shouldDouble;
      }
      return sum % 10 === 0;
    };

    const identifyCardType = (number) => {
      const firstTwoDigits = parseInt(number.substring(0, 2));
      const firstDigit = parseInt(number[0]);

      if (number.length === 15 && (firstTwoDigits === 34 || firstTwoDigits === 37)) {
        cardType.value = 'American Express';
      } else if (number.length === 16 && (firstTwoDigits >= 51 && firstTwoDigits <= 55)) {
        cardType.value = 'MasterCard';
      } else if ((number.length === 13 || number.length === 16) && firstDigit === 4) {
        cardType.value = 'Visa';
      } else {
        cardType.value = '';
      }
    };

    const requiresCardDetails = computed(() => {
      return paymentMethod.value === 'creditCard' || paymentMethod.value === 'debitCard' ||
          paymentMethod.value === 'visa' || paymentMethod.value === 'masterCard' || paymentMethod.value === 'americanExpress';
    });

    onMounted(fetchOrderDetails);

    return {
      shippingAddress,
      city,
      postalCode,
      province,
      paymentMethod,
      cardNumber,
      expiryDate,
      cvv,
      cardType,
      cardError,
      deliveryMethod,
      orderItems,
      total,
      errorMsg,
      successMsg,
      goBack,
      placeOrder,
      validateCardNumber,
      requiresCardDetails,
    };
  },
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

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: var(--primary-color);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

h1 {
  font-family: var(--font-family);
  color: #a8f4ff;
  position: relative;
  z-index: 1;
}

.section h2 {
  font-family: var(--font-family);
  color: var(--primary-color);
  border-bottom: 2px solid var(--primary-color);
  padding-bottom: 10px;
  margin-bottom: 10px;
}

.delivery-methods {
  display: flex;
  flex-direction: column; /* Stacks the items vertically */
  gap: 10px; /* Adds spacing between the items */
}

.delivery-methods label {
  display: flex;
  align-items: center; /* Aligns the radio buttons and text vertically */
}

.delivery-methods input[type="radio"] {
  margin-right: 10px; /* Adds space between the radio button and label */
}

/* Hide the default radio buttons */
input[type="radio"] {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

/* Create a custom radio button appearance */
.custom-radio {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid #ddd;
  border-radius: 50%;
  position: relative;
  margin-right: 10px;
  cursor: pointer;
}

/* When a radio button is checked, style the label */
input[type="radio"]:checked + .custom-radio::after {
  content: '';
  width: 10px;
  height: 10px;
  background-color: black;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

label {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.section {
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 15px;
}

input[type="text"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-sizing: border-box;
}

input[type="radio"],
input[type="checkbox"] {
  margin-right: 10px;
}

.payment-methods {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.card-details {
  margin-top: 15px;
}

.total {
  font-size: 1.5em;
  font-weight: bold;
  margin: 20px 0;
}

.actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.success-msg {
  color: green;
  margin-top: 20px;
}

.error-msg {
  color: red;
  margin-top: 20px;
}
</style>


