const router = require('express').Router()
const mysql = require('./../mongo')
const Cart = require('./../mongo/collection/Cart')
const Address = require('./../mongo/collection/Address')
const Order = require('./../mongo/collection/Order')
const Product = require('./../mongo/collection/Product')
const uuid = require('uuid')
/**
 * @api {post} /api/order/updateOrderAddress 修改订单的地址
 * @apiName updateOrderAddress
 * @apiGroup order
 * @apiHeader {String} token  token
 * @apiParam {String} userid 用户id
 * @apiParam {String} name 收货人姓名
 * @apiParam {String} tel 收货人手机号
 * @apiParam {String} province 省
 * @apiParam {String} city 市
 * @apiParam {String} county 区
 * @apiParam {String} addressDetail 详细地址
 * @apiParam {String} time 创建时间
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    code: '200',
 *    message: '修改订单的地址'
 *  }
 */
router.post('/updateOrderAddress', (req, res, next) => {
  const { userid, time, name, tel, 
    province, city, county, addressDetail} = req.body
    // console.log('2222', req.body)
  mysql.update(Order, { userid, time }, { $set: { name, tel, 
    province, city, county,addressDetail} }, 1).then(() => {
      res.send({
        code: '200',
        message: '修改订单的地址'
      })
    })

})
/**
 * @api {get} /api/order/confirmOrder 获取确认订单的信息
 * @apiName confirmOrder
 * @apiGroup order
 * @apiHeader {String} token  token
 * @apiParam {String} userid 用户id
 * @apiParam {String} time 创建时间
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    code: '200',
 *    message: '获取确认订单的信息'
 *  }
 */
router.get('/confirmOrder', (req, res, next) => {
  console.log(req.query)
  const { userid, time } = req.query
  mysql.find(Order, { userid, time }, { _id: 0, __v: 0}).then(data => {
    console.log(data)
    // 查询该订单有没有地址信息
    var flag = false
    let obj = {}
    if (data[0].tel === '') {
      flag = false
    } else {
      flag = true
      obj = {
        name: data[0].name,
        tel: data[0].tel,
        province: data[0].province,
        city: data[0].city,
        county: data[0].county,
        addressDetail: data[0].addressDetail,
      }
    }
    const sendObj = {
      code: '200',
      message: '获取确认订单的信息',
      flag,
      data
    }
    flag && (sendObj.address = obj)
    res.send(sendObj)
  })
})
/**
 * @api {post} /api/order/addOrder 添加订单
 * @apiName addOrder
 * @apiGroup order
 * @apiHeader {String} token  token
 * @apiParam {String} userid 用户id
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    code: '200',
 *    message: '添加订单'
 *  }
 */
router.post('/addOrder', (req, res, next) => {
  const insertData = req.body
  // 以购物车选中的商品为基准值，添加其他的字段
  mysql.find(Cart, { userid: insertData.userid, flag: true },
    { _id: 0,
      proid: 1,
      num: 1
    }).then(data => {
      // data  [{proid: '', num: }, {proid: '', num}, { proid: ''}]
      // 遍历数据查询产品的信息
      const arr = []
      data.forEach(item => {
        arr.push(mysql.find(Product, { proid: item.proid}, { 
          _id: 0,proid: 1, proname: 1, discount: 1, originprice: 1, img1: 1
        }))
      })
      Promise.all(arr).then(result => {
        // result [[{}], [{}]]
        const dataarr = []
        result.forEach(item => {
          dataarr.push(item[0])
        })
        // dataarr [{proid: '', proname: '', discount: '', originprice: '', img1: ''}, {}]
        // 判断用户有没有默认地址，有的话就把订单的地址设置为默认地址
        mysql.find(Address, { userid: insertData.userid, isDefault: true }).then(data1 => {
          let obj = {}
          if (data1.length === 0) {
            // 没有默认地址  ---- 用户还没有添加过地址
            obj = { // 此次确认订单页面的所有商品的公共 地址数据
              name: '',
              tel: '',
              province: '',
              city: '',
              county: '',
              addressDetail: '',
            }
          } else {
            obj = { // 此次确认订单页面的所有商品的公共 地址数据
              name: data1[0].name,
              tel: data1[0].tel,
              province: data1[0].province,
              city: data1[0].city,
              county: data1[0].county,
              addressDetail: data1[0].addressDetail,
            }
          }
          const resultarr = []
          const time = new Date().getTime() + ''
          // 遍历dataarr 添加其他的数据
          dataarr.forEach((item, index) => {
            resultarr.push({
              name: obj.name,
              tel: obj.tel,
              province: obj.province,
              city: obj.city,
              county: obj.county,
              addressDetail: obj.addressDetail,
              orderid: 'order_' + uuid.v4(),
              userid: insertData.userid,
              status: 0,
              proname: item.proname,
              proid: item.proid,
              originprice: item.originprice,
              img1: item.img1,
              discount: item.discount,
              num: data[index].num,
              time
            })
          })
          // console.log(1111111)
          // 插入数据
          mysql.insert(Order, resultarr).then(() => {
            console.log(222222)
            res.send({
              code: '200',
              message: '添加订单',
              time
            })
          })
          
        })
        
      })
      
    })
})
/**
 * @api {get} /api/order/deleteCartItem 支付时删除购物车选中的数据
 * @apiName deleteCartItem
 * @apiGroup order
 * @apiHeader {String} token  token
 * @apiParam {String} userid 用户id
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    code: '200',
 *    message: '支付时删除购物车选中的数据'
 *  }
 */
router.get('/deleteCartItem', (req, res, next) => {
  const { userid } = req.query
  mysql.delete(Cart, { userid, flag: true }, 1).then(() => {
    res.send({
      code:'200',
      message: '支付时删除购物车选中的数据'
    })
  })
})

module.exports = router