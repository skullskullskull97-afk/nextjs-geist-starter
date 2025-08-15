const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Driver = require('../models/Driver');

const JWT_SECRET = 'moto_taxi_secret_key_2024';

// Middleware to verify JWT token
const authenticateDriver = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.driver = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};

// Register driver
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, bikeModel, licensePlate, licenseNumber } = req.body;

    // Validate required fields
    if (!name || !email || !password || !phone || !bikeModel || !licensePlate || !licenseNumber) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if driver already exists
    const existingDriver = await Driver.findOne({ 
      $or: [{ email }, { licensePlate }] 
    });
    
    if (existingDriver) {
      return res.status(400).json({ error: 'Driver with this email or license plate already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new driver
    const driver = new Driver({
      name,
      email,
      password: hashedPassword,
      phone,
      bikeModel,
      licensePlate,
      licenseNumber
    });
    
    await driver.save();
    
    res.status(201).json({ 
      message: 'Driver registered successfully',
      driverId: driver._id
    });
  } catch (error) {
    console.error('Driver registration error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Login driver
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find driver by email
    const driver = await Driver.findOne({ email });
    if (!driver) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, driver.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { driverId: driver._id, email: driver.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      driver: {
        id: driver._id,
        name: driver.name,
        email: driver.email,
        phone: driver.phone,
        bikeModel: driver.bikeModel,
        licensePlate: driver.licensePlate,
        isVerified: driver.isVerified,
        isAvailable: driver.isAvailable,
        rating: driver.rating,
        totalRides: driver.totalRides,
        earnings: driver.earnings
      }
    });
  } catch (error) {
    console.error('Driver login error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get driver profile
router.get('/profile', authenticateDriver, async (req, res) => {
  try {
    const driver = await Driver.findById(req.driver.driverId).select('-password');
    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }
    res.json(driver);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update driver availability
router.put('/availability', authenticateDriver, async (req, res) => {
  try {
    const { isAvailable, location } = req.body;
    
    const updateData = { isAvailable };
    if (location && location.coordinates) {
      updateData.location = location;
    }

    const driver = await Driver.findByIdAndUpdate(
      req.driver.driverId,
      updateData,
      { new: true }
    ).select('-password');

    res.json({
      message: 'Availability updated successfully',
      driver
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update driver location
router.put('/location', authenticateDriver, async (req, res) => {
  try {
    const { coordinates } = req.body;
    
    if (!coordinates || coordinates.length !== 2) {
      return res.status(400).json({ error: 'Valid coordinates [longitude, latitude] are required' });
    }

    const driver = await Driver.findByIdAndUpdate(
      req.driver.driverId,
      { 
        location: {
          type: 'Point',
          coordinates: coordinates
        }
      },
      { new: true }
    ).select('-password');

    res.json({
      message: 'Location updated successfully',
      location: driver.location
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get nearby drivers (for admin or testing purposes)
router.get('/nearby', async (req, res) => {
  try {
    const { longitude, latitude, maxDistance = 5000 } = req.query;
    
    if (!longitude || !latitude) {
      return res.status(400).json({ error: 'Longitude and latitude are required' });
    }

    const drivers = await Driver.find({
      isAvailable: true,
      isVerified: true,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      }
    }).select('-password');

    res.json(drivers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
