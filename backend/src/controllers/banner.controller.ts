import { Request, Response } from "express";
import Banner from "../models/bannerModel";

export const createBanner = async (req: Request, res: Response) => {
  try {
    const { heading, subHeading, ctaText, ctaLink } = req.body;
    const imageUrl = (req.file as Express.Multer.File).path;

    const banner = new Banner({
      heading,
      subHeading,
      ctaLink,
      ctaText,
      imageUrl,
    });

    await banner.save();
    res.status(201).json(banner);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to create banner", details: error });
  }
};

export const getBanner = async (req: Request, res: Response) => {
  try {
    const bannerDetails = await Banner.find();
    res.status(200).json(bannerDetails);
  } catch (error) {
    console.error("Error fetching banners:", error);
    res.status(500).json({ message: "Failed to fetch banner" });
  }
};

export const updateBanner = async (req: Request, res: Response) => {
  try {
    const { id, heading, subHeading, ctaText, ctaLink } = req.body;
    const existingBanner = await Banner.findById(id);

    if (!existingBanner) {
      return res.status(400).json({ message: "Banner not found" });
    }

    existingBanner.heading = heading ?? existingBanner.heading;
    existingBanner.subHeading = subHeading ?? existingBanner.subHeading;
    existingBanner.ctaLink = ctaLink ?? existingBanner.ctaLink;
    existingBanner.ctaText = ctaText ?? existingBanner.ctaText;

    if (req.file) {
      existingBanner.imageUrl = (req.file as Express.Multer.File).path;
    }
    const savedBanner = await existingBanner.save();

    res.status(200).json({
      message: "Banner updated successfully",
      data: savedBanner,
    });
  } catch (error) {
    console.error("Update banner error:", error);
    res.status(500).json({ message: "Failed to update banner" });
  }
};
