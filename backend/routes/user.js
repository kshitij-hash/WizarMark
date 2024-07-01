const express = require("express");
const { auth } = require("../middleware/authMiddleware");

const {
    login,
    signup,
} = require("../controllers/user");

const router = express.Router();


router.post("/signup", signup);
router.post("/login", login);


module.exports = router;