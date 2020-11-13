const axios = require('axios');


async function testCreateUser() {
    await axios.post('http://localhost:3000/users/',
        {
            lastname: "Bidden",
            firstname: "Joe",
            pseudo: "usaFever",
            password: 'Azerty1',
            email: 'usa@gmail.com',
            seller: true,
            order: [],
            products_created: [],
            products_buy:[],
            products_sells: [],
            cart: [],
            money_earn: 0,
            money_spend: 0,
            money: 0,
            avatar: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmontpellier.citycrunch.fr%2Fwp-content%2Fuploads%2Fsites%2F7%2F2020%2F04%2Fmasquescoronavirus012.jpg&f=1&nofb=1",
        })
        .then(function(response) {
            // handle success
            console.log(response.data);
        })
}

async function testCreateProduct() {
    await axios.post('http://localhost:3000/products/',
        {
            title: "pdf geste barrière",
            description: "un condensé de savoir qui récapitule la pub qu'on a tous vu en boucle",
            price: 5,
            ref: "GEST19COVID",
            gateways: [
                "paypal",
                "bitcoin",
                "ethereum",
                "stripe"
            ],
            image_url: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmontpellier.citycrunch.fr%2Fwp-content%2Fuploads%2Fsites%2F7%2F2020%2F04%2Fmasquescoronavirus012.jpg&f=1&nofb=1",
            ratings: [{rating:4},{rating:2},{rating:2},{rating:2}],
            categories: ["masque", "test","db"],
            type: "book",
            seller_pseudo: "DéDéRaoult",
            sells: 0
        })
        .then(function(response) {
            // handle success
            console.log(response.data);
        })
}

async function testAddToCart(UserId) {
    await axios.patch('http://localhost:3000/users/addToCart/' + UserId,
        {
            title: "pdf geste barrière",
            description: "un condensé de savoir qui récapitule la pub qu'on a tous vu en boucle",
            price: 12.99,
            ref: "GEST19COVID",
            gateways: [
                "paypal",
                "bitcoin",
                "ethereum",
                "stripe"
            ],
            image_url: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmontpellier.citycrunch.fr%2Fwp-content%2Fuploads%2Fsites%2F7%2F2020%2F04%2Fmasquescoronavirus012.jpg&f=1&nofb=1",
            ratings: [],
            categories: ["masque", "santé"],
            type: "game",
            seller_pseudo: "DDRaoult",
            add_to_cart: 0,
            sells: 0
        })
        .then(function(response) {
            console.log(response.data);
        })
}
async function testAddMoney(user,money) {
    await axios.patch('http://localhost:3000/users/addMoney/'+user,
        {money:money} )
        .then(function(response) {
            // handle success
            console.log(response.data);
        })
}

/*  await axios.put('http://localhost:3000/users/coco',
      {
        name: "coco",
          attribute: "noob"
      })
      .then(function (response) {
          // handle success
          console.log(response.data);
      })
      .catch(()=>{
          console.log("try to reload server");})
  await axios.patch('http://localhost:3000/users/coco',
      {
          name: "coco",
          attribute: "bigboss"
      })
      .then(function (response) {
          // handle success
          console.log(response.data);
      })
      .catch(()=>{
          console.log("try to reload server");})
  await axios.delete('http://localhost:3000/users/antony')
      .then(function (response) {
          // handle success
          console.log(response.data);
      })
      .catch(()=>{
          console.log("try to reload server");})*/
//testCreateUser().then()
//testCreateProduct().then()
//testAddToCart("5fae7aae3da351c93958e8bf").then()
//testAddMoney("5fae7aae3da351c93958e8bf",-5000).then()
