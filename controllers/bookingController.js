// backend/controllers/bookingController.js
const Booking = require('../models/Booking');
// const { bucket } = require('../config/firebaseConfig');
const s3 = require('../config/awsConfig');
const path = require('path');

// Get all bookings
// Update getAllBookings function
// const getAllBookings = async (req, res) => {
//   try {
//     const bookings = await Booking.find()
//       .select('crm_booking_id company_name contact_person email phone services total_amount payment_date bdm branch_name closed_by state current_stage stages createdAt updatedAt')
//       .sort({ createdAt: -1 }); // -1 means descending (newest first)
    
//     res.json(bookings);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching bookings', error });
//   }
// };




const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .select('crm_booking_id company_name contact_person email phone services current_stage stages booking_date createdAt updatedAt total_amount received_amount pending_amount bdm branch_name closed_by pan gst state status')
      .sort({ booking_date: -1 }); // ⭐ Sort by booking_date
    
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error });
  }
};


// Get single booking details
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching booking', error });
  }
};

// Move booking to next stage
const moveToNextStage = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const stages = ['agreement', 'pitchdeck', 'dpr', 'application', 'others'];
    const currentIndex = stages.indexOf(booking.current_stage);
    
    if (currentIndex < stages.length - 1) {
      const nextStage = stages[currentIndex + 1];
      booking.current_stage = nextStage;
      booking.stages[nextStage].done = true;
      booking.stages[nextStage].doneAt = new Date();

      booking.auditLogs.push({
        action: 'STAGE_MOVED',
        user: req.session.username,
        stage: nextStage,
        meta: { from: stages[currentIndex], to: nextStage },
      });

      await booking.save();
      res.json({ message: 'Stage updated', booking });
    } else {
      res.status(400).json({ message: 'Already at final stage' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating stage', error });
  }
};

// Add note
const addNote = async (req, res) => {
  try {
    const { stage, message } = req.body;
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.notes.push({
      stage,
      message,
      author: req.session.username,
    });

    booking.auditLogs.push({
      action: 'NOTE_ADDED',
      user: req.session.username,
      stage,
      meta: { message: message.substring(0, 50) },
    });

    await booking.save();
    res.json({ message: 'Note added', booking });
  } catch (error) {
    res.status(500).json({ message: 'Error adding note', error });
  }
};

// Upload file
// const uploadFile = async (req, res) => {
//   try {
//     // Validate file exists
//     if (!req.file) {
//       return res.status(400).json({ message: 'No file provided' });
//     }

//     const { stage, note } = req.body;

//     // Validate stage
//     const validStages = ['agreement', 'pitchdeck', 'dpr', 'application', 'others'];
//     if (!validStages.includes(stage)) {
//       return res.status(400).json({ message: 'Invalid stage' });
//     }

//     // Get booking
//     const booking = await Booking.findById(req.params.id);
//     if (!booking) {
//       return res.status(404).json({ message: 'Booking not found' });
//     }

//     // Validate file type
//     const allowedMimes = [
//       'application/pdf',
//       'application/msword',
//       'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//       'image/jpeg',
//       'image/png',
//     ];

//     if (!allowedMimes.includes(req.file.mimetype)) {
//       return res.status(400).json({ 
//         message: 'Invalid file type. Allowed: PDF, DOCX, JPG, PNG' 
//       });
//     }

//     // Validate file size (max 50MB for S3)
//     const maxSize = 50 * 1024 * 1024;
//     if (req.file.size > maxSize) {
//       return res.status(400).json({ message: 'File too large (max 50MB)' });
//     }

//     // Create S3 key (path in bucket)
//     const timestamp = Date.now();
//     const filename = `${req.params.id}/${stage}/${timestamp}-${req.file.originalname}`;

//     console.log(`📤 Uploading to S3: ${filename}`);

//     // Upload to S3
//     const params = {
//       Bucket: process.env.AWS_S3_BUCKET,
//       Key: filename,
//       Body: req.file.buffer,
//       ContentType: req.file.mimetype,
//       // ACL: 'public-read', // Make publicly readable
//     };

//     const s3Response = await s3.upload(params).promise();
//     const fileUrl = s3Response.Location;

//     console.log(`✅ File uploaded: ${fileUrl}`);

//     // Save metadata to MongoDB
//     booking.attachments.push({
//       filename: req.file.originalname,
//       url: fileUrl,
//       stage,
//       uploadedBy: req.session.username,
//       note: note || '',
//     });

//      // ⭐ NEW: Mark stage as completed when first file is uploaded
//     if (!booking.stages[stage].done) {
//       booking.stages[stage].done = true;
//       booking.stages[stage].doneAt = new Date();
//       console.log(`✅ Stage ${stage} marked as completed`);
//     }


//     // Log action
//     booking.auditLogs.push({
//       action: 'FILE_UPLOADED',
//       user: req.session.username,
//       stage,
//       timestamp: new Date(),
//       meta: {
//         filename: req.file.originalname,
//         filesize: req.file.size,
//         s3Key: filename,
//         url: fileUrl,
//       },
//     });

//     await booking.save();

//     res.json({
//       message: 'File uploaded successfully',
//       file: {
//         filename: req.file.originalname,
//         url: fileUrl,
//         size: req.file.size,
//         uploadedBy: req.session.username,
//         uploadedAt: new Date(),
//       },
//       booking,
//     });

//   } catch (error) {
//     console.error('❌ File upload error:', error);
//     res.status(500).json({
//       message: 'Error uploading file',
//       error: error.message,
//     });
//   }
// };



const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    const { stage, note } = req.body;

    // Validate stage
    const validStages = ['agreement', 'pitchdeck', 'dpr', 'application', 'others'];
    if (!validStages.includes(stage)) {
      return res.status(400).json({ message: 'Invalid stage' });
    }

    // Get booking
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Validate file type
    const allowedMimes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
    ];

    if (!allowedMimes.includes(req.file.mimetype)) {
      return res.status(400).json({ 
        message: 'Invalid file type. Allowed: PDF, DOCX, JPG, PNG' 
      });
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024;
    if (req.file.size > maxSize) {
      return res.status(400).json({ message: 'File too large (max 50MB)' });
    }

    // Create S3 key
    const timestamp = Date.now();
    const filename = `${req.params.id}/${stage}/${timestamp}-${req.file.originalname}`;

    console.log(`📤 Uploading to S3: ${filename}`);

    // Upload to S3
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: filename,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
      // ACL: 'public-read',
    };

    const s3Response = await s3.upload(params).promise();
    const fileUrl = s3Response.Location;

    console.log(`✅ File uploaded: ${fileUrl}`);

    // Save metadata to MongoDB
    booking.attachments.push({
      filename: req.file.originalname,
      url: fileUrl,
      stage,
      uploadedBy: req.session.username,
      note: note || '',
    });

    // ⭐ NEW: Mark stage as completed when first file is uploaded
    if (!booking.stages[stage].done) {
      booking.stages[stage].done = true;
      booking.stages[stage].doneAt = new Date();
      console.log(`✅ Stage ${stage} marked as completed`);
    }

    // Log action
    booking.auditLogs.push({
      action: 'FILE_UPLOADED',
      user: req.session.username,
      stage,
      timestamp: new Date(),
      meta: {
        filename: req.file.originalname,
        filesize: req.file.size,
        s3Key: filename,
        url: fileUrl,
        stageCompleted: booking.stages[stage].done,
      },
    });

    await booking.save();

    res.json({
      message: 'File uploaded successfully',
      file: {
        filename: req.file.originalname,
        url: fileUrl,
        size: req.file.size,
        uploadedBy: req.session.username,
        uploadedAt: new Date(),
      },
      booking,
    });

  } catch (error) {
    console.error('❌ File upload error:', error);
    res.status(500).json({
      message: 'Error uploading file',
      error: error.message,
    });
  }
};

