var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const { secret } = require('./../config/config');

var jwt = require('express-jwt');
var auth = jwt({
  secret: secret,
  userProperty: 'payload'
});

var ctrlProfile = require('../controllers/profile');
var ctrlAuth = require('../controllers/authentication');

var Products = mongoose.model('Product');

// profile
router.get('/profile', auth, ctrlProfile.profileRead);

// authentication
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);


/*--- PRODUCTOS ---*/

/* GET Featured Products */
router.get('/', function(req, res, next) {
  //Query de productos destacados
  Products.find({ featured: true },function(err, products){

    if(err){ return next(err) }
    
    res.json(products);

  });
});

/* GET Todos los Colchones */
router.get('/colchones/:page', async function(req, res, next){
  const resPerPage = 10; // resultados por página
  const page = req.params.page || 1; // pagina 

  try {
    //Obtenemos el número total de documentos
    const numOfProducts = await Products.countDocuments({ type: "Colchon" });
    //Obtenemos 10 documentos filtrado por la "página" a la cual el usuario esta solicitando 
    const foundProducts = await Products.find({ type: "Colchon" }).skip((resPerPage * page) - resPerPage)
    .limit(resPerPage);
    
    var result = {products: foundProducts, count:numOfProducts}
    //Devolvemos los documentos junto a la cantidad total en la colección
    res.json(result);

  } catch (err) {
    throw new Error(err);
  }
});

/* GET Todos los Somieres */
router.get('/somieres/:page', async function(req, res, next){
  const resPerPage = 10; // resultados por página
  const page = req.params.page || 1; // pagina 

  try {
    //Obtenemos el número total de documentos
    const numOfProducts = await Products.countDocuments({ type: "Somier" });
    //Obtenemos 10 documentos filtrado por la "página" a la cual el usuario esta solicitando 
    const foundProducts = await Products.find({ type: "Somier" }).skip((resPerPage * page) - resPerPage)
    .limit(resPerPage);

    var result = {products: foundProducts, count:numOfProducts}
    //Devolvemos los documentos junto a la cantidad total en la colección
    res.json(result);

  } catch (err) {
    throw new Error(err);
  }
});


/* GET Producto por _id */
router.get('/productos/:id', function(req, res, next){
  //Query de producto por id
  Products.findById(req.params.id, function(err, product){

    if(err){ return next(err) }

    res.json(product);

  });

});

/* POST Producto  '/productos' */
router.post('/productos', function(req, res, next){

  var product = new Products(req.body);

  product.save(function(err, product){
    
    if(err){return next(err)}
    res.json({added: 1});

  });
});

/* PUT Producto */
router.put('/productos/:id', function(req, res, next){

  Products.findById(req.params.id, function(err, product){

    product.title = req.body.title;
    product.description = req.body.description;
    product.price = req.body.price;
    product.image = req.body.image;
    product.type = req.body.type;
    product.featured = req.body.featured;

    product.save(function(err){

      if(err){res.send(err)}

      res.json({updated: 1});

    });
  });
});

/* DELETE Producto*/
router.delete('/productos/:id', function(req, res, next){

  Products.findByIdAndRemove(req.params.id, function(err){

      if(err){res.send(err)}

      res.json({deleted: 1});

  });
});


module.exports = router;
