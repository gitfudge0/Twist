var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('layout', { title: 'Express' });
});
/*router.get('/test', function(req, res, next) {
  res.render('test', { title: 'Test Page' });
}); */

module.exports = router;
