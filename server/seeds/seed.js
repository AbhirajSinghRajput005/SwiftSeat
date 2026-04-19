const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const User = require('../models/User');
const Bus = require('../models/Bus');
const Route = require('../models/Route');

const OPERATORS = [
  'SwiftLine Travels', 'Horizon Express', 'Royal Cruiser', 'Metro Riders',
  'Galaxy Travels', 'Sunrise Voyages', 'Eagle Transport', 'Diamond Coaches',
  'Apex Bus Lines', 'Velocity Travels',
];

function generateSeaterLayout(rows, cols, basePrice) {
  const seats = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (cols === 5 && c === 2) continue; // aisle
      const label = `${r + 1}${String.fromCharCode(65 + c)}`;
      seats.push({
        id: label,
        row: r,
        col: c,
        type: 'seater',
        price: basePrice + (r < 3 ? 50 : 0), // front seats cost more
        isWomenOnly: r >= rows - 2 && c < 2, // last 2 rows left side women only
      });
    }
  }
  return { rows, cols, seats };
}

function generateSleeperLayout(rows, cols, basePrice) {
  const seats = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (cols === 4 && (c === 1 || c === 2)) continue; // aisle in middle
      if (cols === 3 && c === 1) continue;
      const label = `${r + 1}${String.fromCharCode(65 + c)}`;
      seats.push({
        id: label,
        row: r,
        col: c,
        type: 'sleeper',
        price: basePrice + (r < 2 ? 100 : 0),
        isWomenOnly: false,
      });
    }
  }
  return { rows, cols, seats };
}

