// backend/models/Booking.js
const mongoose = require('mongoose');

// const bookingSchema = new mongoose.Schema(
//   {
//     crm_booking_id: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     company_name: String,
//     contact_person: String,
//     email: String,
//     phone: String,
//     services: [String],
    
//     // Stage tracking
//     current_stage: {
//       type: String,
//       enum: ['agreement', 'pitchdeck', 'dpr', 'application', 'others'],
//       default: 'agreement',
//     },
    
//     stages: {
//       agreement: {
//         done: { type: Boolean, default: false },
//         doneAt: Date,
//         approved: { type: Boolean, default: false },
//       },
//       pitchdeck: {
//         done: { type: Boolean, default: false },
//         doneAt: Date,
//         approved: { type: Boolean, default: false },
//       },
//       dpr: {
//         done: { type: Boolean, default: false },
//         doneAt: Date,
//         approved: { type: Boolean, default: false },
//       },
//       application: {
//         done: { type: Boolean, default: false },
//         doneAt: Date,
//         approved: { type: Boolean, default: false },
//       },
//       others: {
//         done: { type: Boolean, default: false },
//         doneAt: Date,
//         approved: { type: Boolean, default: false },
//       },
//     },
    
//     // Attachments (files)
//     attachments: [
//       {
//         filename: String,
//         url: String,
//         stage: String,
//         uploadedBy: String,
//         uploadedAt: { type: Date, default: Date.now },
//         note: String,
//       },
//     ],
    
//     // Notes/Comments
//     notes: [
//       {
//         stage: String,
//         message: String,
//         author: String,
//         createdAt: { type: Date, default: Date.now },
//       },
//     ],
    
//     // Audit logs
//     auditLogs: [
//       {
//         action: String,
//         user: String,
//         stage: String,
//         timestamp: { type: Date, default: Date.now },
//         meta: mongoose.Schema.Types.Mixed,
//       },
//     ],
//   },
//   { timestamps: true }
// );

// // Add index for sorting by creation date (newest first)
// bookingSchema.index({ createdAt: -1 });

// module.exports = mongoose.model('Booking', bookingSchema);













// const bookingSchema = new mongoose.Schema(
//   {
//     crm_booking_id: {
//       type: String,
//       required: true,
//       unique: true,
//     },
    
//     // Basic Info
//     company_name: String,
//     contact_person: String,
//     email: String,
//     phone: String,
//     services: [String],

//     // ⭐ NEW: Booking date from CRM
//     booking_date: { type: Date, default: Date.now },
    
//     // Financial Details (NEW)
//     total_amount: { type: Number, default: 0 },
//     received_amount: { type: Number, default: 0 },
//     pending_amount: { type: Number, default: 0 },
//     term_1: { type: Number, default: 0 },
//     term_2: { type: Number, default: null },
//     term_3: { type: Number, default: null },
    
//     // Payment Dates (NEW)
//     payment_date: Date,
//     term_1_payment_date: Date,
//     term_2_payment_date: Date,
//     term_3_payment_date: Date,
    
//     // Additional Info (NEW)
//     bdm: String,
//     branch_name: String,
//     closed_by: String,
//     pan: String,
//     gst: String,
//     bank_name: String,
//     remark: String,
//     state: String,
//     status: { type: String, default: 'Pending' },
    
//     // Stage tracking
//     current_stage: {
//       type: String,
//       enum: ['agreement', 'pitchdeck', 'dpr', 'application', 'others'],
//       default: 'agreement',
//     },
    
//     stages: {
//       agreement: {
//         done: { type: Boolean, default: false },
//         doneAt: Date,
//         approved: { type: Boolean, default: false },
//       },
//       pitchdeck: {
//         done: { type: Boolean, default: false },
//         doneAt: Date,
//         approved: { type: Boolean, default: false },
//       },
//       dpr: {
//         done: { type: Boolean, default: false },
//         doneAt: Date,
//         approved: { type: Boolean, default: false },
//       },
//       application: {
//         done: { type: Boolean, default: false },
//         doneAt: Date,
//         approved: { type: Boolean, default: false },
//       },
//       others: {
//         done: { type: Boolean, default: false },
//         doneAt: Date,
//         approved: { type: Boolean, default: false },
//       },
//     },
    
