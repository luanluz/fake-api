const { Router } = require("express");
const TodoController = require("./todo.controller");
const authenticate = require("../../middleware/authenticate.middleware");

const router = Router();

router.use(authenticate);

router.get("/", TodoController.list);
router.get("/:id", TodoController.getById);
router.post("/", TodoController.create);
router.put("/:id", TodoController.update);
router.delete("/:id", TodoController.delete);

module.exports = router;
