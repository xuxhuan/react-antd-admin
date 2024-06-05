const mongoose = require('mongoose');

// 创建集合结构 即表的字段结构
let BillSchema = new mongoose.Schema({
    // _id: {
    //   type: mongoose.Types.ObjectId,
    //   required: true
    // },
    title: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'expense'
    },
    category: {
      type: String,
      required: true
    },
    money: {
      type: Number,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    memo: {
      type: String,
      default: '无'
    },
    uid: {
      type: mongoose.Types.ObjectId,
      required: true
    },
}); 

// 创建模型对象
let BillModel = mongoose.model('bill', BillSchema);

module.exports = BillModel