var express = require('express');
var router = express.Router();
const dbServices = require('../db/dbServices')

/* GET products listing. */
router.get('/', async (req, res, next) =>{
  res.json( await dbServices.list("products"));
});
router.get('/:id', async (req, res)=> {
  const id = req.params.id
  res.json(await dbServices.getById("products",id))
})
router.post('/', async (req, res) => {
  var resource = req.body
  await dbServices.create("products",resource)
  res.send("done")
})
router.get('/search/:field&:search', async (req, res, next) =>{
  const field = req.params.field
  const search = req.params.search
  res.json( await dbServices.searchBy("products",field,search));
});

router.patch('/:id', async (req, res) => {
  const id = req.params.id
  await dbServices.update("products",id,req.body)
  res.json("done")
})
router.patch('/push/:id', async (req, res) => {
  const id = req.params.id
  await dbServices.push("products",id,req.body)
  res.json("done")
})

router.get('/getBy/:field&:search', async (req, res, next) =>{
  const field = req.params.field
  const search = req.params.search
  console.log(field);
  console.log(search);
  res.json( await dbServices.getBy("products",field,search));
});
router.get('/price/:price', async (req, res, next) =>{
  const price = parseInt(req.params.price)
  res.json( await dbServices.filterLTEPrice("products",price));
});
router.get('/list/:field', async (req, res, next) =>{
  const field = req.params.field
  res.json( await dbServices.showDistinct("products",field));
});


module.exports = router;
