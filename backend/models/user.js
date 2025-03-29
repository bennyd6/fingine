import mongoose, { model } from "mongoose";
const { Schema } = mongoose;
import bcrypt from "bcrypt";

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hashed password
  phone: { type: String },
  role: { 
    type: String, 
    enum: ["freelancer", "small_business", "ecommerce", "corporate", "accountant"], 
    required: true 
  }, // User type
  organization: { type: String }, // Optional for corporate users
  accountingSoftware: { type: String, enum: ["None", "QuickBooks", "Tally", "SAP", "Zoho Books", "Custom ERP"], default: "None" }, // Accounting tool used
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Skip if not modified
  const salt = await bcrypt.genSalt(10); // Generate salt
  this.password = await bcrypt.hash(this.password, salt); // Hash password
  next();
});

// 🔹 **Method to Compare Passwords**
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = model("User", userSchema);
export default User;


