import { format } from 'date-fns'
import { v4 as uuid } from 'uuid'
import fs, { promises as fsPromises } from 'fs'
import path from 'path'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import { errMsg } from '../utils/responseMsgs'

export const notFound: RequestHandler = (req, res, next) => {
  const error = new Error(`${req.originalUrl} doesnt exist`)
  res.status(404)
  next(error)
}

const logEvents = async (message: string, logFileName: string) => {
  const dateTime = format(new Date(), 'yyyyMMdd\tHH:mm:ss')
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`

  try {
    if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
      await fsPromises.mkdir(path.join(__dirname, '..', 'logs'))
    }
    await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logFileName), logItem)
  } catch (err) {
    console.log(err)
  }
}

export const logger: RequestHandler = (req, res, next) => {
  logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, 'reqLog.log')
  // console.log(`${req.method} ${req.path}`)
  next()
}

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logEvents(`${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log')
  console.log(err)
  // jwt error
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return errMsg(401, 'error', 'access denied', res)
  }
  // validation error from joi
  if (err.name === 'ValidationError') {
    return errMsg(400, 'error', err.message, res)
  }
  // cors error
  if (err.name === 'Not allowed by CORS') {
    return errMsg(403, 'error', err.message, res)
  }
  const status = res.statusCode === 200 ? 500 : res.statusCode
  errMsg(status, 'error', err.message, res)
  next()
}
