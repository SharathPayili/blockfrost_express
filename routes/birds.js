const express = require('express')
const router = express.Router()

// middleware that is specific to this router
const timeLog = (req, res, next) => {
  console.log('Time: ', Date.now())
  next()
}
router.use(timeLog)


// define the about route

/**
 * @swagger
 * /birds/about:
 *   get:
 *     summary: a page about birds
 *     description: Just a test endpoints
 *     responses:
 *       200:
 *         description: Successful response about birds.
 */
router.get('/about', (req, res) => {
  res.send('About birds')
})

module.exports = router;