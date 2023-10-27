import express from 'express'
import * as paymentController from '../controllers/payment.controller'
import { auth } from '../middleware/auth'
import { validateBody } from '../middleware/validation'

const router = express.Router()

router.get('/balance', auth, paymentController.showBalance)

router.use(validateBody)
router.post('/credit/:id', paymentController.receiveFunds)
router.post('/debit', auth, paymentController.debit)
router.post('/send/:id', auth, paymentController.sendFunds)

export default router
