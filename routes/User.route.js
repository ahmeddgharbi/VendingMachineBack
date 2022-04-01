const express = require("express");

const router = express.Router();
const User = require("../models/User.model");
const Product = require("../models/Product.model");
router.get("/", (req, res) => {
  res.json("test");
});
//Add User
router.post("/add", async (req, res) => {
  const dt = req.body;

  const newUser = new User({
    username: dt.username,
    email: dt.email,
    password: dt.password,
    role: dt.role,
    cart: [],
    sessions: [],
  });
  try {
    const userMatch = await User.findOne({ email: dt.email });
    if (userMatch) {
      return res.status(401).json({ message: "User already exists" });
    } else {
      const savedUser = await newUser.save();
      res.json(savedUser);
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
//Update User
// router.patch("/update/:uid", async (req, res) => {
//   const dt = req.body;
//   console.log(req.params.uid);
//   try {
//     const userMatch = await User.findOne({ email: dt.email });
//     if (userMatch ){
//       return res.status(401).json({ message: "User already exists" });
//     } else {
//     const updatedUser = await User.updateOne(
//       { _id: req.params.uid },
//       {
//         $set: {
//           username: dt.username,
//           email: dt.email,
//           password: dt.password,
//           role: dt.role,
//         },
//       }
//     );
//     const updUser = await User.find({ _id: req.params.uid });
//     res.json(updUser[0]);
//     }
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

//Update User Deposite
router.patch("/updateDeposit/:uid", async (req, res) => {
  const dt = req.body;

  try {
    //   const user=await User.findOne({email: dt.email});

    const updatedUser = await User.updateOne(
      { _id: req.params.uid },
      {
        $set: {
          deposit: dt.deposit,
        },
      }
    );
    const updUser = await User.find({ _id: req.params.uid });
    res.json(updUser[0]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//Delete User
router.delete("/delete/:uid", async (req, res) => {
  try {
    const deletedUser = await User.deleteOne({ _id: req.params.uid });
    res.json(deletedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
//Get Specific User
router.get("/specific/:uid", async (req, res) => {
  try {
    const theUser = await User.find({ _id: req.params.uid });
    res.json(theUser[0]);
  } catch (err) {
    res.json({ message: error.message });
  }
});
//Get All Users
router.get("/all", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post("/logout", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    const index = user.sessions.indexOf(req.body.session);
    user.sessions.splice(index, 1);
    await user.save();
    res.json({ message: "Logged out", user: null });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post("/logout/all", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    
    user.sessions = user.sessions.filter(usr => usr === req.body.session);
    await user.save();
    res.json({ message: "Logged out of all sessions", user: user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post("/login", async (req, res) => {
  const dt = req.body;
  async function storeSession (email) {
    const session_key = Date.now().toString(36);
    try {
      const user = await User.find({ email: email });
      
      const sessions = user[0].sessions;
      sessions.push(session_key);
      const updatedUser = await User.updateOne(
        { email: email },
        {
          $set: {
            sessions: sessions,
          },
        }
      );
      const updUser = await User.find({ email: email });
      return { user: updUser[0], session_key: session_key};
    } catch (err) {
      return { message: err.message };
    }
  }
  try {
    const user = await User.findOne({ email: dt.email });
    if (user && user.password === dt.password) {
      const session = await storeSession(dt.email);
      res.json(session);
    } else {
      res.status(401).json({ message: "Invalid Credentials" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//Add to cart
router.patch("/addToCart/:uid", async (req, res) => {
  const dt = req.body;
  try {
    const user = await User.find({ _id: req.params.uid });

    const product = await Product.find({ _id: dt.pid });
    const cart = user[0].cart;
    cart.push(product[0]);
    const updatedUser = await User.updateOne(
      { _id: req.params.uid },
      {
        $set: {
          cart: cart,
        },
      }
    );
    const updUser = await User.find({ _id: req.params.uid });
    res.json(updUser[0]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.patch("/emptyCart/:uid", async (req, res) => {
  try {
    const user = await User.find({ _id: req.params.uid });

    const updatedUser = await User.updateOne(
      { _id: req.params.uid },
      {
        $set: {
          cart: [],
        },
      }
    );
    const updUser = await User.find({ _id: req.params.uid });
    res.json(updUser[0]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get("/verify-session/:key/:email", async (req, res) => {
  try {
    const user = await User.find({ email: req.params.email });
    const sessions = user[0].sessions;
    if (sessions.includes(req.params.key)) {
      res.json({user: user[0], message: "Session Valid", forceLogout: false});
    }
    else {
      res.status(401).json({ message: "Invalid Session", forceLogout: true});
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
