const router = require('express').Router()
const mysql = require('../mongo')
const Cart = require('../mongo/collection/Cart')
const Product = require('../mongo/collection/Product')
const uuid = require('uuid')
// user_00023f7d-5bdd-489a-b662-1c84798082c9
/**
 * @api {post} /api/cart/add 加入购物车
 * @apiName PostCartAdd
 * @apiGroup Cart
 * @apiHeader {String} token  token
 * @apiParam {String} userid 用户id
 * @apiParam {String} proid 产品id
 * @apiParam {String} num 加入购物车数量
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    code: '200',
 *    message: '加入购物车成功'
 *  }
 */
// 加入购物车
router.post('/add', (req, res, next) => {
  let { userid, proid, num } = req.body
  if (userid === '' || proid === '' || userid=== undefined || proid ===undefined) {
    res.send({
      code: '10101',
      message: '请填写完整参数'
    })
    return
  }
  num = num * 1 || 1
  mysql.find(Cart, { userid, proid }, { _id: 0, __v: 0 }).then(data => {
    if (data.length === 0) { // 购物车中没有该商品
      const insertData = {
        cartid: 'cart_' + uuid.v4(),
        userid,
        proid,
        flag: true,
        num
      }
      mysql.insert(Cart, insertData).then(() => {
        res.send({
          code: '200',
          message: '加入购物车成功',
          data: 0
        })
      })
    } else { // 购物车中有商品
      // mysql.update(Cart, { cartid: data[0].cartid })
      mysql.update(Cart, { userid, proid }, { $inc: { num: num}}).then(() => {
        res.send({
          code: '200',
          message: '加入购物车成功',
          data: 1
        })
      })
    }
  })
})
/**
 * @api {post} /api/cart/list 查看购物车
 * @apiName PostCartList
 * @apiGroup Cart
 * @apiHeader {String} token  token
 * @apiParam {String} userid 用户id
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    code: '200',
 *    message: '购物车列表',
 *    data
 *  }
 */
// 查询当前用户的购物车数据
router.post('/list', (req, res, next) => {
  const userid = req.body.userid
  mysql.find(Cart, { userid }, { _id: 0, __v: 0 }).then(data1 => {
    if (data1.length === 0) {
      res.send({
        code: '10020',
        message: '购物车数据为空'
      })
    } else {
      // data1 [ { userid, proid, cartid, num, flag}, { userid, proid, cartid, num, flag}]
      // 遍历data1 数据，提取每条数据的proid ，以proid为基础，查询产品的信息
      // 数据库操作属于异步操作
      // promise.all([ promise, promise ]).then(result => {})
      const arr = []
      data1.forEach((item, index) => {
        arr.push(
          // 返回值为 promise 对象
          mysql.find(Product, { proid: item.proid }, { _id: 0, __v: 0})
        )
      })

      Promise.all(arr).then(result => {
        // result [[{}],[{}]]
        // res.send(result)
        const resultarr = []
        result.forEach((item, index) => {
          // item 代表 [[{}]]  => item [{}] => {}  => item[0]
          let obj = {}
          // 从购物车数据库获取  --- 依据 是两个数组的索引值一致
          obj.cartid = data1[index].cartid
          obj.userid = data1[index].userid
          obj.num = data1[index].num
          obj.flag = data1[index].flag
          // 提取数据
          obj.img1 = item[0].img1
          obj.proname = item[0].proname
          obj.originprice = item[0].originprice
          obj.proid = item[0].proid
          obj.discount = item[0].discount
          resultarr.push(obj)
        })
        res.send({
          code: '200',
          message: '购物车列表',
          data: resultarr
        })
      })
    }
  })
})
/**
 * @api {post} /api/cart/remove 删除购物车单条数据
 * @apiName PostCartRemove
 * @apiGroup Cart
 * @apiHeader {String} token  token
 * @apiParam {String} cartid 购物车id
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    code: '200',
 *    message: '删除购物车单条数据'
 *  }
 */
// 删除购物车单条数据
router.post('/remove', (req, res, next) => {
  const { cartid } = req.body
  mysql.delete(Cart, { cartid }).then(() => {
    res.send({
      code: '200',
      message: '删除购物车单条数据'
    })
  })
})
/**
 * @api {post} /api/cart/removeall 删除当前用户的购物车数据
 * @apiName PostCartRemoveall
 * @apiGroup Cart
 * @apiHeader {String} token  token
 * @apiParam {String} userid 用户id
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    code: '200',
 *    message: '删除当前用户的购物车数据'
 *  }
 */
// 删除当前用户的购物车数据
router.post('/removeall', (req, res, next) => {
  const { userid } = req.body
  mysql.delete(Cart, { userid }, 1).then(() => {
    res.send({
      code: '200',
      message: '删除当前用户的购物车数据'
    })
  })
})
/**
 * @api {post} /api/cart/updatenum 更新购物车数量
 * @apiName PostCartUpdatenum
 * @apiGroup Cart
 * @apiHeader {String} token  token
 * @apiParam {String} cartid 购物车id
 * @apiParam {Number} num 数量
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    code: '200',
 *    message: '更新购物车数量'
 *  }
 */
// 更新购物车数量
router.post('/updatenum', (req, res, next) => {
  let { cartid, num } = req.body
  num = num * 1
  mysql.update(Cart, { cartid }, { $set: { num } }).then(() => {
    res.send({
      code: '200',
      message: '更新购物车数量'
    })
  })
})
/**
 * @api {post} /api/cart/selectone 更新当前购物车数据的选中状态
 * @apiName PostCartSelectone
 * @apiGroup Cart
 * @apiHeader {String} token  token
 * @apiParam {String} cartid 购物车id
 * @apiParam {Boolean} flag 是否选中
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    code: '200',
 *    message: '更新当前购物车数据的选中状态'
 *  }
 */
// 更新购物车数据的选中状态 - 单个
router.post('/selectone', (req, res, next) => {
  const { cartid, flag } = req.body
  mysql.update(Cart, { cartid }, { $set: { flag }}).then(() => {
    res.send({
      code: '200',
      message: '更新当前购物车数据的选中状态'
    })
  })
})
/**
 * @api {post} /api/cart/selectall 更新所有购物车数据的选中状态
 * @apiName PostCartSelectall
 * @apiGroup Cart
 * @apiHeader {String} token  token
 * @apiParam {String} userid 用户id
 * @apiParam {Boolean} type 是否全部选中
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    code: '200',
 *    message: '更新所有购物车数据的选中状态'
 *  }
 */
// 更新购物车数据的选中状态 - 全选
router.post('/selectall', (req, res, next) => {
  const { userid, type } = req.body
  mysql.update(Cart, { userid }, { $set: { flag: type }}, 1).then(() => {
    res.send({
      code: '200',
      message: '更新所有购物车数据的选中状态'
    })
  })
})

module.exports = router