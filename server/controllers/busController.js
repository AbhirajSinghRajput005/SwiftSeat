const Route = require('../models/Route');
const Bus = require('../models/Bus');
const Booking = require('../models/Booking');

// City list for autocomplete
const CITIES = [
  { name: 'Hyderabad', state: 'Telangana' },
  { name: 'Bangalore', state: 'Karnataka' },
  { name: 'Chennai', state: 'Tamil Nadu' },
  { name: 'Mumbai', state: 'Maharashtra' },
  { name: 'Pune', state: 'Maharashtra' },
  { name: 'Delhi', state: 'Delhi' },
  { name: 'Kolkata', state: 'West Bengal' },
  { name: 'Ahmedabad', state: 'Gujarat' },
  { name: 'Jaipur', state: 'Rajasthan' },
  { name: 'Lucknow', state: 'Uttar Pradesh' },
  { name: 'Goa', state: 'Goa' },
  { name: 'Kochi', state: 'Kerala' },
  { name: 'Thiruvananthapuram', state: 'Kerala' },
  { name: 'Vizag', state: 'Andhra Pradesh' },
  { name: 'Vijayawada', state: 'Andhra Pradesh' },
  { name: 'Tirupati', state: 'Andhra Pradesh' },
  { name: 'Coimbatore', state: 'Tamil Nadu' },
  { name: 'Mysore', state: 'Karnataka' },
  { name: 'Nagpur', state: 'Maharashtra' },
  { name: 'Indore', state: 'Madhya Pradesh' },
  { name: 'Bhopal', state: 'Madhya Pradesh' },
  { name: 'Surat', state: 'Gujarat' },
  { name: 'Mangalore', state: 'Karnataka' },
  { name: 'Madurai', state: 'Tamil Nadu' },
];

// @desc    Get list of cities
// @route   GET /api/buses/cities
exports.getCities = async (req, res) => {
  try {
    res.json(CITIES);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Search buses
// @route   GET /api/buses/search?from=Hyderabad&to=Bangalore&date=2026-04-20
exports.searchBuses = async (req, res) => {
  try {
    const { from, to, date } = req.query;

    if (!from || !to || !date) {
      return res.status(400).json({ message: 'from, to, and date are required' });
    }

    const searchDate = new Date(date);
    const startOfDay = new Date(searchDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(searchDate.setHours(23, 59, 59, 999));

    const routes = await Route.find({
      'from.city': { $regex: new RegExp(from, 'i') },
      'to.city': { $regex: new RegExp(to, 'i') },
      date: { $gte: startOfDay, $lte: endOfDay },
      isActive: true,
    }).populate('bus');

    // Calculate available seats for each route considering bookings
    const routesWithAvailability = await Promise.all(
      routes.map(async (route) => {
        const bookings = await Booking.find({
          route: route._id,
          status: 'confirmed',
        });
        const bookedSeats = bookings.flatMap(b => b.seats);
        const routeObj = route.toObject();
        routeObj.bookedSeats = bookedSeats;
        routeObj.availableSeats = route.bus.totalSeats - bookedSeats.length;
        return routeObj;
      })
    );

    res.json(routesWithAvailability);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get bus details with seat layout
// @route   GET /api/buses/:id
exports.getBusDetails = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }
    res.json(bus);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get route details
// @route   GET /api/buses/route/:id
exports.getRouteDetails = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id).populate('bus');
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }

    // Get booked seats
    const bookings = await Booking.find({
      route: route._id,
      status: 'confirmed',
    });
    const bookedSeats = bookings.flatMap(b => b.seats);

    const routeObj = route.toObject();
    routeObj.bookedSeats = bookedSeats;

    res.json(routeObj);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
