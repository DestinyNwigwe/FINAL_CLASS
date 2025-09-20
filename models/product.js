const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    productImage: {
        publicId: {
            type: String,
            required: true
        },
        imageUrl: {
            type: String,
            required: true
        }
    }
});
const productModel = mongoose.model('Product', productSchema);
module.exports = productModel;
