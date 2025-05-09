<template>
  <div class="container">
    <header class="header">
      <div class="welcome-header">
        <h1>Welcome to Our Hardware Store</h1>
      </div>
    </header>

    <!-- Ant Design Slider for Images with Custom Arrows -->
    <a-carousel :autoplay="true" class="image-slider" ref="carousel" :dots="false">
      <template #prev>
        <div class="custom-arrow custom-arrow-left" @click="prevSlide">‹</div>
      </template>
      <template #next>
        <div class="custom-arrow custom-arrow-right" @click="nextSlide">›</div>
      </template>
      <div v-for="(product, index) in sliderProducts" :key="index">
        <img :src="product.productUrl || 'https://via.placeholder.com/800x400'" alt="Product Image" class="slider-image" />
      </div>
    </a-carousel>

    <div class="row">
      <!-- Sidebar for Categories -->
      <div class="col s12 m3 categories-sidebar">
        <div class="collection with-header">
          <div class="collection-header"><h5>Categories</h5></div>
          <a v-if="categories.length === 0" class="collection-item">No categories available</a>
          <a v-for="category in categories" :key="category.id" href="#!" class="collection-item">
            {{ category.name }}
          </a>
        </div>
      </div>

      <!-- Product Section -->
      <div class="col s12 m9">
        <div class="row">
          <div v-if="products.length === 0" class="col s12"><p>No products available</p></div>
          <div v-for="product in products" :key="product.productId" class="col s12 m6 l4">
            <div class="card">
              <div class="card-image">
                <img :src="product.productUrl || 'default-placeholder-image.jpg'" alt="Product Image">
                <span class="card-title">{{ product.name }}</span>
              </div>
              <div class="card-content">
                <p>{{ product.description }}</p>
                <p><strong>Price:</strong> ${{ product.price }}</p>
              </div>
              <div class="card-action">
                <a href="javascript:void(0)" class="btn" @click="addToCart(product)">Add to Cart</a>
                <a :href="'/product/' + product.productId" class="btn">View Details</a>
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
import axios from 'axios';
import { Carousel } from 'ant-design-vue'; 

export default {
  name: 'HomePage',
  components: {
    'a-carousel': Carousel // Register the carousel component
  },
  props: {
    updateCartCount: Function // Receives the method to update the cart count from App.vue
  },
  setup(props) {
    const products = ref([]);
    const categories = ref([]);
    const sliderProducts = ref([]); // For holding the first 3 products for the slider

    const carouselRef = ref(null); // Reference to the carousel

    // Fetch products
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/ecommerce/products/all');
        products.value = response.data.map(product => ({
          productId: product.productId,
          name: product.name,
          description: product.description,
          price: product.price,
          productUrl: product.productUrl || 'default-placeholder-image.jpg'
        }));
        
        // Extract first 3 products for the slider
        sliderProducts.value = response.data.slice(0, 3);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    // Fetch categories
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8080/ecommerce/categories/all');
        categories.value = response.data.map(category => ({
          id: category.id,
          name: category.name
        }));
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    // Function to handle adding product to cart
    const addToCart = async (product) => {
      try {
        // Extract userId from localStorage (which is the customerId)
        const user = JSON.parse(localStorage.getItem('user-info'));
        const customerId = user.userId;

        // Make API request to add the product for the customer
        const apiUrl = `http://localhost:8080/ecommerce/api/product-customer/create?customerId=${customerId}&productId=${product.productId}`;
        await axios.post(apiUrl);

        // Update the cart count via the method passed from App.vue
        props.updateCartCount(1);

        console.log(`Product added to cart: ${product.name}`);
      } catch (error) {
        console.error('Error adding product to cart:', error);
      }
    };

    // Go to the previous slide
    const prevSlide = () => {
      carouselRef.value.prev();
    };

    // Go to the next slide
    const nextSlide = () => {
      carouselRef.value.next();
    };

    onMounted(async () => {
      await fetchProducts();
      await fetchCategories();
    });

    return {
      products,
      sliderProducts,
      categories,
      addToCart,
      prevSlide,
      nextSlide,
      carouselRef 
    };
  }
};
</script>

<style scoped>
.categories-sidebar {
  padding-right: 20px;
  border-right: 1px solid #e0e0e0;
}

.collection .collection-item {
  padding: 10px;
  border-bottom: 1px solid #e0e0e0;
}

.collection-header {
  font-weight: bold;
  font-size: 1.2em;
  margin-bottom: 10px;
}

.card {
  margin: 10px 0;
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
  justify-content: center;
  gap: 10px;
}

.card-action a {
  text-decoration: none;
  padding: 10px 20px;
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

/* Image Slider */
.image-slider {
  margin-bottom: 30px;
}

.slider-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
}

/* Custom arrow styles */
.custom-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 2rem;
  color: #fff;
  cursor: pointer;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  padding: 10px;
}

.custom-arrow-left {
  left: 10px;
}

.custom-arrow-right {
  right: 10px;
}
</style>
