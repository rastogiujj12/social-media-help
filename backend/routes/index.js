/**
 * This file is where you define your application routes and controllers.
 *
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 *
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 *
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 *
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 *
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

var keystone = require('./../ks');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);
var cors = require('cors')
const path = require('path');


// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
	views: importRoutes('./views'),
	services: importRoutes('../services'),
};

// Setup Route Bindings
exports = module.exports = function (app) {
	// Views

	app.use('*', function(req, res, next){
		res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-XSRF-TOKEN');
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
		res.header('Access-Control-Allow-Credentials', true);
		next();
	})

	app.options('*', function(req, res){
		res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-XSRF-TOKEN');
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
		res.header('Access-Control-Allow-Credentials', true);
		res.sendStatus(200);
	})

	// app.get('/', (req, res)=>res.redirect("/admin"));
	// app.get('/video',   routes.services.videos.get);
	// app.get('/getVideosList',   routes.services.videos.getVideosList);
	app.post('/login',  routes.services.auth.login);
	// app.post('/signup', routes.services.auth.signup);

	// app.get('/getVideo/:slug',  routes.services.videos.getVideo);


	app.get('/getUser',   middleware.isLoggedIn, routes.services.auth.getUser );
	app.get('/autologin', middleware.isLoggedIn, routes.services.auth.autoLogin );
	app.post("/savepage", middleware.isLoggedIn, routes.services.pages.save )
	app.get("/page",     routes.services.pages.getPage )
	
	app.get('/*', (req, res) => {
        // console.log('keystone', keystone);
		// console.log('inside /* routing');
        // console.log('path',path.join(__dirname,'..','public','index.html'));
        res.sendFile(path.join(__dirname,'..','public','index.html'));
    });
	// app.post('/videoBySlug',  middleware.isLoggedIn, routes.services.videos.getBySlug);
	// app.post('/directorCuts', middleware.isLoggedIn, routes.services.videos.directorCuts);

	// app.get('/videos',             middleware.isLoggedIn, routes.services.videos.videos);
	
	app.post('/getUploadUrl',     middleware.isLoggedIn, routes.services.pages.getUploadUrl);
	// app.post('/allFilesUploaded',  middleware.isLoggedIn, routes.services.videos.allFilesUploaded);

	// app.post('/deleteVideo',       middleware.isLoggedIn, routes.services.videos.deleteVideo);

	// app.get('/getPreSignedUrl', middleware.isLoggedIn, routes.services.pages.getPreSignedUrl);
	// app.post('/mergeVideos', routes.services.ffmpeg.mergeVideos);

	//middleware.isLoggedIn to check if user is logged in
	


	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);

};
