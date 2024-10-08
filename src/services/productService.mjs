// src/services/productService.mjs
import axios from 'axios';

export const getProducts = async () => {
    try {
        const response = await axios.get('/api/products'); // Replace with your actual API endpoint
        const products = response.data;

        // Handle null or empty values and provide placeholders
        return products.map(product => ({
            id: product.id || 0, // Default to 0 if id is missing
            name: product.name || 'Unnamed Product', // Placeholder name
            price: product.price !== null && product.price !== undefined ? product.price : 0.0, // Default to 0.0 if price is missing
            description: product.description || 'No description available.', // Placeholder description
            image: product.image || 'https://via.placeholder.com/150' // Placeholder image
        }));
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
};
