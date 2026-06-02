const TodoService = require("./todo.service");

const TodoController = {
  list(req, res, next) {
    try {
      const result = TodoService.list(req.user.userId, req.query);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },

  getById(req, res, next) {
    try {
      const todo = TodoService.getById(req.params.id, req.user.userId);
      res.status(200).json(todo);
    } catch (err) {
      next(err);
    }
  },

  create(req, res, next) {
    try {
      const todo = TodoService.create(req.user.userId, req.body);
      res.status(201).json(todo);
    } catch (err) {
      next(err);
    }
  },

  update(req, res, next) {
    try {
      const todo = TodoService.update(req.params.id, req.user.userId, req.body);
      res.status(200).json(todo);
    } catch (err) {
      next(err);
    }
  },

  delete(req, res, next) {
    try {
      TodoService.delete(req.params.id, req.user.userId);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};

module.exports = TodoController;