// 4. OPTIONAL: Delete file from S3
// ============================================

// const deleteFile = async (req, res) => {
//   try {
//     const { attachmentId } = req.params;
//     const booking = await Booking.findById(req.params.id);

//     if (!booking) {
//       return res.status(404).json({ message: 'Booking not found' });
//     }

//     // Find attachment
//     const attachment = booking.attachments.id(attachmentId);
//     if (!attachment) {
//       return res.status(404).json({ message: 'File not found' });
//     }

//     // Extract S3 key from URL
//     const url = attachment.url;
//     const s3Key = url.split('.com/')[1];

//     console.log(`🗑️ Deleting from S3: ${s3Key}`);

//     // Delete from S3
//     await s3.deleteObject({
//       Bucket: process.env.AWS_S3_BUCKET,
//       Key: s3Key,
//     }).promise();

//     console.log('✅ File deleted from S3');

//   // Remove from MongoDB
//   // Some Mongoose environments may not expose a `.remove()` helper on subdocs
//   // (or the document may have been converted to a plain object). Use a
//   // resilient array filter to remove the attachment by _id instead.
//   booking.attachments = booking.attachments.filter((att) => String(att._id) !== String(attachmentId));

//     // Log action
//     booking.auditLogs.push({
//       action: 'FILE_DELETED',
//       user: req.session.username,
//       timestamp: new Date(),
//       meta: {
//         filename: attachment.filename,
//         s3Key: s3Key,
//       },
//     });

