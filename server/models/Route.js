const mongoose = require('mongoose');

const pointSchema = new mongoose.Schema({
  name: { type: String, required: true },
  time: { type: String, required: true },
  address: { type: String, default: '' },
}, { _id: false });

const routeSchema = new mongoose.Schema({
  bus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bus',
    required: true,
  },
  from: {
    city: { type: String, required: true },
    state: { type: String, required: true },
  },
  to: {
    city: { type: String, required: true },
    state: { type: String, required: true },
  },
  departureTime: { type: String, required: true },  // "22:30"
  arrivalTime: { type: String, required: true },      // "06:15"
  duration: { type: String, required: true },          // "7h 45m"
  date: { type: Date, required: true },
  boardingPoints: [pointSchema],
  droppingPoints: [pointSchema],
  basePrice: { type: Number, required: true },
  availableSeats: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true,
});

// Index for efficient search queries
routeSchema.index({ 'from.city': 1, 'to.city': 1, date: 1 });

module.exports = mongoose.model('Route', routeSchema);
