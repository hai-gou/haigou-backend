const router = require('express').Router()
const mysql = require('../mongo')
const Address = require('../mongo/collection/Address')
const uuid = require('uuid')

/**
 * @api {get} /admin/address/list 地址列表
 * @apiName GetAddressList
 * @apiGroup Address
 * @apiHeader {String} token  token
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    code: '200',
 *    message: '添加地址成功',
 *    data
 *  }
 */
router.get('/list', (req, res, next) => {
  mysql.find(Address, {}, { _id: 0, __v: 0 }).then(data => {
    
    res.send({
      code: '200',
      message: '地址列表',
      data
    })
  })
})

module.exports = router