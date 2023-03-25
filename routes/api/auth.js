const express = require("express");
const router = express.Router();
const { validateBody, authorizationUser,upload } = require("../../middlewares");
const {registerShema,loginShema,repeatedEmail,}=require("../../models/user")
const { register, login, current, logout,avatar,verifyEmail,repeatedVerify } = require("../../controllers/auth");

router.post("/register", validateBody(registerShema), register);
router.get("/verify:verificationCode", verifyEmail);
router.post("/verify",validateBody(repeatedEmail),repeatedVerify)
router.post("/login", validateBody(loginShema), login);
router.get("/current", authorizationUser, current);
router.post("/logout", authorizationUser, logout);
router.patch("/avatars",authorizationUser,upload.single("avatar"), avatar)

module.exports = router;