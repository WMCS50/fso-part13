const router = require('express').Router()

const { Session } = require('../models')
const tokenExtractor = require('../middleware/tokenExtractor')

router.delete('/', tokenExtractor, async(req, res) => {
  await Session.destroy({
    where: {
      user_id: req.decodedToken.id
    }
  })
  return res.status(200).json({ message: 'Logout successful' })
})

module.exports = router