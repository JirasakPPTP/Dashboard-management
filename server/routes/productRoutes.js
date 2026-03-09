import express from "express";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct
} from "../controllers/productController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getProducts).post(protect, authorize("admin"), createProduct);
router
  .route("/:id")
  .put(protect, authorize("admin"), updateProduct)
  .delete(protect, authorize("admin"), deleteProduct);

export default router;
