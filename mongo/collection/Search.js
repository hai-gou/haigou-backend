const mongoose = require('../db')
const schema = new mongoose.Schema({
  wordid: String,
  keyword: String,
  num: Number
})

module.exports = mongoose.model('Search', schema)