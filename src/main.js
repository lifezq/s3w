const express = require('express');
const app = express();
const fs = require("fs");
const _ = require('underscore');

const hostname = '127.0.0.1';
const port = 3000;

app.use(express.static('static'));

app.tplhtml = function(path){
    return fs.readFileSync(path).toString();
}

app.engine("tpl", function(path, opts, fn){
    fn(null, _.template(app.tplhtml(path))(opts));
});

app.get("/list_object/:bucket/:path", function(req, res){

    app.render("home/list_object.tpl", {header: app.tplhtml('views/home/header.tpl'),
        footer: app.tplhtml('views/home/footer.tpl'), bucket:req.params.
        bucket,path:req.params.path}, function(err, html){
        
		if(err){
			return console.error(err);
		}

		res.setHeader('Content-Type', 'text/html');
    	res.statusCode = 200;
    	res.write(html);
    	res.end();
    });
});

app.get('/', function(req, res) {

	app.render('home/main.tpl',{header: app.tplhtml('views/home/header.tpl'),
        footer: app.tplhtml('views/home/footer.tpl')}, function(err, html){

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
