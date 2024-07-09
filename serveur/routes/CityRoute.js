const express = require('express');
const router = express.Router();

const {
    getAllCities,
    getCityById,
    createCity,
    updateCity,
    deleteCity,
  } = require('../controller/CityController');
  
// Routes pour les villes
router.get('/', getAllCities);
router.get('/:id',getCityById);
router.post('/', createCity);
router.put('/:id', updateCity);
router.put('/update_deleted/:id', deleteCity);

module.exports = router;
