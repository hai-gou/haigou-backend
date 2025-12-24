const express = require('express')
const xlsx = require('node-xlsx').default;
const router = express.Router()
const mysql = require('../mongo')
const Product = require('../mongo/collection/Product')
const Search = require('../mongo/collection/Search')
const uuid = require('uuid')

router.get('/', (req, res, next) => {
  // 发送数据
  res.send('产品列表的接口')
})
/**
 * @api {get} /api/pro/list 获取商品分页列表数据
 * @apiName GetProList
 * @apiGroup Pro
 * 
 * @apiParam {Number} count 页码,默认值为1
 * @apiParam {Number} limitNum 每页显示个数,默认值为10
 * 
 */
router.get('/list', (req, res, next) => {
  const count = req.query.count * 1 || 1
  const limitNum = req.query.limitNum * 1 || 10
  mysql.paging(Product, {}, { _id: 0, __v: 0}, count, limitNum).then(data => {
    res.send({
      code: '200',
      message: '获取商品分页列表数据',
      data // 如果对象的 key 和value 相同，并且value值是一个变量，那么可以简写
    })
  })
})
/**
 * @api {get} /api/pro/detail/:proid 获取产品的详情数据
 * @apiName GetProDetail
 * @apiGroup Pro
 * 
 * @apiParam {String} proid 产品唯一值，产品id
 * 
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    code: '10001',
 *    message: '抱歉，没有查找到该商品'
 *  }
 *  {
 *    code: '200',
 *    message: '获取产品的详情数据'
 *    data: {}
 *  }
 */
router.get('/detail/:proid', (req, res, next) => {
  const { proid } = req.params // 解构复制 const proid = req.params.proid

  mysql.find(Product, { proid }, { _id: 0, __v: 0 }).then(data => {
    // data 数据一般都是数组
    if (data.length === 0) { // 没有找到该商品
      res.send({
        code: '10001', // 自己定义规则就可以
        message: '抱歉，没有查找到该商品'
      })
    } else {
      res.send({
        code: '200',
        message: '获取产品的详情数据',
        data: data[0] // data [{}]
      })
    }
  })
})
/**
 * @api {get} /api/pro/seckilllist 获取秒杀产品列表的数据
 * @apiName GetProSeckillList
 * @apiGroup Pro
 * 
 * @apiParam {Number} count 页码,默认值为1
 * @apiParam {Number} limitNum 每页显示个数,默认值为6
 * 
 */
router.get('/seckilllist', (req, res, next) => {
  const count = req.query.count * 1 || 1
  const limitNum = req.query.limitNum * 1 || 6
  mysql.paging(Product, { isseckill: 1 }, { _id:0, __v:0 }, count, limitNum).then(data => {
    res.send({
      code: '200',
      message: '获取秒杀产品列表的数据',
      data
    })
  })
})


/**
 * @api {get} /api/pro/recommendlist 获取推荐产品列表的数据
 * @apiName GetProRecommendList
 * @apiGroup Pro
 * 
 * @apiParam {Number} count 页码,默认值为1
 * @apiParam {Number} limitNum 每页显示个数,默认值为12
 * 
 */
router.get('/recommendlist', (req, res, next) => {
  const count = req.query.count * 1 || 1
  const limitNum = req.query.limitNum * 1 || 12
  mysql.paging(Product, { isrecommend: 1 }, { _id:0, __v:0 }, count, limitNum).then(data => {
    res.send({
      code: '200',
      message: '获取推荐产品列表的数据',
      data
    })
  })
})
/**
 * @api {get} /api/pro/search 搜索列表
 * @apiName GetProSearch
 * @apiGroup Pro
 * 
 * @apiParam {Number} count 页码,默认值为1
 * @apiParam {Number} limitNum 每页显示个数,默认值为10
 * @apiParam {String} keyword 搜索的关键词
 * 
 */
router.get('/search', (req, res, next) => {
  const { keyword } = req.query
  const reg = new RegExp(keyword)
  // 搜索到的产品进行分页
  const count = req.query.count * 1 || 1
  const limitNum = req.query.limitNum * 1 || 10
  // 搜索数据库中产品的 proname 和 desc 字段，返回搜索的列表数据
  mysql.paging(Product, 
    { $or: [ { proname: reg }, { desc: reg } ] },  // 或查询的 语法
    {_id:0, __v: 0}, 
    count, limitNum).then(data => {
      // 如果有搜索到商品，收纳搜索的关键词
      // 如果没有，告知用户暂未搜索到心仪的商品，并且可以给用户其他的推荐商品
      if (data.length === 0) { // 没有搜索到商品
        res.send({
          code: '10002',
          message: '抱歉，暂未找到相关的商品'
        })
      } else {
        // 检测 关键词 在数据库中(搜索关键词数据库集合)有没有，如果没有，插入并且设置数量为1
        // 如果有，更新该关键词的数量加1
        mysql.find(Search, { keyword }, { _id: 0, __v: 0}).then(result => {
          if (result.length === 0) { // 没有这个关键词
            mysql.insert(Search, {
              wordid: 'word_' + uuid.v4(),
              keyword: keyword,
              num: 1
            }).then(() => {
              // 插入成功
              res.send({
                code: '200',
                message: '搜索列表',
                data: data  // 搜到了，收纳了，返回搜到的数据
              })
            })
          } else { // 有关键词
            // 更新这个关键词的数量 + 1
            // 找到唯一值 为条件进行更新
            // result [{ wordid:'', keyword: '', num: 1}]
            const wordid  = result[0].wordid
            mysql.update(Search, { wordid }, { $inc: {num: 1} }).then(() => {
              // 更新成功
              res.send({
                code: '200',
                message: '搜索列表',
                data: data  // 搜到了，收纳了，返回搜到的数据
              })
            })
          }
        })
      }
  })
})
/**
 * @api {get} /api/pro/hotword 热门搜索
 * @apiName GetProHotWord
 * @apiGroup Pro
 * 
 */
