const router = require('express').Router()
const mysql = require('../mongo')
const Banner = require('../mongo/collection/Banner')
router.get('/', (req, res, next) => {
  res.send('用户相关接口')
})
/**
 * @api {get} /api/banner/list 查看轮播图
 * @apiName GetBannerList
 * @apiGroup Banner
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    code: '200',
 *    message: '查看轮播图',
 *    data
 *  }
 */
router.get('/list', (req, res, next) => {
  mysql.paging(Banner, {  }, { _id: 0, __v: 0 }, 1, 4).then(data => {
    res.send({
      code: '200',
      message: '查看轮播图',
      data
    })
  })
})
module.exports = router