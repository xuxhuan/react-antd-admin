var express = require('express');
var router = express.Router();
const BillModel = require('../models/BillModel');
const UserModel = require('../models/UserModel');
const MenuModel = require('../models/MenuModel');
const ObjectId = require('mongoose').Types.ObjectId;

// 登录请求
router.post('/login', (req, res) => {
  // 查询
  UserModel.findOne(req.body).then((data) => {
    // 不管查询成功还是失败都会执行then，查询失败返回null
    if (!data) {
      // 验证失败
      res.status(400).send({ code: 400, data: { message: '账号或密码错误', success: false } });
    }else{
      // 验证成功
      // 创建一个示例令牌 
      // const token = jwt.sign({ username: username, userId: '12345' }, md5, { expiresIn: '12h' });
      const {_id: uid, username, role} = data;
      res.status(200).send({ code: 200, data: { message: '验证成功', uid, username, role, token: 'Admin Token', success: true} });
    }
  }).catch((err) => {
    // 处理查询错误
    res.status(500).send( { code: 500, data: { message: err.message, success: false }} );
  })
});

// 获取当前用户信息请求
router.get('/userInfo/:uid', (req, res) => {
  const {uid} = req.params;
  if (!uid) {
    // 验证 uid 是否存在
    res.status(401).send({ code: 401, data: { message: '缺少 uid 参数', success: false } });
  }
  if(!ObjectId.isValid(uid)){
    // uid 不合法
    res.status(402).send({ code: 402, data: { message: 'uid 参数不合法', success: false } });
  }

  // const objUID = new ObjectId(uid);  // 将 string类型 转化为 ObjectId类型
  // 从user集合中查询用户信息并返回
  UserModel.findById(uid).then((data) => {
    if(!data){
      // 获取失败
      res.status(404).send({ code: 404, data: { message: '未找到该用户', success: false } });
    }else{
      // 获取成功
      const {_id, username, avatar, gender, role} = data;
      const userInfo = {_id, username, avatar, gender, role};
      res.status(200).send({ code: 200, data: { message: '获取用户信息成功', userInfo, success: true} });
    }
  }).catch((err) => {
    // 处理查询错误
    res.status(500).send( { code: 500, data: { message: err.message, success: false }} );
  })
})

// 获取用户密码请求
router.get('/userPassword/:uid', (req, res) => {
  const {uid} = req.params;
  if (!uid) {
    // 验证 uid 是否存在
    res.status(401).send({ code: 401, data: { message: '缺少 uid 参数', success: false } });
  }
  if(!ObjectId.isValid(uid)){
    // uid 不合法
    res.status(402).send({ code: 402, data: { message: 'uid 参数不合法', success: false } });
  }

  // const objUID = new ObjectId(uid);  // 将 string类型 转化为 ObjectId类型
  // 从user集合中查询用户信息并返回
  UserModel.findById(uid).then((data) => {
    if(!data){
      // 获取失败
      res.status(404).send({ code: 404, data: { message: '未找到该用户', success: false } });
    }else{
      // 获取成功
      const {_id, password} = data;
      const userPassword = {_id, password};
      res.status(200).send({ code: 200, data: { message: '获取用户成功', userPassword, success: true} });
    }
  }).catch((err) => {
    // 处理查询错误
    res.status(500).send( { code: 500, data: { message: err.message, success: false }} );
  })
})

// 修改头像
router.post('/uploadAvatar', (req, res) => {
  const {uid, avatar} = req.body;
  if (!avatar) {
    return res.status(400).json({code: 400, message: '没有上传头像', success: false});
  }

  if (!uid) {
    // 验证 uid 是否存在
    res.status(401).send({ code: 401, data: { message: '缺少 uid 参数', success: false } });
  }
  if(!ObjectId.isValid(uid)){
    // uid 不合法
    res.status(402).send({ code: 402, data: { message: 'uid 参数不合法', success: false } });
  }

  const objUID = new ObjectId(uid);
  UserModel.updateOne({_id: objUID}, {avatar}).then((data) => {
    
    if (data.modifiedCount === 0 && data.matchedCount === 0) {
      return res.status(408).send({ code: 408, data: { message: '用户头像更新出错', success: false } });
    }
    // 更新成功
    res.status(200).send({ code: 200, data: { message: '用户头像更新成功', data, success: true} });
  }).catch((err) => {
    // 处理更新错误
    res.status(500).send( { code: 500, data: { message: err.message, success: false }} );
  })
})

