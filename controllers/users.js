const router = require('express').Router()
const { User, Blog } = require('../models')

// get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll({
      include: {
        model: Blog,
        attributes: ['id', 'title']
      }
    })
    
    res.json(users)

  } catch(error) {
    next(error)
  }

})

// create a user
router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body)
    res.status(201).json(user)
  } catch(error) {
    return res.status(400).json({ error })
  }
})

// find a user
router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id)
  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})

// modify a user
router.put('/:username', async (req, res, next) => {
  const user = await User.findOne({ 
    where: { 
      username: req.params.username 
    } 
  })

  try {
    if (user) {
      user.username = req.body.username || user.username
      await user.save()
      res.json(user)
    } else {
      res.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

module.exports = router