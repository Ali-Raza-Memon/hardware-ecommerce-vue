<template>
  <div class="management-section">
    <h3>Manage Categories</h3>
    <button @click="addCategory">Add Category</button>
    <table>
      <thead>
        <tr>
          <th @click="sortBy('id')">ID</th>
          <th @click="sortBy('name')">Name</th>
          <th @click="sortBy('products')">Products</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="category in sortedCategories" :key="category.id">
          <td>{{ category.id }}</td>
          <td>{{ category.name }}</td>
          <td>{{ category.products.length }}</td>
          <td>
            <button @click="updateCategory(category.id)">Update</button>
            <button @click="deleteCategory(category.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      categories: [
        { id: 1, name: 'Tools', products: ['Hammer', 'Saw', 'Wrench'] },
        { id: 2, name: 'Hardware', products: ['Nails', 'Screws'] }
      ],
      sortKey: '',
      sortAsc: true
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
    addCategory() {
      // Implement add category logic here
    },
    updateCategory(id) {
      // Implement update category logic here
    },
    deleteCategory(id) {
      this.categories = this.categories.filter(category => category.id !== id);
    }
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