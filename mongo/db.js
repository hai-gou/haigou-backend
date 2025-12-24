const mongoose = require('mongoose')

const DB_URL = process.env.MONGO_URI || 'mongodb://localhost:27017/haigou'

// 连接数据库
mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })

// 检测数据库的连接状态
mongoose.connection.once('open', () => {
  console.log(`haigou 数据库连接成功 -> ${DB_URL}`)
})

mongoose.connection.on('error', (err) => {
  console.error('haigou 数据库连接异常', err)
})

module.exports = mongoose
