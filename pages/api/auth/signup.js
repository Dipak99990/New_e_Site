import User from "@/models/User";
import db from "@/utils/db";
async function handler(req, res) {
  if (req.method !== "POST") {
    return;
  }
  const { name, email, password } = req.body;
  if (
    !name ||
    !email ||
    !email.includes("@") ||
    !password ||
    password.trim().length < 5
  ) {
    res.status(402).json({
      message: "Validation Error",
    });
    return;
  }
  await db.connect();

  const existingUser = await User.findOne({ email: email });
  if (existingUser) {
    res.status(403).json({ message: "User Already Exists" });
    await db.disconnect();
    return;
  }
  const newUser = new User({
    name,
    email,
    password,
    isAdmin: false,
  });
  const user = await newUser.save();

  await db.disconnect();
  res.status(201).json({
    message: "USer Created",
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  });
}
export default handler;
