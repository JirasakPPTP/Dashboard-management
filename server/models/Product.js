import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true
    },
    stock: {
      type: Number,
      required: [true, "Stock is required"],
      min: 0,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
