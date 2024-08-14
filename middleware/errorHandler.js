const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({ error: 'Validation error: ' + error.errors.map(e => e.message).join(', ') })
  } else if (error.name === 'SequelizeDatabaseError') {
    return res.status(500).json({ error: 'Database error' + error.message })
  } else {
    return res.status(500).json({ error: 'Error ' + error.message})
  }
  next(error)
}

module.exports = errorHandler