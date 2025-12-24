const mongoose = require('../db')
const schema = new mongoose.Schema({
  proid: String, // 产品id，每个产品的唯一值
  category: String, // 产品分类
  brand: String, // 产品品牌
  proname: String, // 产品名称
  banners: Array, // 产品详情中的轮播图/放大镜
  originprice: Number, // 产品原价
  sales: Number, // 产品销量
  stock: Number, // 产品库存
  desc: String, // 产品描述
  issale: Number, // 是否在售卖
  isrecommend: Number, // 当前产品是否被推荐
  discount: Number, // 产品价格折扣
  isseckill: Number, // 是否参加秒杀
  img1: String, // 产品的单图图片1
  img2: String, // 产品的单图图片2
  img3: String, // 产品的单图图片3
  img4: String // 产品的单图图片4
})

module.exports = mongoose.model('Product', schema)