const BUSES = [
  { operator: OPERATORS[0], busNumber: 'KA-01-AB-1234', type: 'Volvo AC', amenities: ['WiFi', 'Charging', 'Blanket', 'Water', 'AC', 'Track My Bus'], totalSeats: 36, rating: 4.5, reviewCount: 324, layoutType: 'seater', rows: 10, cols: 5, basePrice: 800 },
  { operator: OPERATORS[0], busNumber: 'KA-01-CD-5678', type: 'AC Sleeper', amenities: ['Charging', 'Blanket', 'Water', 'AC', 'Reading Light'], totalSeats: 30, rating: 4.3, reviewCount: 215, layoutType: 'sleeper', rows: 10, cols: 4, basePrice: 1200 },
  { operator: OPERATORS[1], busNumber: 'TS-09-EF-9012', type: 'Volvo Multi-Axle', amenities: ['WiFi', 'Charging', 'Blanket', 'Water', 'AC', 'Snacks', 'Track My Bus'], totalSeats: 40, rating: 4.7, reviewCount: 562, layoutType: 'seater', rows: 12, cols: 5, basePrice: 950 },
  { operator: OPERATORS[1], busNumber: 'TS-09-GH-3456', type: 'AC Seater', amenities: ['Charging', 'AC', 'Water'], totalSeats: 44, rating: 4.1, reviewCount: 189, layoutType: 'seater', rows: 12, cols: 5, basePrice: 650 },
  { operator: OPERATORS[2], busNumber: 'MH-12-IJ-7890', type: 'Mercedes AC', amenities: ['WiFi', 'Charging', 'Blanket', 'Water', 'AC', 'Snacks', 'Reading Light', 'Track My Bus'], totalSeats: 32, rating: 4.8, reviewCount: 890, layoutType: 'seater', rows: 9, cols: 5, basePrice: 1100 },
  { operator: OPERATORS[2], busNumber: 'MH-12-KL-1234', type: 'AC Sleeper', amenities: ['Charging', 'Blanket', 'Water', 'AC'], totalSeats: 24, rating: 4.4, reviewCount: 445, layoutType: 'sleeper', rows: 8, cols: 4, basePrice: 1400 },
  { operator: OPERATORS[3], busNumber: 'AP-05-MN-5678', type: 'Non-AC Seater', amenities: ['Water', 'Emergency Exit'], totalSeats: 48, rating: 3.8, reviewCount: 120, layoutType: 'seater', rows: 13, cols: 5, basePrice: 350 },
  { operator: OPERATORS[3], busNumber: 'AP-05-OP-9012', type: 'AC Seater', amenities: ['Charging', 'AC', 'Water'], totalSeats: 40, rating: 4.0, reviewCount: 98, layoutType: 'seater', rows: 11, cols: 5, basePrice: 550 },
  { operator: OPERATORS[4], busNumber: 'TN-01-QR-3456', type: 'Volvo AC', amenities: ['WiFi', 'Charging', 'AC', 'Water', 'Track My Bus'], totalSeats: 40, rating: 4.6, reviewCount: 678, layoutType: 'seater', rows: 12, cols: 5, basePrice: 850 },
  { operator: OPERATORS[4], busNumber: 'TN-01-ST-7890', type: 'Non-AC Sleeper', amenities: ['Water', 'Reading Light'], totalSeats: 28, rating: 3.5, reviewCount: 56, layoutType: 'sleeper', rows: 10, cols: 3, basePrice: 500 },
  { operator: OPERATORS[5], busNumber: 'KL-01-UV-1234', type: 'Volvo Multi-Axle', amenities: ['WiFi', 'Charging', 'Blanket', 'Water', 'AC', 'Snacks', 'Track My Bus'], totalSeats: 36, rating: 4.9, reviewCount: 1020, layoutType: 'seater', rows: 10, cols: 5, basePrice: 1000 },
  { operator: OPERATORS[5], busNumber: 'KL-01-WX-5678', type: 'AC Sleeper', amenities: ['Charging', 'Blanket', 'Water', 'AC', 'Track My Bus'], totalSeats: 24, rating: 4.5, reviewCount: 432, layoutType: 'sleeper', rows: 8, cols: 4, basePrice: 1300 },
  { operator: OPERATORS[6], busNumber: 'RJ-14-YZ-9012', type: 'AC Seater', amenities: ['Charging', 'AC', 'Water', 'Blanket'], totalSeats: 44, rating: 4.2, reviewCount: 267, layoutType: 'seater', rows: 12, cols: 5, basePrice: 700 },
  { operator: OPERATORS[7], busNumber: 'GJ-01-AB-3456', type: 'Volvo AC', amenities: ['WiFi', 'Charging', 'AC', 'Water', 'Snacks'], totalSeats: 36, rating: 4.4, reviewCount: 345, layoutType: 'seater', rows: 10, cols: 5, basePrice: 900 },
  { operator: OPERATORS[8], busNumber: 'DL-01-CD-7890', type: 'Mercedes AC', amenities: ['WiFi', 'Charging', 'Blanket', 'Water', 'AC', 'Snacks', 'Reading Light', 'Track My Bus', 'Emergency Exit'], totalSeats: 28, rating: 4.7, reviewCount: 780, layoutType: 'seater', rows: 8, cols: 5, basePrice: 1200 },
  { operator: OPERATORS[9], busNumber: 'UP-32-EF-1234', type: 'Non-AC Seater', amenities: ['Water'], totalSeats: 52, rating: 3.6, reviewCount: 43, layoutType: 'seater', rows: 14, cols: 5, basePrice: 300 },
];

