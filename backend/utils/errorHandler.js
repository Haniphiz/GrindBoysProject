const errorHandler = (res, error, status = 500, message = "Terjadi kesalahan") => {
  console.error(error);
  return res.status(status).json({
    success: false,
    message,
    error: error?.message || error
  });
};

module.exports = errorHandler;
