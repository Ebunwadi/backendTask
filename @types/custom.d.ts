// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Request } from 'express'
import { IUser } from '../src/utils/interface'

declare global {
  namespace Express {
    interface Request {
      user: IUser
    }
  }
}
