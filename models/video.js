var mongoose=require('mongoose');

var videoSchema=new mongoose.Schema({
    'videoid':String,    
    'userid':String,
    'tit':String,
    'desc':String,
    'vote':Number,
    'coll':Number,
    "videoimg":String,
    'uptime':Number,
    'Comment':Array,
    'videoUrl':String,
    'pending':Number,
    'puserid':String,
})
module.exports=mongoose.model("Videos",videoSchema,'Videos');