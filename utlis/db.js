import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// DATABASE IS ALWAYS IN ANOTHER CONTINENT
const db = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("Connected to Db"))
    .catch((err) => console.log("Connecting to Db failed"));
};

export default db;

// --> utils folder is used for using reusable code 

// --> The db.js file usually contains the database connection logic so that 
// it can be reused in different parts of the project without repeating code.

// --> mongoose has a function .connect which connects it with the db 
// It returns a promise that is why we are using the & catch

// -->we are exporting because we want to use this db function in other files 

// --> we are only sending one fun() that is why we are using defaulut
// if there are multiple things that we want to export so we have to write in differet way