const ROUTE_TEMPLATES = [
  { from: { city: 'Hyderabad', state: 'Telangana' }, to: { city: 'Bangalore', state: 'Karnataka' }, duration: '7h 30m', depTimes: ['21:00', '22:00', '22:30', '23:00'], arrTimes: ['04:30', '05:00', '05:30', '06:00'] },
  { from: { city: 'Bangalore', state: 'Karnataka' }, to: { city: 'Chennai', state: 'Tamil Nadu' }, duration: '6h 00m', depTimes: ['22:00', '23:00', '23:30'], arrTimes: ['04:00', '05:00', '05:30'] },
  { from: { city: 'Mumbai', state: 'Maharashtra' }, to: { city: 'Pune', state: 'Maharashtra' }, duration: '3h 30m', depTimes: ['06:00', '08:00', '10:00', '14:00', '18:00', '22:00'], arrTimes: ['09:30', '11:30', '13:30', '17:30', '21:30', '01:30'] },
  { from: { city: 'Mumbai', state: 'Maharashtra' }, to: { city: 'Goa', state: 'Goa' }, duration: '10h 00m', depTimes: ['18:00', '20:00', '21:00'], arrTimes: ['04:00', '06:00', '07:00'] },
  { from: { city: 'Delhi', state: 'Delhi' }, to: { city: 'Jaipur', state: 'Rajasthan' }, duration: '5h 30m', depTimes: ['06:00', '10:00', '14:00', '22:00'], arrTimes: ['11:30', '15:30', '19:30', '03:30'] },
  { from: { city: 'Chennai', state: 'Tamil Nadu' }, to: { city: 'Coimbatore', state: 'Tamil Nadu' }, duration: '8h 00m', depTimes: ['21:00', '22:00', '22:30'], arrTimes: ['05:00', '06:00', '06:30'] },
  { from: { city: 'Hyderabad', state: 'Telangana' }, to: { city: 'Vizag', state: 'Andhra Pradesh' }, duration: '12h 00m', depTimes: ['18:00', '19:00', '20:00'], arrTimes: ['06:00', '07:00', '08:00'] },
  { from: { city: 'Hyderabad', state: 'Telangana' }, to: { city: 'Vijayawada', state: 'Andhra Pradesh' }, duration: '5h 00m', depTimes: ['06:00', '08:00', '14:00', '22:00'], arrTimes: ['11:00', '13:00', '19:00', '03:00'] },
  { from: { city: 'Bangalore', state: 'Karnataka' }, to: { city: 'Mysore', state: 'Karnataka' }, duration: '3h 00m', depTimes: ['06:00', '08:00', '10:00', '14:00'], arrTimes: ['09:00', '11:00', '13:00', '17:00'] },
  { from: { city: 'Kochi', state: 'Kerala' }, to: { city: 'Thiruvananthapuram', state: 'Kerala' }, duration: '4h 30m', depTimes: ['06:00', '10:00', '14:00', '22:00'], arrTimes: ['10:30', '14:30', '18:30', '02:30'] },
  { from: { city: 'Pune', state: 'Maharashtra' }, to: { city: 'Nagpur', state: 'Maharashtra' }, duration: '10h 00m', depTimes: ['19:00', '20:00', '21:00'], arrTimes: ['05:00', '06:00', '07:00'] },
  { from: { city: 'Ahmedabad', state: 'Gujarat' }, to: { city: 'Mumbai', state: 'Maharashtra' }, duration: '7h 00m', depTimes: ['20:00', '21:00', '22:00'], arrTimes: ['03:00', '04:00', '05:00'] },
  { from: { city: 'Hyderabad', state: 'Telangana' }, to: { city: 'Chennai', state: 'Tamil Nadu' }, duration: '9h 00m', depTimes: ['19:00', '20:30', '22:00'], arrTimes: ['04:00', '05:30', '07:00'] },
  { from: { city: 'Bangalore', state: 'Karnataka' }, to: { city: 'Goa', state: 'Goa' }, duration: '10h 00m', depTimes: ['18:00', '20:00', '21:30'], arrTimes: ['04:00', '06:00', '07:30'] },
  { from: { city: 'Delhi', state: 'Delhi' }, to: { city: 'Lucknow', state: 'Uttar Pradesh' }, duration: '8h 00m', depTimes: ['20:00', '21:00', '22:00'], arrTimes: ['04:00', '05:00', '06:00'] },
];

