const productModel = require("../models/product");
const userModel = require("../models/user");

exports.createProduct = async (req, res) => {
    try {
        const {productName} = req.body;
        const file = req.files;
        let response;
        let listOfProducts=[];
        let product = {};

        if(!file || file.length === 0) {
            for(const file of files) {
                response = await cloudinary.uploader.upload(file.path);
                product = {
                    publicId: response.public_id,
                    imageUrl: response.secure_url
                };
                listOfProducts.push(product);
                fs.unlinkSync(file.path);
            }
            const products = new productModel({
                productName,
                productImage: listOfProducts
            });
            await products.save();
            return res.status(201).json({
                message: 'Product created successfully',
                data: products
            });
        }

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ error: error.message })
    }
};

exports.update = async(req,res)=>{
       try {
       const{productName} = req.body
       const{id} = req.body
       const products = await userModel.findById(id);

       const files = req.files;

       let response;
       let listOfProducts = [];
       let product = {};

       if(!products){
        return res.status(404).json("Product Not Found")
       };

       if(files && files.length > 0) {
      for(const product of products.productImage){
       await cloudinary.uploader.destroy(product.publicId)
      };
      for(const file of files){
        response = await cloudinary.uploader.upload(file.path);
        product = {
            publicId: response.public_id,
            imageUrl: response.secure_url
        };
        listOfProducts.push(product);
        fs.unlinkSync(file.path);
      }
       }

       const data = {
        productName:productName ?? products.productName,
        productImage: listOfProducts
       };

       const update = await userModel.findByIdAndUpdate(products._id, data, {new:true});

         res.status(200).json({
            message: "Product Updated Successfully",
            data: update
         });
       } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
       })
}
}

exports.deleteProduct = async(req,res)=>{
    try {
        const{id} = req.params
        const products = await productModel.findById(id);
        const files = req.files;
        let response;
        let listOfProducts=[];
        let product = {};
        if(!products){
            return res.status(404).json("Product Not Found")
           }
           if(files && files.length > 0) {
          for(const product of products.productImage){
           await cloudinary.uploader.destroy(product.publicId)
          }
                for(const file of files){
        response = await cloudinary.uploader.upload(file.path);
        product = {
            publicId: response.public_id,
            imageUrl: response.secure_url
        };
        listOfProducts.push(product);
        fs.unlinkSync(file.path);
      }
    }
    const deletion = {
        productName:productName ?? products.productName,
        productImage: listOfProducts
       };

       const deletedProduct = await userModel.findByIdAndDelete(products._id, {new:true});

         res.status(200).json({
            message: "Product Deleted Successfully",
            data: deletedProduct
         });
} catch(error) {
    console.log(error.message);
    res.status(500).json({
        message: 'Internal Server Error',
        error: error.message
   })
}
}

