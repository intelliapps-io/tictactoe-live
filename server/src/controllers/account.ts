import express from 'express'
import { Req, withAuth } from '../helpers/auth'
import { logger } from '../helpers/logger'
import { IUser, User } from '../models/userModel'
const router = express.Router()

router.get('/me', async (req: Req, res) => {
  type ResultData = Omit<Omit<IUser, "password">, "authCount">
  
  const user = await withAuth(req, res).catch(err => {
    res.status(400).send(err.message)
  })

  if (user) {
    const resultData: ResultData = {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      totalGames: user.totalGames,
      totalWins: user.totalWins
    }
    res.status(200).json(resultData)

  }

})

router.post('/logout', async (req, res) => {
  try {
    // res.cookie("refresh-token", "");
    // res.cookie("access-token", "");
    res.clearCookie('refresh-token')
    res.clearCookie('access-token')
    res.status(200).send()
  } catch (error) {
    res.status(400).send({
      status: 400,
      message: error
    })
  }
})

router.post('/login', async (req, res) => {
  try {
    //find the credentials from the database
    const user = await User.findByCredentials(req.body.email, req.body.password)
      .catch(err => { throw err })

    //generate a token 
    const tokens = await user.generateAuthTokens()

    res.cookie("refresh-token", tokens.refreshToken);
    res.cookie("access-token", tokens.accessToken);

    type ResultData = Omit<Omit<IUser, "password">, "authCount">
  
    const userData: ResultData = {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      totalGames: user.totalGames,
      totalWins: user.totalWins
    }

    res.status(200).json({
      tokens: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken
      },
      user: userData
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

    //generate a token 
    const tokens = await user.generateAuthTokens()

    res.cookie("refresh-token", tokens.refreshToken);
    res.cookie("access-token", tokens.accessToken);

    type ResultData = Omit<Omit<IUser, "password">, "authCount">
  
    const userData: ResultData = {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      totalGames: user.totalGames,
      totalWins: user.totalWins
    }

    res.status(200).json({
      tokens: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken
      },
      user: userData
    })
    // res.status(200).send({
    //   status: 200,
    //   message: 'Successfully Registered',
    //   userData: user
    // })

  } catch (error) {
    res.status(400).send({
      status: 400,
      message: error
    })
  }
})

export default router