var express = require('express');
var router = express.Router();
var mongoose =require('mongoose');
var Users = require('../models/user');
var fs = require('fs');
var formidable =require('formidable');
var path = require("path");


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
                nickname:req.body.nickname,
                avatar:"http://192.168.1.141:3000/images/avatarimg/touxiang.jpeg",
                age:18,
                sex:"男",
                intro:"",
            },(err,data)=>{
                // console.log(data);
                res.json({
                    code:true,
                    msg:"注册成功"
                })
            })
        }
    })
});
router.get('/getuserinfo',function(req,res){
    // console.log(req.query.userid);
    Users.findOne({userid:req.query.userid},(err,data)=>{
        if(err){
            console.log(err);
            return;
        }
        let userinfo={};
        userinfo.avatar=data.avatar;
        userinfo.nickname=data.nickname;
        userinfo.age=data.age;
        userinfo.sex=data.sex;
        userinfo.intro=data.intro;
        // userinfo.wyCollect=data.wyCollect;
        // console.log(userinfo);
        res.json({
            code:true,
            data:userinfo
        })
    })
})

router.post('/update',function(req,res){
    var date = new  Date();
    // console.log(date);
    var form = new formidable.IncomingForm();
    form.uploadDir = "./public/images/avatarimg";
    form.keepExtensions = true;
    form.parse(req, function(err, fields, files) { 
        // console.log(fields.avatar);
        if(fields.file==''){
            //未更改头像，不需要保存文件
            //存入数据库 
            Users.update({userid:fields.userid},{
                nickname:fields.nickname,
                age:fields.age,
                sex:fields.sex,
                // avatar: 'http://192.168.1.141:3000/images/avatarimg/touxiang.jpeg',
                intro:fields.intro,
            },function(err,docs){
                if(err) console.log(err);
                // console.log('更改成功：' + docs);
                res.json({
                    code:true,
                    msg:'保存成功！',
                });
            }) 
        }else{
            /**************************** */
            //gif图的上传未实现
            // var reg = /\/(\S*);/;
            // var imgtype = fields.file.match(reg)[1]; console.log("图片格式"+imgtype);
            //********************** */

            //更改头像，需保存文件
            var base64Data = fields.file.replace(/^data:image\/\w+;base64,/, "");
            var dataBuffer = new Buffer(base64Data, 'base64');
            var newpath = path.resolve(__dirname,'../') + '/public/images/avatarimg/'+date.getTime()+fields.userid+".png";
            // console.log(newpath);
            fs.writeFile(newpath, dataBuffer, function(err) {
                if(err){
                    res.send(err);
                }else{
                    //存入数据库           
                    Users.update({userid:fields.userid},{
                        nickname:fields.nickname,
                        age:fields.age,
                        sex:fields.sex,
                        avatar: 'http://192.168.1.141:3000/images/avatarimg/'+date.getTime()+fields.userid+".png",
                        intro:fields.intro,
                    },function(err,docs){
                        if(err) console.log(err);
                        // console.log('更改成功：' + docs);
                        res.json({
                            code:true,
                            msg:'保存成功！',
                        });
                    })  

                    //删除原本的文件 
                    var filename = fields.avatar.replace(/(.*\/)*([^.]+).*/ig,"$2");
                    var filepath =  path.resolve(__dirname,'../') + '/public/images/avatarimg/'+filename+".png";
                    if(filename=="touxiang"){
                        console.log('默认头像不删除！');
                        return ;
                    }
                    fs.unlink(filepath, function(err){
                    if(err){
                        console.log('文件:'+filepath+'删除失败！');
                    }
                        console.log('文件:'+filepath+'删除成功！');
                    })
                }
            });
        }
    })
})

//添加收藏
router.post('/addCollect',function(req,res){
    Users.update({'userid':req.body.userid}, {'$push':{'wyCollect':{
        'plid':req.body.plid,
        'contentid':req.body.contentid,
        'img':req.body.img,
        'tit':req.body.tit,
        'desc':req.body.desc,
        'director':req.body.director,
        'viewcount':req.body.viewcount,
    }}},function(err,docs){
        if(err) console.log(err);
        console.log('添加成功：' + docs);
        res.json({
            code:true,
            msg:'添加成功！',
        });
    }); 
})
//删除收藏
router.post('/deleteCollect',function(req,res){
    Users.update(
        {'userid':req.body.userid}, 
        {'$pull':{wyCollect:{plid:req.body.plid,contentid:req.body.contentid}} },
        {multi:true},function(err,docs){
            if(err) console.log(err);
            console.log('取消成功：' + docs);
            res.json({
                code:true,
                msg:'取消成功！',
            });
        } 
    )
})
//获取收藏列表
router.get('/getCollectList',function(req,res){
    let status=req.query.status;
    // console.log(req.query);
    Users.findOne({userid:req.query.userid},{},(err,data)=>{
        // console.log(data);
        if(err){
            console.log(err);
            return;
        }
        if(status==0){
            //获取网易的数据
            res.json({
                code:true,
                data:data.wyCollect,
            })
        }else if(status==1){
            //获取嗨皮的数据
            res.json({
                code:true,
                data:data.hpCollect,
            })
        }
    })
})
//添加网易播放记录
router.post('/addhistory',function(req,res){
    console.log(req.body);
    Users.update(
        {'userid':req.body.userid}, 
        {'$pull':{playHistory:{plid:req.body.plid,contentid:req.body.contentid}} },
        {multi:true},function(err,docs){
            if(err) console.log(err);
            console.log('删除成功：' + docs);
        } 
    )
    Users.update({'userid':req.body.userid}, {'$push':{'playHistory':{
        'plid':req.body.plid,
        'contentid':req.body.contentid,
        'tit':req.body.tit,
        'director':req.body.director,
        'playtime':req.body.playtime,
    }}},function(err,docs){
        if(err) console.log(err);
        console.log('添加成功：' + docs);
        res.json({
            code:true,
            msg:'添加成功！',
        });
    }); 
})
//清空播放记录
router.post('/delehistory',function(req,res){
    Users.update({'userid':req.body.userid}, {'$set':{'playHistory':[]}},function(err,docs){
        if(err) console.log(err);
        console.log('清除成功：' + docs);
        res.json({
            code:true,
            msg:'清除成功！',
        });
    }); 
})
//获取播放记录
router.get('/gethistory',function(req,res){
    console.log(req.query);
    Users.findOne({userid:req.query.userid},{},(err,data)=>{
        // console.log(data);
        if(err){
            console.log(err);
            return;
        }
        res.json({
            code:true,
            data:data.playHistory
        })
    })
})
module.exports = router;
