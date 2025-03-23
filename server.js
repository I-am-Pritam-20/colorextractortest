const express = require('express');
const axios = require('axios');
const sharp = require('sharp');
const color = require('color-thief-node');
const app = express();
const port = 5003;

// Middleware for parsing JSON bodies
app.use(express.json());

// Route to extract dominant color from an image URL
app.post('/extract-color', async (req, res) => {
  try {
    const { imageUrl } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({ error: 'Image URL is required' });
    }
    
    // Download the image
    const response = await axios({
      url: imageUrl,
      responseType: 'arraybuffer'
    });
    
    // Get dominant color using color-thief-node
    const dominantColor = await color.getColorFromURL(imageUrl);
    
    // Convert RGB to hex
    const hexColor = rgbToHex(dominantColor[0], dominantColor[1], dominantColor[2]);
    
    res.json({
      dominantColor: {
        rgb: dominantColor,
        hex: hexColor
      }
    });
  } catch (error) {
    console.error('Error extracting color:', error);
    res.status(500).json({ error: 'Failed to extract color from image' });
  }
});

// Helper function to convert RGB to hex
function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

// Simple test endpoint
//Make a POST request to /extract-color with a JSON body containing an imageUrl
//Example: { "imageUrl": "https://example.com/image.jpg" }


// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});