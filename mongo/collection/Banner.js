const mongoose = require('../db')
const schema = new mongoose.Schema({
  bannerid: String,
  img: String,
  alt: String,
  link: String,
  flag: Boolean
})

module.exports = mongoose.model('Banner', schema)