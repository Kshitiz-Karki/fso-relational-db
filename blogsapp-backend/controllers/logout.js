const router = require('express').Router()
const Token = require('../models/token')
const { tokenExtractor, loggedInUserFinder } = require('../util/middleware')

router.delete('/:id', tokenExtractor, loggedInUserFinder, async (req, res) => {
  if(!req.validUser){
      return res.status(401).json({ error: 'user disabled' })
  }
  const token = await Token.findOne({ where: { userId: req.decodedToken.id }  })
  if (token) {
    await token.destroy()
  } 
  res.status(204).end()
})

module.exports = router