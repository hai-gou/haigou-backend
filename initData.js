/**
 * 数据初始化模块 - 服务启动时自动执行
 * 检测数据库是否为空，为空则自动导入初始数据
 */
const xlsx = require('node-xlsx').default;
const path = require('path');
const uuid = require('uuid');

async function initProducts(mysql, Product) {
  try {
    const count = await Product.countDocuments();
    if (count > 0) {
      console.log(`[Init] 产品数据已存在 (${count} 条)，跳过初始化`);
      return;
    }

    console.log('[Init] 开始导入产品数据...');
    const xlsxPath = path.join(__dirname, 'api', 'pro.xlsx');
    const originData = xlsx.parse(xlsxPath);
    const firstData = originData[0].data;
    const arr = [];

    for (let i = 1; i < firstData.length; i++) {
      arr.push({
        proid: 'pro_' + uuid.v4(),
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
      });
    }

    await Product.insertMany(arr);
    console.log(`[Init] 产品数据导入完成 (${arr.length} 条)`);
  } catch (err) {
    console.error('[Init] 产品数据导入失败:', err.message);
  }
}

module.exports = { initProducts };
