/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: User authentication and profile management
 */

/**
 * @swagger
 * tags:
 *   - name: Coworkingspaces
 *     description: Coworking space management API
 */

/**
 * @swagger
 * tags:
 *   - name: Reservations
 *     description: Reservation management API
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 *   schemas:
 *
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - telephoneNumber
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           example: 65d123abc456def789012345
 *         name:
 *           type: string
 *           example: John Doe
 *         email:
 *           type: string
 *           example: johndoe@email.com
 *         telephoneNumber:
 *           type: string
 *           example: 0812345678
 *         role:
 *           type: string
 *           enum: [user, admin]
 *           default: user
 *         numberOfEntries:
 *           type: number
 *           example: 15
 *         profilePicture:
 *           type: string
 *           nullable: true
 *           example: https://drive.google.com/uc?id=YOUR_FILE_ID
 *
 *     Coworkingspace:
 *       type: object
 *       required:
 *         - name
 *         - address
 *         - district
 *         - province
 *         - postalcode
 *         - tel
 *         - region
 *         - openTime
 *         - closeTime
 *       properties:
 *         id:
 *           type: string
 *           example: 65f123abc456def789012345
 *         name:
 *           type: string
 *           example: The Hive Bangkok
 *         address:
 *           type: string
 *           example: 123 ถนนสุขุมวิท
 *         district:
 *           type: string
 *           example: บางนา
 *         province:
 *           type: string
 *           example: กรุงเทพมหานคร
 *         postalcode:
 *           type: string
 *           example: 10260
 *         tel:
 *           type: string
 *           example: 021234567
 *         region:
 *           type: string
 *           example: Bangkok
 *         openTime:
 *           type: string
 *           example: "08:00"
 *         closeTime:
 *           type: string
 *           example: "20:00"
 *         picture:
 *           type: string
 *           nullable: true
 *           example: https://drive.google.com/uc?id=YOUR_FILE_ID
 *         caption:
 *           type: string
 *           example: Our bright and modern main workspace area
 *
 *     Reservation:
 *       type: object
 *       required:
 *         - apptDate
 *         - coworkingSpace
 *       properties:
 *         id:
 *           type: string
 *           example: 65f456abc789def123456789
 *         apptDate:
 *           type: string
 *           format: date-time
 *           example: 2026-03-01T10:00:00.000Z
 *         user:
 *           type: string
 *           example: 65d123abc456def789012345
 *         coworkingSpace:
 *           type: string
 *           example: 65f123abc456def789012345
 *         status:
 *           type: string
 *           enum: [pending, success, cancelled]
 *           example: pending
 *         createdAt:
 *           type: string
 *           format: date-time
 */


// ==========================================
// AUTH
// ==========================================

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - telephoneNumber
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: johndoe@email.com
 *               telephoneNumber:
 *                 type: string
 *                 example: 0812345678
 *               password:
 *                 type: string
 *                 example: password123
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *                 default: user
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid data or duplicate email
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@email.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 *       401:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current logged in user profile with rank info
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     telephoneNumber:
 *                       type: string
 *                     numberOfEntries:
 *                       type: number
 *                     profilePicture:
 *                       type: string
 *                       nullable: true
 *                     rank:
 *                       type: number
 *                       example: 3
 *                     title:
 *                       type: string
 *                       example: Gold
 *                     discount:
 *                       type: string
 *                       example: 10%
 *       401:
 *         description: Not authorized
 */

/**
 * @swagger
 * /auth/me/photo:
 *   put:
 *     summary: Update profile picture with a Google Drive URL
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - profilePicture
 *             properties:
 *               profilePicture:
 *                 type: string
 *                 example: https://drive.google.com/uc?id=YOUR_FILE_ID
 *     responses:
 *       200:
 *         description: Profile picture updated successfully
 *       400:
 *         description: No URL provided
 *       401:
 *         description: Not authorized
 */

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Logout current user
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Logged out successfully
 */


