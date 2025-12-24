const router = require('express').Router()
const mysql = require('./../mongo')
const Banner = require('./../mongo/collection/Banner')
const uuid = require('uuid')
/**
 * @api {post} /admin/banner/add 插入轮播图数据
 * @apiName AdminBannerAdd
 * @apiGroup Banner
 * @apiHeader {String} token  token
 * @apiParam {String} img 图片地址
 * @apiParam {String} alt 提示信息
 * @apiParam {String} link 链接地址
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    code: '200',
 *    message: '插入轮播图数据'
 *  }
 */
router.post('/add', (req, res, next) => {
  const insertData = req.body
  insertData.bannerid = 'banner_' + uuid.v4()
  insertData.flag = true
  mysql.insert(Banner, insertData).then(() => {
    res.send({
      code: '200',
      message: '插入轮播图数据'
    })
  })
})
/**
 * @api {get} /admin/banner/list 查看轮播图数据
 * @apiName AdminBannerList
 * @apiGroup Banner
 * @apiHeader {String} token  token
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    code: '200',
 *    message: '查看轮播图数据',
 * data
 *  }
 */
router.get('/list', (req, res, next) => {
  const insertData = req.body
  mysql.find(Banner, {}, { _id: 0, __v: 0 }).then((data) => {
    res.send({
      code: '200',
      message: '查看轮播图数据',
      data
    })
  })
})

/**
 * @api {get} /admin/banner/delete 删除单条数据
 * @apiName AdminBannerDelete
 * @apiGroup Banner
 * @apiHeader {String} token  token
 * @apiParam {String} bannerid  轮播图id
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    code: '200',
 *    message: '查看轮播图数据',
 * data
 *  }
 */
router.get('/delete', (req, res, next) => {
  const {bannerid} = req.query
  mysql.delete(Banner, {bannerid}, { _id: 0, __v: 0 }).then((data) => {
    res.send({
      code: '200',
      message: '删除单条数据'
    })
  })
})

/**
 * @api {get} /admin/banner/removeAll 删除全部轮播图数据
 * @apiName AdminBannerRemoveAll
 * @apiGroup Banner
 * @apiHeader {String} token  token
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    code: '200',
 *    message: '删除全部轮播图数据',
 * data
 *  }
 */
router.get('/removeAll', (req, res, next) => {
  mysql.delete(Banner, {},  1).then((data) => {
    res.send({
      code: '200',
      message: '删除全部轮播图数据'
    })
  })
})

/**
 * @api {post} /admin/banner/updateFlag 访问状态更新
 * @apiName AdminBannerUpdateFlag
 * @apiGroup Banner
 * @apiHeader {String} token  token
 * @apiParam {String} bannerid  轮播图id
 * @apiParam {String} flag  是否可用
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    code: '200',
 *    message: '访问状态更新成功',
 * data
 *  }
 */
router.post('/updateFlag', (req, res, next) => {
  const { bannerid, flag } = req.body
  mysql.update(Banner, { bannerid }, { $set: { flag }}).then(() => {
    res.send({
      code: '200',
      message: '访问状态更新成功'
    })
  })
})
module.exports = router