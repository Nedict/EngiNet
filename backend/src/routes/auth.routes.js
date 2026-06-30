const express = require("express");

const router = express.Router();

const authController = require("../controllers/auth.controller");

const {
    validateRegister,
    validateLogin
} = require("../validations/auth.validation");

router.post(
    "/register",
    validateRegister,
    authController.register
);

router.post(
    "/login",
    validateLogin,
    authController.login
);

router.post(
    "/logout",
    authController.logout
);

router.post(
    "/forgot-password",
    authController.forgotPassword
);

router.post(
    "/reset-password",
    authController.resetPassword
);

module.exports = router;
