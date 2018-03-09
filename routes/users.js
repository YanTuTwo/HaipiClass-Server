var express = require('express');
var router = express.Router();

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.post('/login', function(req, res){
  if(req.body.username == 'admin' && req.body.password == '123456'){
      req.session.userName = req.body.username; // 登录成功，设置 session
      res.json({ret_code : 0, ret_msg : '登录成功'});
  }
  else{
      res.json({ret_code : 1, ret_msg : '账号或密码错误'});// 若登录失败，重定向到登录页面
  }
});
router.post('/checklogin',function(req,res){
	console.log(req.session);
	res.header('Access-Control-Allow-Origin', 'http://localhost:3000')
	res.header('Access-Control-Allow-Credentials', 'true')
	if(req.session.userName){  //判断session 状态，如果有效，则返回主页，否则转到登录页面
		res.json({ret_code : 1, ret_msg : '未登录'});
	}else{
		res.json({ret_code : 0, ret_msg : '登录成功'});
	}
})
module.exports = router;
