const express = require("express");
const router = express.Router();
const { generateSignedUrl } = require("../utils/storage");
const { verifyToken } = require("../auth/verify");

router.post("/generate-upload-url", verifyToken, async (req, res) => {
  try {
    const { fileName, fileType } = req.body;

    // Validate file type
    const validTypes = [
      "image/jpeg",
      "image/png",
      "video/mp4",
      "application/pdf",
    ];
    if (!validTypes.includes(fileType)) {
      return res.status(400).json({ error: "Invalid file type" });
    }

    // Generate a unique filename to avoid collisions
    const uniqueFileName = `${Date.now()}-${fileName}`;
    const uploadUrl = await generateSignedUrl(uniqueFileName, fileType);
    
    res.json({ 
      uploadUrl,
      fileName: uniqueFileName // Return the unique filename
    });
  } catch (error) {
    console.error('Upload URL generation error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
