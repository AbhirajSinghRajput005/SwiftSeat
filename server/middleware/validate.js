const { z } = require('zod');

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    const errors = error.errors.map(e => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    return res.status(400).json({ message: 'Validation failed', errors });
  }
};

// Validation schemas
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid 10-digit Indian phone number'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const bookingSchema = z.object({
  routeId: z.string().min(1, 'Route ID is required'),
  busId: z.string().min(1, 'Bus ID is required'),
  seats: z.array(z.string()).min(1, 'At least one seat must be selected'),
  passengers: z.array(z.object({
    name: z.string().min(1, 'Passenger name is required'),
    age: z.number().min(1).max(120),
    gender: z.enum(['Male', 'Female', 'Other']),
    seatId: z.string(),
  })).min(1),
  boardingPoint: z.object({
    name: z.string(),
    time: z.string(),
  }),
  droppingPoint: z.object({
    name: z.string(),
    time: z.string(),
  }),
  contactEmail: z.string().email(),
  contactPhone: z.string(),
  totalAmount: z.number().positive(),
});

module.exports = { validate, registerSchema, loginSchema, bookingSchema };
