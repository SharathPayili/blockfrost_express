const express = require('express');
const router = express.Router();


/**
 * @swagger
 * /users/all:
 *   get:
 *     summary: Get a list of users
 *     description: Retrieve a list of users from the database.
 *     responses:
 *       200:
 *         description: Successful response with a list of users.
 */
router.get('/all', (req, res) => {
    res.json({ users: [] });
});

module.exports = router;