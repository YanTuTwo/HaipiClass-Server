var express = require('express');
var router = express.Router();
var mongoose =require('mongoose');
var Users = require('../models/user');


//连接MongoDB数据库

mongoose.connect('mongodb://127.0.0.1:27017/haipitest');

mongoose.connection.on("connected", function () {
  console.log("MongoDB connected success.")
});

mongoose.connection.on("error", function () {
  console.log("MongoDB connected fail.")
});

mongoose.connection.on("disconnected", function () {
  console.log("MongoDB connected disconnected.")
});
/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.post('/login', function(req, res){
//   if(req.body.username == 'admin' && req.body.password == '123456'){
//       res.json({code : 0, msg : '登录成功'});
//   }
//   else{
//       res.json({code : 1, msg : '账号或密码错误'});
//   }
    console.log(req.body.userid)
    console.log(req.body.password)
    Users.find({userid:req.body.userid,password:req.body.password},(err,data)=>{
        if(err){
            console.log(err);
            return;
        }
        if(data.length>0){
            res.json({
                code:true,
                msg:"登录成功"
            })
        }else{
            res.json({
                code:false,
                msg:"用户名或密码不正确！"
            })
        }
    })
});
router.post('/register', function(req, res){
    Users.find({userid:req.body.userid},(err,data)=>{
        if(err){
            console.log(err);
            return;
        }
        if(data.length>0){
            res.json({
                code:false,
                msg:'该用户名已被注册！'
            })
        }else{
            Users.create({
                userid:req.body.userid,
                password:req.body.password,
                username:req.body.username,
                avatar:"默认头像地址",
                age:0,
                sex:"",
                intro:"",
            },(err,data)=>{
                console.log(data);
                res.json({
                    code:true,
                    msg:"注册成功"
                })
            })
        }
    })
    // if(req.body.username == 'admin' && req.body.password == '123456'){
    //     res.json({code : 0, msg : '登录成功'});
    // }
    // else{
    //     res.json({code : 1, msg : '账号或密码错误'});
    // }
  });
module.exports = router;
