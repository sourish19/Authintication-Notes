import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const isLoggedIn = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    // console.log("req -> ",req);

    // console.log("token -> ", token);

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "No token found",
      });
    }

    try {
      // we can keep this under trycatch or we can use it without trycatch
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decodedToken;

      //   console.log("decodedtoken -> ", decodedToken);
      //   console.log("req.user ->", req.user);
        
    //   next();
    } catch (error) {
      return res.status(500).json({
        message: "Failed to decode token",
      });
    }
  } catch (error) {
    return res.status(400).json({
      message: "Unauthorized",
    });
  }
  next();
};

export default isLoggedIn;
// --> We have created a middleware seperately because after login User has to authenticate
// each & every time so I can write it in controllers also but over there I have to repeate
// the same thing.

// --> Middlewares are always use in routes because it is a functionality b/w a req & res
// & after a middleware fuction is done always pass a flag "next()"

// --> Same token will get encrypted & decrypted through a jwt secrete key & the token
// After decrypting we only get the payload

// --> Here we are creating ower own user in req like body, params, cookies etc.
// which will store the decoded data from jwt

//get token from cookie
//verify token
//decode token
