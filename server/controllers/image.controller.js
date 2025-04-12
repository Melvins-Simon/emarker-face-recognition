import cloudinary from "../utils/clodinary.js";

export const upload_image = async (req, res) => {
  try {
    const { images } = req.body;

    if (!images || !Array.isArray(images)) {
      return res.status(400).json({ error: "Images are required" });
    }

    const uploadPromises = images.map((img) =>
      cloudinary.uploader.upload(`data:image/jpeg;base64,${img}`, {
        folder: "face-dataset",
      })
    );

    const results = await Promise.all(uploadPromises);
    const urls = results.map((r) => r.secure_url);

    res
      .status(200)
      .json({ success: true, message: "Dataset upload success.", urls });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    res.status(500).json({ error: "Failed to upload images" });
  }
};
