<template>
  <div id="app" class="app-container">
    <nav>
      <div class="nav-wrapper">
        <ul id="nav-mobile" class="left">
          <li><router-link to="/"><i class="material-icons">home</i></router-link></li>
        </ul>
        <a href="#" class="brand-logo">Hardware Store</a>
        <ul id="nav-mobile" class="right">
          <li v-if="!isLoggedIn"><router-link to="/login">Login</router-link></li>
          <li v-if="!isLoggedIn"><router-link to="/register">Register</router-link></li>
          <li v-if="isLoggedIn">{{ user.name }} {{ user.surname }}</li>
          <li v-if="isLoggedIn"><a @click="logout">Logout</a></li>
          <li class="cart-icon-wrapper">
            <router-link to="/cart">
              <i class="material-icons">shopping_cart</i>
              <span class="cart-count">{{ cartCount }}</span>
              <span class="cart-value">${{ cartValue.toFixed(2) }}</span>
            </router-link>
          </li>
        </ul>
      </div>
    </nav>
    <router-view :updateCartCount="updateCartCount" :resetCartCount="resetCartCount" />
    <PageFooter />
  </div>
</template>

<script>
import PageFooter from './components/Footer.vue';
import { getUserDetails, logoutUser } from '@/services/userService';

export default {
  name: 'App',
  components: {
    PageFooter
  },
  data() {
    return {
      cartCount: 0, // Holds the count of items in the cart
      cartValue: 0.00, // Holds the total value of items in the cart
      isLoggedIn: false,
      user: {
        name: '',
        surname: ''
      }
    };
  },
  mounted() {
    this.checkUserStatus();
    this.fetchCartData();
  },
  methods: {
    // Fetch initial cart data, could be from an API or localStorage
    fetchCartData() {
      setTimeout(() => {
        this.cartCount = 0;
        this.cartValue = 0.00;
      }, 1000);
    },
    // Increment the cart count when a product is added
    updateCartCount(amount, price) {
      this.cartCount += amount;
      this.cartValue += price * amount;
    },
    // Reset the cart count after checkout
    resetCartCount() {
      this.cartCount = 0;
      this.cartValue = 0.00;
    },
    async checkUserStatus() {
      try {
        const userDetails = await getUserDetails();
        this.user = userDetails;
        this.isLoggedIn = true;
      } catch (error) {
        this.isLoggedIn = false;
      }
    },
    async logout() {
      try {
        await logoutUser();
        this.isLoggedIn = false;
        this.user = { name: '', surname: '' };
      } catch (error) {
        console.error('Failed to logout:', error);
      }
    }
  }
};
</script>

<style>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 70vh;
}
.nav-wrapper {
  padding: 0 20px;
  background-color: #333;
}
.nav-wrapper .left,
.nav-wrapper .right {
  display: flex;
  align-items: center;
}
ul#nav-mobile.left {
  margin: 0;
  padding: 0;
  flex: 1;
}
.brand-logo {
  color: white;
  flex: 2;
  text-align: center;
}
ul#nav-mobile li {
  display: flex;
  align-items: center;
  margin: 0 10px;
}
.material-icons {
  vertical-align: middle;
  color: white;
}
.cart-icon-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}
.cart-count {
  position: absolute;
  top: 4px;
  right: 43px;
  background-color: red;
  color: white;
  border-radius: 50%;
  padding: 4px 8px;
  font-size: 10px;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.cart-value {
  margin-top: 13px;
  margin-left: 14px;
  font-weight: bold;
  vertical-align: middle;
  color: white;
}
.empty-cart {
  color: grey;
  margin-left: 10px;
}
ul#nav-mobile.right li {
  margin: 0;
}
ul#nav-mobile.right li a {
  color: white;
  padding: 0 10px;
  display: flex;
  align-items: center;
  font-size: 14px;
}
</style>
