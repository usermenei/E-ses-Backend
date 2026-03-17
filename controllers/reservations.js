const Reservation = require('../models/Reservation');
const Coworkingspace = require('../models/Coworkingspace');
const User = require('../models/User');


// =====================================================
// Helper: Handle Common Errors
// =====================================================
const handleError = (err, res) => {
    console.error(err);

    // Duplicate key error
    if (err.code === 11000) {
        return res.status(400).json({
            success: false,
            message: "Duplicate field value entered."
        });
    }

    // Validation error (Mongoose)
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }

    return res.status(500).json({
        success: false,
        message: "Server error"
    });
};


// =====================================================
// @desc    Get all reservations
// =====================================================
exports.getReservations = async (req, res, next) => {
    try {
        let query;

        if (req.user.role !== 'admin') {

            // regular users only see their own reservations; if scoped to a space, restrict to that space
            const filter = { user: req.user.id };
            if (req.params.coworkingspaceId) {
                filter.coworkingSpace = req.params.coworkingspaceId;
            }

            query = Reservation.find(filter)
                .populate({
                    path: 'coworkingSpace',
                    select: 'name address tel openTime closeTime'
                });

        } else {

            if (req.params.coworkingspaceId) {
                query = Reservation.find({
                    coworkingSpace: req.params.coworkingspaceId
                }).populate({
                    path: 'coworkingSpace',
                    select: 'name address tel openTime closeTime'
                });
            } else {
                query = Reservation.find()
                    .populate({
                        path: 'coworkingSpace',
                        select: 'name address openTime closeTime'
                    });
            }
        }

        const reservations = await query;

        return res.status(200).json({
            success: true,
            count: reservations.length,
            data: reservations
        });

    } catch (err) {
        return handleError(err, res);
    }
};


// =====================================================
// @desc    Get single reservation
// =====================================================
exports.getReservation = async (req, res, next) => {
    try {
        const reservation = await Reservation.findById(req.params.id)
            .populate({
                path: 'coworkingSpace',
                select: 'name address telephoneNumber openTime closeTime'
            });

        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: "Reservation not found"
            });
        }

        if (
            reservation.user.toString() !== req.user.id &&
            req.user.role !== 'admin'
        ) {
            return res.status(403).json({
                success: false,
                message: "Not authorized"
            });
        }

        return res.status(200).json({
            success: true,
            data: reservation
        });

    } catch (err) {
        return handleError(err, res);
    }
};


// =====================================================
// @desc    Add reservation
// =====================================================
exports.addReservation = async (req, res, next) => {
    try {
        // ensure authenticated user has a role
        if (!req.user || !req.user.role) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to create a reservation'
            });
        }

        req.body.coworkingSpace = req.params.coworkingspaceId;
        req.body.user = req.user.id;
        req.body.status = 'pending';

        const coworkingspace = await Coworkingspace.findById(
            req.params.coworkingspaceId
        );

        if (!coworkingspace) {
            return res.status(404).json({
                success: false,
                message: "Coworking space not found"
            });
        }

        // Limit 3 reservations (normal user)
        if (req.user.role !== 'admin') {

            const userReservations = await Reservation.countDocuments({
                user: req.user.id
            });

            if (userReservations >= 3) {
                return res.status(400).json({
                    success: false,
                    message: "User already has 3 reservations"
                });
            }
        }

        const reservation = await Reservation.create(req.body);

        return res.status(201).json({
            success: true,
            data: reservation
        });

    } catch (err) {
        return handleError(err, res);
    }
};


// =====================================================
// @desc    Update reservation
// =====================================================
exports.updateReservation = async (req, res, next) => {
    try {
        let reservation = await Reservation.findById(req.params.id);

        // 1️⃣ Check reservation exists
        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: "Reservation not found"
            });
        }

        // 2️⃣ Authorization check
        if (
            reservation.user.toString() !== req.user.id &&
            req.user.role !== 'admin'
        ) {
            return res.status(403).json({
                success: false,
                message: "Not authorized"
            });
        }

        // 3️⃣ Prevent changing owner
        if (req.body.user) {
            delete req.body.user;
        }

        // 4️⃣ Prevent manual success confirmation
        if (req.body.status === 'success') {
            return res.status(400).json({
                success: false,
                message: "Cannot manually set reservation to success"
            });
        }

        // 5️⃣ If coworkingSpace is being updated → validate it exists
        if (req.body.coworkingSpace) {
            const coworkingspace = await Coworkingspace.findById(
                req.body.coworkingSpace
            );

            if (!coworkingspace) {
                return res.status(404).json({
                    success: false,
                    message: "Coworking space not found"
                });
            }
        }

        // 6️⃣ Perform update
        reservation = await Reservation.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        return res.status(200).json({
            success: true,
            data: reservation
        });

    } catch (err) {
        console.error(err);

        // Duplicate key error
        if (err.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Duplicate field value entered."
            });
        }

        // Validation error
        if (err.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }

        // Cast error (invalid Mongo ID)
        if (err.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: "Invalid ID format"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Cannot update reservation"
        });
    }
};

// =====================================================
// @desc    Delete reservation
// =====================================================
exports.deleteReservation = async (req, res, next) => {
    try {
        const reservation = await Reservation.findById(req.params.id);

        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: "Reservation not found"
            });
        }

        if (
            reservation.user.toString() !== req.user.id &&
            req.user.role !== 'admin'
        ) {
            return res.status(403).json({
                success: false,
                message: "Not authorized"
            });
        }

        await reservation.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Reservation deleted successfully"
        });

    } catch (err) {
        return handleError(err, res);
    }
};


// =====================================================
// @desc    Admin confirm reservation
// =====================================================
exports.confirmReservation = async (req, res, next) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Admin only"
            });
        }

        const reservation = await Reservation.findById(req.params.id);

        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: "Reservation not found"
            });
        }

        if (reservation.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: "Reservation is not pending"
            });
        }

        reservation.status = 'success';
        await reservation.save();

        await User.findByIdAndUpdate(reservation.user, {
            $inc: { numberOfEntries: 1 }
        });

        return res.status(200).json({
            success: true,
            message: "Reservation confirmed successfully",
            data: reservation
        });

    } catch (err) {
        return handleError(err, res);
    }
};