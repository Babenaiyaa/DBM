import Banner from "../models/Banner.js";

// GET all banners
export const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ order: 1 });
    res.json(banners);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch banners" });
  }
};

// CREATE new banner
export const createBanner = async (req, res) => {
  try {
    const newBanner = new Banner(req.body);
    const saved = await newBanner.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ message: "Failed to create banner" });
  }
};

// UPDATE banner
export const updateBanner = async (req, res) => {
  try {
    const updated = await Banner.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch {
    res.status(500).json({ message: "Failed to update banner" });
  }
};

// DELETE banner
export const deleteBanner = async (req, res) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);
    res.json({ message: "Banner deleted" });
  } catch {
    res.status(500).json({ message: "Failed to delete banner" });
  }
};
