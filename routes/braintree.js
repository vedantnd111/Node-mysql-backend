const express = require("express");
const router = express.Router();

const {
    requireLogIn,
    isAuth
} = require("../controllers/auth");
const {
    userById
} = require("../controllers/user");
const {
    generateToken,
    processPayment
} = require("../controllers/braintree");

router.get("/braintree/getToken/:userId", requireLogIn, isAuth, generateToken);
router.post(
    "/braintree/payment/:userId",
    requireLogIn,
    isAuth,
    processPayment
);

router.param("userId", userById);

module.exports = router;