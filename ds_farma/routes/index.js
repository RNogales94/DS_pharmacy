var express = require('express');
var router = express.Router();

var db = require('../queries');

router.get('/', function(request, response){
  response.set('Content-Type', 'text/html; charset=utf-8');
  response.set('Strict-Transport-Security', 'max-age=31536000');
	response.set('X-Frame-Options', 'deny');
	response.sendFile(__dirname + '/public/index.html', {maxAge: '30m', immutable: true});
})

router.get('/api/puppies', db.getAllPuppies);
router.get('/api/puppies/:id', db.getSinglePuppy);
router.post('/api/puppies', db.createPuppy);
router.put('/api/puppies/:id', db.updatePuppy);
router.delete('/api/puppies/:id', db.removePuppy);

module.exports = router;
