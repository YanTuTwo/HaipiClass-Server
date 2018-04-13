var express = require('express');
var router = express.Router();
var axios =require('axios');
var pendUsers = require('../models/penduser');
var Users =require('../models/user');
var Videos = require('../models/video')
var pendHistory = require('../models/pendhistory');

/* GET home page. */
// router.get('/', function(req, res, next) {
//   	res.render('index', { title: 'Express' });
// });


//首页推荐接口
router.get('/getlist',function(req,res){
	axios.get("https://c.open.163.com/open/mob/subscribe/home/list.do?rtypes=2",
	{
		headers:{
			host:"c.open.163.com",
			referer:"https://m.open.163.com/index"
		}
	}).then(function(data){
		res.json(data.data.data);
	})
})
//首页其它tab项接口
router.get('/getclasslist',function(req,res){
	let url="https://c.open.163.com/mob/classify/playlist.do?";
	axios.get(url,
	{
		params:req.query
	}).then(function(data){
		res.json(data.data);
	})
})


//总后台控制接口
//总后台首页接口
router.get('/pindex',function(req,res){
	Users.count({},(err,usercount)=>{
		console.log(usercount);
		Videos.count({pending:'0'},(err,pendcount)=>{
			console.log(pendcount);
			Videos.count({pending:'1'},(err,passcount)=>{
				console.log(passcount);
				Videos.count({pending:'2'},(err,notpasscount)=>{
					console.log(notpasscount);
					pendHistory.count({},(err,historycount)=>{
						res.json({
							code:true,
							data:{
								usercount:usercount,
								pendcount:pendcount,
								passcount:passcount,
								notpasscount:notpasscount,
								historycount:historycount
							}
							
						})
					})
					
				})
			})

		})
	})
})
router.get('/puserinfo',function(req,res){
	pendUsers.findOne({puserid:req.query.puserid},(err,puserdata)=>{
		Videos.count({
			puserid:req.query.puserid,
			pending:{ $in: ['1', '2']}
		},(err,checked)=>{
			res.json({
				code:true,
				data:{
					puserdata:puserdata,
					checkedcount:checked
				}
				
			})
		})
	})
})
//总后台登陆接口
router.post('/plogin', function(req, res){
	let date=new Date();
	console.log(req.body);
	if(req.body.puserid=='admin' && req.body.password=='123456'){
		res.json({
                code:true,
                msg:"超级管理员登录成功",
                lv:1,
        })
        return ;
	}
    pendUsers.findOneAndUpdate({puserid:req.body.puserid,password:req.body.password},{$set:{lastlogin:date.toLocaleString()}},(err,doc)=>{
        if(err){
            console.log(err);
            return;
        }
        // console.log(doc)
        if(doc){
            res.json({
                code:true,
                msg:"登录成功",
                lv:0,
            })
        }else{
            res.json({
                code:false,
                msg:"用户名或密码不正确！"
            })
        }
    })
});
//所有用户信息查询
router.get('/alluser',function(req,res){
	Users.find({},(err,data)=>{
		if(err){
			console.log(err);
			return;
		}
		// if(data.length>0){
			res.json({
				code:true,
				data:data,
			})
		// }
	})
})

//删除用户
router.post('/deleuser',function(req,res){
	console.log(req.body);
	Users.remove({userid:req.body.userid},(err,data)=>{
		if(err){
			console.log(err);
			return;
		}
		if(data.length>0){
			res.json({
				code:true,
				msg:'删除成功',
			})
		}else{
			res.json({
				code:true,
				msg:'删除失败',
			})
		}
	})
})

//搜索用户
router.get('/searchuser',function(req,res){
	// console.log(req.query);
	var  keyword = req.query.searchValue; //从URL中传来的 keyword参数
	var  type=req.query.searchType;
	var regex = new RegExp(keyword, 'i');
	let query={};
	if(type=='userid'){
		query={'userid':regex}
	}else if(type=='sex'){
		query={'sex':regex}
	}else if(type=='nickname'){
		query={'nickname':regex}
	}else if(type=='intro'){
		query={'intro':regex}
	}
	Users.find(query,(err,data)=>{
		if(err){
			console.log(err);
			return;
		}
		res.json({
			code:true,
			data:data,
		})
	})
})

