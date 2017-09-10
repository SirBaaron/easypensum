var EXPRESS = require('express')
var URL = require("url");
var FS = require('fs');
var SESSION = require('node-session');


const config = require("./server/config.js");

var app = EXPRESS();

const secret = require("./server/secret").session_csrf_secret;
const cookiename = require("./server/secret").session_cookie_name;

var session = new SESSION({
	"secret": secret,
	"lifetime": 1000 * 60 * 60 * 24 * 365,
	"cookie": cookiename
});

app.use((req, res, next) => {
	session.startSession(req, res, next);
});

app.get("/", (req, res) => {
	req.session.set("loadedModules", []);
	require("./server/renderIndex").renderIndex(config.entryPoints["/"])
		.pipe(res);
});

app.get("/index.html", (req, res) => {
	res.redirect(301, "/");
});

app.all("/bundles/*", (req, res) => {
	res.end(require("./server/createBundle").createBundle(req.path, req.session));
});

app.all("/static/*", (req, res) => {
	FS.createReadStream("./" + req.path)
		.pipe(res)
});

app.get("/classid.js", (req, res) => {
	FS.createReadStream("./dev/classid.js").pipe(res); 
})

app.listen(8000);

// HTTP.createServer((req, res) => {
// 	const url = URL.parse(req.url);
// 	const path = url.path.replace(/.(\/|\/index.html)$/, "");
// 	const headers = req.headers;
// 	const entryPoint = (Object.keys(config.entryPoints).indexOf(path) > -1);
// 	const js = url.path.endsWith(".js");

// 	var response;

// 	console.log("entryPoint? ", entryPoint);

// 	if(entryPoint) {
// 		response = require("./renderIndex").renderIndex(path);
// 	}
// 	else if(js) {
// 		response = require("./createBundle").createBundle(path);
// 	}
// 	else {
// 		response = FS.createReadStream("./dev" + url.path);
// 	}

// 	res.writeHead(200, {
// 		"Content-Type": "text/html"
// 	});
// 	response.pipe(res);
// }).listen(8000, "127.0.0.1");