// 根据 uid 以及提交的新密码更新指定账单信息请求 post
router.post('/updatePasswordDoc', (req, res) => {
  const {uid, currentPassword, confirmPassword} = req.body;

  if (!uid){
    // 验证 bid 是否存在
    res.status(401).send({ code: 406, data: { message: '缺少 uid 参数', success: false } });
  }
  if(!ObjectId.isValid(uid)){
    // uid 不合法
    res.status(402).send({ code: 407, data: { message: 'uid 参数不合法', success: false } });
  }

  const objUID = new ObjectId(uid);
  UserModel.updateOne({_id: objUID}, {password: confirmPassword}).then((data) => {
    
    if (data.modifiedCount === 0 && data.matchedCount === 0) {
      return res.status(408).send({ code: 408, data: { message: '密码更新出错', success: false } });
    }
    // 更新成功
    res.status(200).send({ code: 200, data: { message: '密码更新成功', user: data, success: true} });

  }).catch((err) => {
    // 处理更新错误
    res.status(500).send( { code: 500, data: { message: err.message, success: false }} );
  })
})

// 根据uid和role获取所有用户信息请求
router.get('/userInfos/:uid/:role', (req, res) => {
  const {uid, role} = req.params;
  if (!uid) {
    // 验证 uid 是否存在
    res.status(401).send({ code: 401, data: { message: '缺少 uid 参数', success: false } });
  }
  if(!ObjectId.isValid(uid)){
    // uid 不合法
    res.status(402).send({ code: 402, data: { message: 'uid 参数不合法', success: false } });
  }

  let users = [];
  UserModel.find().then((data) => {
    users = data.map(user => {
      user = user.toObject();
      delete user.password;  // 去掉密码
      return user;
    });
    // 普通管理员 获取用户信息（无法获取系统管理员的信息和其他普通管理员的信息）
    if(role === '0') {  
      users = users.filter(user => (user.role === 1) || (user._id.toString() === uid));
    }
    res.status(200).send({ code: 200, data: { message: '获取用户信息成功', userInfos: users, success: true} });
  }).catch((err) => {
    // 处理查询错误
    res.status(500).send( { code: 500, data: { message: err.message, success: false }} );
  })
})

// 增加用户
router.post('/createUserDoc', (req, res) => {

  const {username} = req.body;
  UserModel.findOne({username}).then((data) => {
    if (data) {
      // 账号已存在
      res.status(410).send({ code: 410, data: { message: '账号已存在', success: false } });
    }
  }).catch((err) => {
    // 处理查询错误
    res.status(500).send( { code: 500, data: { message: err.message, success: false }} );
  })

  UserModel.create(req.body).then((data) => {
    // 插入成功
    res.status(200).send({ code: 200, data: {user: data, success: true} });
  }).catch((err) => {
    // 处理插入错误
    res.status(500).send( { code: 500, data: { message: err.message, success: false }} );
  })
})

// 删除用户
router.get('/deleteUserDoc/:uid', (req, res) => {
  const {uid} = req.params;
  if (!uid) {
    // 验证 bid 是否存在
    res.status(401).send({ code: 406, data: { message: '缺少 uid 参数', success: false } });
  }
  if(!ObjectId.isValid(uid)){
    // bid 不合法
    res.status(402).send({ code: 407, data: { message: 'uid 参数不合法', success: false } });
  }
  // 从数据库中删除
  const objUID = new ObjectId(uid);
  UserModel.deleteOne({_id: objUID}).then((data) => {
    if(data.deletedCount === 0){
      // 删除失败
      res.status(408).send({ code: 408, data: { message: '用户信息删除出错', success: false } });
    }else{
      // 删除成功
      res.status(200).send({ code: 200, data: { message: '用户信息删除成功', user: data, success: true} });
    }
  }).catch((err) => {
    // 处理删除错误
    res.status(500).send( { code: 500, data: { message: err.message, success: false }} );
  })
})

// 修改用户信息
router.post('/updateUserDoc', (req, res) => {
  const {uid, username, avatar, gender, role} = req.body;
  const user = {username, avatar, gender, role};

  if (!uid) {
    // 验证 bid 是否存在
    res.status(401).send({ code: 406, data: { message: '缺少 bid 参数', success: false } });
  }
  if(!ObjectId.isValid(uid)){
    // uid 不合法
    res.status(402).send({ code: 407, data: { message: 'bid 参数不合法', success: false } });
  }

  const objUID = new ObjectId(uid);
  UserModel.updateOne({_id: objUID}, user).then((data) => {
    if (data.modifiedCount === 0) {
      return res.status(408).send({ code: 408, data: { message: '用户信息更新出错', success: false } });
    }
    // 更新成功
    res.status(200).send({ code: 200, data: { message: '用户信息更新成功', user: data, success: true} });
  }).catch((err) => {
    // 处理更新错误
    res.status(500).send( { code: 500, data: { message: err.message, success: false }} );
  })
})

