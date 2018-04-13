var mongoose=require('mongoose');

var pendhistorySchema=new mongoose.Schema({
    'videoid':String,    
    'userid':String,
    'tit':String,
    'uptime':Number,
    'videoUrl':String,
    'pending':Number,
    'puserid':String,
    'reason':String,
})
module.exports=mongoose.model("pendHistory",pendhistorySchema,'pendHistory');