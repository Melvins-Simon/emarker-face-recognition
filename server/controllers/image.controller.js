import { User } from "../models/user.model.js";
import cloudinary from "../utils/clodinary.js";

export const upload_image = async (req, res) => {
  try {
    const { images, name, email } = req.body;

    if (
      !images ||
      !Array.isArray(images) ||
      images.length === 0 ||
      !name ||
      !email
    ) {
      return res.status(400).json({
        error: "Please provide an array of base64-encoded images",
      });
    }

    // Validate each image is a proper data URI
    const validImages = images.filter(
      (img) => img.startsWith("data:image/") && img.includes(";base64,")
    );

    if (validImages.length !== images.length) {
      return res.status(400).json({
        error: "Some images are not valid base64 data URIs",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Something went wrong." });
    }

    // Upload to Cloudinary with concurrency control
    const MAX_CONCURRENT_UPLOADS = 5;
    const results = [];

    for (let i = 0; i < validImages.length; i += MAX_CONCURRENT_UPLOADS) {
      const batch = validImages.slice(i, i + MAX_CONCURRENT_UPLOADS);
      const uploadPromises = batch.map((img) =>
        cloudinary.uploader
          .upload(img, {
            folder: `face-dataset/${name}-${user._id}`,
            resource_type: "image",
          })
          .catch((e) => {
            console.error(`Failed to upload image: ${e.message}`);
            return null;
          })
      );

      const batchResults = await Promise.all(uploadPromises);
      results.push(...batchResults.filter(Boolean));
    }

    const urls = results.map((r) => r.secure_url);
    user.images = urls;
    const newStudent = await user.save();

    res.status(200).json({
      success: true,
      message: `${results.length}/${images.length} images uploaded`,
      data: { ...newStudent._doc, password: undefined },
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      error: error.message || "Image processing failed",
    });
  }
};

export const get_images = async (req, res) => {
  try {
    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: "face-dataset/",
      max_results: 100,
    });
    res.json(result.resources);
  } catch (error) {
    console.error("Error fetching faces:", error);
    res.status(500).json({ error: "Failed to fetch face images" });
  }
};
