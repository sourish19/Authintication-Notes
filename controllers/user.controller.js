import User from "../model/User.model.js";
import crypto from "crypto"; //inBuilt in nodejs
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const registeredUser = async (req, res) => {
  const { name, email, password } = req.body; //get data

  //Check data
  if (!name || !email || !password) {
    return res.status(400).json({
      message: "All fields are required",
    }); // After this line the codes below it will not work because I am sending a response
  }

  try {
    const existingUser = await User.findOne({ email: email }); // the first one is database field name & the other one is variable
    if (existingUser) {
      return res.status(400).json({
        message: "User already registered",
      });
    }
    const user = await User.create({
      name,
      email,
      password,
    }); // since the variables are same we can write in this way also

    if (!user) {
      return res.status(400).json({
        message: "Cannot register User",
      });
    }

    const token = crypto.randomBytes(32).toString("hex"); // create a random token & store it in that particular users database

    user.verificationToken = token;
    await user.save(); //save in db

    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 587,
      secure: false, // true for port 465, false for other ports
      auth: {
        user: "43404ca90bc47d",
        pass: "3a467cb5abcd19",
      },
    });

    const verificationLink = `${process.env.BASE_URL}/api/v1/users/verify/${token}`;
    const sentMail = await transporter.sendMail({
      from: "sandbox.smtp.mailtrap.io", // sender address
      to: email, // list of receivers
      subject: "User verification", // Subject line
      text: "Click Link", // plain text body
      html: `<b>${verificationLink}</b>`, // html body
    });

    return res.status(200).json({
      message: "User created successfully & sent email",
      success: true, // we are sending this success message because it is helpfull in the frontend part to know the status
    });
  } catch (error) {}
  return res.status(400).json({
    message: "Cannot register user",
    success: false,
  });
};

const verifyUser = async (req, res) => {
  const { token } = req.params;
  console.log(token);

  if (!token) {
    return res.status(400).json({
      message: "Token required",
    });
  }

  const user = await User.findOne({ verificationToken: token });

  if (!user) {
    return res.status(400).json({
      message: "Invalid User",
    });
  }

  try {
    user.isVerified = true;
    user.verificationToken = undefined; // the field will get removed from Db, if null the th value will be null
    await user.save();

    return res.status(200).json({
      message: "User verified",
    });
  } catch (error) {
    return res.status(400).json({
      message: "user cannot be verified",
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body; //get email pass

  if (!email || !password) {
    // check
    res.status(400).json({
      message: "All fields required",
    });
  }

  try {
    const user = await User.findOne({ email });
    console.log(user);

    if (!user) {
      return res.status(400).json({
        message: "user not found",
      });
    }

    const matchedPassword = bcrypt.compare(password, user.password);

    if (!matchedPassword) {
      return res.status(400).json({
        message: "wrong password",
      });
    }

    const sessionToken = jwt.sign(
      { id: user._id, name: user.name }, // PAYLOAD
      process.env.JWT_SECRET, // SECRET KEY
      {
        expiresIn: process.env.JWT_EXPIRE, // EXPIRY
      }
    ); // returns a token
    console.log(sessionToken);

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    };
    res.cookie("token", sessionToken, cookieOptions);

    return res.status(200).json({
      message: "user logedin successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      message: "Failed to check in database",
    });
  }
};

const userProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); //exclude password
    console.log(user);

    if (!user) {
      return res.status(400).json({
        message: "Cannot view profile",
      });
    }

    return res.status(200).json({
      message: "User profile",
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed to check in database",
    });
  }
};

const userLogOut = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  console.log(user);

  if (!user) {
    return res.status(400).json({
      message: "Cannot log out",
    });
  }
  console.log(req.cookies.token);

  res.cookie("token", "");

  console.log("token", req.cookies.token);
  return res.status(400).json({
    message: "User Log Out",
  });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    // check
    res.status(400).json({
      message: "email field is required",
    });
  }

  const user = await User.findOne({ email });

  if (!user) {
    // check
    res.status(400).json({
      message: "user not found",
    });
  }

  try {
    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

    await user.save(); // save he above two field in db

    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 587,
      secure: false, // true for port 465, false for other ports
      auth: {
        user: "43404ca90bc47d",
        pass: "3a467cb5abcd19",
      },
    });

    const verificationLink = `${process.env.BASE_URL}/api/v1/users/resetPassword/${token}`;
    const sentMail = await transporter.sendMail({
      from: "sandbox.smtp.mailtrap.io", // sender address
      to: email, // list of receivers
      subject: "Reset password", // Subject line
      text: `Click Link 
      ${verificationLink}`, // plain text body
    });

    return res.status(200).json({
      message: "Sent reset password link in email",
    });
  } catch (error) {
    return res.status(400).json({
      message: "Cannot save user ",
    });
  }
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!token || !password) {
    return res.status(400).json({
      message: "Invalid",
    });
  }

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    console.log(user);

    if (!user) {
      return res.status(400).json({
        message: "Invalid user",
      });
    }
    user.password = password;
    user.resetPasswordExpires = undefined;
    user.resetPasswordToken = undefined;
    await user.save();

    res.cookie("token", ""); // user login again with new password

    return res.status(200).json({
      message: "Password reset successfull",
    });
  } catch (error) {
    return res.status(400).json({
      message: "Error occurr",
    });
  }
};

export {
  registeredUser,
  verifyUser,
  loginUser,
  userProfile,
  userLogOut,
  forgotPassword,
  resetPassword,
};

// export {registeredUser} -> in import i have to give this name only

// --> Controllers is basically used for when a user comes to a specific route what will he do over ther -- functionality

// --> req.body - all data sent by client

// --> find - everything , findOne - the first value that is found

// --> so user is now registered now we can move to verify part

// --> after creating toke & saving it to db now i need to send this verificationtoken to users through mail
// so i am using a package called nodemailer which acts as a transport for sending mail

// --> verification will be done in another route

// --> after verification we have to secure password -- for that I will be using bcrypt.js
// bcrypt - something can be hashed but cannot take it back -- one way possible -- hashed pass

// --> in the login part we have check the email password now we have to login the use
// for that we use sessions i.e fow how much time [1 week,10 hr, etc] the user can be logedin
// we use sessions because whenever user refreshes the page he will have to login again

// --> we stor session token in db & to users cookies

// forgot password
// email ..
// user in db
// resetpass token
// reset pass time
// save in db

// redirect to resetPassword
// token
// new password
// find user based on token
// check token expiry
// token valid - reset
