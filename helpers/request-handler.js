module.exports = (req, res, next) => {
  res.status(res.locals.status || 200).json(res.locals.data);
  next();
};
