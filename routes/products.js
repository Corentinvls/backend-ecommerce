var express = require('express');
var router = express.Router();
const dbServices = require('../db/dbServices')

/* GET products listing. */
router.get('/', function(req, res, next) {
 dbServices.list("products")
  res.json( dbServices.list("products"));

});

module.exports = router;
