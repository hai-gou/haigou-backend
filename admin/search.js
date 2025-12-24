const router = require('express').Router()
const mysql = require('../mongo')
const Search = require('../mongo/collection/Search')
const uuid = require('uuid')

/**
 * @api {get} /admin/search/list 搜索关键词列表
 * @apiName GetSearchList
 * @apiGroup Search
 * @apiHeader {String} token  token
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    code: '200',
 *    message: '搜索关键词列表',
 *    data
 *  }
 */
router.get('/list', (req, res, next) => {
  mysql.find(Search, {}, { _id: 0, __v: 0 }).then(data => {
    // res.send(data)
    
    res.send({
      code: '200',
      message: '搜索关键词列表',
      data
    })
  })
})

module.exports = router