// 创建账单请求
router.post('/createBillDoc', (req, res) => {

    const {title, type, category, money, date, memo, uid} = req.body;

    if (!uid) {
      // 验证 uid 是否存在
      res.status(401).send({ code: 401, data: { message: '缺少 uid 参数', success: false } });
    }
    if(!ObjectId.isValid(uid)){
      // uid 不合法
      res.status(402).send({ code: 402, data: { message: 'uid 参数不合法', success: false } });
    }

    const objUID = new ObjectId(uid);
    const bill = {title, type, category, money, date: new Date(date), memo, uid: objUID};

    BillModel.create(bill).then((data) => {
    // 插入成功
    res.status(200).send({ code: 200, data: {bill: data, success: true} });
  }).catch((err) => {
    // 处理插入错误
    res.status(500).send( { code: 500, data: { message: err.message, success: false }} );
  })
})

// 根据uid获取账单信息请求
router.get('/billInfo/:uid', (req, res) => {
  const {uid} = req.params;
  if (!uid) {
    // 验证 uid 是否存在
    res.status(401).send({ code: 401, data: { message: '缺少 uid 参数', success: false } });
  }
  if(!ObjectId.isValid(uid)){
    // uid 不合法
    res.status(402).send({ code: 402, data: { message: 'uid 参数不合法', success: false } });
  }
  // 从数据库中查询
  const objUID = new ObjectId(uid);
  BillModel.find({uid: objUID}).then((data) => {
    if(!data){
      // 获取失败
      res.status(404).send({ code: 404, data: { message: '账单信息未找到', success: false } });
    }else{
      // 获取成功
      res.status(200).send({ code: 200, data: { message: '获取用户信息成功', bills: data, success: true} });
    }
  }).catch(() => {
    // 处理查询错误
    res.status(500).send( { code: 500, data: { message: err.message, success: false }} );
  })
})

// 根据bid以及提交的新数据更新指定账单信息请求 post
router.post('/updateBillDoc', (req, res) => {
  const {bid, title, type, category, money, date, memo} = req.body;

  if (!bid) {
    // 验证 bid 是否存在
    res.status(401).send({ code: 406, data: { message: '缺少 bid 参数', success: false } });
  }
  if(!ObjectId.isValid(bid)){
    // uid 不合法
    res.status(402).send({ code: 407, data: { message: 'bid 参数不合法', success: false } });
  }

  const objBID = new ObjectId(bid);
  const bill = {title, type, category, money, date: new Date(date), memo};

  BillModel.updateOne({_id: objBID}, bill).then((data) => {
    
    if (data.modifiedCount === 0) {
      return res.status(408).send({ code: 408, data: { message: '账单信息更新出错', success: false } });
    }
    // 更新成功
    res.status(200).send({ code: 200, data: { message: '账单信息更新成功', bills: data, success: true} });
  }).catch((err) => {
    // 处理更新错误
    res.status(500).send( { code: 500, data: { message: err.message, success: false }} );
  })
})

// 根据 bid 删除指定账单信息请求 get
router.get('/deleteBillDoc/:bid', (req, res) => {
  const {bid} = req.params;
  if (!bid) {
    // 验证 bid 是否存在
    res.status(401).send({ code: 406, data: { message: '缺少 bid 参数', success: false } });
  }
  if(!ObjectId.isValid(bid)){
    // bid 不合法
    res.status(402).send({ code: 407, data: { message: 'bid 参数不合法', success: false } });
  }
  // 从数据库中删除
  const objBID = new ObjectId(bid);
  BillModel.deleteOne({_id: objBID}).then((data) => {
    if(data.deletedCount === 0){
      // 删除失败
      res.status(404).send({ code: 408, data: { message: '账单信息删除出错', success: false } });
    }else{
      // 删除成功
      res.status(200).send({ code: 200, data: { message: '账单信息删除成功', bills: data, success: true} });
    }
  }).catch((err) => {
    // 处理删除错误
    res.status(500).send( { code: 500, data: { message: err.message, success: false }} );
  })
})

// 根据角色获取当前用户的菜单列表
router.get('/getMenus/:role', (req, res) => {
  MenuModel.findOne(req.params).then((data) => {
    if(!data){
      // 获取失败
      res.status(404).send({ code: 404, data: { message: '未找到该角色', success: false } });
    }else{
      // 获取成功
      const {menus} = data;
      res.status(200).send({ code: 200, data: { message: '获取菜单成功', menus, success: true} });
    }
  }).catch((err) => {
    // 处理查询错误
    res.status(500).send( { code: 500, data: { message: err.message, success: false }} );
  })
})

// 根据bid以及提交的新数据更新指定账单信息请求 post
router.post('/updateMenu', (req, res) => {
  const {role, menus} = req.body;
  MenuModel.updateOne({role}, {menus}).then((data) => {
    
    if(data.modifiedCount === 0 && data.matchedCount === 0) {
      return res.status(408).send({ code: 408, data: { message: '菜单更新出错', success: false } });
    }

    // 更新成功
    res.status(200).send({ code: 200, data: { message: '菜单更新成功', data, success: true} });

  }).catch((err) => {
    // 处理更新错误
    res.status(500).send( { code: 500, data: { message: err.message, success: false }} );
  })
})

module.exports = router;
