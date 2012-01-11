
// modules
var express = require('../../node_modules/express'),
	_ = require('../../node_modules/underscore')._,
	jqtpl = require('../../node_modules/jqtpl'),
	v8p = require('../../node_modules/v8-profiler'),
	seeder = require('./controllers/seeder');

var app = express.createServer();

// configuration

app.configure(function(){
{
	// views
	app.set('views', __dirname + '/views');
	app.set("view engine", "html");
	app.register(".html", jqtpl.express);

	// logging
	//app.use(express.logger({ format: ':remote-addr - - [:date] ":method :url HTTP/:http-version" :status :response-time ":referrer" ":user-agent"' }));

	// session
	app.use(express.cookieParser());
	app.use(express.session({secret: 'qwe123'}));

	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);

	// static files
	app.use(express.static(__dirname + '/public')); //contents of public subdir will be exposed as '/' in http

	//controllers

	require('./controllers/seeder').boot(app);

}
});

// dev config

app.configure('development', function(){
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

//prod config

app.configure('production', function(){
	app.use(express.errorHandler()); 
});

// routes

// run

if (!module.parent) {
	app.listen(2000);
	console.log("Express server listening on port %d", app.address().port);
}