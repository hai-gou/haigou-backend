const mongoose = require('../db')
const Schema = mongoose.Schema

const schema = new Schema({
  orderid: { type: String, required: true },
  userid: { type: String, required: true },
  proid: { type: String, required: true },
  proname: { type: String, required: true },
  discount: { type: Number, required: true },
  originprice: { type: Number, required: true },
  img1: { type: String, required: true },
  num: { type: Number, required: true },
  // 0 未支付 1 待发货 2 待收获 3 待评价 4 已完成
  status: { type: Number, required: true }, 
  name: String,
  tel: String,
  province: String,
  city: String,
  county: String,
  addressDetail: String,
  time: { type: String, required: true}
})

module.exports = mongoose.model('Order', schema)