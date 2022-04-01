const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    cost: {
        type: Number,
        required: true
    },
    amountAvailable: {
        type: Number,
        required: true
    },
    sellerId:{
        type:String,
        required:true
    },
    sellerName:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model('products', productSchema);