router.get('/hotword', (req, res, next) => {
  // 先排序，再取值
  mysql.sort(Search, {}, { _id: 0, __v:0 }, { num: -1}).then(data => {
    // 截取 当前数组的 12项
    const arr = data.splice(0, 12)

    res.send({
      code: '200',
      message: '热门搜索',
      data: arr
    })
  })
})
/**
 * @api {get} /api/pro/categorylist 产品的分类列表
 * @apiName GetProCategoryList
 * @apiGroup Pro
 * 
 */
router.get('/categorylist', (req, res, next) => {
  mysql.distinct(Product, 'category').then(data => {
    res.send({
      code: '200',
      message: '产品的分类列表',
      data
    })
  })
})

/**
 * @api {get} /api/pro/categorybrandlist 产品分类下品牌列表
 * @apiName GetProCategoryBrandList
 * @apiGroup Pro
 * 
 * @apiParam {String} category 分类
 * 
 */
router.get('/categorybrandlist', (req, res, next) => {
  const { category } = req.query 
  mysql.find(Product, { category }, { _id: 0, brand: 1}).then(data => {
    // data 数据有重复数据， 去重 ------ 对象数组去重
    // https://www.cnblogs.com/le220/p/9130656.html
    // reduce 的第二个参数是一个数组，那么执行函数中 的参数代表
    // item 代表当前的对象  next代表的是下一个对象
    // 如果reduce 第二个参数为number类型，第一个参数代表当前的对象，第二代表的是索引值
    // obj = {'Apple':true, '小米': true, '华为': true, '洛基亚': true}
    const obj = {}
    data = data.reduce((item, next) => {
      obj[next.brand] ? '' : obj[next.brand] = true && item.push(next)
      return item
    }, [])
    res.send({
      code: '200',
      message: '产品分类下品牌列表',
      data
    })
  })
})
/**
 * @api {get} /api/pro/categorybrandprolist 获取某分类下某品牌的产品列表
 * @apiName GetCategoryBrandProList
 * @apiGroup Pro
 * 
 * @apiParam {Number} count 页码,默认值为1
 * @apiParam {Number} limitNum 每页显示个数,默认值为10
 * @apiParam {String} category 产品分类
 * @apiParam {String} brand 当前分类下的品牌
 * 
 */
router.get('/categorybrandprolist', (req, res, next) => {
  let { category, brand, count, limitNum } = req.query
  count = req.query.count * 1 || 1
  limitNum = req.query.limitNum * 1 || 20
  mysql.paging(Product, { category, brand }, { _id: 0, __v: 0 }, count, limitNum).then(data => {
    if (data.length === 0) {
      res.send({
        code: '10003',
        message: '没有更多数据了'
      })
    } else {
      res.send({
        code: '200',
        message: '获取某分类下某品牌的产品列表',
        data
      })
    }
  }) 
})
// 导入excel表格的数据
router.get('/uploadPro', (req, res, next) => {
  const originData = xlsx.parse(`${__dirname}/pro.xlsx`);
  const firstData = originData[0].data
  const arr = []
  for (var i = 0; i < firstData.length; i++) { 
    if (i !== 0) {
      arr.push({
        proid: 'pro_'+ uuid.v4(),
        category: firstData[i][0],
        brand: firstData[i][1],
        proname: firstData[i][2],
        banners: firstData[i][3],
        originprice: firstData[i][4],
        sales: firstData[i][5],
        stock: firstData[i][6],
        desc: firstData[i][7],
        issale: firstData[i][8],
        isrecommend: firstData[i][9],
        discount: firstData[i][10],
        isseckill: firstData[i][11],
        img1: firstData[i][12],
        img2: firstData[i][13],
        img3: firstData[i][14],
        img4: firstData[i][15],
      })
    }
  }
  // 拿到 arr 的数据，先清空 产品的表格数据，然后再插入
  mysql.delete(Product, {}, 1).then(() => { // 不要忘记写1，因为1 代表的是删除多条数据
    // 所有的数据已删除完成
    // 插入数据
    mysql.insert(Product, arr).then(() => {
      // 重定向到 商品的管理的页面路由
      res.send('导入数据成功') // 相当于浏览器自动跳转到了 /pro 的路由
    })
  })
})
module.exports = router
