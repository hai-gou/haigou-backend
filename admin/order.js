const router = require('express').Router()
const mysql = require('../mongo')
const Order = require('../mongo/collection/Order')
const uuid = require('uuid')

/**
 * @api {get} /admin/order/list 查看全部订单列表
 * @apiName GetOrderList
 * @apiGroup Order
 * @apiHeader {String} token  token
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    code: '200',
 *    message: '查看全部订单列表',
 *    data
 *  }
 */
router.get('/list', (req, res, next) => {
  mysql.find(Order, {}, { _id: 0, __v: 0 }).then(data => {
    res.send({
      code: '200',
      message: '查看全部订单列表',
      data
    })
  })
})
/**
 * @api {get} /admin/order/statusList 查看各种状态订单列表
 * @apiName GetOrderStatusList
 * @apiGroup Order
 * @apiHeader {String} token  token
 * @apiParam {number} status  0 未支付 1 待发货 2 待收获 3 待评价 4 已完成
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    code: '200',
 *    message: '查看各种状态订单列表',
 *    data
 *  }
 */
router.get('/statusList', (req, res, next) => {
  const {status} = req.query
  mysql.find(Order, {status}, { _id: 0, __v: 0 }).then(data => {
    res.send({
      code: '200',
      message: '查看全部订单列表',
      data
    })
  })
})
/**
 * @api {get} /admin/order/updateStatus 修改订单的状态
 * @apiName updateStatus
 * @apiGroup Order
 * @apiHeader {String} token  token
 * @apiParam {String} orderid  orderid
 * @apiParam {number} status  0 未支付 1 待发货 2 待收获 3 待评价 4 已完成
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    code: '200',
 *    message: '修改订单的状态',
 *    data
 *  }
 */
router.get('/updateStatus', (req, res, next) => {
  let {status, orderid} = req.query
  status*=1
  mysql.update(Order, { orderid }, { $set: { status} }).then(() => {
    res.send({
      code: '200',
      message: '修改订单的状态'
    })
  })
})
module.exports = router