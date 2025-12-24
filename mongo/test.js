
const Admin = require('./collection/Admin')
const sql = require('./index')
const md5 = require('md5')
const uuid = require('uuid')

sql.insert(Admin, {
  adminid: 'admin_' + uuid.v4(),
  adminname: 'admin',
  password: md5('123456'),
  role: 2,
  checkedKeys: []
}).then(() => {
  console.log('插入超级管理员成功')
})
