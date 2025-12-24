const router = require('express').Router()
const mysql = require('./../mongo')
const User = require('./../mongo/collection/User')
const uuid = require('uuid')

/**
 * @api {get} /admin/user/list 用户列表数据
 * @apiName AdminUserList
 * @apiGroup User
 * @apiHeader {String} token  token
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    code: '200',
 *    message: '用户列表数据',
 *    data
 *  }
 */
router.get('/list', (req, res, next) => {
  mysql.find(User, {}, { _id: 0, __v: 0 }).then((data) => {
    res.send({
      code: '200',
      message: '用户列表数据',
      data
    })
  })
})

module.exports = router