module.exports = (error, req, res, next) => {
  console.log(error);
  res.status(res.locals.status || 500).json(error);
  next();
};
