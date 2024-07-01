const express = require("express");
const { auth } = require("../middleware/authMiddleware");

const {
    login,
    signup,
    logout
} = require("../controllers/user");

const router = express.Router();


router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);



module.exports = router;