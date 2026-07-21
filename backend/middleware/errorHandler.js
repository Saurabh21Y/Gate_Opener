/**
 * Global error handling middleware.
 * Must be the last middleware registered in Express.
 */
const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`);

  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      success: false,
      message: 'File too large. Maximum allowed size is 10 MB.',
    });
  }

  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(422).json({
      success: false,
      message: 'Validation failed.',
      errors: messages,
    });
  }

  // Generic error
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};

module.exports = errorHandler;
