import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Multer for Image Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// Schema & Model
const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  phone: String,
  address: String,
  email: String,
  profilePic: String,
});
const User = mongoose.model("User", UserSchema);

// API Routes
app.post("/addUser", upload.single("profilePic"), async (req, res) => {
  try {
    const { firstName, lastName, phone, address, email } = req.body;
    const profilePic = req.file ? `/uploads/${req.file.filename}` : "";
    const newUser = new User({ firstName, lastName, phone, address, email, profilePic });
    await newUser.save();
    res.json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
