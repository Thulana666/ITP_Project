const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String, // Salon, Photographer, Catering
});

module.exports = mongoose.model("Service", ServiceSchema);
