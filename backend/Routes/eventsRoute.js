const express = require("express");
const eventRouter = express.Router();
const eventController = require("../Controllers/eventsControllers");

eventRouter.get("/", eventController.getAllEvents);

eventRouter.get("/:id", eventController.getEventById);

eventRouter.post("/", eventController.createEvent);

eventRouter.put("/:id", eventController.updateEventById );

eventRouter.delete("/:id", eventController.deleteEventById);

eventRouter.get("/location/:id", eventController.getEventsByLocationId);




module.exports = eventRouter;