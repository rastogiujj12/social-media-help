// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').config();

// Require app
var app = require('./ks');
var handlebars = require('express-handlebars');

// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.

app.init({
	'name': 'multaview',
	'brand': 'multaview',

	'less': 'public',
	'static': 'public',
	'favicon': 'public/favicon.png',
	'views': 'templates/views',
	'view engine': '.hbs',

	'custom engine': handlebars.create({
		layoutsDir: 'templates/views/layouts',
		partialsDir: 'templates/views/partials',
		defaultLayout: 'default',
		helpers: new require('./templates/views/helpers')(),
		extname: '.hbs',
	}).engine,

	'auto update': true,
	'session': true,
	'auth': true,
	'user model': 'User',
	'admin path': 'admin',
	'signin logo': '/favicon.png'
});

// Load your project's Models
app.import('models');

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js
app.set('locals', {
	_: require('lodash'),
	env: app.get('env'),
	utils: app.utils,
	editable: app.content.editable,
});

// Load your project's Routes
app.set('routes', require('./routes'));

app.set('cors allow origin', true);
app.set('cors allow methods', true);
app.set('cors allow headers', true);

// Configure the navigation bar in Keystone's Admin UI
app.set('nav', {
	users: 'users',
	videos: ['videos','director-cuts'],
	subscriptions: ['licenses', 'payments']
});

// //cors
// keystone.set('cors allow origin', true);
// keystone.set('cors allow methods', true);
// keystone.set('cors allow headers', true);


// Start Keystone to connect to your database and initialise the web server
app.start();
