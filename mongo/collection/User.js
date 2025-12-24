const mongoose = require('../db')

const schema = new mongoose.Schema({
  userid: { type: String },
  username: { type: String },
  password: { type: String },
  tel: { type: String },
  telcode: { type: String },
  email: { type: String },
  nickname: { type: String },
  qq: { type: String },
  wx: { type: String },
  avatar: { type: String },
  sex: { type: Number }, // 1 男  0 女
  birthday: { type: String },
  createTime: { type: String },
})

module.exports = mongoose.model('User', schema)