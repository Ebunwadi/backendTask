import rateLimit from 'express-rate-limit'

export const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // Limit each IP to 5 requests per `window` per minute during production
  handler: (_, res) =>
    res.status(429).json({
      error: { message: 'Too many request attempts from this IP, please try again after a 60 second pause' }
    }),
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false // Disable the `X-RateLimit-*` headers
})
