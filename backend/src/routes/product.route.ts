import express from "express";
import { 
  addProduct, 
  getAllProducts, 
  getProduct, 
  updateProduct, 
  deleteProduct 
} from "../controllers/product.controller";
import productUpload from "../middleware/productUpload";
import { authValidate } from "../middleware/auth";

const router = express.Router();

// Public routes
router.get("/all-products", getAllProducts);
router.get("/product/:id", getProduct);

// Protected routes (require authentication)
router.post(
  "/add-product",
  authValidate,
  productUpload.array("images", 5), // Allow up to 5 images
  (req, res, next) => {
    addProduct(req, res).catch(next);
  }
);

router.put(
  "/update-product/:id",
  authValidate,
  productUpload.array("images", 5),
  (req, res, next) => {
    updateProduct(req, res).catch(next);
  }
);

router.delete(
  "/delete-product/:id",
  authValidate,
  (req, res, next) => {
    deleteProduct(req, res).catch(next);
  }
);

export default router; 