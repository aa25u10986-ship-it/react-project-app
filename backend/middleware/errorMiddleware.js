// Global error handler — catches any error passed via next(err)
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500
  console.error(`[ERROR] ${err.message}`)
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  })
}

// 404 handler — catches requests to routes that don't exist
const notFound = (req, res, next) => {
  const err = new Error(`Route not found: ${req.originalUrl}`)
  err.statusCode = 404
  next(err)
}

module.exports = { errorHandler, notFound }
