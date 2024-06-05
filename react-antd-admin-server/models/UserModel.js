const mongoose = require('mongoose');

// 创建集合结构 即表的字段结构
let UserSchema = new mongoose.Schema({
    // _id: {
    //     type: mongoose.Types.ObjectId,
    //     required: true
    // },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: String,
    gender: String,
    role: {
        // -1 表示系统管理员 0 表示普通管理员 1 表示普通用户
        type: Number,
        required: true
    }
}); 

// 创建模型对象
let UserModel = mongoose.model('user', UserSchema);

module.exports = UserModel