var express = require('express');
var router = express.Router();
var axios = require('axios');

/* GET users listing. */
router.get('/getMovieList', function(req, res) {
	let plid=req.query['plid'];
	let start=parseInt(req.query['start']);
	let len=parseInt(req.query['len']);
	let url="https://c.open.163.com/mob/"+plid+"/getMoviesForAndroid.do";
	axios.get(url).then(function(data){
		res.json(_moviedata(data.data.data,start,len));
	})
});


//将视频信息做处理，简化数据
function _moviedata(list,start,len){
	let ret={};
	ret.videoList=list.videoList;
	ret.tit=list.title;
	ret.hits=list.hits;
	ret.director=list.director;
	ret.tags=list.tags;
	ret.type=list.type;
	ret.description=list.description;
	ret.recommendList=list.recommendList.slice(start,start+len);
	return ret;
}

//获取更多推荐视频的信息接口
router.get('/getMoreList', function(req, res) {
	let plid=req.query['plid'];
	let start=parseInt(req.query['start']);
	let len=parseInt(req.query['len']);
	let url="https://c.open.163.com/mob/"+plid+"/getMoviesForAndroid.do";
	axios.get(url).then(function(data){
		res.json(data.data.data.recommendList.slice(start,start+len));
	})
});

module.exports = router;
