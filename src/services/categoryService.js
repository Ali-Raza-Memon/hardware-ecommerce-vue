import axios from 'axios';

const API_URL = '/ecommerce/categories/';

export function getCategories() {
  return axios.get(`${API_URL}getAll`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error fetching categories:', error);
      throw error;
    });
}
