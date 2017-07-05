const express = require('express');
const app = express();
const fs = require("fs");
const _ = require('underscore');

const hostname = '127.0.0.1';
const port = 3000;

app.use(express.static('static'));

app.engine("tpl", function(path, opts, fn){
    fn(null, _.template(fs.readFileSync(path).toString())(opts));
});

app.get('/', function(req, res) {

	app.render('home/main.tpl',{name:'Ryan', buckets:["buk0","buk1"]}, function(err, html){

		if(err){
			return console.error(err);
		}

		res.setHeader('Content-Type', 'text/html');
    	res.statusCode = 200;
    	res.write(html);
    	res.end();
    	
	});
});


app.listen(port, hostname, () => {
  console.log(`server is running http://${hostname}:${port}/`);
});