const BOARDING_POINTS = [
  { name: 'Central Bus Stand', address: 'Main Road, City Center' },
  { name: 'Railway Station', address: 'Station Road' },
  { name: 'Highway Junction', address: 'NH Bypass' },
  { name: 'Airport Road Stop', address: 'Airport Road' },
];

const DROPPING_POINTS = [
  { name: 'Main Bus Terminal', address: 'Ring Road' },
  { name: 'City Center Stop', address: 'MG Road' },
  { name: 'Railway Station', address: 'Station Area' },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/swiftseat');
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Bus.deleteMany({}),
      Route.deleteMany({}),
    ]);
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@swiftseat.com',
      phone: '9999999999',
      password: 'admin123',
      role: 'admin',
    });
    console.log('👤 Admin user created: admin@swiftseat.com / admin123');

    // Create test user
    await User.create({
      name: 'Test User',
      email: 'user@swiftseat.com',
      phone: '8888888888',
      password: 'user123',
      role: 'user',
    });
    console.log('👤 Test user created: user@swiftseat.com / user123');

    // Create buses
    const busDocs = [];
    for (const busData of BUSES) {
      const layout = busData.layoutType === 'sleeper'
        ? generateSleeperLayout(busData.rows, busData.cols, busData.basePrice)
        : generateSeaterLayout(busData.rows, busData.cols, busData.basePrice);

      const bus = await Bus.create({
        operator: busData.operator,
        busNumber: busData.busNumber,
        type: busData.type,
        amenities: busData.amenities,
        totalSeats: layout.seats.length,
        seatLayout: {
          lowerDeck: layout,
          upperDeck: busData.layoutType === 'sleeper'
            ? generateSleeperLayout(Math.max(busData.rows - 2, 6), busData.cols, busData.basePrice + 200)
            : { rows: 0, cols: 0, seats: [] },
        },
        rating: busData.rating,
        reviewCount: busData.reviewCount,
      });
      busDocs.push(bus);
    }
    console.log(`🚌 ${busDocs.length} buses created`);

    // Create routes for the next 7 days
    let routeCount = 0;
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const date = new Date();
      date.setDate(date.getDate() + dayOffset);
      date.setHours(0, 0, 0, 0);

      for (const template of ROUTE_TEMPLATES) {
        for (let i = 0; i < template.depTimes.length; i++) {
          const bus = busDocs[Math.floor(Math.random() * busDocs.length)];
          const depTime = template.depTimes[i];
          const arrTime = template.arrTimes[i];

          const boardingPoints = BOARDING_POINTS.map((bp, idx) => ({
            name: bp.name,
            time: addMinutes(depTime, idx * 15),
            address: `${bp.address}, ${template.from.city}`,
          }));

          const droppingPoints = DROPPING_POINTS.map((dp, idx) => ({
            name: dp.name,
            time: addMinutes(arrTime, idx * 10),
            address: `${dp.address}, ${template.to.city}`,
          }));

          await Route.create({
            bus: bus._id,
            from: template.from,
            to: template.to,
            departureTime: depTime,
            arrivalTime: arrTime,
            duration: template.duration,
            date: date,
            boardingPoints,
            droppingPoints,
            basePrice: bus.seatLayout.lowerDeck.seats[0]?.price || 500,
            availableSeats: bus.totalSeats,
          });
          routeCount++;
        }
      }
    }
    console.log(`🛣️  ${routeCount} routes created (7 days)`);
    console.log('\n✅ Database seeded successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin Login: admin@swiftseat.com / admin123');
    console.log('User Login:  user@swiftseat.com / user123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

function addMinutes(timeStr, minutes) {
  const [hours, mins] = timeStr.split(':').map(Number);
  const totalMins = hours * 60 + mins + minutes;
  const newHours = Math.floor(totalMins / 60) % 24;
  const newMins = totalMins % 60;
  return `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(2, '0')}`;
}

seed();
