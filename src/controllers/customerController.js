const Customer = require('../models/Customer');

const registerCustomer = async (req, res) => {
  try {
    const { name, surname, email, password } = req.body;
    const newCustomer = new Customer({ name, surname, email, password });
    await newCustomer.save();
    res.status(201).json({ message: 'Customer registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register customer' });
  }
};

module.exports = { registerCustomer };

const loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;
    const customer = await Customer.findOne({ email, password });
    if (customer) {
      res.status(200).json({ message: 'Login successful' });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to login' });
  }
};

module.exports = { loginCustomer };


const getUserDetails = async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Not logged in' });
    }
    const customer = await Customer.findById(userId);
    if (customer) {
      res.status(200).json({ name: customer.name, surname: customer.surname });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user details' });
  }
};

module.exports = { loginCustomer, getUserDetails };

