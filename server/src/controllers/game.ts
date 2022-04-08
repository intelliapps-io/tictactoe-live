import express from 'express'
import { Req, withAuth } from '../helpers/auth'
import { logger } from '../helpers/logger'
import { IUser, User } from '../models/userModel'
const router = express.Router()

router.get('/userProfile/:id', async (req, res) => {
  const user = await User.findById(req.params.id)

  type ResultData = Omit<Omit<IUser, "password">, "authCount">

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
  } else
    res.status(400).send('not found')
})

export default router