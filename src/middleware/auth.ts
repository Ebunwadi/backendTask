import { RequestHandler } from 'express'
import jwt, { JwtPayload, Secret } from 'jsonwebtoken'
import { errMsg } from '../utils/responseMsgs'
import { db } from '../config/firebase'
import { IUser } from '../utils/interface'

export const auth: RequestHandler = async (req, res, next) => {
  // here we use the bearer token auth type
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return errMsg(401, 'error', 'unauthorised', res)
  }
  // grab the token from the auth header
  const token = authHeader.split(' ')[1]

  // verify the token, get the id and query our database to check if we have a user/collection with that id
  const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET as Secret) as JwtPayload
  const userDoc = await db.collection('users').doc(decoded.id).get()
  if (!userDoc.exists) {
    return errMsg(403, 'error', 'access forbidden', res)
  }
  const user = userDoc.data()

  // attach the user details as a property in the request body so we can use it for authorization purposes
  req.user = {
    ...user,
    id: decoded.id
  } as IUser

  next()
}
