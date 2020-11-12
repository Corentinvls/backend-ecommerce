var express = require('express');
var router = express.Router();
const dbServices = require('../db/dbServices')

/* GET users listing. */
router.get('/', async (req, res, next) => {
    res.json(await dbServices.list("users"));
});
router.get('/:id', async (req, res) => {
    const id = req.params.id
    res.json(await dbServices.getById("users", id))
})
router.post('/', async (req, res) => {
    var user = req.body
    user.order = [];
    user.products = [];
    user.products_sells = [];
    user.cart = [];
    user.money_earn = 0;
    user.money_spend = 0;
    user.money = 0;
    user.avatar = "https://www.marshall.edu/it/files/question-mark-circle-icon.png";
    await dbServices.create("users", user)
    res.send("done")
})
router.get('/search/:field&:search', async (req, res, next) => {
    const field = req.params.field
    const search = req.params.search
    await res.json(await dbServices.searchBy("users", field, search));
});

router.patch('/:id', async (req, res) => {
    const id = req.params.id
    await dbServices.update("users", id, req.body)
    res.json("done")
})
router.patch('/push/:id', async (req, res) => {
    const id = req.params.id
    await dbServices.push("users", id, req.body)
    res.json("done")
})


module.exports = router;
