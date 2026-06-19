import { User } from "../models/User.js";
import { recordActivity } from "../services/activityService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError } from "../utils/httpError.js";
import { createToken } from "../utils/token.js";

const authResponse = (user) => ({
  user,
  token: createToken(user._id)
});

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new HttpError("Name, email, and password are required", 400);
  }

  const exists = await User.findOne({ email });
  if (exists) throw new HttpError("Email is already registered", 409);

  const user = await User.create({ name, email, password });
  await recordActivity({ owner: user._id, type: "profile", title: "Account created" });
  res.status(201).json(authResponse(user));
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    throw new HttpError("Invalid email or password", 401);
  }

  res.json(authResponse(user));
});

export const getMe = asyncHandler(async (req, res) => {
  res.json(req.user);
});

export const updateProfile = asyncHandler(async (req, res) => {
  const allowed = ["name", "avatar", "bio", "location", "github", "portfolio"];
  allowed.forEach((field) => {
    if (req.body[field] !== undefined) req.user[field] = req.body[field];
  });
  await req.user.save();
  await recordActivity({ owner: req.user._id, type: "profile", title: "Profile updated" });
  res.json(req.user);
});
