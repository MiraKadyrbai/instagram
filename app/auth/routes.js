const express = require('express');
const router = express.Router();
const { sendVerificationEmail,signUp, login, editUser } = require("./controllers");
const {validateSignup}  = require("./middlewares") ; 
const {upload} = require("./utils");
const passport = require("passport");

router.post('/api/auth/sendmail', sendVerificationEmail)
router.post("/api/auth/signup", validateSignup, signUp);
router.post('/api/auth/login', login);
router.put('/api/auth/edit',  upload.single('user_image'), passport.authenticate('jwt', {session: false}),  editUser);

module.exports = router;