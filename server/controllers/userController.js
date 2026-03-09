import asyncHandler from "express-async-handler";
import User from "../models/User.js";

export const getUsers = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const search = req.query.search || "";

  const query = {
    $or: [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } }
    ]
  };

  const total = await User.countDocuments(query);
  const users = await User.find(query)
    .select("-password")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  res.json({
    data: users,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    }
  });
});

export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Name, email and password are required");
  }

  const exists = await User.findOne({ email });
  if (exists) {
    res.status(400);
    throw new Error("User email already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role === "admin" ? "admin" : "user"
  });

  res.status(201).json({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt
  });
});

export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const { name, email, role } = req.body;
  user.name = name ?? user.name;
  user.email = email ?? user.email;
  user.role = role ?? user.role;

  if (req.body.password) {
    user.password = req.body.password;
  }

  const updated = await user.save();

  res.json({
    id: updated._id,
    name: updated.name,
    email: updated.email,
    role: updated.role,
    createdAt: updated.createdAt
  });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  await user.deleteOne();
  res.json({ message: "User deleted successfully" });
});
