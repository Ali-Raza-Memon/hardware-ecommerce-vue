<template>
  <div id="dashboard">
    <AdminSidebar />
    <div class="content">
      <div class="header">
        <h1>Admin Dashboard</h1>
        <input type="text" placeholder="Search..." class="search-bar" />
      </div>
      <CustomerManagement />
      <CategoryProductManagement />
      <OrderManagement />
    </div>
  </div>
</template>

<script>
import AdminSidebar from './AdminSidebar.vue';
import CustomerManagement from './CustomerManagement.vue';
import CategoryProductManagement from './ProductManagement.vue';
import OrderManagement from './OrderManagement.vue';

export default {
  components: {
    AdminSidebar,
    CustomerManagement,
    CategoryProductManagement,
    OrderManagement
  }
}
</script>

<style scoped>
#dashboard {
  display: flex;
}

.content {
  flex-grow: 1;
  padding: 20px;
  background-color: #f4f7fc;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-bar {
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #ccc;
}
</style>