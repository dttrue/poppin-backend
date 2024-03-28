const express = require("express");
const locationRouter = express.Router();
const locationController = require("../Controllers/locationsController");

locationRouter.get("/", locationController.index);

locationRouter.post("/", locationController.create);

locationRouter.get("/:id", locationController.getById);

locationRouter.put("/:id", locationController.updateById);

locationRouter.delete("/:id", locationController.deleteById);

module.exports = locationRouter;