//     attachments: [
//       {
//         filename: String,
//         url: String,
//         stage: String,
//         uploadedBy: String,
//         uploadedAt: { type: Date, default: Date.now },
//         note: String,
//       },
//     ],
    
//     notes: [
//       {
//         stage: String,
//         message: String,
//         author: String,
//         createdAt: { type: Date, default: Date.now },
//       },
//     ],
    
//     auditLogs: [
//       {
//         action: String,
//         user: String,
//         stage: String,
//         timestamp: { type: Date, default: Date.now },
//         meta: mongoose.Schema.Types.Mixed,
//       },
//     ],
//   },
//   { timestamps: true }
// );

// // Add index for sorting
// bookingSchema.index({ createdAt: -1 });

// module.exports = mongoose.model('Booking', bookingSchema);











const bookingSchema = new mongoose.Schema(
  {
    crm_booking_id: {
      type: String,
      required: true,
      unique: true,
    },
    
    // Basic Info
    company_name: String,
    contact_person: String,
    email: String,
    phone: String,
    services: [String],
    
    // ⭐ NEW: Booking date from CRM
    booking_date: { type: Date, default: Date.now },
    
    // Financial Details
    total_amount: { type: Number, default: 0 },
    received_amount: { type: Number, default: 0 },
    pending_amount: { type: Number, default: 0 },
    term_1: { type: Number, default: 0 },
    term_2: { type: Number, default: null },
    term_3: { type: Number, default: null },
    
    // Payment Dates
    payment_date: Date,
    term_1_payment_date: Date,
    term_2_payment_date: Date,
    term_3_payment_date: Date,
    
    // Additional Info
    bdm: String,
    branch_name: String,
    closed_by: String,
    pan: String,
    gst: String,
    bank_name: String,
    remark: String,
    state: String,
    status: { type: String, default: 'Pending' },
    
    // Stage tracking
    current_stage: {
      type: String,
      enum: ['agreement', 'pitchdeck', 'dpr', 'application', 'others'],
      default: 'agreement',
    },
    
    stages: {
      agreement: {
        done: { type: Boolean, default: false },
        doneAt: Date,
        approved: { type: Boolean, default: false },
      },
      pitchdeck: {
        done: { type: Boolean, default: false },
        doneAt: Date,
        approved: { type: Boolean, default: false },
        required: { type: Boolean, default: true }, // ⭐ NEW
      },
      dpr: {
        done: { type: Boolean, default: false },
        doneAt: Date,
        approved: { type: Boolean, default: false },
        required: { type: Boolean, default: true }, // ⭐ NEW
      },
      application: {
        done: { type: Boolean, default: false },
        doneAt: Date,
        approved: { type: Boolean, default: false },
      },
      others: {
        done: { type: Boolean, default: false },
        doneAt: Date,
        approved: { type: Boolean, default: false },
      },
    },
    
    attachments: [
      {
        filename: String,
        url: String,
        stage: String,
        uploadedBy: String,
        uploadedAt: { type: Date, default: Date.now },
        note: String,
      },
    ],
    
    notes: [
      {
        stage: String,
        message: String,
        author: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    
    auditLogs: [
      {
        action: String,
        user: String,
        stage: String,
        timestamp: { type: Date, default: Date.now },
        meta: mongoose.Schema.Types.Mixed,
      },
    ],
  },
  { timestamps: true }
);

// ⭐ Index by booking_date (not createdAt)
bookingSchema.index({ booking_date: -1 });

module.exports = mongoose.model('Booking', bookingSchema);