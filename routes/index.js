var express = require('express');
var router = express.Router();
var axios =require('axios');


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

module.exports = router;
