const express = require('express');
const app = express();
const fs = require("fs");
const _ = require('underscore');

const hostname = '127.0.0.1';
const port = 3000;

app.use(express.static('static'));

app.tplhtml = (path) => {
    return fs.readFileSync(path).toString();
}

app.engine("tpl", (path, opts, fn) => {
    fn(null, _.template(app.tplhtml(path))(opts));
});

app.get("/list_object", (req, res) => {

    app.render("object/list_object.tpl", {header: app.tplhtml('views/public/header.tpl'),
        footer: app.tplhtml('views/public/footer.tpl'), bucket:req.query.bucket,
        path:req.query.path,
        uploadModal: app.tplhtml('views/public/upload.tpl')}, (err, html) => {
        
		if(err){
			return console.error(err);
		}

		res.setHeader('Content-Type', 'text/html');
    	res.statusCode = 200;
    	res.write(html);
    	res.end();
    });
});

app.get('/', (req, res) => {

	app.render('home/main.tpl',{header: app.tplhtml('views/public/header.tpl'),
            footer: app.tplhtml('views/public/footer.tpl'),
            uploadModal: app.tplhtml('views/public/upload.tpl')}, (err, html) => {

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
