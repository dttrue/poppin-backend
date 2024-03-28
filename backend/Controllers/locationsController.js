const express = require("express");
const app = express();
const { PrismaClient } = require("@prisma/client");

app.use(express.json());

const prisma = new PrismaClient();

const index = async (req, res) => {
    try {
        const locations = await prisma.location.findMany();
        res.json(locations);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
}

const create = async (req, res) => {
    const created_at = new Date().toISOString();
    const { 
        name, 
        street_address_1, 
        street_address_2 = "", // Default to empty string if not provided
        city, 
        state, 
        zip_code 
    } = req.body;
    
    try {
        // Check if a location with the same address already exists
        const existingLocation = await prisma.location.findFirst({
            where: {
                AND: [
                    { street_address_1 },
                    { street_address_2 },
                    { city },
                    { state },
                    { zip_code },
                ],
            },
        });

        if (existingLocation) {
            return res.status(400).send({ message: 'A location with the same address already exists.' });
        }

        // If no existing location, create a new one
        const newLocation = await prisma.location.create({
            data: {
                created_at,
                name,
                street_address_1,
                street_address_2,
                city,
                state,
                zip_code,
            }
        });
        // Respond with a success message and the details of the new location
        res.status(201).json({ 
            message: 'Successfully created the location', 
            location: newLocation 
        });
    } catch (error) {
        console.error(error);
        // General error handling
        res.status(500).send({ message: 'An error occurred while creating the location.' });
    }
}

const getById = async (req, res) => {
    const { id } = req.params;
    try {
        const location = await prisma.location.findUnique({
            where: {
                id: parseInt(id),
            },
        });
        if (location) {
            res.json(location);
        } else {
            res.status(404).send({ message: 'Location not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
}

const updateById = async (req, res) => {
    const { id } = req.params;
    const { street_address_1, street_address_2 = "", city, state, zip_code } = req.body;
    const updateData = req.body;

    try {
        // Check if another location with the same address exists
        const existingLocation = await prisma.location.findFirst({
            where: {
                AND: [
                    { id: { not: parseInt(id) } }, // Exclude the current location from the check
                    { street_address_1 },
                    { street_address_2 },
                    { city },
                    { state },
                    { zip_code },
                ],
            },
        });

        if (existingLocation) {
            return res.status(400).send({ message: 'Another location with the specified address already exists. Update not allowed.' });
        }

        // Proceed with the update if no conflicting address is found
        const updatedLocation = await prisma.location.update({
            where: { id: parseInt(id) },
            data: updateData,
        });

        // Respond with a success message and the details of the updated location
        res.status(200).json({
            message: 'Location successfully updated',
            location: updatedLocation
        });
    } catch (error) {
        console.error(error);
        // General error handling
        res.status(500).send({ message: 'An error occurred while updating the location.' });
    }
}

const deleteById = async (req, res) => {
    const { id } = req.params;
    const numericId = parseInt(id, 10); // Ensure id is treated as a numeric value

    try {
        // First, check if the location exists
        const location = await prisma.location.findUnique({
            where: { id: numericId },
        });

        if (!location) {
            // If the location doesn't exist, return a 404 error
            return res.status(404).send({ message: 'Location not found' });
        }

        // If the location exists, proceed to delete
        const deletedLocation = await prisma.location.delete({
            where: { id: numericId },
        });

        // Respond with a success message and the deleted location object
        return res.status(200).send({
            message: 'Location successfully deleted',
            deletedLocation: deletedLocation
        });
    } catch (error) {
        console.error(error);

        // Here, you know the location exists, so any error is unexpected
        // Respond with a generic 500 server error
        res.status(500).send({ message: 'An unexpected error occurred' });
    }
}

module.exports = {
    index,
    create,
    getById,
    updateById,
    deleteById 
}