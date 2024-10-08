<template>
  <div class="management-section">
    <h3>Manage Products</h3>
    <button @click="addProduct">Add Product</button>
    <table>
      <thead>
        <tr>
          <th @click="sortBy('productId')">ID</th>
          <th @click="sortBy('name')">Name</th>
          <th @click="sortBy('description')">Description</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in sortedProducts" :key="product.productId">
          <td>{{ product.productId }}</td>
          <td>{{ product.name }}</td>
          <td>{{ product.description }}</td>
          <td>
            <button @click="deleteProduct(product.productId)">Delete</button>
          </td>
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
      products: [],
      sortKey: '',
      sortAsc: true
    };
  },
  computed: {
    sortedProducts() {
      return [...this.products].sort((a, b) => {
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
    async fetchProducts() {
      try {
        const response = await axios.get('http://localhost:8080/ecommerce/products/all');
        this.products = response.data.map(product => ({
          productId: product.productId,
          name: product.name,
          description: product.description,  // Include description
        }));
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    },
    async addProduct() {
      const name = prompt("Enter the product name:", "");
      if (!name) return;
      const description = prompt("Enter the product description:", "");
      if (!description) return;
      const price = parseFloat(prompt("Enter the product price:", ""));
      if (isNaN(price)) {
        alert("Invalid price. Please enter a valid number.");
        return;
      }

      const newProduct = { name, description, price };

      try {
        const response = await axios.post('http://localhost:8080/ecommerce/products/create', newProduct);
        if (response.status === 200 || response.status === 201) {
          this.products.push(response.data); // Add the new product to the list
          alert('Product added successfully!');
        }
      } catch (error) {
        console.error('Failed to add product:', error);
        alert('Failed to add product. Please try again.');
      }
    },
    async deleteProduct(id) {
      try {
        const response = await axios.delete(`http://localhost:8080/ecommerce/products/delete/${id}`);
        if (response.status === 200 || response.status === 204) {
          this.products = this.products.filter(product => product.productId !== id);
          alert(`Product with ID ${id} deleted successfully!`);
        }
      } catch (error) {
        console.error('Failed to delete product:', error);
        alert('Failed to delete product. Please try again.');
      }
    }
  },
  mounted() {
    this.fetchProducts();
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
  background-color: #3498db;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #2980b9;
}
</style>
