const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
    apptDate: {
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

module.exports = mongoose.model('Reservation', ReservationSchema);