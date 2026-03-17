const express = require('express');

const {
    getCoworkingspaces,
    getCoworkingspace,
    createCoworkingspace,
    updateCoworkingspace,
    deleteCoworkingspace,
    updateCoworkingspacePhoto
} = require('../controllers/coworkingspaces');

const reservationRouter = require('./reservations');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.use('/:coworkingspaceId/reservations', reservationRouter);

router
    .route('/')
    .get(getCoworkingspaces)
    .post(protect, authorize('admin'), createCoworkingspace);

router
    .route('/:id')
    .get(getCoworkingspace)
    .put(protect, authorize('admin'), updateCoworkingspace)
    .delete(protect, authorize('admin'), deleteCoworkingspace);

router
    .route('/:id/photo')
    .put(protect, authorize('admin'), updateCoworkingspacePhoto);

module.exports = router;