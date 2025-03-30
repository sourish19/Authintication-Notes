// ---- ALL PACKAGES & other technologies USED -----
// express   nodemon   dotenv  cors  moongose  crypto  nodemailer  MAILTRAP  bcryptjs  jwt  cookieparser

import express from "express"; // For Process  // first name is export name & the one in "" is file name
import dotenv from "dotenv";
import cors from "cors";
import db from "./utlis/db.js"; //sometimes it dosent connect so write .js
import cookieParser from "cookie-parser";

//import all routes
import userRoutes from "./routes/user.routes.js";

dotenv.config(); // it configures .env

const app = express(); // app variable has all express functions
const port = process.env.PORT || 4000; // Dont display port that is why it is in .env

//Connect to MongoDb
db();

app.use(
  //CORS IS IN BACKEND
  cors({
    // Untill we are calling any api or sending request from frontend we dont need cors - fetch call
    origin: process.env.BASE_URL,
    methods: ["GET", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Middlewares     app.use is used to handel middlewares
app.use(express.urlencoded({ extended: true })); //Frontend can send data through url
//extended true can be used to handel complex url -- can be used for encoding nesting

app.use(express.json()); //Frontend can send data through json
app.use(cookieParser())

//Routes help the server understand what to do when someone visits a URL or sends data.  --- Path
//  listens for GET requests and sends a response.
// .get request will be in req
app.get("/", (req, res) => {
  // Route & callback
  // console.log("This is req",req);
  res.send("Cohort");
  // res.json("Cohort")   //Its upto us in which format we want to send response
});

// In app.get we cant use req.body because it takes the data
// It works in app.post

app.get("/Sourish", (req, res) => {
  res.send("Sourish");
});
app.get("/Levi", (req, res) => {
  res.send("Levi");
});

//routes
app.use("/api/v1/users", userRoutes); // This is also a middleware

app.listen(port, () => {
  // Port & callback is passed
  console.log(`Example app listening on port ${port}`);
});

//app.listen -> starts the server & receives incomming connections kind of eventListner

// --- User Auth ---
// Regiser
// Verify
// Login

// --> GET = Fetching data
// POST = Sending data

// -->nodemon is onlys used for our personal use so it cant be in dependincies so it will be in Dev dependencies
//When we host it dev dependencies will not be there

//--> when we do process.nv our ip-address and other sensitive information also shows so we use dotenv.config that only shows the content in the file

// -->Express connects frontend & backend and frontend sends some req but what kind of req is this backend dosent know
//what type of req??
//Frontend can only send two types of req either JSON[body format] & urlencoded --- So we need to set it up

// --> Middlewares - between req & res

// --> Mong stores data in object format and Sql stores data in table

// --> Postman is basically acts as a Client who sends web request since I dont have a Frontend
