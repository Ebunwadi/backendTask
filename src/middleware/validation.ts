import Joi from 'joi'
import { NextFunction, Request, Response } from 'express'

const signupSchema = Joi.object().keys({
  username: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
})

const paymentSchema = Joi.object().keys({
  amount: Joi.number().required()
})
export const validateSignUp = async (req: Request, res: Response, next: NextFunction) => {
  await signupSchema.validateAsync(req.body)
  next()
}

export const validateBody = async (req: Request, res: Response, next: NextFunction) => {
  await paymentSchema.validateAsync(req.body)
  next()
}
