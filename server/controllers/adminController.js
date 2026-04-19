const User = require('../models/User');
const Bus = require('../models/Bus');
const Route = require('../models/Route');
const Booking = require('../models/Booking');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
exports.getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalBuses, totalRoutes, totalBookings, bookings] = await Promise.all([
      User.countDocuments(),
      Bus.countDocuments(),
      Route.countDocuments(),
      Booking.countDocuments(),
      Booking.find({ status: 'confirmed' }),
    ]);

    const totalRevenue = bookings.reduce((sum, b) => sum + b.totalAmount, 0);
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });

    res.json({
      totalUsers,
      totalBuses,
      totalRoutes,
      totalBookings,
      totalRevenue,
      cancelledBookings,
      confirmedBookings: totalBookings - cancelledBookings,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all bookings
// @route   GET /api/admin/bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('route')
      .populate('bus', 'operator busNumber type')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Add a new bus
// @route   POST /api/admin/buses
exports.addBus = async (req, res) => {
  try {
    const bus = await Bus.create(req.body);
    res.status(201).json(bus);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update a bus
// @route   PUT /api/admin/buses/:id
exports.updateBus = async (req, res) => {
  try {
    const bus = await Bus.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!bus) return res.status(404).json({ message: 'Bus not found' });
    res.json(bus);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a bus
// @route   DELETE /api/admin/buses/:id
exports.deleteBus = async (req, res) => {
  try {
    const bus = await Bus.findByIdAndDelete(req.params.id);
    if (!bus) return res.status(404).json({ message: 'Bus not found' });
    res.json({ message: 'Bus deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Add a new route
// @route   POST /api/admin/routes
exports.addRoute = async (req, res) => {
  try {
    const route = await Route.create(req.body);
    const populated = await Route.findById(route._id).populate('bus');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update a route
// @route   PUT /api/admin/routes/:id
exports.updateRoute = async (req, res) => {
  try {
    const route = await Route.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!route) return res.status(404).json({ message: 'Route not found' });
    res.json(route);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a route
// @route   DELETE /api/admin/routes/:id
exports.deleteRoute = async (req, res) => {
  try {
    const route = await Route.findByIdAndDelete(req.params.id);
    if (!route) return res.status(404).json({ message: 'Route not found' });
    res.json({ message: 'Route deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all buses
// @route   GET /api/admin/buses
exports.getAllBuses = async (req, res) => {
  try {
    const buses = await Bus.find().sort({ createdAt: -1 });
    res.json(buses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all routes
// @route   GET /api/admin/routes
exports.getAllRoutes = async (req, res) => {
  try {
    const routes = await Route.find().populate('bus', 'operator busNumber type').sort({ createdAt: -1 });
    res.json(routes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
