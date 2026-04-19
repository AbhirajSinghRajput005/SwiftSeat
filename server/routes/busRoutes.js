const express = require('express');
const router = express.Router();
const { searchBuses, getBusDetails, getCities, getRouteDetails } = require('../controllers/busController');

router.get('/cities', getCities);
router.get('/search', searchBuses);
router.get('/route/:id', getRouteDetails);
router.get('/:id', getBusDetails);

module.exports = router;
