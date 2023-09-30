const cartModel = require("../models/cartModel");
const {
  verfiyTokenAndAuthorization,
  verfiyTokenAndAdmin,
  verfiyToken,
} = require("./verfiyToken");

const router = require("express").Router();

// Create
router.post("/", verfiyToken, async (req, res) => {
  const newCart = new cartModel(req.body);
  try {
    const savedCart = await newCart.save();
    res.status(200).json(savedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

/// Update
router.put("/:id", verfiyTokenAndAuthorization, async (req, res) => {
  try {
    const updatedCart = await cartModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE

router.delete("/:id", verfiyTokenAndAuthorization, async (req, res) => {
  try {
    await cartModel.findByIdAndDelete(req.params.id);
    res.status(200).json("Cart has been deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

/// Get user cart
router.get("/find/:userId", verfiyTokenAndAuthorization, async (req, res) => {
  try {
    const cart = await cartModel.findOne({
      userId: req.params.userId,
    });
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json(err);
  }
});

/// get all carts by admin

router.get("/", verfiyTokenAndAdmin, async (req, res) => {
  try {
    const carts = await cartModel.find();
    res.status(200).json(carts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
