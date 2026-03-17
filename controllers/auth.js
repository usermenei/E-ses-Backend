const User = require('../models/User');


// ===============================
// Helper: Send Token Response
// ===============================
const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    if (process.env.NODE_ENV === 'production') options.secure = true;

    res.status(statusCode).cookie('token', token, options).json({ success: true, token });
};


// ===============================
// Rank Calculator
// ===============================
const calculateRank = (entries) => {
    if (entries >= 500) return { rank: 6, title: 'Grandmaster', discount: 90 };
    if (entries >= 100) return { rank: 5, title: 'Legend',      discount: 50 };
    if (entries >= 25)  return { rank: 4, title: 'Diamond',     discount: 25 };
    if (entries >= 10)  return { rank: 3, title: 'Gold',        discount: 10 };
    if (entries >= 5)   return { rank: 2, title: 'Silver',      discount: 5  };
    if (entries >= 1)   return { rank: 1, title: 'Bronze',      discount: 0  };
    return                     { rank: 0, title: 'Newbie',      discount: 0  };
};


// ===============================
// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
// ===============================
exports.register = async (req, res, next) => {
    try {
        const { name, email, telephoneNumber, password, role } = req.body;

        const user = await User.create({ name, email, telephoneNumber, password, role });

        sendTokenResponse(user, 201, res);

    } catch (err) {
        console.error(err);

        if (err.code === 11000) {
            return res.status(400).json({ success: false, message: 'Duplicate field value entered. Email already exists.' });
        }

        return res.status(400).json({ success: false, message: err.message || 'Registration failed' });
    }
};


// ===============================
// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
// ===============================
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide an email and password' });
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        sendTokenResponse(user, 200, res);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};


// ===============================
// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
// ===============================
exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const rankData = calculateRank(user.numberOfEntries || 0);

        return res.status(200).json({
            success: true,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                telephoneNumber: user.telephoneNumber,
                numberOfEntries: user.numberOfEntries,
                profilePicture: user.profilePicture,
                rank: rankData.rank,
                title: rankData.title,
                discount: `${rankData.discount}%`
            }
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};


// ===============================
// @desc    Logout user
// @route   GET /api/v1/auth/logout
// @access  Private
// ===============================
exports.logout = async (req, res, next) => {
    try {
        res.cookie('token', 'none', {
            expires: new Date(Date.now() + 10 * 1000),
            httpOnly: true
        });

        return res.status(200).json({ success: true, message: 'Logged out successfully' });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Logout failed' });
    }
};


// ===============================
// @desc    Update profile picture (Google Drive URL)
// @route   PUT /api/v1/auth/me/photo
// @access  Private
// ===============================
exports.updateProfilePicture = async (req, res, next) => {
    try {
        const { profilePicture } = req.body;

        if (!profilePicture) {
            return res.status(400).json({ success: false, message: 'Please provide a picture URL' });
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { profilePicture },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        return res.status(200).json({ success: true, data: { profilePicture: user.profilePicture } });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};