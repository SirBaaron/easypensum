var EXPRESS = require('express')
var URL = require("url");
var FS = require('fs');
var SESSION = require('node-session');
var compression = require('compression');
var cookieParser = require('cookie-parser')

const config = require("./server/config.js");
const environment = require("./server/environment.js");

var app = EXPRESS();

const secret = require("./server/secret").session_csrf_secret;
const cookiename = require("./server/secret").session_cookie_name;

var routes = Object.keys(config.entryPoints);

var session = new SESSION({
	"secret": secret,
	"lifetime": 1000 * 60 * 60 * 24 * 365,
	"cookie": cookiename
});

app.use(compression({
	filter: _ => {
		return true;
	}
}));
app.use((req, res, next) => {
	session.startSession(req, res, next);
});
app.use(cookieParser());

app.get(routes, (req, res) => {
	req.session.set("route", req.path);
	req.session.set("loadedModules", []);
	require("./server/renderIndex").renderIndex(req)
		.pipe(res);
});

app.get("/index.html", (req, res) => {
	res.redirect(301, "/");
});

app.all("/bundles/*.js", (req, res) => {
	res.end(require("./server/createBundle").createBundle(req.path, req.session, req.cookies));
});

app.all("/static/*", (req, res) => {
	FS.createReadStream("./" + req.path)
		.pipe(res)
});

app.get("/classid.js", (req, res) => {
	FS.createReadStream("./dev/classid.js").pipe(res); 
})

app.listen(environment.port);

console.log("server started!");