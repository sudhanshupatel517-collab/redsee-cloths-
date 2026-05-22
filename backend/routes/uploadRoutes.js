const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { protect, admin, coadmin } = require('../middleware/authMiddleware');

// Multer memory storage (keeps file in memory instead of saving to disk)
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed (JPG, PNG, WEBP)'));
    }
  }
});

// @desc    Upload an image to Cloudinary
// @route   POST /api/upload
// @access  Private (Admin/Co-Admin)
router.post('/', protect, coadmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    // Stream the file buffer to Cloudinary
    const streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'redsee_products' },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        stream.end(req.file.buffer);
      });
    };

    const result = await streamUpload(req);

    res.status(200).json({
      url: result.secure_url,
      public_id: result.public_id
    });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ message: error.message || 'Image upload failed' });
  }
});

// @desc    Delete an image from Cloudinary
// @route   POST /api/upload/destroy
// @access  Private (Admin/Co-Admin)
router.post('/destroy', protect, coadmin, async (req, res) => {
  try {
    const { public_id } = req.body;
    if (!public_id) {
      return res.status(400).json({ message: 'No public_id provided' });
    }

    const result = await cloudinary.uploader.destroy(public_id);
    res.status(200).json({ message: 'Image deleted successfully', result });
  } catch (error) {
    console.error('Destroy Error:', error);
    res.status(500).json({ message: 'Failed to delete image' });
  }
});

module.exports = router;
