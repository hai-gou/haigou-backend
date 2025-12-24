const router = require('express').Router()
const mysql = require('./../mongo')
const User = require('./../mongo/collection/User')
const Cart = require('./../mongo/collection/Cart')
const Pro = require('./../mongo/collection/Product')
const uuid = require('uuid')
/**
 * @api {get} /admin/cart/remove 删除购物车数据
 * @apiName AdminDeleteCart
 * @apiGroup Cart
 * @apiHeader {String} token  token
 * @apiParam {String} cartid  购物车id
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    code: '200',
 *    message: '删除购物车数据',
 *    data
 *  }
 */
router.get('/remove', (req, res, next) => {
  const { cartid } = req.query
  mysql.delete(Cart, { cartid }).then(() => {
    res.send({
      code: '200',
      message: '删除购物车数据'
    })
  })
})
/**
 * @api {get} /admin/cart/list1 购物车列表数据-不区分用户
 * @apiName AdminCartList1
 * @apiGroup Cart
 * @apiHeader {String} token  token
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    code: '200',
 *    message: '购物车列表数据-不区分用户',
 *    data
 *  }
 */
router.get('/list1', (req, res, next) => {
  mysql.find(Cart, {}, { _id: 0, __v: 0}).then(data1 => {
    // res.send(data1)
    /**data1
     * {
        "cartid": "cart_1bd7bbdf-59b9-4dc4-ae6a-f61b9453dfda",
        "userid": "user_00023f7d-5bdd-489a-b662-1c84798082c9",
        "proid": "pro_63d36ffb-5451-4901-a55b-ef4eda753548",
        "flag": true,
        "num": 1
    },
     */
    const arr1 = []
    data1.forEach(item => {
      arr1.push(mysql.find(User, { userid: item.userid }, { _id: 0, __v: 0}))
      arr1.push(mysql.find(Pro, { proid: item.proid }, { _id: 0, __v: 0}))
    })
    Promise.all(arr1).then(result => {
      // res.send(result)
      const arr2 = []
      result.forEach((item, index) => {
        if (index % 2 === 0) {
          arr2.push({
            cartid: data1[index / 2].cartid,
            userid: result[index][0].userid,
            username: result[index][0].username,
            tel: result[index][0].tel,
            proid: result[index + 1][0].proid,
            proname: result[index + 1][0].proname,
            img1: result[index + 1][0].img1,
            originprice: result[index + 1][0].originprice,
            discount: result[index + 1][0].discount,
            sales: result[index + 1][0].sales,
            stock: result[index + 1][0].stock,
            category: result[index + 1][0].category,
            brand: result[index + 1][0].brand
          })
        }
      })

      res.send({
        code: '200',
        message: '购物车数据',
        data: arr2
      })
    })
  })
})

/**
 * @api {get} /admin/cart/list2 购物车列表数据-区分用户
 * @apiName AdminCartList2
 * @apiGroup Cart
 * @apiHeader {String} token  token
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    code: '200',
 *    message: '购物车列表数据-不区分用户',
 *    data
 *  }
 */
router.get('/list2', (req, res, next) => {
  mysql.find(Cart, {}, { _id: 0, __v: 0}).then(data1 => {
    // res.send(data1)
    /**data1
     * {
        "cartid": "cart_1bd7bbdf-59b9-4dc4-ae6a-f61b9453dfda",
        "userid": "user_00023f7d-5bdd-489a-b662-1c84798082c9",
        "proid": "pro_63d36ffb-5451-4901-a55b-ef4eda753548",
        "flag": true,
        "num": 1
    },
     */
    const arr1 = []
    data1.forEach(item => {
      arr1.push(mysql.find(User, { userid: item.userid }, { _id: 0, __v: 0}))
      arr1.push(mysql.find(Pro, { proid: item.proid }, { _id: 0, __v: 0}))
    })
    Promise.all(arr1).then(result => {
      // res.send(result)
      const arr2 = []
      result.forEach((item, index) => {
        if (index % 2 === 0) {
          arr2.push({
            cartid: data1[index / 2].cartid,
            userid: result[index][0].userid,
            username: result[index][0].username,
            tel: result[index][0].tel,
            proid: result[index + 1][0].proid,
            proname: result[index + 1][0].proname,
            img1: result[index + 1][0].img1,
            originprice: result[index + 1][0].originprice,
            discount: result[index + 1][0].discount,
            sales: result[index + 1][0].sales,
            stock: result[index + 1][0].stock,
            category: result[index + 1][0].category,
            brand: result[index + 1][0].brand
          })
        }
      })
      var map = {}
      dest = []
      for (var i = 0; i < arr2.length; i++) {
        var ai = arr2[i] // 原数组中的每一项
        if (!map[ai.tel]) {
          dest.push({
            tel: ai.tel,
            data: [ai]
          })
          map[ai.tel] = ai
        } else {
          for(var j = 0; j < dest.length; j++) {
            var dj = dest[j]
            if (dj.tel === ai.tel) {
              dj.data.push(ai);
              break
            }
          }
        }
      }
      res.send({
        code: '200',
        message: '购物车数据',
        data: dest
      })
    })
  })
})

module.exports = router