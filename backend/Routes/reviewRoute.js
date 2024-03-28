const express = require("express");
const reviewRouter = express.Router();
const reviewController = require("../Controllers/reviewsController");

reviewRouter.get("/", reviewController.index);

reviewRouter.post("/", reviewController.create);

reviewRouter.get("/:id", reviewController.getById);

reviewRouter.put("/:id", reviewController.updateById);

reviewRouter.delete("/:id", reviewController.deleteById);

module.exports = reviewRouter;