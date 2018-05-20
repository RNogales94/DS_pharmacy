var express = require('express');
var app = express();
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const {OAuth2Client} = require('google-auth-library');

const googleId = "806589839267-n7f2r90tj06pdjd479r0dbh8m1m1poo4.apps.googleusercontent.com";
const auth = new OAuth2Client(googleId);



function getUserid(request, response, next) {
	if (request.headers.authorization) {
		auth.verifyIdToken({idToken: request.headers.authorization.split(' ')[1] || "null", audience: googleId}, function(error, login) {
			if (login) {
				request.userid = login.getPayload()['sub'];
				next();
			}
			else
				response.status(401).json({error: "Invalid token"});
		});
	}
	else
		response.status(401).json({error: "Credentials required"});
}

function tryUserid(request, response, next) {
	if (request.headers.authorization)
		getUserid(request, response, next);
	else
		next();
}



var port = process.env.PORT || 3000;
app.use(bodyParser.json());


app.get('/', function(request, response) {
	response.set('Content-Encoding', 'gzip');
	response.set('Content-Type', 'text/html; charset=utf-8');
	response.set('Strict-Transport-Security', 'max-age=31536000');
	response.set('X-Frame-Options', 'deny');
	response.sendFile(__dirname + '/public/index.html.gz', {maxAge: '30m', immutable: true});
});

app.post('/register', getUserid, function(request, response) {
	if (request.body.username) {
		pool.query('insert into users(userid, username) values($1, $2)', [request.userid, request.body.username.trim()]).then(result => {
			response.json();
		}).catch(error => {
			let errorMsg = error.stack.split(/[\r\n]+/)[0];

			if (errorMsg.includes("unique")) {
				if (errorMsg.includes("username"))
					response.status(403).json({error: "Username already in use"});
				else
					response.status(403).json({error: "User already registered"});
			}
			else {
				console.error(error.stack);
				response.status(500).json({error: "Query failed"});
			}
		});
	}
	else
		response.status(400).json({error: "Username required"});
});

app.get('/username', getUserid, function(request, response) {
	pool.query('select username from users where userid = $1', [request.userid]).then(result => {
		if (result.rows[0])
			response.json(result.rows[0].username);
		else
			response.status(403).json({error: "Registration required"});
	}).catch(error => {
		console.error(error.stack);
		response.status(500).json({error: "Query failed"});
	});
});

app.listen(app.get('port'), function() {
	console.log('Node app is running on port: '+port;
});
