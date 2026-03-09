import asyncHandler from "express-async-handler";
import Product from "../models/Product.js";

export const getProducts = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const search = req.query.search || "";
  const category = req.query.category || "";

  const query = {
    name: { $regex: search, $options: "i" }
  };
  if (category) query.category = category;

  const total = await Product.countDocuments(query);
  const products = await Product.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  res.json({
    data: products,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    }
  });
});

export const createProduct = asyncHandler(async (req, res) => {
  const { name, price, category, stock } = req.body;
  if (!name || price == null || !category || stock == null) {
    res.status(400);
    throw new Error("Name, price, category and stock are required");
  }

  const product = await Product.create({ name, price, category, stock });
  res.status(201).json(product);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const { name, price, category, stock } = req.body;
  product.name = name ?? product.name;
  product.price = price ?? product.price;
  product.category = category ?? product.category;
  product.stock = stock ?? product.stock;

  const updated = await product.save();
  res.json(updated);
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  await product.deleteOne();
  res.json({ message: "Product deleted successfully" });
});
