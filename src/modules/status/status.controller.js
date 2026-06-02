const StatusService = require("./status.service");

const StatusController = {
  list(req, res, next) {
    try {
      res.status(200).json(StatusService.list());
    } catch (err) {
      next(err);
    }
  },

  getByCode(req, res, next) {
    try {
      res.status(200).json(StatusService.getByCode(req.params.code));
    } catch (err) {
      next(err);
    }
  },
};

module.exports = StatusController;
