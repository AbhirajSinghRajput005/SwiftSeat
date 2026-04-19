const mongoose = require('mongoose');

const passengerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  seatId: { type: String, required: true },
}, { _id: false });

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  route: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route',
    required: true,
  },
  bus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bus',
    required: true,
  },
  seats: [{ type: String, required: true }],  // ["1A", "1B"]
  passengers: [passengerSchema],
  boardingPoint: {
    name: { type: String, required: true },
    time: { type: String, required: true },
  },
  droppingPoint: {
    name: { type: String, required: true },
    time: { type: String, required: true },
  },
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled', 'completed'],
    default: 'confirmed',
  },
  bookingId: {
    type: String,
    unique: true,
    required: true,
  },
  contactEmail: { type: String, required: true },
  contactPhone: { type: String, required: true },
}, {
  timestamps: true,
});

// Generate booking ID before saving
bookingSchema.pre('validate', function (next) {
  if (!this.bookingId) {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    this.bookingId = `SW-${dateStr}-${random}`;
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
