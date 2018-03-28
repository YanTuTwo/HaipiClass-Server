var express =require('express');
var router = express.Router();
var mongoose =require('mongoose');
var Users = require('../models/user');
var fs = require('fs');
var formidable =require('formidable');
var path = require("path");

// router.post('/upvideo',function(req,res){
//     var form = new formidable.IncomingForm();
//     form.uploadDir = "./public/images/avatarimg";
//     form.keepExtensions = true;
//     form.parse(req, function(err, fields, files) {
//         console.log(files);
//     })
// })
router.post('/upvideo', function(req, res) {
	var form = new formidable.IncomingForm();
	form.uploadDir = "./public/video";
	form.keepExtensions = true;
	form.parse(req, function(err, fields, files) {
		if(output.length == 0) {
			output = new Array(fields.total);
		}
		output[fields.index] = files.data;
		++successed;
		if(successed == fields.total) {
			function read(i) {
				var data = fs.readFileSync(output[i].path);
				fs.appendFile('./static/upload/' + fields.name, data);
				fs.unlink(output[i].path);
				i++;
				if(i < successed) {
					read(i);
				} else {
					successed = 0;
					output = [];
					return;
				}
			}
			read(0);
			login.create({
				username: fields.un + "",
				passward: fields.pw + ""
			}, function(err, result) {
				if(err) {
					console.log(err);
					return;
				}
				console.log('ok');
			});
		}
		res.end("1");
	});
});
module.exports =router;
