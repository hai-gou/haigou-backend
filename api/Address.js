const router = require('express').Router()
const mysql = require('../mongo')
const Address = require('../mongo/collection/Address')
const uuid = require('uuid')
/**
 * @api {post} /api/address/add 添加地址
 * @apiName PostAddressAdd
 * @apiGroup Address
 * @apiHeader {String} token  token
 * @apiParam {String} userid 用户id
 * @apiParam {String} name 收货人姓名
 * @apiParam {String} tel 收货人手机号
 * @apiParam {String} province 省
 * @apiParam {String} city 市
 * @apiParam {String} county 区
 * @apiParam {String} addressDetail 详细地址
 * @apiParam {Boolean} isDefault 默认地址
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    code: '200',
 *    message: '添加地址成功'
 *  }
 */
// 添加地址
router.post('/add', (req, res, next) => {
  let insertData = req.body
  insertData.addressid = 'address_' + uuid.v4()
  // 如果添加的当前地址是一个默认地址，应该先把所有的地址都修改为非默认地址，再插入该地址
  // 如果是第一个添加的地址，默认为默认地址
  mysql.find(Address, {}, {_id:0, __v: 0}).then(data => {
    if (data.length === 0) {
      insertData.isDefault = true
      mysql.insert(Address, insertData).then(data => {
        res.send({
          code: '200',
          message: '添加地址成功'
        })
      })
    } else {
      if (insertData.isDefault) {
        mysql.update(Address, {}, { $set: { isDefault: false }}, 1).then(() => {
          mysql.insert(Address, insertData).then(data => {
            res.send({
              code: '200',
              message: '添加地址成功'
            })
          })
        })
      } else {
        mysql.insert(Address, insertData).then(data => {
          res.send({
            code: '200',
            message: '添加地址成功'
          })
        })
      }
    }
  })
  
})
/**
 * @api {get} /api/address/list 地址列表
 * @apiName GetAddressList
 * @apiGroup Address
 * @apiHeader {String} token  token
 * @apiParam {String} userid 用户id
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    code: '200',
 *    message: '添加地址成功',
 *    data
 *  }
 */
router.get('/list', (req, res, next) => {
  const { userid } = req.query
  mysql.find(Address, { userid }, { _id: 0, __v: 0 }).then(data => {
    res.send({
      code: '200',
      message: '地址列表',
      data
    })
  })
})

/**
 * @api {post} /api/address/update 更新地址接口
 * @apiName PostAddressUpdate
 * @apiGroup Address
 * @apiHeader {String} token  token
 * @apiParam {String} addressid  地址id
 * @apiParam {String} userid 用户id
 * @apiParam {String} name 收货人姓名
 * @apiParam {String} tel 收货人手机号
 * @apiParam {String} province 省
 * @apiParam {String} city 市
 * @apiParam {String} county 区
 * @apiParam {String} addressDetail 详细地址
 * @apiParam {Boolean} isDefault 默认地址
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    code: '200',
 *    message: '更新地址接口'
 *  }
 */
// 添加地址
router.post('/update', (req, res, next) => {
  let updateData = req.body
  const addressid = updateData.addressid
  console.log(addressid)
  mysql.update(Address, { addressid }, { $set: updateData }).then(data => {
    res.send({
      code: '200',
      message: '更新地址接口'
    })
  })
})
/**
 * @api {post} /api/address/delete 删除地址
 * @apiName PostAddressDelete
 * @apiGroup Address
 * @apiHeader {String} token  token
 * @apiParam {String} addressid  地址id
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    code: '200',
 *    message: '删除地址'
 *  }
 */
// 删除地址
router.post('/delete', (req, res, next) => {
  let {addressid} = req.body
  mysql.delete(Address, { addressid }).then(data => {
    res.send({
      code: '200',
      message: '删除地址'
    })
  })
})
/**
 * @api {post} /api/address/defaultAddress 查询默认地址
 * @apiName defaultAddress
 * @apiGroup Address
 * @apiHeader {String} token  token
 * @apiParam {String} userid  用户id
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    code: '200',
 *    message: '查询默认地址'
 *  }
 */
router.post('/defaultAddress', (req, res, next) => {
  let {userid} = req.body
  mysql.find(Address, { userid, isDefault: true }, { _id:0, __v:0}).then(data => {
    res.send({
      code: '200',
      message: '查询默认地址',
      data
    })
  })
})
module.exports = router