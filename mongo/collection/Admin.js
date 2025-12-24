const mongoose = require('./../db')
const Schema = mongoose.Schema

const schema = new Schema({
  adminid: { type: String, required: true },
  adminname: { type: String, required: true },
  password: { type: String, required: true },
  // 2超级管理员  1 普通管理员
  role: { type: Number, required: true },
  checkedKeys: { type: Array, required: true }
})

module.exports = mongoose.model('Admin', schema)