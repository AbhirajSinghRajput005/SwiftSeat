const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const admin = require('../middleware/admin');
const {
  getDashboardStats, getAllUsers, getAllBookings,
  addBus, updateBus, deleteBus, getAllBuses,
  addRoute, updateRoute, deleteRoute, getAllRoutes,
} = require('../controllers/adminController');

// All admin routes require auth + admin role
router.use(protect, admin);

router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/bookings', getAllBookings);
router.get('/buses', getAllBuses);
router.post('/buses', addBus);
router.put('/buses/:id', updateBus);
router.delete('/buses/:id', deleteBus);
router.get('/routes', getAllRoutes);
router.post('/routes', addRoute);
router.put('/routes/:id', updateRoute);
router.delete('/routes/:id', deleteRoute);

module.exports = router;
