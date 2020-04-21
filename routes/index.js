var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Products = mongoose.model('Product');

/* GET Featured Products */
router.get('/', function(req, res, next) {

  Products.find({ featured: true },function(err, products){

    if(err){ return next(err) }

    res.json(products);

  });
});

/* GET Todos los Colchones */
router.get('/colchones', function(req, res, next){

  Products.find({ type: "Colchon" },function(err, products){

    if(err){ return next(err) }

    res.json(products);

  });
});

/* GET Todos los Somieres */
router.get('/somieres', function(req, res, next){

  Products.find({ type: "Somier" },function(err, products){

    if(err){ return next(err) }

    res.json(products);

  });
});

/* GET Producto por _id */
router.get('/productos/:id', function(req, res, next){

  Products.findById(req.params.id, function(err, product){

    if(err){ return next(err) }

    res.json(product);

  });

});

/* POST Producto */
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
