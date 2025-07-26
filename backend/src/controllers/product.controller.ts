import { Request, Response } from "express";
import Product from "../models/productModel";

// Add Product
export const addProduct = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      category,
      subCategory,
      brand,
      price,
      originalPrice,
      stock,
      rating,
      numReviews,
      isFeatured,
      isOnSale
    } = req.body;

    // Get uploaded images from req.files
    const uploadedFiles = req.files as Express.Multer.File[];
    const images = uploadedFiles ? uploadedFiles.map(file => file.path) : [];

    // Validate required fields
    if (!name || !description || !category || !brand || !price || !stock) {
      res.status(400).json({ 
        success: false,
        message: "Name, description, category, brand, price, and stock are required" 
      });
      return;
    }

    // Convert string values to numbers and validate
    const numericPrice = Number(price);
    const numericStock = Number(stock);
    const numericOriginalPrice = originalPrice ? Number(originalPrice) : null;
    const numericRating = rating ? Number(rating) : 0;
    const numericNumReviews = numReviews ? Number(numReviews) : 0;

    // Validate price
    if (isNaN(numericPrice) || numericPrice <= 0) {
      res.status(400).json({ 
        success: false,
        message: "Price must be a positive number" 
      });
      return;
    }

    // Validate stock
    if (isNaN(numericStock) || numericStock < 0) {
      res.status(400).json({ 
        success: false,
        message: "Stock must be a non-negative number" 
      });
      return;
    }

    // Validate original price if provided
    if (numericOriginalPrice !== null && (isNaN(numericOriginalPrice) || numericOriginalPrice <= 0)) {
      res.status(400).json({ 
        success: false,
        message: "Original price must be a positive number" 
      });
      return;
    }

    // Validate images array
    if (!Array.isArray(images) || images.length === 0) {
      res.status(400).json({ 
        success: false,
        message: "At least one image is required" 
      });
      return;
    }



    const product = await Product.create({
      name,
      description,
      category,
      subCategory,
      brand,
      price,
      originalPrice: originalPrice || price,
      stock,
      images,
      rating: rating || 0,
      numReviews: numReviews || 0,
      isFeatured: isFeatured === 'true' || isFeatured === true,
      isOnSale: isOnSale === 'true' || isOnSale === true
    });

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product
    });

  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

// Get All Products
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, category, brand, isFeatured, isOnSale } = req.query;
    
    const filter: any = {};
    
    if (category) filter.category = category;
    if (brand) filter.brand = brand;
    if (isFeatured !== undefined) filter.isFeatured = isFeatured === 'true';
    if (isOnSale !== undefined) filter.isOnSale = isOnSale === 'true';

    const products = await Product.find(filter)
      .populate('brand', 'name logoUrl')
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(filter);

    res.status(200).json({
      success: true,
      products,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalProducts: total,
        hasNext: Number(page) * Number(limit) < total,
        hasPrev: Number(page) > 1
      }
    });

  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

// Get Single Product
export const getProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id).populate('brand', 'name logoUrl');

    if (!product) {
      res.status(404).json({
        success: false,
        message: "Product not found"
      });
      return;
    }

    res.status(200).json({
      success: true,
      product
    });

  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

// Update Product
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Handle uploaded images
    const uploadedFiles = req.files as Express.Multer.File[];
    if (uploadedFiles && uploadedFiles.length > 0) {
      updateData.images = uploadedFiles.map(file => file.path);
    }

    // Handle boolean fields - convert string to boolean if needed
    if (updateData.isFeatured !== undefined) {
      updateData.isFeatured = updateData.isFeatured === 'true' || updateData.isFeatured === true;
    }
    if (updateData.isOnSale !== undefined) {
      updateData.isOnSale = updateData.isOnSale === 'true' || updateData.isOnSale === true;
    }

    // Remove fields that shouldn't be updated directly
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    const product = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('brand', 'name logo');

    if (!product) {
      res.status(404).json({
        success: false,
        message: "Product not found"
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product
    });

  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

// Delete Product
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      res.status(404).json({
        success: false,
        message: "Product not found"
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};
