const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  id: { type: String, required: true },        // e.g., "1A", "L1", "U1"
  row: { type: Number, required: true },
  col: { type: Number, required: true },
  type: { type: String, enum: ['seater', 'sleeper'], default: 'seater' },
  price: { type: Number, required: true },
  isWomenOnly: { type: Boolean, default: false },
}, { _id: false });

const busSchema = new mongoose.Schema({
  operator: {
    type: String,
    required: [true, 'Operator name is required'],
    trim: true,
  },
  busNumber: {
    type: String,
    required: [true, 'Bus number is required'],
    trim: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['AC Sleeper', 'Non-AC Sleeper', 'AC Seater', 'Non-AC Seater', 'Volvo AC', 'Volvo Multi-Axle', 'Mercedes AC'],
  },
  amenities: [{
    type: String,
    enum: ['WiFi', 'Charging', 'Blanket', 'Water', 'Snacks', 'Reading Light', 'AC', 'Track My Bus', 'Emergency Exit'],
  }],
  totalSeats: { type: Number, required: true },
  seatLayout: {
    lowerDeck: {
      rows: { type: Number, required: true },
      cols: { type: Number, required: true },
      seats: [seatSchema],
    },
    upperDeck: {
      rows: { type: Number, default: 0 },
      cols: { type: Number, default: 0 },
      seats: [seatSchema],
    },
  },
  rating: { type: Number, default: 4.0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Bus', busSchema);
