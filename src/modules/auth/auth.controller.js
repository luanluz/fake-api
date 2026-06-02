const AuthService = require("./auth.service");

const AuthController = {
  register(req, res, next) {
    try {
      const result = AuthService.register(req.body);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  },

  login(req, res, next) {
    try {
      const result = AuthService.login(req.body);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },

  me(req, res, next) {
    try {
      const user = AuthService.getProfile(req.user.userId);
      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  },
};

module.exports = AuthController;
