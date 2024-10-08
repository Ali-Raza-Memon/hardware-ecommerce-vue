import axios from 'axios';

export const getUserDetails = async () => {
  try {
    const response = await axios.get('/api/user/details');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch user details');
  }
};

export const logoutUser = async () => {
  try {
    await axios.post('/api/logout');
  } catch (error) {
    throw new Error('Failed to logout');
  }
};