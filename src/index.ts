import 'express-async-errors'
import 'dotenv/config'
import express, { Express, Request, Response } from 'express'
import helmet from 'helmet'
import cors from 'cors'
import hpp from 'hpp'
import auth from './routes/auth.route'
import payment from './routes/payment.route'
import { errorHandler, logger, notFound } from './middleware/loggerAndErrorHandler'
import { corsOptions } from './config/corsOption'
import { limiter } from './config/rateLimiter'
import { successMsg } from './utils/responseMsgs'

const xssClean = require('xss-clean')

// initialize the express app
const app: Express = express()
// logs all incoming request and errors to the 'log' folder
app.use(logger)

// security middlewares
app.disable('x-powered-by') // To hide the framework used by the web server
app.use(helmet()) // Set security headers
app.use(cors(corsOptions)) // Origin restriction to control who can access this service.
app.use(hpp()) // Prevent Http param pollution
app.use(xssClean()) // Prevent XSS (Cross-SIte Scripting) attacks
app.use(limiter) // Rate limiting to prevent abuse.

app.use(express.json())

app.get('/', async (req: Request, res: Response) => {
  successMsg(200, 'success', 'healthcheck done!', res)
})

// routes
app.use('/api/auth', auth)
app.use('/api', payment)

// error handlers middleware
app.use(notFound)
app.use(errorHandler)

const port = process.env.PORT
export default app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})
