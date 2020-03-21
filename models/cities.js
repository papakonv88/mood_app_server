const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({});

const dataModelCities = mongoose.model('citie', dataSchema, 'Cities');

module.exports = {dataModelCities};