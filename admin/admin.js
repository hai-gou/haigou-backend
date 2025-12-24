const router = require('express').Router()
const sql = require('../mongo')
const Admin = require('../mongo/collection/Admin')
const uuid = require('uuid')
const md5 = require('md5')
const jwt = require('jsonwebtoken')

// JWT 密钥配置
const JWT_SECRET_ADMIN = process.env.JWT_SECRET_ADMIN || 'haigou-admin-secret'
/**
 * @api {post} /admin/admin/login 管理系统登录
 * @apiName PostLogin
 * @apiGroup Admin
 * 
 * @apiParam { string } adminname 管理员账号 admin
 * @apiParam { string } password 密码 123456
 * 
 * @apiSuccess {String} code 状态码.
 * @apiSuccess {String} message  描述
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": "200" || '10003' || '10005',
 *       "message": "登录成功" || 密码错误 ｜| 未注册,
 *     }
 * @apiSampleRequest /admin/admin/login
 */
router.post('/login', (req, res, next) => {
  let { adminname, password } = req.body
  if (adminname === '' || password === '') {
  	res.send({
  		code: '66666',
  		message: '想啥呢哥们，输入完整信息吧'	
  	})	
  }
  console.log(adminname, password)
  sql.find(Admin, { adminname }, { _id: 0, __v: 0 }).then(data => {
    if (data.length !== 0) {
      if (md5(password) === data[0].password) {
        const token = jwt.sign({ adminname }, JWT_SECRET_ADMIN, {
          expiresIn: 8 *  60 * 60 // 单位为 秒
//          expiresIn: 10 // 单位为 秒
        })
        res.status(200).send({
          code: '200',
          message: '登录成功',
          data: {
            adminname,
            token,
            role: data[0].role,
            checkedkeys: data[0].checkedKeys
          }
        }) 
      } else {
        res.status(200).send({
          code: '10003',
          message: '密码错误'
        })
      }
      
    } else {
      res.status(200).send({
        code: '10005',
        message: '未注册'
      })
    }
  })
})
/**
 * @api {post} /admin/admin/add 添加管理员
 * @apiName PostAddAdmin
 * @apiGroup Admin
 * 
 * @apiParam { string } adminname
 * @apiParam { string } password
 * @apiParam { string } role
 * @apiParam { string } checkedKeys
 * 
 * @apiHeader { string } token
 * 
 * @apiSuccess {String} code 状态码.
 * @apiSuccess {String} message  描述
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": "200" || '10004',
 *       "message": "添加管理员成功" || 该管理员已存在,
 *     }
 * @apiSampleRequest /admin/admin/add
 */
router.post('/add', (req, res, next) => {
  let insertData = req.body
  let password = insertData.password
  if (insertData.adminname.length > 6) {
  	res.send({
     	code: '10008',
     	message: '管理员长度不能大于6'
   	})
  } else {
  	insertData.adminid = 'admin_' + uuid.v4()
  	insertData.password = md5(password)
  	insertData.checkedKeys = insertData.checkedKeys.length > 0 ? insertData.checkedKeys : ['0-0']
    // 判断有没有该管理员账号
    sql.find(Admin, { adminname: insertData.adminname}, {_id: 0, __v: 0}).then(data => {
      if (data.length === 0) { // 没有当前想要添加的管理员
        sql.insert(Admin, insertData).then(() => {
          res.send({
            code: '200',
            message: '添加管理员成功'
          })
        })
      } else { // 已有该管理员
        res.send({
          code: '10004',
          message: '该管理员已存在'
        })
      }
    })
  }
  
  
})
/**
 * @api {post} /admin/admin/delete 删除管理员
 * @apiName PostDeleteAdmin
 * @apiGroup Admin
 * 
 * @apiParam { string } adminid
 * 
 * @apiHeader { string } token
 * 
 * @apiSuccess {String} code 状态码.
 * @apiSuccess {String} message  描述
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": "200",
 *       "message": "删除管理员" 
 *     }
 * @apiSampleRequest /admin/admin/delete
 */
router.post('/delete', (req, res, next) => {
  const { adminid } = req.body
  sql.delete(Admin, { adminid }).then(() =>{
    res.send({
      code: '200',
      message: '删除管理员'
    })
  })
})
/**
 * @api {get} /admin/admin/detail 获取管理员信息
 * @apiName GetDetailAdmin
 * @apiGroup Admin
 * 
 * @apiParam { string } adminname
 * 
 * @apiHeader { string } token
 * 
 * @apiSuccess {String} code 状态码.
 * @apiSuccess {String} message  描述
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": "200",
 *       "message": "获取管理员信息" ,
 *        data
 *     }
 * @apiSampleRequest /admin/admin/detail
 */
router.get('/detail', (req, res, next) => {
  const { adminname } = req.query
  sql.find(Admin, { adminname }, { _id: 0, __v: 0, password: 0}).then(data => {
    res.status(200).send({
      code: '200',
      message: '获取管理员信息',
      data
    })
  })
})
/**
 * @api {post} /admin/admin/update 修改管理员信息
 * @apiName PostAdminUpdate
 * @apiGroup Admin
 * 
 * @apiHeader { string } token
 * 
 * @apiParam { string } adminname
 * @apiParam { string } password
 * @apiParam { string } role
 * @apiParam { string } checkedKeys
 * 
 * @apiSuccess {String} code 状态码.
 * @apiSuccess {String} message  描述
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": "200",
 * 
 *       "message": "修改管理员信息" 
 *     }
 * @apiSampleRequest /admin/admin/update
 */
router.post('/update', (req, res, next) => {
  console.log(req.body)
  let updateData = req.body
  updateData.role = updateData.role * 1
  if (updateData.adminname === 'admin') {
    res.status(200).send({
      code: '200',
      message: '你想翻天吗'
    })
  } else {
    sql.update(Admin, { adminname: updateData.adminname }, { $set: {adminname: updateData.adminname, role: updateData.role, checkedKeys: updateData.checkedKeys}}).then(() => {
      res.send({
        code: '200',
        message: '修改管理员权限成功'
      })
    })
  }
  
})
/**
 * @api {get} /admin/admin/list 管理员列表
 * @apiName PostAdminList
 * @apiGroup Admin
 * 
 * @apiHeader { string } token
 * 
 * @apiSuccess {String} code 状态码.
 * @apiSuccess {String} message  描述
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": "200",
 *       "message": "管理员列表" 
 *     }
 * @apiSampleRequest /admin/admin/list
 */
router.get('/list', (req, res, next) => {
  sql.find(Admin, {}, { __v: 0}).then((data) => {
    const index = data.findIndex((item) => item.adminname === 'admin')
    data.splice(index, 1)
    res.send({
      code: '200',
      message: '管理员列表',
      data
    })
  })
})

module.exports = router