const express = require('express');

const router = express.Router();
const Product = require('../models/Product.model');

router.get('/', (req, res) => {
    res.json("test");
})

//Add product
router.post('/add',async(req,res)=>{
    const dt= req.body;
    const p1 = new Product({
        productName: dt.productName,
        cost: dt.cost,
        amountAvailable: dt.amountAvailable,
        sellerId: dt.sellerId,
        sellerName: dt.sellerName
    });
    try {
        const savedProduct = await p1.save();
        res.json(savedProduct);
      } catch (err) {
        res.status(400).json({ message: err.message });
      }
})
//Update Product
router.patch('/update/:pid', async(req,res) => {
  const dt= req.body;
  try {
    const updatedProduct = await Product.updateOne({_id: req.params.pid}, {
     
      $set: {
        productName: dt.productName,
        cost: dt.cost,
        amountAvailable: dt.amountAvailable,
        sellerId: dt.sellerId
      }
    });
    const updProduct = await Product.find({ _id: req.params.pid });
    res.json(updProduct[0]);
  }catch(err){
      res.status(400).json({ message: err.message });
  }
})
//Delete Product
router.delete('/delete/:pid', async(req,res) => {
  try {
    const deletedProduct = await Product.deleteOne({_id: req.params.pid});
    res.json(deletedProduct);

  }catch(err){
    res.status(400).json({message: err.message});
  }
});
//Get Specific Product
router.get("/specific/:pid", async (req, res) => {
  try {
    const theProduct = await Product.find({ _id: req.params.pid});
    res.json(theProduct[0]);
  } catch (err) {
    res.json({ message: "failed" });
  }
});
//Get All Products
router.get('/all', async(req,res)=>{
    try {
        const products = await Product.find();
        res.json(products);
      } catch (err) {
        res.status(400).json({ message: err.message });
      }
})
//Update Quantity Only
router.patch("/updateQuantity/:pid", async (req, res) => {
  const dt = req.body;

  try {
    //   const user=await User.findOne({email: dt.email});
      
    const updatedProduct = await Product.updateOne(
      { _id: req.params.pid },
      {
        $set: {
          amountAvailable: dt.amountAvailable,
        },
      }
    );
    const updProduct = await Product.find({ _id: req.params.pid });
    res.json(updProduct[0]);
  } catch (err) {
    res.status(400).json({ message: "QUFailed" });
  }
});


module.exports = router;