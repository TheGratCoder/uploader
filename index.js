const express = require('express');
const fs = require('fs');
const path = require('path');
const noblox = require('noblox.js');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Route to handle decal upload
app.post('/upload-decal', async (req, res) => {
  const { cookie } = req.body;

  if (!cookie) {
    return res.status(400).send('Missing required field: cookie.');
  }

  try {
    // Authenticate with Roblox using the provided cookie
    await noblox.setCookie(cookie);

    // Define the decal name and image path
    const decalName = 'Sigma';
    const imagePath = path.join(__dirname, 'image.png');

    // Ensure the image file exists
    if (!fs.existsSync(imagePath)) {
      return res.status(400).send('Image file not found.');
    }

    // Read the image file
    const imageBuffer = fs.readFileSync(imagePath);

    // Upload the decal
    const assetType = 13; // AssetTypeId for Decal
    const uploadResponse = await noblox.uploadItem(decalName, assetType, imageBuffer);

    res.status(200).json({
      message: 'Decal uploaded successfully!',
      assetId: uploadResponse.assetId,
    });
  } catch (error) {
    res.status(500).send(`Error uploading decal: ${error.message}`);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
