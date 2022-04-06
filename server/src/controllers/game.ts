import express from 'express'
import { Req, withAuth } from '../helpers/auth'
import { logger } from '../helpers/logger'
import { IUser, User } from '../models/userModel'
const router = express.Router()

router.post('/new', (req, res) => {

})

export default router