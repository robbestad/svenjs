var http = require("http"),
	express = require("express"),
	app = express();

app.get('*', function (req, res) {
 //res.send(__dirname+""+req.path);
 res.sendFile(__dirname+req.path);
});

app.listen("8085",function(){
	console.log("Server running on port 8085");
});