const express = require("express");
const locationRouter = express.Router();
const locationController = require("../Controllers/locationsController");

locationRouter.get("/", locationController.index);

locationRouter.post("/", locationController.create);

locationRouter.get("/:id", locationController.getById);

locationRouter.put("/:id", locationController.updateById);

locationRouter.delete("/:id", locationController.deleteById);

locationRouter.get("/:id/social", locationController.getMediaLinksByLocation);

locationRouter.post("/:id/social", locationController.createMediaLinkByLocation);

module.exports = locationRouter;