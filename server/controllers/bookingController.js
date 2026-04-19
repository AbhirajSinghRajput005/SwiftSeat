const Booking = require('../models/Booking');
const Route = require('../models/Route');

// @desc    Create a new booking
// @route   POST /api/bookings
exports.createBooking = async (req, res) => {
  console.log('Booking Request:', JSON.stringify(req.body, null, 2));
  try {
    const {
      routeId, busId, seats, passengers,
      boardingPoint, droppingPoint,
      contactEmail, contactPhone, totalAmount,
    } = req.body;

    // Check if seats are still available
    const existingBookings = await Booking.find({
      route: routeId,
      status: 'confirmed',
      seats: { $in: seats },
    });

    if (existingBookings.length > 0) {
      const takenSeats = existingBookings.flatMap(b => b.seats).filter(s => seats.includes(s));
      return res.status(400).json({
        message: 'Some seats are already booked',
        takenSeats,
      });
    }

    const booking = await Booking.create({
      user: req.user.id,
      route: routeId,
      bus: busId,
      seats,
      passengers,
      boardingPoint,
      droppingPoint,
      contactEmail,
      contactPhone,
      totalAmount,
    });

    // Update available seats on route
    await Route.findByIdAndUpdate(routeId, {
      $inc: { availableSeats: -seats.length },
    });

    const populated = await Booking.findById(booking._id)
      .populate('route')
      .populate('bus');

    res.status(201).json(populated);
  } catch (error) {
    console.error('Booking Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get current user's bookings
// @route   GET /api/bookings/my
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('route')
      .populate('bus')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('route')
      .populate('bus');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Ensure user owns the booking or is admin
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    booking.status = 'cancelled';
    await booking.save();

    // Restore available seats
    await Route.findByIdAndUpdate(booking.route, {
      $inc: { availableSeats: booking.seats.length },
    });

    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