//     await booking.save();

//     res.json({ message: 'File deleted successfully', booking });

//   } catch (error) {
//     console.error('❌ File deletion error:', error);
//     res.status(500).json({
//       message: 'Error deleting file',
//       error: error.message,
//     });
//   }
// };








// const deleteFile = async (req, res) => {
//   try {
//     const { attachmentId } = req.params;
//     const booking = await Booking.findById(req.params.id);

//     if (!booking) {
//       return res.status(404).json({ message: 'Booking not found' });
//     }

//     const attachment = booking.attachments.id(attachmentId);
//     if (!attachment) {
//       return res.status(404).json({ message: 'File not found' });
//     }

//     const deletedStage = attachment.stage;

//     // Extract S3 key from URL
//     const url = attachment.url;
//     const s3Key = url.split('.com/')[1];

//     // Delete from S3
//     await s3.deleteObject({
//       Bucket: process.env.AWS_S3_BUCKET,
//       Key: s3Key,
//     }).promise();

//     // Remove from MongoDB
//     // booking.attachments.id(attachmentId).remove();
//     booking.attachments = booking.attachments.filter((att) => String(att._id) !== String(attachmentId));

//     // ⭐ NEW: Check if this was the last file in this stage
//     const remainingFilesInStage = booking.attachments.filter(
//       file => file.stage === deletedStage
//     );

//     if (remainingFilesInStage.length === 0) {
//       // No more files in this stage - mark stage as incomplete
//       booking.stages[deletedStage].done = false;
//       booking.stages[deletedStage].doneAt = null;
      
//       // ⭐ Move current_stage back if needed
//       const STAGES = ['agreement', 'pitchdeck', 'dpr', 'application', 'others'];
//       const deletedStageIndex = STAGES.indexOf(deletedStage);
//       const currentStageIndex = STAGES.indexOf(booking.current_stage);
      
//       // If deleted stage is before current stage, move current stage back
//       if (deletedStageIndex < currentStageIndex) {
//         booking.current_stage = deletedStage;
//       }
//     }

//     // Log action
//     booking.auditLogs.push({
//       action: 'FILE_DELETED',
//       user: req.session.username,
//       timestamp: new Date(),
//       meta: { 
//         filename: attachment.filename, 
//         s3Key,
//         stage: deletedStage,
//         stageResetToPending: remainingFilesInStage.length === 0
//       },
//     });

//     await booking.save();

//     res.json({ 
//       message: 'File deleted successfully', 
//       booking,
//       stageReset: remainingFilesInStage.length === 0
//     });

//   } catch (error) {
//     console.error('File deletion error:', error);
//     res.status(500).json({ message: 'Error deleting file', error: error.message });
//   }
// };










