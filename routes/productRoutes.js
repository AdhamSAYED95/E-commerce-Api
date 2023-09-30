const productmodel = require("../models/productModel");
const {
  verfiyTokenAndAuthorization,
  verfiyTokenAndAdmin,
} = require("./verfiyToken");

const router = require("express").Router();

// Create Product
router.post("/", verfiyTokenAndAdmin, async (req, res) => {
  const newProduct = new productmodel(req.body);
  try {
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

/// Update
router.put("/:id", verfiyTokenAndAdmin, async (req, res) => {
  try {
    const updatedProduct = await productmodel.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE

router.delete("/:id", verfiyTokenAndAdmin, async (req, res) => {
  try {
    await productmodel.findByIdAndDelete(req.params.id);
    res.status(200).json("Product has been deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

/// Get one product
router.get("/find/:id", async (req, res) => {
  try {
    const product = await productmodel.findById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get All products
router.get("/", async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  try {
    let products;
    if (qNew) {
      products = await productmodel.find().sort({ createdAt: -1 }).limit(5);
    } else if (qCategory) {
      products = await productmodel.find({
        categories: {
          $in: [qCategory],
        },
      });
    } else {
      products = await productmodel.find();
    }
    res.status(200).json({
      products,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
