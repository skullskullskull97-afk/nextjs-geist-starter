const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Ride = require('../models/Ride');
const Driver = require('../models/Driver');
const User = require('../models/User');

const JWT_SECRET = 'moto_taxi_secret_key_2024';

// Middleware to verify JWT token (works for both users and drivers)
const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.auth = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};

// Fare calculation function
function calculateFare(distance, basePrice = 2.0, timeFactor = 1.0) {
  const pricePerKm = 0.5; // Price per kilometer
  const minFare = 3.00; // Minimum fare
  let fare = basePrice + (distance * pricePerKm);
  
  // Apply time factor for demand-based pricing
  fare = fare * timeFactor;
  
  return Math.max(fare, minFare);
}

// Calculate distance between two points (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return distance;
}

// Request a ride (User only)
router.post('/request', authenticate, async (req, res) => {
  try {
    // Ensure this is a user request
    if (!req.auth.userId) {
      return res.status(403).json({ error: 'Only users can request rides' });
    }

    const { pickupLocation, destination, paymentMethod = 'cash' } = req.body;

    // Validate required fields
    if (!pickupLocation || !destination || !pickupLocation.coordinates || !destination.coordinates) {
      return res.status(400).json({ error: 'Pickup location and destination with coordinates are required' });
    }

    // Calculate distance
    const distance = calculateDistance(
      pickupLocation.coordinates[1], // latitude
      pickupLocation.coordinates[0], // longitude
      destination.coordinates[1],
      destination.coordinates[0]
    );

    // Calculate estimated fare
    const estimatedFare = calculateFare(distance);

    // Create ride request
    const ride = new Ride({
      user: req.auth.userId,
      pickupLocation,
      destination,
      distance: Math.round(distance * 100) / 100, // Round to 2 decimal places
      estimatedFare: Math.round(estimatedFare * 100) / 100,
      paymentMethod,
      status: 'requested'
    });

    await ride.save();

    // Populate user information
    await ride.populate('user', 'name phone rating');

    res.status(201).json({
      message: 'Ride requested successfully',
      ride
    });
  } catch (error) {
    console.error('Ride request error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get available ride requests (Driver only)
router.get('/available', authenticate, async (req, res) => {
  try {
    // Ensure this is a driver request
    if (!req.auth.driverId) {
      return res.status(403).json({ error: 'Only drivers can view available rides' });
    }

    const { longitude, latitude, maxDistance = 10000 } = req.query;

    let query = { status: 'requested', driver: null };

    // If location provided, find nearby rides
    if (longitude && latitude) {
      query.pickupLocation = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      };
    }

    const rides = await Ride.find(query)
      .populate('user', 'name phone rating')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(rides);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Accept a ride (Driver only)
router.put('/:rideId/accept', authenticate, async (req, res) => {
  try {
    // Ensure this is a driver request
    if (!req.auth.driverId) {
      return res.status(403).json({ error: 'Only drivers can accept rides' });
    }

    const ride = await Ride.findById(req.params.rideId);
    if (!ride) {
      return res.status(404).json({ error: 'Ride not found' });
    }

    if (ride.status !== 'requested') {
      return res.status(400).json({ error: 'Ride is no longer available' });
    }

    // Check if driver is available and verified
    const driver = await Driver.findById(req.auth.driverId);
    if (!driver.isAvailable || !driver.isVerified) {
      return res.status(400).json({ error: 'Driver must be available and verified' });
    }

    // Update ride
    ride.driver = req.auth.driverId;
    ride.status = 'accepted';
    ride.acceptedAt = new Date();
    await ride.save();

    // Update driver availability
    driver.isAvailable = false;
    await driver.save();

    // Populate driver and user information
    await ride.populate([
      { path: 'driver', select: 'name phone bikeModel licensePlate rating' },
      { path: 'user', select: 'name phone rating' }
    ]);

    res.json({
      message: 'Ride accepted successfully',
      ride
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start ride (Driver only)
router.put('/:rideId/start', authenticate, async (req, res) => {
  try {
    if (!req.auth.driverId) {
      return res.status(403).json({ error: 'Only drivers can start rides' });
    }

    const ride = await Ride.findById(req.params.rideId);
    if (!ride) {
      return res.status(404).json({ error: 'Ride not found' });
    }

    if (ride.driver.toString() !== req.auth.driverId) {
      return res.status(403).json({ error: 'You can only start your own rides' });
    }

    if (ride.status !== 'accepted') {
      return res.status(400).json({ error: 'Ride must be accepted first' });
    }

    ride.status = 'in-progress';
    await ride.save();

    await ride.populate([
      { path: 'driver', select: 'name phone bikeModel licensePlate rating' },
      { path: 'user', select: 'name phone rating' }
    ]);

    res.json({
      message: 'Ride started successfully',
      ride
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Complete ride (Driver only)
router.put('/:rideId/complete', authenticate, async (req, res) => {
  try {
    if (!req.auth.driverId) {
      return res.status(403).json({ error: 'Only drivers can complete rides' });
    }

    const { actualFare } = req.body;

    const ride = await Ride.findById(req.params.rideId);
    if (!ride) {
      return res.status(404).json({ error: 'Ride not found' });
    }

    if (ride.driver.toString() !== req.auth.driverId) {
      return res.status(403).json({ error: 'You can only complete your own rides' });
    }

    if (ride.status !== 'in-progress') {
      return res.status(400).json({ error: 'Ride must be in progress' });
    }

    // Update ride
    ride.status = 'completed';
    ride.completedAt = new Date();
    ride.actualFare = actualFare || ride.estimatedFare;
    ride.paymentStatus = 'completed';
    await ride.save();

    // Update driver stats
    const driver = await Driver.findById(req.auth.driverId);
    driver.isAvailable = true;
    driver.totalRides += 1;
    driver.earnings += ride.actualFare;
    await driver.save();

    // Update user stats
    const user = await User.findById(ride.user);
    user.totalRides += 1;
    await user.save();

    await ride.populate([
      { path: 'driver', select: 'name phone bikeModel licensePlate rating' },
      { path: 'user', select: 'name phone rating' }
    ]);

    res.json({
      message: 'Ride completed successfully',
      ride
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cancel ride
router.put('/:rideId/cancel', authenticate, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.rideId);
    if (!ride) {
      return res.status(404).json({ error: 'Ride not found' });
    }

    // Check if user owns the ride or driver is assigned
    const isUser = req.auth.userId && ride.user.toString() === req.auth.userId;
    const isDriver = req.auth.driverId && ride.driver && ride.driver.toString() === req.auth.driverId;

    if (!isUser && !isDriver) {
      return res.status(403).json({ error: 'You can only cancel your own rides' });
    }

    if (ride.status === 'completed') {
      return res.status(400).json({ error: 'Cannot cancel completed ride' });
    }

    ride.status = 'cancelled';
    await ride.save();

    // If driver was assigned, make them available again
    if (ride.driver) {
      await Driver.findByIdAndUpdate(ride.driver, { isAvailable: true });
    }

    res.json({
      message: 'Ride cancelled successfully',
      ride
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get ride history
router.get('/history', authenticate, async (req, res) => {
  try {
    let query = {};
    
    if (req.auth.userId) {
      query.user = req.auth.userId;
    } else if (req.auth.driverId) {
      query.driver = req.auth.driverId;
    }

    const rides = await Ride.find(query)
      .populate('user', 'name phone rating')
      .populate('driver', 'name phone bikeModel licensePlate rating')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(rides);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rate ride
router.put('/:rideId/rate', authenticate, async (req, res) => {
  try {
    const { rating } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const ride = await Ride.findById(req.params.rideId);
    if (!ride) {
      return res.status(404).json({ error: 'Ride not found' });
    }

    if (ride.status !== 'completed') {
      return res.status(400).json({ error: 'Can only rate completed rides' });
    }

    // Check if user is rating driver or driver is rating user
    if (req.auth.userId && ride.user.toString() === req.auth.userId) {
      ride.driverRating = rating;
      
      // Update driver's overall rating
      const driver = await Driver.findById(ride.driver);
      const driverRides = await Ride.find({ 
        driver: ride.driver, 
        driverRating: { $exists: true } 
      });
      const avgRating = driverRides.reduce((sum, r) => sum + r.driverRating, 0) / driverRides.length;
      driver.rating = Math.round(avgRating * 10) / 10;
      await driver.save();
      
    } else if (req.auth.driverId && ride.driver.toString() === req.auth.driverId) {
      ride.userRating = rating;
      
      // Update user's overall rating
      const user = await User.findById(ride.user);
      const userRides = await Ride.find({ 
        user: ride.user, 
        userRating: { $exists: true } 
      });
      const avgRating = userRides.reduce((sum, r) => sum + r.userRating, 0) / userRides.length;
      user.rating = Math.round(avgRating * 10) / 10;
      await user.save();
    } else {
      return res.status(403).json({ error: 'You can only rate rides you participated in' });
    }

    await ride.save();

    res.json({
      message: 'Rating submitted successfully',
      ride
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
