import express, { Router } from "express";
import {
  registeredUser,
  verifyUser,
  loginUser,
  userProfile,
  userLogOut,
  forgotPassword,
  resetPassword,
} from "../controllers/user.controller.js";
import isLoggedIn from "../middleware/auth.middleware.js";

const router = express.Router(); // Holds/Orgainze all our routes -- routing functionality

router.post("/register", registeredUser); // we are doing post here because user is giveing data like username, password etc
router.get("/verify/:token", verifyUser);
router.post("/login", loginUser);
router.get("/profile", isLoggedIn, userProfile); //Before hitting userprofile first go to isLoggedIn
router.get("/logOut", isLoggedIn, userLogOut);
router.get("/forgotPassword", forgotPassword);
router.post("/resetPassword/:token", resetPassword);

export default router; // Here i am writing default so when i am importing it i can give any name

// --> Routes where User will go for registration

// --> GET - its takes response
//     POST - when user will give a response user will give data & then it will atke response

// --> in verifyUser data or we can say token will be send in url format [req.params] & we have to extract the token from the url

// --> isLoggedIn is a event driven architecture because if we write isLoggedIn() then it will execute
// immediately & when we write isLoggedIn it will execute when I want i.e in this case when user will hit /profile route
// nodejs is also EDA
