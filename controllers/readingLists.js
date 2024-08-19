const router = require('express').Router()
const { Membership, User, ReadingList } = require('../models')
const tokenExtractor = require('../middleware/tokenExtractor')

// get all reading lists
router.get('/', async (req, res, next) => {
  try {
    const readingLists = await ReadingList.findAll({
      attributes: ['id', 'name'], 
    })
    res.json(readingLists)
  } catch (error) {
    next(error)
  }
})

// add reading list
router.post('/', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const readingList = await ReadingList.create({
      ...req.body,
      userId: user.id, 
    })

    res.status(201).json(readingList)
  } catch (error) {
    next(error)
  }
})

// add blog to reading list (got user from token)
router.post('/:id', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
       
    if (!user) {
      return res.status(400).json({ error: 'User must be logged in' })
    }
    
    const { blogId, userId } = req.body

    if (!blogId) {
      return res.status(400).json({ error: 'Blog ID required' })
    }

    const readingListId = req.params.id 

    const membership = await Membership.create({
      blogId,
      readingListId,
      userId
    })

    res.status(201).json(membership)
  } catch(error) {
    next(error)
  }
})

// mark a blog as read in the reading list
router.put('/:id', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
       
    if (!user) {
      return res.status(400).json({ error: 'User must be logged in' })
    }
  
    const membership = await Membership.findByPk(req.params.id, {
      include: {
        model: ReadingList,
        where: { userId: user.id }
      }
    })

      membership.read = req.body.read === true,
      await membership.save()
    
      res.status(200).json(membership)
    } catch(error) {
      next(error)
    }
  })
    
module.exports = router