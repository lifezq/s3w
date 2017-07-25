const express = require('express');
const app = express(), s3w = express();
const fs = require("fs");
const _ = require('underscore');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();
const http = require("http");
const querystring = require("querystring");

const hostname = 'localhost';
const port = 3000;

s3w.use('/s3w', app);

s3w.use('/s3w', express.static('static'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.session = [];

app.tplhtml = (path) => {
    return fs.readFileSync(path).toString();
}

app.engine("tpl", (path, opts, fn) => {
    fn(null, _.template(app.tplhtml(path))(opts));
});

app.post("/login", upload.array(),  (req, res) => {

    var reqObj = req.body;
    req.body = querystring.stringify(req.body);

    var proxyReq = http.request({
        protocol:"http:",
        hostname:"127.0.0.1",
        port:16000,
        path:"/s3/session/login",
        method: "POST",
        headers:{
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(req.body)
        }
    }, (proxyRes) => {
        
        proxyRes.setEncoding('utf8');

        var rsp = "";
        proxyRes.on('data', (chunk) => {
            rsp += chunk;
        });

        proxyRes.on('end', () => {

            var obj = JSON.parse(rsp);
            if(obj.kind == "Login"){
                app.session.push({name: obj.client_id});
            }

		    res.setHeader('Content-Type', 'text/javascript');
    	    res.statusCode = 200;
    	    res.write(rsp);
    	    res.end();
        });
    });

    proxyReq.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
    });

    proxyReq.write(req.body);
    proxyReq.end();
});

app.get("/login", (req, res) => {
    app.render("public/login.tpl", {header: app.tplhtml('views/public/header.tpl'),
        footer: app.tplhtml('views/public/footer.tpl')}, (err, html) => {

		res.setHeader('Content-Type', 'text/html');
    	res.statusCode = 200;
    	res.write(html);
    	res.end();
    });
});

app.get("/logout", (req, res) => {
    
    for(var i in app.session){
        if(req.cookies.s3_client_id == app.session[i].name){
            app.session.splice(i, 1);
        }
    }

    res.redirect("/s3w");
});

app.get("/list_object", (req, res) => {

    if(!app.validSession(req.cookies.s3_client_id)){
       res.redirect('/s3w/login');
        return;
    }

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

    if(!app.validSession(req.cookies.s3_client_id)){
       res.redirect('/s3w/login');
        return;
    }

	app.render('home/main.tpl',{header: app.tplhtml('views/public/header.tpl'),
            footer: app.tplhtml('views/public/footer.tpl'),
            uploadModal: app.tplhtml('views/public/upload.tpl'),
            accessModal: app.tplhtml('views/public/access.tpl')}, (err, html) => {

		if(err){
			return console.error(err);
		}

		res.setHeader('Content-Type', 'text/html');
    	res.statusCode = 200;
    	res.write(html);
    	res.end();
	});
});

app.validSession = (session) => {
    if(!session){
        return false;
    }

    if(app.session.length>0){
        for(var i in app.session){
            if(session == app.session[i].name){
                return true;
            }
        }
    } 
    return false;
}

s3w.listen(port, hostname, () => {
  console.log(`server is running http://${hostname}:${port}/`);
});
