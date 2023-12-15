const jwt = require('jsonwebtoken')
const router = require('express').Router()

const { SECRET } = require('../util/config')
const User = require('../models/user')
const Token = require('../models/token')

router.post('/', async (request, response) => {
  const body = request.body

  const user = await User.findOne({
    where: {
      username: body.username
    }
  })

  const passwordCorrect = body.password === 'secret'
  // console.log('user - ', user);
  // console.log('passwordCorrect - ', passwordCorrect);

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  if (user.disabled) {
    return response.status(401).json({
      error: 'account disabled, please contact admin'
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  }

  const token = jwt.sign(userForToken, SECRET)
  // console.log('user.id - ', user.id);

  const existingToken = await Token.findOne({ where: { userId: user.id }  })

  if(!existingToken){
    await Token.create({
      userId: user.id,
      token: token 
    })
  }
  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = router