var mongoose = require('mongoose');

//Esquema de productos
var ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    price: {
        type: Number,
        required: true
    },
    image: String,
    type: {
        type: String,
        required: true
    },
    featured: {
        type: Boolean,
        required: true
    }
});

mongoose.model('Product', ProductSchema);
