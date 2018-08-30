var EXPRESS = require('express')
var URL = require("url");
var FS = require('fs');
var compression = require('compression');
var cookieParser = require('cookie-parser')
var session = require('express-session')

const config = require("./server/config.js");
const environment = require("./server/environment.js");

var app = EXPRESS();

const secret = environment.session_secret;
const cookiename = environment.session_cookie_name;

var routes = Object.keys(config.entryPoints);


app.use(compression({
	filter: _ => {
		return true;
	}
}));
app.use(session({
	"secret": secret,
	"cookie": {
		"secure": false,
		"maxAge": 1000 * 60 * 60 * 24 * 365
	},
	"name": cookiename,
	"saveUninitialized": false,
	"resave": false
}));
app.use(cookieParser());


app.get(routes, (req, res) => {
	let start = process.hrtime();
	req.session["route"] = req.path;
	req.session["loadedModules"] = [];
	require("./server/renderIndex").renderIndex(req).then(r => {
		let end = process.hrtime(start);
		console.log("index rendering time: " + Math.round((end[0]*1000) + (end[1]/1000000)) + "ms");
		res.set("render-time", Math.round((end[0]*1000) + (end[1]/1000000)) + "ms");
		res.end(r);
	});
});

app.get("/index.html", (req, res) => {
	res.redirect(301, "/");
});

app.get("/element/*.js", (req, res) => {
	let start = process.hrtime();
	require("./server/createBundle").createBundle(req.path, req.session, req.cookies).then(r => {
		let end = process.hrtime(start);
		console.log("element rendering time: " + Math.round((end[0]*1000) + (end[1]/1000000)) + "ms");
		res.set("render-time", Math.round((end[0]*1000) + (end[1]/1000000)) + "ms");
		res.end(r);
	});
});

app.all("/bundles/*.js", (req, res) => {
	let start = process.hrtime();
	require("./server/createBundle").createBundle(req.path, req.session, req.cookies).then(r => {
		let end = process.hrtime(start);
		console.log("bundle rendering time: " + Math.round((end[0]*1000) + (end[1]/1000000)) + "ms");
		res.set("render-time", Math.round((end[0]*1000) + (end[1]/1000000)) + "ms");
		res.end(r);
	});
});

app.all("/static/*", (req, res) => {
	FS.createReadStream("./" + req.path)
		.pipe(res)
});

app.get("/classid.js", (req, res) => {FS.createReadStream("./dev/classid.js").pipe(res);});

app.listen(environment.port);

console.log("server started on port ", environment.port);