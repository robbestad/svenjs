'use strict';
var express = require('express');
var bodyparser = require('body-parser');
var app = express();

var routes = function (app) {
	app.use(bodyparser.json());

	app.get('*', function (req, res) {
          res.sendFile(__dirname+req.url);
	});

}
var router = express.Router();
routes(router);
app.use('/', router);

app.listen(process.env.PORT || 8080, function () {
	console.log('server listening on port ' + (process.env.PORT || 8080));
});
