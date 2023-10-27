import { RequestHandler } from 'express'
import bcrypt from 'bcryptjs'
import { db } from '../config/firebase'
import { errMsg, successMsg } from '../utils/responseMsgs'
import { generateToken } from '../utils/generateToken'
import sendEmail from '../utils/sendEmail'

// @desc signup endpoint
// @route POST /api/auth/signup
// @access Public
export const signUp: RequestHandler = async (req, res) => {
  // get details from client
  const { username, email, password } = req.body
  // check if email already exists
  const existingEmailSnapshot = await db.collection('users').where('email', '==', email).get()

  if (!existingEmailSnapshot.empty) {
    return errMsg(409, 'error', 'email already exist', res)
  }
  // hash password before storing in our database
  const passwordHashed = await bcrypt.hash(password, 10)

  const user = db.collection('users').doc()
  user.set({
    username,
    email,
    password: passwordHashed,
    accountBalance: 0
  })

  // sign the user's id with jsonwebtoken which would be later used for authorization
  const accessToken = await generateToken(user.id)
  sendEmail(email, 'welcome', 'Thanks for signing up on Atechcoins')
  successMsg(201, 'success', { accessToken }, res)
}

// @desc login endpoint
// @route POST /api/auth/login
// @access Public
export const login: RequestHandler = async (req, res) => {
  // get details from the client
  const { password, email } = req.body

  // authenticate the user by checking if the details are in our database
  const userSnapshot = await db.collection('users').where('email', '==', email).get()
  if (userSnapshot.empty) {
    return errMsg(400, 'error', 'invalid credentials', res)
  }
  // grab the user details from the database
  let user = {
    id: '',
    email: '',
    password: '',
    accountBalance: 0,
    username: ''
  }
  userSnapshot.forEach((doc: any) => {
    user = {
      id: doc.id,
      ...doc.data()
    }
  })
  // crosscheck if passwords match with that in our database
  const passwordMatch = await bcrypt.compare(password, user.password)
  if (!passwordMatch) {
    return errMsg(400, 'error', 'invalid credentials', res)
  }

  // sign the user's id with jsonwebtoken which would be later used for authorization
  const accessToken = await generateToken(user.id)

  successMsg(200, 'success', { accessToken }, res)
}
