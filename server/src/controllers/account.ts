import express from 'express'
import { logger } from '../helpers/logger'
import { IUser, User } from '../models/userModel'
const router = express.Router()

router.post('/login', async (req, res) => {
  try {
    //find the credentials from the database
    const user = await User.findByCredentials(req.body.email, req.body.password)
      .catch(err => { throw err })
    
    logger.info(user.email)

    //generate a token 
    const token = await user.generateAuthToken()
    res.status(200).send({
      status: 200,
      message: 'Successfully Signin',
      data: {
        token
      }
    })
  } catch (error) {
    // logger.info(error)
    res.status(400).send({
      status: 400,
      message: error
    })
  }
})

router.put('/signup', async (req, res) => {
  //@ts-ignore
  const userData: IUser = {
    email: req.body.email,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    totalGames: 0,
    totalWins: 0,
    authCount: 0
  }
  const user = new User(userData)
  try {
    await user.save().catch(err => { throw err })
    res.status(200).send({
      status: 200,
      message: 'Successfully Registered',
      userData: user
    })
  } catch (error) {
    res.status(400).send({
      status: 400,
      message: error
    })
  }
})

export default router