const deleteFile = async (req, res) => {
  try {
    const { attachmentId } = req.params;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const attachment = booking.attachments.id(attachmentId);
    if (!attachment) {
      return res.status(404).json({ message: 'File not found' });
    }

    const deletedStage = attachment.stage;

    // Extract S3 key from URL
    const url = attachment.url;
    const s3Key = url.split('.com/')[1];

    console.log(`🗑️ Deleting from S3: ${s3Key}`);

    // Delete from S3
    await s3.deleteObject({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: s3Key,
    }).promise();

    console.log('✅ File deleted from S3');

    // Remove from MongoDB
    // booking.attachments.id(attachmentId).remove();
    booking.attachments = booking.attachments.filter((att) => String(att._id) !== String(attachmentId));

    // ⭐ Check if this was the last file in this stage
    const remainingFilesInStage = booking.attachments.filter(
      file => file.stage === deletedStage
    );

    console.log(`📊 Remaining files in ${deletedStage}: ${remainingFilesInStage.length}`);

    if (remainingFilesInStage.length === 0) {
      // ⭐ Mark stage as incomplete
      booking.stages[deletedStage].done = false;
      booking.stages[deletedStage].doneAt = null;
      console.log(`⚪ Stage ${deletedStage} marked as incomplete`);
      
      // Move current_stage back if needed
      const STAGES = ['agreement', 'pitchdeck', 'dpr', 'application', 'others'];
      const deletedStageIndex = STAGES.indexOf(deletedStage);
      const currentStageIndex = STAGES.indexOf(booking.current_stage);
      
      if (deletedStageIndex < currentStageIndex) {
        booking.current_stage = deletedStage;
        console.log(`↩️ Current stage moved back to: ${deletedStage}`);
      }
    }

    // Log action
    booking.auditLogs.push({
      action: 'FILE_DELETED',
      user: req.session.username,
      timestamp: new Date(),
      meta: { 
        filename: attachment.filename, 
        s3Key,
        stage: deletedStage,
        stageResetToPending: remainingFilesInStage.length === 0,
      },
    });

    await booking.save();

    res.json({ 
      message: 'File deleted successfully', 
      booking,
      stageReset: remainingFilesInStage.length === 0
    });

  } catch (error) {
    console.error('❌ File deletion error:', error);
    res.status(500).json({ message: 'Error deleting file', error: error.message });
  }
};


const toggleStageRequirement = async (req, res) => {
  try {
    const { stage } = req.body; // 'pitchdeck' or 'dpr'
    
    if (!['pitchdeck', 'dpr'].includes(stage)) {
      return res.status(400).json({ message: 'Can only toggle pitchdeck or dpr' });
    }
    
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Toggle required flag
    booking.stages[stage].required = !booking.stages[stage].required;
    
    // Log action
    booking.auditLogs.push({
      action: 'STAGE_REQUIREMENT_TOGGLED',
      user: req.session.username,
      stage,
      meta: { 
        required: booking.stages[stage].required,
        message: booking.stages[stage].required 
          ? `${stage} is now required` 
          : `${stage} is now optional (skipped)`
      },
    });

    await booking.save();

    res.json({ 
      message: `${stage} requirement updated`, 
      booking 
    });

  } catch (error) {
    console.error('Toggle stage requirement error:', error);
    res.status(500).json({ message: 'Error updating stage requirement', error: error.message });
  }
};

// Get dashboard metrics
const getDashboard = async (req, res) => {
  try {
    const total = await Booking.countDocuments();
    const agreement = await Booking.countDocuments({ 'stages.agreement.done': true });
    const pitchdeck = await Booking.countDocuments({ 'stages.pitchdeck.done': true });
    const dpr = await Booking.countDocuments({ 'stages.dpr.done': true });
    const application = await Booking.countDocuments({ 'stages.application.done': true });
    const others = await Booking.countDocuments({ 'stages.others.done': true });

    res.json({
      totalBookings: total,
      stageMetrics: {
        agreement,
        pitchdeck,
        dpr,
        application,
        others,
      },
      completedBookings: others, // Bookings completed all stages
      pendingApprovals: await Booking.countDocuments({
        $or: [
          { 'stages.agreement.approved': false },
          { 'stages.pitchdeck.approved': false },
        ],
      }),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard', error });
  }
};

module.exports = {
  getAllBookings,
  getBookingById,
  moveToNextStage,
  addNote,
  uploadFile,
  deleteFile,
  toggleStageRequirement,
  getDashboard,
};