# 嗨购商城后端 API

基于 Express + MongoDB 的电商后端服务。

## 快速部署

```bash
# 克隆项目
git clone https://github.com/hai-gou/haigou-backend.git
cd haigou-backend

# Docker 一键启动
docker-compose up -d
```

服务启动后自动初始化数据，无需手动导入。

## 本地开发

```bash
# 1. 启动本地 MongoDB
mongod

# 2. 安装依赖
npm install

# 3. 启动服务
npm start
```

数据初始化：
- 产品数据：访问 http://localhost:3000/api/uploadPro 自动导入
- 后台接口文档：http://localhost:3000/admindoc/
- 移动端接口文档：http://localhost:3000/apidoc/

## 测试账号

| 手机号 | 密码 | 说明 |
|--------|------|------|
| 13800138001 | 123456 | 测试账号 |
| 13900139001 | 123456 | 演示账号 |

## 环境变量

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `MONGO_URI` | MongoDB 连接地址 | `mongodb://localhost:27017/haigou` |
| `SESSION_SECRET` | Session 密钥 | `haigou-session-secret` |
| `JWT_SECRET` | 用户 JWT 签名密钥 | `haigou-jwt-secret` |
| `JWT_SECRET_ADMIN` | 管理员 JWT 签名密钥 | `haigou-admin-secret` |
| `JWT_SECRET_CAPTCHA` | 验证码 JWT 签名密钥 | `haigou-captcha-secret` |

**生产环境请务必设置强随机密钥：** `openssl rand -base64 32`

## API 接口

- 基础地址：`http://your-server:3000`
- API 文档：`http://your-server:3000/apidoc`

### 主要接口

| 接口 | 说明 |
|------|------|
| POST /api/user/login | 用户登录 |
| GET /api/user/authcode | 获取验证码 |
| GET /api/pro/list | 产品列表 |
| POST /api/cart/add | 添加购物车 |
| POST /api/order/addOrder | 创建订单 |
| GET /api/banner/list | 轮播图列表 |
| GET /api/address/list | 地址列表 |
| GET /api/city | 城市数据 |

## 数据初始化

### 自动初始化（推荐）
- 用户数据：`mongo-init/init.js` - MongoDB 首次启动执行
- 产品数据：`api/pro.xlsx` - 服务启动时自动导入

### 手动重置
```bash
# 重置用户数据
docker exec <mongo-container> mongosh haigou --eval "db.users.drop()"
docker-compose restart mongo

# 重置产品数据
docker exec <mongo-container> mongosh haigou --eval "db.products.drop()"
docker-compose restart backend
```

## 技术栈

- Express.js
- MongoDB + Mongoose
- JWT 认证
- Docker Compose

## 目录结构

```
fsdownload/
├── api/              # API 路由
├── admin/            # 管理后台接口
├── mongo/            # MongoDB 数据模型
├── mongo-init/       # MongoDB 初始化脚本
├── docker-compose.yml
└── Dockerfile
```
