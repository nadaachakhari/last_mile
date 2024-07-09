const City = require('../Models/CityModel');

const getAllCities = async (req, res) => {
    try {
      const cities = await City.findAll({
        where: { deleted: false }, // Ne récupère que les villes non supprimées
      });
      res.json(cities);
    } catch (error) {
      console.error('Erreur lors de la récupération des villes:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des villes.' });
    }
  };
  
  const getCityById = async (req, res) => {
    const { id } = req.params;
    try {
      const city = await City.findByPk(id);
      if (!city) {
        return res.status(404).json({ message: 'Ville non trouvée.' });
      }
      res.json(city);
    } catch (error) {
      console.error(`Erreur lors de la récupération de la ville avec l'ID ${id}:`, error);
      res.status(500).json({ message: 'Erreur lors de la récupération de la ville.' });
    }
  };
  
  const createCity = async (req, res) => {
    const { value } = req.body;
    try {
      const newCity = await City.create({ value, deleted: true });
      res.status(201).json(newCity);
    } catch (error) {
      console.error('Erreur lors de la création de la ville:', error);
      res.status(500).json({ message: 'Erreur lors de la création de la ville.' });
    }
  };
  
  const updateCity = async (req, res) => {
    const { id } = req.params;
    const { value } = req.body;
    try {
      let city = await City.findByPk(id);
      if (!city) {
        return res.status(404).json({ message: 'Ville non trouvée.' });
      }
      city.value = value;
      await city.save();
      res.json(city);
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la ville avec l'ID ${id}:`, error);
      res.status(500).json({ message: 'Erreur lors de la mise à jour de la ville.' });
    }
  };
  
  const deleteCity = async (req, res) => {
    const { id } = req.params;
    try {
      let city = await City.findByPk(id);
      if (!city) {
        return res.status(404).json({ message: 'Ville non trouvée.' });
      }
      await city.update({ deleted: 0 });
      res.json({ message: `Ville avec l'ID ${id} marquée comme supprimée.` });
    } catch (error) {
      console.error(`Erreur lors de la suppression de la ville avec l'ID ${id}:`, error);
      res.status(500).json({ message: 'Erreur lors de la suppression de la ville.' });
    }
  };
  
  module.exports = {
    getAllCities,
    getCityById,
    createCity,
    updateCity,
    deleteCity,
  };
  