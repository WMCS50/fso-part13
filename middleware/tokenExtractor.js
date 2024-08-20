const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')
const { Session, User } = require('../models')

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    const token = authorization.substring(7)
    
    try {
      req.decodedToken = jwt.verify(token, SECRET)
      
      const session = await Session.findOne({ where: { token }})
      if (!session) {
        return res.status(401).json({ error: 'invalid session' })
      }

    } catch{
      return res.status(401).json({ error: 'token invalid' })
    }
  }  else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

module.exports = tokenExtractor