const express = require('express');

const {
    getReservations,
    getReservation,
    addReservation,
    updateReservation,
    deleteReservation,
    confirmReservation
} = require('../controllers/reservations');

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../middleware/auth');


// GET all reservations
// POST create reservation
router.route('/')
    .get(protect, getReservations)
    .post(protect, authorize('admin', 'user'), addReservation);


// GET single reservation
// UPDATE reservation
// DELETE reservation
router.route('/:id')
    .get(protect, getReservation)
    .put(protect, authorize('admin', 'user'), updateReservation)
    .delete(protect, authorize('admin', 'user'), deleteReservation);


// 🔥 Admin confirm reservation
router.put(
    '/:id/confirm',
    protect,
    authorize('admin'),
    confirmReservation
);

module.exports = router;