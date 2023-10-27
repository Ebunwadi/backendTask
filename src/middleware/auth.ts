import { RequestHandler } from 'express'
import jwt, { JwtPayload, Secret } from 'jsonwebtoken'
import { errMsg } from '../utils/responseMsgs'
import { db } from '../config/firebase'
import { IUser } from '../utils/interfaces'

export const auth: RequestHandler = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith('Bearer ')) {
    return errMsg(401, 'error', 'unauthorised', res)
  }

  const token = authHeader.split(' ')[1]

  const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET as Secret) as JwtPayload

  const userDoc = await db.collection('users').doc(decoded.id).get()
  if (!userDoc.exists) {
    return errMsg(403, 'error', 'access forbidden', res)
  }
  const user = userDoc.data()

  req.user = {
    ...user,
    id: decoded.id
  } as IUser

  next()
}
