const router = require('express').Router()
const mysql = require('../mongo')
const User = require('../mongo/collection/User')
const uuid = require('uuid')
var client = null
// router.io = function (io) {
//   io.on('connection', function (socket) {
//     console.log('connect')
//     socket.emit("getMsg", "lala")
//     client = socket
//   });
//   return io
// }

// router.get('/registerUser', (req, res, next) => {
//   mysql.find(User, { _id: 0}).then(data => {
//     client.emit('registerUserSuccess', data)
//     res.send({
//       code: '10000',
//       message: '新注册用户了'
//     })
//   })
  
// })
/**
 * @api {get} /admin/data/simpleData 简单图表数据
 * @apiName simpleData
 * @apiGroup data
 * @apiHeader {String} token  token
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    code: '200',
 *    message: '简单图表数据,可以做折线图，柱状图，饼图',
 *    data
 *  }
 */
router.get('/simpleData', (req, res, next) => {
  res.send({
    code: '200',
    message: '折线图',
    data: [ 
      {
        x: '星期一',
        val: 150
      },
      {
        x: '星期二',
        val: 230
      },
      {
        x: '星期三',
        val: 224
      },
      {
        x: '星期四',
        val: 218
      },{
        x: '星期五',
        val: 135
      },
      {
        x: '星期六',
        val: 147
      },
      {
        x: '星期日',
        val: 260
      }
    ]
  })
})


/**
 * @api {get} /admin/data/kData 简单K线图
 * @apiName kData
 * @apiGroup data
 * @apiHeader {String} token  token
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    code: '200',
 *    message: '简单K线图',
 *    data
 *  }
 */
router.get('/kData', (req, res, next) => {
  res.send({
    code: '200',
    message: '折线图',
    data: {
      x:  ['2021-11-15', '2021-11-16', '2021-11-17', '2021-11-18'],
      val: [
        [20, 34, 10, 38],
        [40, 35, 30, 50],
        [31, 38, 33, 44],
        [38, 15, 5, 42]
      ]
    }
  })
})

module.exports = router