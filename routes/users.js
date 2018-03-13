var express = require('express');
var router = express.Router();
var mongoose =require('mongoose');
var Users = require('../models/user');
var fs = require('fs');
var multer= require('multer');


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
});
router.get('/getuserinfo',function(req,res){
    console.log(req.query.userid);
    Users.findOne({userid:req.query.userid},(err,data)=>{
        if(err){
            console.log(err);
            return;
        }
        let userinfo={};
        userinfo.avatar=data.avatar;
        userinfo.username=data.username;
        userinfo.age=data.age;
        userinfo.sex=data.sex;
        userinfo.intro=data.intro;
        console.log(userinfo);
        res.json({
            code:true,
            data:userinfo
        })
    })
})


//更新用户信息，包含上传用户头像
var Storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'../public/images');
    },
    filename:function(req,file,cb){
        console.log(file);
        cb(null,file.originalname);
    }
})
var upload=multer({storage:Storage}).single('file2');
router.post('/update',function(req,res){
    upload(req,res,function(err){
        console.log(err)
        if(err){
            return res.end(err);
        }
        return res.end("success!");
    })
})
module.exports = router;
