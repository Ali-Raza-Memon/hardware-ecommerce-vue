import axios from 'axios';

export const loginCustomer = async (loginData) => {
  try {
    const response = await axios.post('/api/login', loginData);
    return response.data;
  } catch (error) {
    throw new Error('Failed to login');
  }
};