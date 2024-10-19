<template>
  <div class="container">
    <header class="header">
      <h1 class="center-align">Login</h1>
    </header>
    <form @submit.prevent="login">
      <div class="row">
        <div class="input-field col s12">
          <input id="email" type="email" v-model="email" required>
          <label for="email">Email</label>
        </div>
      </div>
      <div class="row">
        <div class="input-field col s12">
          <input id="password" type="password" v-model="password" required>
          <label for="password">Password</label>
        </div>
      </div>
      <button class="btn waves-effect waves-light" type="submit" name="action">Login</button>
      <button class="btn btn-secondary waves-effect waves-light" type="button" @click="cancel">Back</button>
    </form>
    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script>
import axios from 'axios'; 

export default {
  name: 'LoginPage',
  data() {
    return {
      email: '',
      password: '',
      message: ''
    };
  },
  methods: {
  async login() {
      // Simple validation checks
      if (!this.validateEmail(this.email)) {
        this.message = 'Please enter a valid email address.';
        return;
      }
      if (this.password.length < 6) {
        this.message = 'Password must be at least 6 characters long.';
        return;
      }

      try {
        const loginData = {
          email: this.email,
          password: this.password
        };

        const response = await axios.post('http://localhost:8080/ecommerce/customer/login', loginData, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

       

        if (response.data) {
          // Assuming the response contains the customer object
          const customer = response.data;
          const token = response.data.jwt;

          // Extract necessary information
          const userInfo = {
            userId: customer.userId,
            userName: customer.userName,
            role: customer.role,
            contact: customer.contact,
          };

          
         
          localStorage.setItem('user-info', JSON.stringify(userInfo));
          localStorage.setItem('token',JSON.stringify(token));

          this.message = 'Login successful!';

          // Redirect based on role
          if (customer.role.toLowerCase() === 'customer') {
            this.$router.push('/homepage');
          } else if (customer.role.toLowerCase() === 'admin') {
            this.$router.push('/admin');
          } else {
            this.message = 'Unknown role. Please contact support.';
          }
        } else {
          this.message = 'Login failed. Please check your credentials.';
        }
      } catch (error) {
        console.error('Login error:', error);
        this.message = 'Failed to login. Please try again later.';
      }
    },

    validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(String(email).toLowerCase());
    },

    cancel() {
      window.history.back();
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 30px;
  background-color: var(--background-color);
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  align-items: center;
  justify-content: center;
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

.input-field {
  position: relative;
}

.btn {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: auto;
  padding: 10px 20px;
  font-size: 1em;
  border-radius: 5px;
  transition: background-color 0.3s, transform 0.3s;
  margin-right: 10px;
}

.btn-primary {
  background-color: #42b983;
  border: none;
  color: #fff;
}

.btn-primary:hover {
  background-color: rgba(0, 117, 11, 0.86);
  transform: scale(1.05);
}

.btn-secondary {
  background-color: #dc3545;
  border: none;
  color: #fff;
}

.btn-secondary:hover {
  background-color: rgba(168, 0, 0, 0.85);
  transform: scale(1.05);
}
</style>
