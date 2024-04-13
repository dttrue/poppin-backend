const express = require("express");
const app = express();
const { PrismaClient } = require("@prisma/client");

app.use(express.json());

const prisma = new PrismaClient();

// desc Get all events
// @route GET /events

 const getAllEvents = async (req, res) => {
    try {
        const events = await prisma.event.findMany({
            include: {
                location: true,
                attendees: true
            }
        });
        res.json(events);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }

};

// desc Get event by id
// @route GET /events/:id

const getEventById = async (req, res) => {
    const { id } = req.params;
    try {
        const event = await prisma.event.findUnique({
            where: {
                id: parseInt(id),
            },
            include: {
                location: true,
                attendees: true
            }
        });
        if (event) {
            res.json(event);
        } else {
            res.status(404).send({ message: 'Event not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
}

// desc Create new event
// @route POST /events

const createEvent = async (req, res) => {
    const {
        title,
        description,
        startDate,
        endDate,
        locationId
    } = req.body;

    // Check if required fields are provided
    if (!title || !startDate || !endDate || !locationId) {
        return res.status(400).send({ message: "Missing required fields." });
    }

    try {
        const newEvent = await prisma.event.create({
            data: {
                title,
                description,
                startDate: new Date(startDate), 
                endDate: new Date(endDate),
                locationId: parseInt(locationId)
            }
        });
        res.status(201).json(newEvent);
    } catch (error) {
        console.error('Failed to create event:', error);
        res.status(500).send({ message: "Error creating the event", details: error.message });
    }
};


// desc Update event by id
// @route PUT /events/:id

const updateEventById = async (req, res) => {
    const { id } = req.params;
    const { name, description, date } = req.body;
    try {
        const updatedEvent = await prisma.event.update({
            where: {
                id: parseInt(id),
            },
            data: {
                name,
                description,
                date
            }
        });
        res.json(updatedEvent);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
}

// desc Delete event by id
// @route DELETE /events/:id

const deleteEventById = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedEvent = await prisma.event.delete({
            where: {
                id: parseInt(id),
            },
        });
        res.json(deletedEvent);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
}

// desc Get events by location id
// @route GET /events/location/:id

const getEventsByLocationId = async (req, res) => {
    const { id } = req.params;
    try {
        const events = await prisma.event.findMany({
            where: {
                location_id: parseInt(id),
            },
            include: {
                location: true,
                attendees: true
            }
        });
        res.json(events);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
}


module.exports = {
     getAllEvents,
     getEventById,
     createEvent,
     updateEventById,
     deleteEventById,
     getEventsByLocationId
    }
