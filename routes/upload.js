var express =require('express');
var router = express.Router();
var mongoose =require('mongoose');
var Users = require('../models/user');
var Videos = require('../models/video');
var fs = require('fs');
var formidable =require('formidable');
var path = require("path");
var events = require('events');




//上传视频
router.post('/upvideo', function(req, res) {
    var date = new  Date();
    // console.log(date);
    var form = new formidable.IncomingForm();
    form.uploadDir = "./public/images/videoimg";
    form.keepExtensions = true;
    form.parse(req, function(err, fields, files) {
        console.log(fields);
        console.log(files);
        // return;
        var base64Data = fields.imgfile.replace(/^data:image\/\w+;base64,/, "");
            var dataBuffer = new Buffer(base64Data, 'base64');
            var newpath = path.resolve(__dirname,'../') + '/public/images/videoimg/'+fields.videoid+".png";
            // console.log(newpath);
            fs.writeFile(newpath, dataBuffer, function(err) {
                if(err){
                    res.send(err);
                }else{
                    //存入数据库           
                    Videos.create({
                        videoid:fields.videoid,
                        userid:fields.userid,
                        tit:fields.tit,
                        videoUrl:fields.videoUrl,
                        vote:0,
                        desc:fields.desc,
                        coll:0,
                        uptime:fields.uptime,
                        pending:0,
                        puserid:'',
                        videoimg: 'http://193.112.95.221:9999/images/videoimg/'+fields.videoid+".png",
                    },(err,data)=>{
                        // console.log(data);
                        res.json({
                            code:true,
                            msg:"success",
                            data:data,
                        })
                    }) 

                    //删除原本的文件 
                    // var filename = fields.videoid.replace(/(.*\/)*([^.]+).*/ig,"$2");
                    // var filepath =  path.resolve(__dirname,'../') + '/public/images/videoimg/'+filename+".png";
                    // if(filename=="touxiang"){
                    //     console.log('默认头像不删除！');
                    //     return ;
                    // }
                    // fs.unlink(filepath, function(err){
                    // if(err){
                    //     console.log('文件:'+filepath+'删除失败！');
                    // }
                    //     console.log('文件:'+filepath+'删除成功！');
                    // })
                }
            });
    })
	console.log(req.body);
	
});
//获取视频列表
router.get('/videoList',function(req,res){
    //使用node的events解决查询异步问题
	console.log(req.query.pending);
    Videos.find({pending:req.query.pending}).then(function(data){
        if(data==''){
            res.json({
                code:true,
                videolist:[],
                userinfo:[],
            });
        }
        var cartsshop = [];
        var obj ;
        var j = 0;
        var myEventEmitter = new events.EventEmitter();
        myEventEmitter.on('next',addResult);
        function addResult() {
            cartsshop.push(obj);
            j++;
            if(j==data.length){
                console.log(cartsshop);
                res.json({
                    code:true,
                    videolist:data,
                    userinfo:cartsshop,
                });
            }
        }
        for(var i = 0;i<data.length;i++){
            var ii = i;
          Users.findOne({userid:data[ii].userid},function (err,shops) {
            if(err){
                return next(err);
            }else{
                // console.log(shops);
                obj = shops;
                myEventEmitter.emit('next');
            }
          });
        }
    })

    
})
//根据id获取视频信息
router.get('/videoDetail',function(req,res){
	// console.log()
	Videos.findOne({videoid:req.query.videoid},(err,data)=>{
        if(err){
            console.log(err);
            return;
        }
        // console.log(data);
        Users.findOne({userid:data.userid},(err,userdata)=>{
            res.json({
                code:true,
                data:{
                    videodata:data,
                    userdata:userdata,
                }
            })
        })
        
    })
})
module.exports =router;
