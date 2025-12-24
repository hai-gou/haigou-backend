const mongoose = require('../db')
const schema = new mongoose.Schema({
  addressid: String,
  userid: String,
  name: String,
  tel: String,
  province: String,
  city: String,
  county: String,
  addressDetail: String,
  isDefault: Boolean
 })

module.exports = mongoose.model('Address', schema)