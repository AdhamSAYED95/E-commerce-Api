const userModel = require("../models/userModel");
const {
  verfiyTokenAndAuthorization,
  verfiyTokenAndAdmin,
} = require("./verfiyToken");

const router = require("express").Router();

//// Update user
router.put("/:id", verfiyTokenAndAuthorization, async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString();
  }

  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE

router.delete("/:id", verfiyTokenAndAuthorization, async (req, res) => {
  try {
    await userModel.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

/// Get one user
router.get("/find/:id", verfiyTokenAndAdmin, async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get All Users
router.get("/", verfiyTokenAndAdmin, async (req, res) => {
  const query = req.query.new;
  try {
    const users = query
      ? await userModel
          .find()
          .sort({
            _id: -1,
          })
          .limit(5)
      : await userModel.find();
    res.status(200).json({
      users,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
