// Centralized error handler - final middleware in the stack. Catches
// anything forwarded via next(err) (e.g. from asyncHandler) so a single
// route bug can't take down the process or leak stack traces to clients.
const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (res.headersSent) {
    return next(err);
  }

  const status = err.status || 500;
  res.status(status).json({
    message: err.message || 'Something went wrong',
  });
};

module.exports = errorHandler;
