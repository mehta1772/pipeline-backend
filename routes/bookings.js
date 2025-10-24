// // backend/routes/bookings.js
// const express = require('express');
// const multer = require('multer');
// const authMiddleware = require('../middleware/authMiddleware');
// const bookingController = require('../controllers/bookingController');

// const router = express.Router();

// // Setup multer for file uploads (in memory)
// const upload = multer({ storage: multer.memoryStorage() });

// router.get('/', authMiddleware, bookingController.getAllBookings);
// router.get('/dashboard', authMiddleware, bookingController.getDashboard);
// router.get('/:id', authMiddleware, bookingController.getBookingById);
// router.post('/:id/stage', authMiddleware, bookingController.moveToNextStage);
// router.post('/:id/note', authMiddleware, bookingController.addNote);
// router.post('/:id/upload', authMiddleware, upload.single('file'), bookingController.uploadFile);

// module.exports = router;












const express = require('express');
const multer = require('multer');
const authMiddleware = require('../middleware/authMiddleware');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

// Setup multer for file uploads (in memory)
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max
  },
});

// Existing routes
router.get('/', authMiddleware, bookingController.getAllBookings);
router.get('/dashboard', authMiddleware, bookingController.getDashboard);
router.get('/:id', authMiddleware, bookingController.getBookingById);
router.post('/:id/stage', authMiddleware, bookingController.moveToNextStage);
router.post('/:id/note', authMiddleware, bookingController.addNote);

// File upload route (updated for S3)
router.post('/:id/upload', authMiddleware, upload.single('file'), bookingController.uploadFile);

// File delete route (NEW - optional)
router.delete('/:id/attachment/:attachmentId', authMiddleware, bookingController.deleteFile);

// Toggle stage requirement (pitchdeck or dpr)
router.post('/:id/toggle-stage-requirement', authMiddleware, bookingController.toggleStageRequirement);

module.exports = router;