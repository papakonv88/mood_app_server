  const mongoose = require('mongoose');

  const dataSchema = new mongoose.Schema({});

  const dataModel = mongoose.model('boundarie', dataSchema, 'Boundaries');

  module.exports = {dataModel};