import { registerUser, loginUser } from "../services/authService.js";
import { generateToken } from "../utils/generateToken.js";

const formatUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role
});

export const register = async (req, res, next) => {
  try {
    const user = await registerUser(req.body);

    res.status(201).json({
      message: "User created",
      token: generateToken(user),
      user: formatUser(user)
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await loginUser(req.body.email, req.body.password);

    res.json({
      message: "Login successful",
      token: generateToken(user),
      user: formatUser(user)
    });
  } catch (error) {
    next(error);
  }
};