// ==========================================
// COWORKING SPACES
// ==========================================

/**
 * @swagger
 * /coworkingspaces:
 *   get:
 *     summary: Get all coworking spaces
 *     tags: [Coworkingspaces]
 *     parameters:
 *       - in: query
 *         name: select
 *         schema:
 *           type: string
 *         description: Select specific fields (comma separated)
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort fields (comma separated)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of results per page
 *     responses:
 *       200:
 *         description: List of coworking spaces
 */

/**
 * @swagger
 * /coworkingspaces/{id}:
 *   get:
 *     summary: Get a single coworking space by ID
 *     tags: [Coworkingspaces]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Coworking space ID
 *     responses:
 *       200:
 *         description: Coworking space data
 *       404:
 *         description: Coworking space not found
 */

/**
 * @swagger
 * /coworkingspaces:
 *   post:
 *     summary: Create new coworking space (Admin only)
 *     tags: [Coworkingspaces]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Coworkingspace'
 *     responses:
 *       201:
 *         description: Coworking space created successfully
 *       400:
 *         description: Invalid data or duplicate
 *       401:
 *         description: Not authorized
 */

/**
 * @swagger
 * /coworkingspaces/{id}:
 *   put:
 *     summary: Update coworking space by ID (Admin only)
 *     tags: [Coworkingspaces]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Coworkingspace'
 *     responses:
 *       200:
 *         description: Coworking space updated
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Not found
 */

/**
 * @swagger
 * /coworkingspaces/{id}:
 *   delete:
 *     summary: Delete coworking space by ID (Admin only)
 *     tags: [Coworkingspaces]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Coworking space deleted successfully
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Not found
 */

/**
 * @swagger
 * /coworkingspaces/{id}/photo:
 *   put:
 *     summary: Update photo (Google Drive URL) and/or caption (Admin only)
 *     tags: [Coworkingspaces]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Coworking space ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               picture:
 *                 type: string
 *                 example: https://drive.google.com/uc?id=YOUR_FILE_ID
 *               caption:
 *                 type: string
 *                 example: Our bright and modern main workspace area
 *     responses:
 *       200:
 *         description: Photo or caption updated successfully
 *       400:
 *         description: No data provided
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Coworking space not found
 */


// ==========================================
// RESERVATIONS
// ==========================================

/**
 * @swagger
 * /reservations:
 *   get:
 *     summary: Get all reservations (Admin sees all, user sees own)
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of reservations
 *       401:
 *         description: Not authorized
 */

/**
 * @swagger
 * /reservations/{id}:
 *   get:
 *     summary: Get reservation by ID
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reservation data
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - not your reservation
 *       404:
 *         description: Reservation not found
 */

/**
 * @swagger
 * /coworkingspaces/{coworkingspaceId}/reservations:
 *   post:
 *     summary: Create reservation for a coworking space
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: coworkingspaceId
 *         required: true
 *         schema:
 *           type: string
 *         description: Coworking space ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - apptDate
 *             properties:
 *               apptDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-03-01T10:00:00.000Z
 *     responses:
 *       201:
 *         description: Reservation created
 *       400:
 *         description: Reservation limit reached or invalid data
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Coworking space not found
 */

/**
 * @swagger
 * /reservations/{id}:
 *   put:
 *     summary: Update reservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reservation'
 *     responses:
 *       200:
 *         description: Reservation updated
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - not your reservation
 *       404:
 *         description: Reservation not found
 */

/**
 * @swagger
 * /reservations/{id}:
 *   delete:
 *     summary: Delete reservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reservation deleted
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - not your reservation
 *       404:
 *         description: Reservation not found
 */

/**
 * @swagger
 * /reservations/{id}/confirm:
 *   put:
 *     summary: Admin confirm reservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reservation confirmed successfully
 *       400:
 *         description: Reservation is not pending
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Admin only
 *       404:
 *         description: Reservation not found
 */