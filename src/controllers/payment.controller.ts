import { RequestHandler } from 'express'
import { db } from '../config/firebase'
import { errMsg, successMsg } from '../utils/responseMsgs'
import { isTransactionViable } from '../utils/isTransactionViable'

// @desc receive funds endpoint
// @route POST /api/credit/:id
// @access Public
export const receiveFunds: RequestHandler = async (req, res) => {
  // grab amount from frontend
  const { amount } = req.body
  // check if user exists in database by querying with the req.params
  const user = db.collection('users').doc(req.params.id)
  const userDoc = await user.get()
  if (!userDoc.exists) {
    return errMsg(400, 'error', 'no user found', res)
  }
  const userDetails = userDoc.data()

  // update account balance with amount received
  const accountBalance = userDetails?.accountBalance + amount
  await user.set({
    ...userDetails,
    accountBalance
  })

  successMsg(200, 'success', `you have successfuly received ${amount}`, res)
}

// @desc debit endpoint
// @route POST /api/debit
// @access Protected
export const debit: RequestHandler = async (req, res) => {
  const { amount } = req.body
  // check if amount is greater than acoount balance
  if (!isTransactionViable(amount, req.user.accountBalance)) {
    return errMsg(400, 'error', 'insufficient funds', res)
  }

  // update account balance with amount removed
  req.user.accountBalance = req.user.accountBalance - amount
  await db.collection('users').doc(req.user.id).set(req.user)

  successMsg(200, 'success', `${amount} has been removed from your account`, res)
}

// @desc show balance endpoint
// @route POST /api/balance
// @access Protected
export const showBalance: RequestHandler = async (req, res) => {
  // get balance from authorised user details
  const accountBalance = req.user.accountBalance

  successMsg(200, 'success', `your account balance is ${accountBalance}`, res)
}

// @desc send funds endpoint
// @route POST /api/send/:id
// @access Protected
export const sendFunds: RequestHandler = async (req, res) => {
  const { amount } = req.body
  const receiverId = req.params.id
  // check to ascertain that a user doesnt credit himself
  if (req.user.id === receiverId) {
    return errMsg(400, 'error', 'you cannot send money to yourself', res)
  }
  // get details of the sender from the auth middleware(i.e current logged in user) and check if he has sufficient funds
  const sender = req.user
  if (!isTransactionViable(amount, sender.accountBalance)) {
    return errMsg(400, 'error', 'insufficient funds', res)
  }

  // check if the receiver exists
  const receiver = db.collection('users').doc(receiverId)
  const receiverDoc = await receiver.get()
  if (!receiverDoc.exists) {
    return errMsg(400, 'error', 'no user found', res)
  }
  const receiverDetails = receiverDoc.data()

  // debit the sender and credit the receiver
  sender.accountBalance = sender.accountBalance - amount
  const receiverAccountBalance = receiverDetails?.accountBalance + amount

  // updates senders record with new account balance
  await db.collection('users').doc(sender.id).set(sender)

  // updates receivers record with new account balance
  await receiver.set({
    ...receiverDetails,
    accountBalance: receiverAccountBalance
  })
  successMsg(200, 'success', `you have successfully sent ${amount} to ${receiverDetails?.username}`, res)
}
