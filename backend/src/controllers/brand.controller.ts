import { Request, Response } from "express";
import Brand from "../models/brandModel";
import slugify from "slugify";
import { authValidate } from "../middleware/auth";

export const addBrand = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const logoUrl = (req.file as Express.Multer.File)?.path;

    if (!name || !logoUrl) {
      return res.status(400).json({ message: "Name and logo are required" });
    }

    const slug = slugify(name, { lower: true });

    const brand = new Brand({
      name,
      slug,
      logoUrl,
    });

    await brand.save();

    res.status(201).json({
      message: "Brand added successfully",
      data: brand,
    });
  } catch (error) {
    console.log("Add brand error:", error);
    res.status(500).json({ message: "Failed to add brand" });
  }
};

export const getAllBrands = async (req: Request, res: Response) => {
  try {
    const brands = await Brand.find().sort({ name: 1 });
    res.status(200).json({ data: brands });
  } catch (error) {
    console.error("Get brands error:", error);
    res.status(500).json({ message: "Failed to fetch brands" });
  }
};

export const deleteBrand = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const brand = await Brand.findById(id);

    if (!brand) {
      res.status(404).json({ message: "Brand not found" });
      return;
    }

    await Brand.findByIdAndDelete(id);
    res.status(200).json({ message: "Brand deleted successfully" });
  } catch (error) {
    console.error("Error deleting brand:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
