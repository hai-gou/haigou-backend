const router = require('express').Router()
const mysql = require('./../mongo')
const User = require('./../mongo/collection/User')
const Product = require('./../mongo/collection/Product')
/**
 * @api {get} /admin/statistic/user 用户总数量
 * @apiName StatisticUser
 * @apiGroup Statistic
 * @apiHeader {String} token  token
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    code: '200',
 *    message: '用户总数量',
 *    data
 *  }
 */
router.get('/user', (req, res, next) => {
  mysql.find(User, {}, {_id: 0, __v: 0, password: 0}).then(data => {
    res.send({
      code: '200',
      message: '用户总数量',
      data: data.length
    })
  })
})
/**
 * @api {get} /admin/statistic/product 商品总数量
 * @apiName StatisticProduct
 * @apiGroup Statistic
 * @apiHeader {String} token  token
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    code: '200',
 *    message: '商品总数量',
 *    data
 *  }
 */
router.get('/product', (req, res, next) => {
  mysql.find(Product, {}, {_id: 0, __v: 0}).then(data => {
    res.send({
      code: '200',
      message: '商品总数量',
      data: data.length
    })
  })
})

module.exports = router