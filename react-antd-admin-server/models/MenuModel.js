const mongoose = require('mongoose');

// 创建集合结构 即表的字段结构
let MenuSchema = new mongoose.Schema({
    role: {
      type: Number,
      required: true
    },
    menus: {
      type: Array,
      required: true
    }
}); 

// 创建模型对象
let MenuModel = mongoose.model('role_menu', MenuSchema);

module.exports = MenuModel