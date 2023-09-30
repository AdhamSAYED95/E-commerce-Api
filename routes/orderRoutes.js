const orderModel = require("../models/orderModel");
const {
  verfiyTokenAndAuthorization,
  verfiyTokenAndAdmin,
  verfiyToken,
} = require("./verfiyToken");

const router = require("express").Router();

// Create
router.post("/", verfiyToken, async (req, res) => {
  const newOrder = new orderModel(req.body);
  try {
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

/// Update
router.put("/:id", verfiyTokenAndAdmin, async (req, res) => {
  try {
    const updatedOrder = await orderModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE

router.delete("/:id", verfiyTokenAndAuthorization, async (req, res) => {
  try {
    await orderModel.findByIdAndDelete(req.params.id);
    res.status(200).json("Order has been deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

/// Get user order
router.get("/find/:userId", verfiyTokenAndAuthorization, async (req, res) => {
  try {
    const orders = await orderModel.find({
      userId: req.params.userId,
    });
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get all orders by admin

router.get("/", verfiyTokenAndAdmin, async (req, res) => {
  try {
    const orders = await orderModel.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
