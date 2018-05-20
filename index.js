"use strict";
const express = require('express');
const app = express();
const { Pool } = require('pg');
const bodyParser = require('body-parser');

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: true
});

app.set('port', process.env.PORT || 5000);

app.get('/', function(request, response) {
	response.set('Content-Type', 'text/html; charset=utf-8');
	response.set('Strict-Transport-Security', 'max-age=31536000');
	response.set('X-Frame-Options', 'deny');
	response.sendFile(__dirname + '/public/index.html', {maxAge: '30m', immutable: true});
});

app.use(bodyParser.json());

app.post('/register', function(request, response) {
	if (request.body.username && request.body.password) {
		pool.query('insert into users(username, password) values($1, $2)', [request.body.username.trim(), request.body.password.trim()]).then(result => {
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
	pool.query('select username from users where username = $1', [request.userid]).then(result => {
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
	console.log('Node app is running on port', app.get('port'));
});
