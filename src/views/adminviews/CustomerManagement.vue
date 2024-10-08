<template>
  <div class="management-section">
    <h3>Manage Customers</h3>
    <table>
      <thead>
        <tr>
          <th @click="sortBy('userId')">ID</th>
          <th @click="sortBy('userName')">User Name</th>
          <th @click="sortBy('surname')">Surname</th>
          <th @click="sortBy('email')">Email</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="customer in sortedCustomers" :key="customer.userId">
          <td>{{ customer.userId }}</td>
          <td>{{ customer.userName }}</td>
          <td>{{ customer.surname || 'soon' }}</td> <!-- Display 'soon' if surname is null -->
          <td>{{ customer.email || customer.contact.email }}</td>
          <td>
            <button @click="deleteCustomer(customer.userId)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="message" class="success-message">{{ message }}</div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      customers: [],
      sortKey: '',
      sortAsc: true,
      message: '' // Message to show on successful delete
    };
  },
  computed: {
    sortedCustomers() {
      return [...this.customers].sort((a, b) => {
        let result = 0;
        if (a[this.sortKey] < b[this.sortKey]) result = -1;
        if (a[this.sortKey] > b[this.sortKey]) result = 1;
        return this.sortAsc ? result : -result;
      });
    }
  },
  methods: {
    sortBy(key) {
      this.sortKey = key;
      this.sortAsc = !this.sortAsc;
    },
    async fetchCustomers() {
      try {
        const response = await axios.get('http://localhost:8080/customer/getAll');
        this.customers = response.data.map(customer => ({
          userId: customer.userId,
          userName: customer.userName,
          email: customer.email || customer.contact?.email,
          surname: customer.surname || 'soon',
        }));
      } catch (error) {
        console.error('Failed to fetch customers:', error);
      }
    },
    async deleteCustomer(id) {
      try {
        const response = await axios.delete(`http://localhost:8080/customer/delete/${id}`);
        if (response.status === 200) {
          this.message = `Customer with ID ${id} deleted successfully!`;
          // Reload the page to update the customer list
          setTimeout(() => {
            window.location.reload();
          }, 2000); // Reload after 2 seconds to show the message
        }
      } catch (error) {
        console.error('Failed to delete customer:', error);
      }
    }
  },
  mounted() {
    this.fetchCustomers();
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
  cursor: pointer;
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

.success-message {
  margin-top: 20px;
  color: #28a745;
  font-weight: bold;
}
</style>
