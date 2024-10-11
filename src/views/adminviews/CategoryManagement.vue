<template>
  <div class="management-section">
    <h3>Manage Categories</h3>
    <button @click="showPopup = true">Add Category</button>

    <!-- Category Table -->
    <table>
      <thead>
        <tr>
          <th @click="sortBy('categoryId')">ID</th>
          <th @click="sortBy('name')">Name</th>
          <th @click="sortBy('description')">Description</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="category in sortedCategories" :key="category.categoryId">
          <td>{{ category.categoryId }}</td>
          <td>{{ category.name }}</td>
          <td>{{ category.description }}</td>
          <td>
            <button @click="updateCategory(category.categoryId)">Update</button>
            <button @click="deleteCategory(category.categoryId)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Popup for adding new category -->
    <div v-if="showPopup" class="popup-overlay">
      <div class="popup-content">
        <h3>Add Category</h3>
        <label for="name">Name</label>
        <input type="text" v-model="newCategory.name" placeholder="Category Name" />

        <label for="description">Description</label>
        <input type="text" v-model="newCategory.description" placeholder="Category Description" />

        <button @click="saveCategory">Save Category</button>
        <button @click="closePopup">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      categories: [],
      sortKey: 'categoryId',
      sortAsc: true,
      showPopup: false,
      newCategory: {
        name: '',
        description: ''
      }
    };
  },
  computed: {
    sortedCategories() {
      return [...this.categories].sort((a, b) => {
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
    // Fetch all categories from the API
    fetchCategories() {
      axios.get('http://localhost:8080/ecommerce/categories/all')
        .then(response => {
          this.categories = response.data;
        })
        .catch(error => {
          console.error('Error fetching categories:', error);
        });
    },
    // Show the popup
    closePopup() {
      this.showPopup = false;
      this.newCategory.name = '';
      this.newCategory.description = '';
    },
    // Save a new category
    saveCategory() {
      const payload = {
        name: this.newCategory.name,
        description: this.newCategory.description
      };

      axios.post('http://localhost:8080/ecommerce/categories/create', payload)
        .then(() => {  // Removed 'response' as it's not used
          // Fetch the updated list of categories after adding the new category
          this.fetchCategories();
          this.closePopup();
        })
        .catch(error => {
          console.error('Error saving category:', error);
        });
    },
    updateCategory(id) {
      // Implement update category logic
      console.log('Update category:', id);
    },
    deleteCategory(id) {
      // Implement delete category logic
      console.log('Delete category:', id);
    }
  },
  mounted() {
    this.fetchCategories(); // Fetch categories when component is mounted
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

/* Popup Styles */
.popup-overlay {
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

.popup-content {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
}

.popup-content h3 {
  margin-bottom: 20px;
}

.popup-content label {
  display: block;
  margin-bottom: 5px;
}

.popup-content input {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.popup-content button {
  margin-right: 10px;
}
</style>
