import mongoose from "mongoose";
import bcrypt from "bcryptjs";
// How to store Data - Data Blocks
// mongoose has a function knows as .Schema -- object -- creates a new instance because we are writing new
// key value pair are arguments passed in the Schema constructor
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
      lowercase: true,
    },
    email: {
      type: String,
      require: true,
      lowercase: true,
    },
    password: String, //It is not safe
    role: {
      type: String,
      enum: ["user", "admin"], // Predefined or expexted values
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
  },
  {
    timestamps: true, //mongoose inserts createdAt and updatedAt field
  }
);
// Writeing hooks -- kind of middleware
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    // whenever the is any modification or save in the password field this function will get executed
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const user = mongoose.model("User", userSchema);
export default user;

// --> Schema means structure / Blueprint
// User scchema will be inside Mongo and is created by mongoose

// --> mongoose.model("name",userSchema) -- Creates a collection in mongoDb -- automatically makes Users(plural)
// Kind of gives the entire schema a heading

// --> By exporting user we can insert data into this schema
