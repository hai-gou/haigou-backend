var createError = require('http-errors');
var express = require('express');
var path = require('path');
var fs = require('fs');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var jwt = require('jsonwebtoken')
var bodyParser = require('body-parser')
var session = require('express-session')
var MongoStore = require('connect-mongo')

var indexRouter = require('./routes/index');

// JWT 密钥配置
const JWT_SECRET = process.env.JWT_SECRET || 'haigou-jwt-secret'
const JWT_SECRET_ADMIN = process.env.JWT_SECRET_ADMIN || 'haigou-admin-secret'
const JWT_SECRET_CAPTCHA = process.env.JWT_SECRET_CAPTCHA || 'haigou-captcha-secret'

// restful
var proApiRouter = require('./api/pro')
var userApiRouter = require('./api/user')
var cartApiRouter = require('./api/cart');
var addressApiRouter = require('./api/Address');
var orderApiRouter = require('./api/order');
var bannerApiRouter = require('./api/banner');
var cityApiRouter = require('./api/city');
// admin
var bannerAdminRouter = require('./admin/banner')
var statisticAdminRouter = require('./admin/statistic')
var proAdminRouter = require('./admin/pro')
var adminRouter = require('./admin/admin')
var userAdminRouter = require('./admin/user')
var cartAdminRouter = require('./admin/cart')
var addressAdminRouter = require('./admin/address')
var searchAdminRouter = require('./admin/search')
var orderAdminRouter = require('./admin/order')
var dataAdminRouter = require('./admin/data')

var app = express();
// app.io = dataAdminRouter.io

var logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}
// 将请求/错误日志写入磁盘，方便排查
var accessLogStream = fs.createWriteStream(path.join(logsDir, 'access.log'), { flags: 'a' });
var errorLogStream = fs.createWriteStream(path.join(logsDir, 'error.log'), { flags: 'a' });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(logger('combined', { stream: accessLogStream }));
app.use(bodyParser.json({limit:'100mb'}));
app.use(bodyParser.urlencoded({ limit:'100mb', extended: true }));
//app.use(express.json());
//app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// 会话配置，使用 Mongo 存储，便于验证码等临时状态保持
app.use(session({
  secret: process.env.SESSION_SECRET || 'haigou-session-secret',
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    maxAge: 5 * 60 * 1000, // 验证码等短会话 5 分钟
    httpOnly: true,
    sameSite: 'lax'
  },
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI || 'mongodb://localhost:27017/haigou',
    ttl: 5 * 60 // 秒
  })
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/out')));

app.all("*",function(req,res,next){
  //设置允许跨域的域名，*代表允许任意域名跨域
  // 如需携带 cookie，请改为具体域名并打开 credentials。当前移动端同域调用，此配置维持默认。
  res.header("Access-Control-Allow-Origin","*");
  //允许的header类型， content-type
  res.header("Access-Control-Allow-Headers","*");
  //跨域允许的请求方式
  res.header("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");
  next();
});

app.all('/api/cart/*', (req, res, next) => {
  const token = req.headers.token || req.query.token || req.body.token
  if (token) {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        res.send({
          code: '10119',
          message: 'token无效'
        })
      } else {
        req.decoded = decoded
        next() // 中间件
      }
    })
  } else {
    res.send({
      code: '10119',
      message: 'token无效'
    })
  }
})

app.use('/api/pro', proApiRouter)
app.use('/api/user', userApiRouter)
app.use('/api/cart', cartApiRouter)
app.use('/api/address', addressApiRouter)
app.use('/api/order', orderApiRouter)
app.use('/api/banner', bannerApiRouter)
app.use('/api/city', cityApiRouter)

 app.all('/admin/*', (req, res, next) => {
    const token = req.headers.token || req.query.token || req.body.token
    if (req.url == '/admin/admin/login') {
      next()
    } else {
      if (token) {
        jwt.verify(token, JWT_SECRET_ADMIN, (err, decoded) => {
          if (err) {
            res.send({
              code: '10119',
              message: 'token无效'
            })
          } else {
            req.decoded = decoded
            next() // 中间件
          }
        })
      } else {
        res.send({
          code: '10119',
          message: 'token无效'
        })
      }
    } 
  })
// admin
app.use('/admin/banner', bannerAdminRouter)
app.use('/admin/statistic', statisticAdminRouter)
app.use('/admin/pro', proAdminRouter)
app.use('/admin/admin', adminRouter)
app.use('/admin/user', userAdminRouter)
app.use('/admin/cart', cartAdminRouter)
app.use('/admin/address', addressAdminRouter)
app.use('/admin/search', searchAdminRouter)
app.use('/admin/order', orderAdminRouter)
app.use('/admin/data', dataAdminRouter)

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  var status = err.status || 500;
  if (errorLogStream && errorLogStream.writable) {
    var errorEntry = '[' + new Date().toISOString() + '] ' + status + ' ' + req.method + ' ' + req.originalUrl + '\n' + (err.stack || err.message) + '\n\n';
    errorLogStream.write(errorEntry);
  }

  // render the error page
  res.status(status);
  res.render('error');
});

module.exports = app;