//添加审核人员
router.post('/pregister', function(req, res){
	if(req.body.puserid=='admin'){
		res.json({
            code:false,
            msg:'该编号已被存在'
        })
        return ;
	}
    pendUsers.find({puserid:req.body.puserid},(err,data)=>{
        if(err){
            console.log(err);
            return;
        }
        if(data.length>0){
            res.json({
                code:false,
                msg:'该编号已被存在'
            })
        }else{
            pendUsers.create({
                puserid:req.body.puserid,
                password:req.body.password,
                name:req.body.name,        
                sex:req.body.sex,
                lastlogin:'',
            },(err,data)=>{
                // console.log(data);
                res.json({
                    code:true,
                    msg:"添加成功"
                })
            })
        }
    })
});
//查询所有审核人员信息
router.get('/getpuserinfo',function(req,res){
    // console.log(req.query.userid);
    pendUsers.find({},(err,data)=>{
        if(err){
            console.log(err);
            return;
        }
		res.json({
			code:true,
			data:data,
		})
    })
})
//删除审核人员
router.post('/delepuser',function(req,res){
	console.log(req.body);
	pendUsers.remove({puserid:req.body.puserid},(err,data)=>{
		if(err){
			console.log(err);
			return;
		}
		if(data.length>0){
			res.json({
				code:true,
				msg:'删除成功',
			})
		}else{
			res.json({
				code:true,
				msg:'删除失败',
			})
		}
		
	})
})
//搜索审核人员
router.get('/searchpuser',function(req,res){
	// console.log(req.query);
	var  keyword = req.query.searchValue; //从URL中传来的 keyword参数
	var  type=req.query.searchType;
	var regex = new RegExp(keyword, 'i');
	let query={};
	if(type=='puserid'){
		query={'puserid':regex}
	}else if(type=='sex'){
		query={'sex':regex}
	}else if(type=='name'){
		query={'name':regex}
	}
	pendUsers.find(query,(err,data)=>{
		if(err){
			console.log(err);
			return;
		}
		res.json({
			code:true,
			data:data,
		})
	})
})
//视频审核结果接口
router.post('/pendresult',function(req,res){
	console.log(req.body);
	Videos.update({videoid:req.body.videoid},{$set:{pending:req.body.pending,puserid:req.body.puserid}},(err,data)=>{
		if(err){
			console.log(err);
			return;
		}
		res.json({
			code:true,
			msg:'修改审核状态成功',
		})		
	})
})

//视频审核记录接口
router.get('/getvideohistory',function(req,res){
    // console.log(req.query.userid);
    pendHistory.find({},(err,data)=>{
        if(err){
            console.log(err);
            return;
        }
		res.json({
			code:true,
			data:data,
		})
    })
})

//添加审核记录
router.post('/addhistory',function(req,res){
	console.log(req.body);
	let reason='';
	if(req.body.pending==2){
		reason=req.body.reason;
	}
	pendHistory.create({
		videoid:req.body.videoid,
        tit:req.body.tit,
        uptime:req.body.uptime,
        userid:req.body.userid,
        videoUrl:req.body.videoUrl,
        pending:req.body.pending,
        puserid:req.body.puserid,
        reason:reason,
	},(err,data)=>{
		if(err){
			console.log(err);
			return;
		}
		//添加通知记录
		var date=new Date();
		Users.update({userid:req.body.userid},{'$push':{'notice':{
                    type:"message",
                    content:reason,
                    pending:req.body.pending,
                    userid:req.body.userid,
                    actionid:"HaiPiAdmin",
                    videoid:req.body.videoid,
                    videoUrl:req.body.videoUrl,
                    videotit:req.body.tit,
                    videoimg:req.body.videoimg,
                    time:date.getTime(),
                }}},function(err,authordata){
                    res.json({
                        code:true,
                        msg:'修改审核状态成功',
            });
        })	
	})
})
//获取所有视频信息
router.get('/allvideo',function(req,res){
	Videos.find({},(err,data)=>{
		if(err){
			console.log(err);
			return;
		}
		// if(data.length>0){
			res.json({
				code:true,
				data:data,
			})
		// }
	})
})
//删除视频
router.post('/delevideo',function(req,res){
	console.log(req.body);
	Videos.remove({videoid:req.body.videoid},(err,data)=>{
		if(err){
			console.log(err);
			return;
		}
		if(data.length>0){
			res.json({
				code:true,
				msg:'删除成功',
			})
		}else{
			res.json({
				code:true,
				msg:'删除失败',
			})
		}
		
	})
})
//搜索视频
router.get('/searchvideo',function(req,res){
	// console.log(req.query);
	var  keyword = req.query.searchValue; //从URL中传来的 keyword参数
	var  type=req.query.searchType;
	var regex = new RegExp(keyword, 'i');
	let query={};
	if(type=='videoid'){
		query={'videoid':regex}
	}else if(type=='tit'){
		query={'tit':regex}
	}else if(type=='userid'){
		query={'userid':regex}
	}
	Videos.find(query,(err,data)=>{
		if(err){
			console.log(err);
			return;
		}
		res.json({
			code:true,
			data:data,
		})
	})
})
module.exports = router;
