import express from 'express'
import { validateSignUp } from '../middleware/validation'
import * as authController from '../controllers/auth.controller'

const router = express.Router()

router.post('/signup', validateSignUp, authController.signUp)
router.post('/login', authController.login)

export default router
