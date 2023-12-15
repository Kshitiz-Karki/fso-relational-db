const { SECRET } = require('../util/config')
const jwt = require('jsonwebtoken')
// const { Token } = require('../models/token')
// const { User } = require('../models/user')
const { Token, User } = require('../models')

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  console.log('authorization - ', authorization.substring(7));
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    // console.log(SECRET);
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch{
      return res.status(401).json({ error: 'token invalid' })
    }
  }  else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

const loggedInUserFinder = async (req, _res, next) => {
  req.validUser = await Token.findOne({ 
    include: {
      model: User,
      where : { disabled: false }
    },
    where: { userId: req.decodedToken.id } 
  })
  next()
}

module.exports = { tokenExtractor, loggedInUserFinder }