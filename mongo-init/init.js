// MongoDB 初始化脚本 - Docker 启动时自动执行
// 只在数据库为空时初始化，避免重复导入

db = db.getSiblingDB('haigou');

// 初始化用户数据
if (db.users.countDocuments() === 0) {
  print('初始化用户数据...');
  db.users.insertMany([
    {
      userid: "user_test001",
      username: "test",
      password: "e10adc3949ba59abbe56e057f20f883e", // 123456
      tel: "13800138001",
      telcode: "",
      email: "test@test.com",
      nickname: "测试用户",
      qq: "",
      wx: "",
      avatar: "https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3358008061,4231540853&fm=26&gp=0.jpg",
      sex: 1,
      birthday: "",
      createTime: Date.now()
    },
    {
      userid: "user_demo001",
      username: "demo",
      password: "e10adc3949ba59abbe56e057f20f883e", // 123456
      tel: "13900139001",
      telcode: "",
      email: "demo@demo.com",
      nickname: "演示账号",
      qq: "",
      wx: "",
      avatar: "https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3358008061,4231540853&fm=26&gp=0.jpg",
      sex: 0,
      birthday: "",
      createTime: Date.now()
    }
  ]);
  print('用户数据初始化完成');
} else {
  print('用户数据已存在，跳过初始化');
}

print('数据库初始化完成！');
print('测试账号: 13800138001 / 123456');
print('演示账号: 13900139001 / 123456');
