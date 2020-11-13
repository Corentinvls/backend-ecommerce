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
    await dbServices.createUser(user)
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

//check if exist
router.get('/exist/:field&:search', async (req, res) => {
    const field = req.params.field
    const search = req.params.search
    await res.json(await dbServices.checkIfUserExist(field, search));
})
router.delete('/:id', async (req, res) => {
    const id = req.params.id
    await dbServices.remove("users", id)
    res.json("done")
})

router.patch('/addToCart/:userId', async (req, res) => {
    const product = req.body
    const userId = req.params.userId
    await dbServices.push("users", userId, {cart:product})
    res.json("done")
})
router.patch('/addMoney/:id', async (req, res) => {
    const id = req.params.id
    const money =req.body
    await dbServices.increment("users", id, money)
    res.send(money.money + " add")
})
/*router.patch('/buy/:userId', async (req, res) => {
    const product = req.body
    const userId = req.params.userId
    const user =await dbServices.getById("users", userId)
    const productsInCart= user.cart

    await dbServices.push("users", userId, {orders:})
    res.json("done")
})*/

module.exports = router;
