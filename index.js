var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
const {OAuth2Client} = require('google-auth-library');
const googleId = "806589839267-n7f2r90tj06pdjd479r0dbh8m1m1poo4.apps.googleusercontent.com";
const auth = new OAuth2Client(googleId);
const { Pool } = require('pg');
const bodyParser = require('body-parser');

app.get('/', function (req, res) {
  res.send('Holaaa bonicaa!');
});

app.listen(port, function () {
  console.log('Example app listening on port '+port+'!');
});
