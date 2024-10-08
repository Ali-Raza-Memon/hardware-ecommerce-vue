<template>
  <div class="container">
    <header class="header">
      <div class="welcome-header">
        <h1>Welcome to Our Hardware Store</h1>
      </div>
    </header>

    <div class="row">
      <!-- Sidebar for Categories -->
      <div class="col s12 m3 categories-sidebar">
        <div class="collection with-header">
          <div class="collection-header"><h5>Categories</h5></div>
          <a v-if="categories.length === 0" class="collection-item">No categories available</a>
          <a v-for="category in categories" :key="category.id" href="#!" class="collection-item">
            <img v-if="category.image" :src="category.image" alt="Category Image" class="circle category-image">
            {{ category.name }}
          </a>
        </div>
      </div>

      <!-- Product Section -->
      <div class="col s12 m9">
        <div class="row">
          <div v-if="products.length === 0" class="col s12"><p>No products available</p></div>
          <div v-for="product in products" :key="product.id" class="col s12 m6 l4">
            <div class="card">
              <div class="card-image">
                <img :src="product.image" alt="Product Image">
                <span class="card-title">{{ product.name }}</span>
              </div>
              <div class="card-content">
                <p>{{ product.description }}</p>
                <p><strong>Price:</strong> ${{ product.price }}</p>
              </div>
              <div class="card-action">
                <a href="/cart" class="btn">Add to Cart</a>
                <a :href="'/product/' + product.id" class="btn">View Details</a>
              </div>
            </div>
          </div>
          <div v-if="additionalProducts.length > 0">
            <div class="section-header">
              <h5>Additional Products</h5>
            </div>
            <div v-for="additionalProduct in additionalProducts" :key="additionalProduct.id" class="col s12 m6 l4">
              <div class="card">
                <div class="card-image">
                  <img :src="additionalProduct.image" alt="Product Image">
                  <span class="card-title">{{ additionalProduct.name }}</span>
                </div>
                <div class="card-content">
                  <p>{{ additionalProduct.description }}</p>
                  <p><strong>Price:</strong> ${{ additionalProduct.price }}</p>
                </div>
                <div class="card-action">
                  <a href="/cart" class="btn">Add to Cart</a>
                  <a :href="'/product/' + additionalProduct.id" class="btn">View Details</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  name: 'HomePage',
  setup() {
    const products = ref([
      {
        id: 1,
        name: 'Heavy-duty hammer',
        description: 'A durable and reliable hammer for all your construction needs.',
        price: 19.99,
        image: 'path-to-hammer-image.jpg'  // Replace with actual image path
      },
      {
        id: 2,
        name: 'Set of screwdrivers',
        description: 'A complete set of screwdrivers in various sizes.',
        price: 9.99,
        image: 'path-to-screwdrivers-image.jpg'  // Replace with actual image path
      }
    ]);

    const additionalProducts = ref([
      {
        id: 3,
        name: 'Electric drill',
        description: 'High-performance electric drill for heavy-duty drilling.',
        price: 49.99,
        image: 'path-to-drill-image.jpg'  // Replace with actual image path
      },
      {
        id: 4,
        name: 'Wrench set',
        description: 'A versatile set of wrenches for various applications.',
        price: 24.99,
        image: 'path-to-wrench-image.jpg'  // Replace with actual image path
      },
      {
        id: 5,
        name: 'Pliers',
        description: 'Durable pliers with a comfortable grip.',
        price: 12.99,
        image: 'path-to-pliers-image.jpg'  // Replace with actual image path
      },
      {
        id: 6,
        name: 'Measuring tape',
        description: 'Precision measuring tape with a retractable design.',
        price: 7.99,
        image: 'path-to-measuring-tape-image.jpg'  // Replace with actual image path
      }
    ]);

    const categories = ref([
      {
        id: 1,
        name: 'Power Tools',
        image: '/images/power-tools.png'  // Replace with actual image path
      },
      {
        id: 2,
        name: 'Hand Tools',
        image: '/images/hand-tools.png'  // Replace with actual image path
      },
      {
        id: 3,
        name: 'Accessories',
        image: '/images/accessories.png'  // Replace with actual image path
      }
    ]);

    onMounted(async () => {
      try {
        // Assuming getProducts() and getCategories() fetch data from an API
        // Here we use hardcoded data for demonstration
        // products.value = await getProducts();
        // categories.value = await getCategories();
        console.log(products.value);
        console.log(categories.value); // Check if images are correctly loaded
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    });

    return {
      products,
      additionalProducts,
      categories
    };
  }
};
</script>

<style scoped>
/* Align Categories Vertically and Improve Styling */
.categories-sidebar {
  padding-right: 20px;
  border-right: 1px solid #e0e0e0;
}

.collection .collection-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #e0e0e0;
}

.collection .collection-item img.category-image {
  width: 40px;
  height: 40px;
  margin-right: 10px;
  border-radius: 50%;
}

.collection-header {
  font-weight: bold;
  font-size: 1.2em;
  margin-bottom: 10px;
}

.card {
  margin: 10px 0; /* Adjusted margin for better alignment */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.card-title {
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 10px;
}

.card-content {
  padding: 15px;
}

.card-action {
  background: #f5f5f5;
  padding: 10px;
  display: flex;
  justify-content: center; /* Center buttons horizontally */
  gap: 10px; /* Space between buttons */
}

.card-action a {
  color: #007bff;
  text-decoration: none;
  padding: 10px 20px; /* Add padding around the buttons */
  border: 1px solid grey;
  border-radius: 5px;
  display: inline-block;
}

.card-action a:hover {
  background: grey;
  color: white;
}

.section-header {
  margin-top: 30px;
}

.welcome-header {
  text-align: center;
  margin-bottom: 20px;
}

.welcome-header h1 {
  font-size: 2em;
  margin: 0;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>



