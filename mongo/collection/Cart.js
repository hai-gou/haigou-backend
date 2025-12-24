const mongoose = require('../db')
const schema = new mongoose.Schema({
  cartid: String,
  userid: String,
  proid: String,
  flag: Boolean, // 当前的数据选中还是未选中
  num: Number
})

module.exports = mongoose.model('Cart', schema)