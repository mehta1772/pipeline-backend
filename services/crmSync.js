// backend/services/crmSync.js
const cron = require('node-cron');
const mongoose = require('mongoose');
const Booking = require('../models/Booking');

let crmConnection = null;
let CRMBookingModel = null;

const initializeCRMSync = async () => {
  try {
    // Create separate connection for CRM (read-only)
    crmConnection = mongoose.createConnection(
      process.env.CRM_MONGODB_URI,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    // Define schema for CRM Bookings collection (flexible schema)
    const crmBookingSchema = new mongoose.Schema({}, { strict: false });

    // Get ONLY the bookings collection from CRM
    CRMBookingModel = crmConnection.model(
      'CRMBooking',
      crmBookingSchema,
      'bookings'  // ← This specifies collection name
    );

    console.log('✅ CRM Connection established (read-only)');
    console.log('✅ Connected to: bookings collection only');

    // Run sync every 5 minutes
    cron.schedule('*/5 * * * *', async () => {
      await syncBookingsFromCRM();
    });

    console.log('✅ CRM Sync initialized (every 5 mins)');

    // Sync immediately on startup
    await syncBookingsFromCRM();
  } catch (error) {
    console.error('❌ CRM Sync initialization failed:', error);
  }
};

// const syncBookingsFromCRM = async () => {
//   try {
//     if (!CRMBookingModel) {
//       console.error('❌ CRM Model not initialized');
//       return;
//     }

//     // Fetch ALL bookings from CRM (read-only)
//     const crmBookings = await CRMBookingModel.find().lean();

//     console.log(`\n📥 CRM Sync started: ${new Date().toLocaleTimeString()}`);
//     console.log(`📊 Found ${crmBookings.length} bookings in CRM...`);

//     let created = 0;
//     let updated = 0;

//     for (const crmBooking of crmBookings) {
//       try {
//         // Use MongoDB _id as unique identifier
//         const bookingId = crmBooking._id?.toString();

//         if (!bookingId) {
//           console.warn('⚠️ Booking without _id found, skipping');
//           continue;
//         }

//         // Check if booking already exists
//         const existingBooking = await Booking.findOne({
//           crm_booking_id: bookingId,
//         });

//         // Map CRM fields to BMS Booking
//         const bookingData = {
//           crm_booking_id: bookingId,
//           company_name: crmBooking.company_name || 'N/A',
//           contact_person: crmBooking.contact_person || 'N/A',
//           email: crmBooking.email || '',
//           phone: crmBooking.contact_no || crmBooking.phone || '',
//           services: crmBooking.services || [],
//           // Keep existing BMS-specific data if updating
//           current_stage: existingBooking?.current_stage || 'agreement',
//           stages: existingBooking?.stages || {
//             agreement: { done: false, doneAt: null, approved: false },
//             pitchdeck: { done: false, doneAt: null, approved: false },
//             dpr: { done: false, doneAt: null, approved: false },
//             application: { done: false, doneAt: null, approved: false },
//             others: { done: false, doneAt: null, approved: false },
//           },
//         };

//         if (existingBooking) {
//           // Update existing booking (keep BMS-specific data)
//           await Booking.findByIdAndUpdate(existingBooking._id, bookingData);
//           updated++;
//         } else {
//           // Create new booking
//           await Booking.create(bookingData);
//           created++;
//         }
//       } catch (error) {
//         console.error(`❌ Error syncing booking:`, error.message);
//       }
//     }

//     console.log(`✅ CRM Sync completed:`);
//     console.log(`   • Created: ${created} new bookings`);
//     console.log(`   • Updated: ${updated} existing bookings`);
//     console.log(`   • Total: ${created + updated} bookings in BMS\n`);
//   } catch (error) {
//     console.error('❌ CRM Sync error:', error);
//   }
// };






// const syncBookingsFromCRM = async () => {
//   try {
//     if (!CRMBookingModel) {
//       console.error('❌ CRM Model not initialized');
//       return;
//     }

//     const crmBookings = await CRMBookingModel.find().lean();

//     console.log(`\n📥 CRM Sync started: ${new Date().toLocaleTimeString()}`);
//     console.log(`📊 Found ${crmBookings.length} bookings in CRM...`);

//     let created = 0;
//     let updated = 0;

//     for (const crmBooking of crmBookings) {
//       try {
//         const bookingId = crmBooking._id?.toString();

//         if (!bookingId) {
//           console.warn('⚠️ Booking without _id found, skipping');
//           continue;
//         }

//         const existingBooking = await Booking.findOne({
//           crm_booking_id: bookingId,
//         });

//         // Map ALL CRM fields to BMS Booking
//         const bookingData = {
//           crm_booking_id: bookingId,
          
//           // Basic Info
//           company_name: crmBooking.company_name || crmBooking.user_name || 'N/A',
//           contact_person: crmBooking.contact_person || crmBooking.user_name || 'N/A',
//           email: crmBooking.email || '',
//           phone: crmBooking.contact_no || crmBooking.phone || '',
          
//           // Services
//           services: Array.isArray(crmBooking.services) 
//             ? crmBooking.services 
//             : crmBooking.services 
//             ? [crmBooking.services] 
//             : [],
          
//           // Financial Details
//           total_amount: crmBooking.total_amount || 0,
//           received_amount: crmBooking.received_amount || 0,
//           pending_amount: crmBooking.pending_amount || 0,
//           term_1: crmBooking.term_1 || 0,
//           term_2: crmBooking.term_2 || null,
//           term_3: crmBooking.term_3 || null,
          
//           // Payment Dates
//           payment_date: crmBooking.payment_date || crmBooking.term_1_payment_date || null,
//           term_1_payment_date: crmBooking.term_1_payment_date || null,
//           term_2_payment_date: crmBooking.term_2_payment_date || null,
//           term_3_payment_date: crmBooking.term_3_payment_date || null,
          
//           // Additional Info
//           bdm: crmBooking.bdm || crmBooking.bdm_name || '',
//           branch_name: crmBooking.branch_name || '',
//           closed_by: crmBooking.closed_by || crmBooking.lead_closed_by || '',
//           pan: crmBooking.pan || '',
//           gst: crmBooking.gst || '',
//           bank_name: crmBooking.bank || '',
//           remark: crmBooking.remark || crmBooking.notes || '',
//           state: crmBooking.state || '',
//           status: crmBooking.status || 'Pending',
          
//           // Keep existing BMS-specific data if updating
//           current_stage: existingBooking?.current_stage || 'agreement',
//           stages: existingBooking?.stages || {
//             agreement: { done: false, doneAt: null, approved: false },
//             pitchdeck: { done: false, doneAt: null, approved: false },
//             dpr: { done: false, doneAt: null, approved: false },
//             application: { done: false, doneAt: null, approved: false },
//             others: { done: false, doneAt: null, approved: false },
//           },
//         };

//         if (existingBooking) {
//           await Booking.findByIdAndUpdate(existingBooking._id, bookingData);
//           updated++;
//         } else {
//           await Booking.create(bookingData);
//           created++;
//         }
//       } catch (error) {
//         console.error(`❌ Error syncing booking:`, error.message);
//       }
//     }

//     console.log(`✅ CRM Sync completed:`);
//     console.log(`   • Created: ${created} new bookings`);
//     console.log(`   • Updated: ${updated} existing bookings`);
//     console.log(`   • Total: ${created + updated} bookings in BMS\n`);
//   } catch (error) {
//     console.error('❌ CRM Sync error:', error);
//   }
// };

// module.exports = { initializeCRMSync };








const syncBookingsFromCRM = async () => {
  try {
    if (!CRMBookingModel) {
      console.error('❌ CRM Model not initialized');
      return;
    }

    const crmBookings = await CRMBookingModel.find().lean();

    console.log(`\n📥 CRM Sync started: ${new Date().toLocaleTimeString()}`);
    console.log(`📊 Found ${crmBookings.length} bookings in CRM...`);

    let created = 0;
    let updated = 0;

    for (const crmBooking of crmBookings) {
      try {
        const bookingId = crmBooking._id?.toString();

        if (!bookingId) {
          console.warn('⚠️ Booking without _id found, skipping');
          continue;
        }

        const existingBooking = await Booking.findOne({
          crm_booking_id: bookingId,
        });

        // Map ALL CRM fields to BMS Booking
        const bookingData = {
          crm_booking_id: bookingId,
          
          // Basic Info
          company_name: crmBooking.company_name || crmBooking.user_name || 'N/A',
          contact_person: crmBooking.contact_person || crmBooking.user_name || 'N/A',
          email: crmBooking.email || '',
          phone: crmBooking.contact_no || crmBooking.phone || '',
          
          // Services
          services: Array.isArray(crmBooking.services) 
            ? crmBooking.services 
            : crmBooking.services 
            ? [crmBooking.services] 
            : [],
          
          // Financial Details
          total_amount: crmBooking.total_amount || 0,
          received_amount: crmBooking.received_amount || 0,
          pending_amount: crmBooking.pending_amount || 0,
          term_1: crmBooking.term_1 || 0,
          term_2: crmBooking.term_2 || null,
          term_3: crmBooking.term_3 || null,
          
          // Payment Dates
          payment_date: crmBooking.payment_date || crmBooking.term_1_payment_date || null,
          term_1_payment_date: crmBooking.term_1_payment_date || null,
          term_2_payment_date: crmBooking.term_2_payment_date || null,
          term_3_payment_date: crmBooking.term_3_payment_date || null,
          
          // Additional Info
          bdm: crmBooking.bdm || crmBooking.bdm_name || '',
          branch_name: crmBooking.branch_name || '',
          closed_by: crmBooking.closed_by || crmBooking.lead_closed_by || '',
          pan: crmBooking.pan || '',
          gst: crmBooking.gst || '',
          bank_name: crmBooking.bank || '',
          remark: crmBooking.remark || crmBooking.notes || '',
          state: crmBooking.state || '',
          status: crmBooking.status || 'Pending',
          
          // ⭐ NEW: Use CRM booking date as createdAt
          booking_date: crmBooking.date || crmBooking.created_at || crmBooking.createdAt || new Date(),
          
          // Keep existing BMS-specific data if updating
          current_stage: existingBooking?.current_stage || 'agreement',
          stages: existingBooking?.stages || {
            agreement: { done: false, doneAt: null, approved: false },
            pitchdeck: { done: false, doneAt: null, approved: false, required: true },
            dpr: { done: false, doneAt: null, approved: false, required: true },
            application: { done: false, doneAt: null, approved: false },
            others: { done: false, doneAt: null, approved: false },
          },
          
          // Preserve existing attachments, notes, audit logs
          attachments: existingBooking?.attachments || [],
          notes: existingBooking?.notes || [],
          auditLogs: existingBooking?.auditLogs || [],
        };

        if (existingBooking) {
          await Booking.findByIdAndUpdate(existingBooking._id, bookingData);
          updated++;
        } else {
          // ⭐ NEW: Set both booking_date and createdAt from CRM
          const newBooking = new Booking(bookingData);
          newBooking.createdAt = bookingData.booking_date;
          await newBooking.save();
          created++;
        }
      } catch (error) {
        console.error(`❌ Error syncing booking:`, error.message);
      }
    }

    console.log(`✅ CRM Sync completed:`);
    console.log(`   • Created: ${created} new bookings`);
    console.log(`   • Updated: ${updated} existing bookings`);
    console.log(`   • Total: ${created + updated} bookings in BMS\n`);
  } catch (error) {
    console.error('❌ CRM Sync error:', error);
  }
};

module.exports = { initializeCRMSync };