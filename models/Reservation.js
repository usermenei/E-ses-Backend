const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
    apptDate: {
        type: Date,
        required: true
    },
    apptEndDate: {   // ✅ เพิ่มฟิลด์นี้เข้ามาสำหรับเวลาสิ้นสุด
        type: Date,
        required: true 
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    coworkingSpace: {   // field referencing CoworkingSpace
        type: mongoose.Schema.ObjectId,
        ref: 'CoworkingSpace',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['pending', 'success', 'cancelled'],
        default: 'pending'
    }
});

// สร้าง Index เพื่อให้ค้นหาได้เร็วขึ้นแบบติดจรวด!
ReservationSchema.index({ user: 1, status: 1, apptDate: 1, apptEndDate: 1 });

module.exports = mongoose.model('Reservation', ReservationSchema);