const router = require('express').Router()
const uuid = require('uuid')
const fs = require('fs')
/**
 * @api {post} /api/city/sortCity 获取城市列表
 * @apiName getSortCity
 * @apiGroup City
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    code: '200',
 *    message: '获取城市列表',
 *    data
 *  }
 */
// 添加地址
router.get('/sortCity', (req, res, next) => {
	fs.readFile(__dirname + '/sortCity.json', 'utf-8', (err, data) => {
		if (err) throw err
		res.send({
			code: '200',
			message: '获取城市列表',
			data
		})	
	})
 	
})
module.exports = router