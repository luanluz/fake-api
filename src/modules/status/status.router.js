const { Router } = require("express");
const StatusController = require("./status.controller");

const router = Router();

router.get("/", StatusController.list);
router.get("/:code", StatusController.getByCode);

module.exports = router;
