const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

const createUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error("User already exists with this email");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const userData = user.toJSON();
  delete userData.password;
  return userData;
};

const loginUser = async (email, password) => {
  try {
    // Validate input
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    return token;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createUser,
  loginUser,
};
