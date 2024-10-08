<template>
  <div class="management-section">
    <h3>Manage Products</h3>
    <button @click="openAddProductForm">Add Product</button>
    
    <!-- Modal for Adding Product -->
    <div v-if="isModalOpen" class="modal">
      <div class="modal-content">
        <h3>Add New Product</h3>
        <form @submit.prevent="addProduct">
          <label for="name">Product Name:</label>
          <input type="text" v-model="newProduct.name" required />
          
          <label for="description">Product Description:</label>
          <textarea v-model="newProduct.description" required></textarea>

          <label for="price">Product Price:</label>
          <input type="number" v-model="newProduct.price" required />
          
          <label for="image">Product Image:</label>
          <input type="file" @change="handleImageUpload" accept="image/*" />

          <button type="submit">Submit</button>
          <button type="button" @click="closeModal">Cancel</button>
        </form>
      </div>
    </div>

    <!-- Product Table -->
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
import { uploadImage } from '@/services/cloudinary'; // Assuming cloudinary.js is correctly configured

export default {
  data() {
    return {
      products: [],
      sortKey: '',
      sortAsc: true,
      isModalOpen: false,
      newProduct: {
        name: '',
        description: '',
        price: null,
        productUrl: ''  // Store product image URL
      }
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
    openAddProductForm() {
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
    },
    async handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        try {
          const response = await uploadImage(file); // Upload image to Cloudinary
          this.newProduct.productUrl = response.data.secure_url; // Set the image URL
          alert('Image uploaded successfully!');
        } catch (error) {
          console.error('Image upload failed:', error);
        }
      }
    },
    async fetchProducts() {
      try {
        const response = await axios.get('http://localhost:8080/ecommerce/products/all');
        this.products = response.data.map(product => ({
          productId: product.productId,
          name: product.name,
          description: product.description,
        }));
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    },
    async addProduct() {
      if (!this.newProduct.productUrl) {
        alert('Please upload an image.');
        return;
      }

      try {
        const response = await axios.post('http://localhost:8080/ecommerce/products/create', this.newProduct);
        if (response.status === 200 || response.status === 201) {
          this.products.push(response.data); // Add new product to the list
          alert('Product added successfully!');
          this.closeModal();
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
    },
    sortBy(key) {
      this.sortKey = key;
      this.sortAsc = !this.sortAsc;
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

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
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
