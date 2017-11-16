const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create Schema and model

const sensor_data_schema = new Schema({
  eCO2:String,
  TVOC:String,
  time:Date

});


//param 1 is the collection and param 2 is the schema of the model
const sensor_data_model = mongoose.model('data',sensor_data_schema)

module.exports = sensor_data_model;
