/**
 * 
 * @param {*} success  数据库连接成功的回调
 * @param {*} error  数据库连接失败的回调
 */

module.exports = function(success, error){

    const mongoose = require('mongoose');
    const config = require('../config');
    const {DBHOST, DBPORT, DBNAME} = config;

    // 开启严格模式
    // mongoose.set('strictQuery', true);

    // 连接 mongodb服务器 中的 billdb数据库
    mongoose.connect(`mongodb://${DBHOST}:${DBPORT}/${DBNAME}`);

    // 设置连接成功回调
    mongoose.connection.once('open', () => {
        success();
    })

    // 连接出错
    mongoose.connection.on('error', () => {
        error();
    })

    // 连接关闭
    mongoose.connection.on('close', () => {
        console.log('连接关闭');
    })

}