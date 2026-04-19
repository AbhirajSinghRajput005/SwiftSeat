const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, getBookingById, cancelBooking } = require('../controllers/bookingController');
const protect = require('../middleware/auth');
const { validate, bookingSchema } = require('../middleware/validate');

router.post('/', protect, validate(bookingSchema), createBooking);
router.get('/my', protect, getMyBookings);
router.get('/:id', protect, getBookingById);
router.put('/:id/cancel', protect, cancelBooking);

module.exports = router;
