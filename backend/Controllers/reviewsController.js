const express = require("express");
const app = express();
const { PrismaClient } = require("@prisma/client");

app.use(express.json());

const prisma = new PrismaClient();

const index = async (req, res) => {
    try {
        const reviews = await prisma.review.findMany();
        res.json(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
}

const create = async (req, res) => {
    const date = new Date().toISOString(); // This uses the current timestamp
    const { 
        description, 
        rating, 
        authorId 
    } = req.body;
    try {
        const newReview = await prisma.review.create({
            data: {
                description,
                rating,
                authorId,
                date
            }
        });
        res.status(201).json(newReview);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
}

const getById = async (req, res) => {
    const { id } = req.params;
    try {
        const review = await prisma.review.findUnique({
            where: {
                id: parseInt(id),
            },
        });
        if (review) {
            res.json(review);
        } else {
            res.status(404).send({ message: 'Review not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
}

const updateById = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    try {
        const updatedReview = await prisma.review.update({
            where: {
                id: parseInt(id),
            },
            data: updateData,
        });
        res.json(updatedReview);
    } catch (error) {
        console.error(error);
        if (error.code === 'P2025') {
            res.status(404).send({ message: 'Review not found' });
        } else {
            res.status(500).send(error);
        }
    }
}

const deleteById = async (req, res) => {
    const { id } = req.params;
    const numericId = parseInt(id, 10); // Ensure id is treated as a numeric value

    try {
        // First, check if the review exists
        const review = await prisma.review.findUnique({
            where: { id: numericId },
        });

        if (!review) {
            // If the review doesn't exist, return a 404 error
            return res.status(404).send({ message: 'Review not found' });
        }

        // If the review exists, proceed to delete
        const deletedReview = await prisma.review.delete({
            where: { id: numericId },
        });

        // Respond with a success message and the deleted review object
        return res.status(200).send({
            message: 'Review successfully deleted',
            deletedReview: deletedReview
        });
    } catch (error) {
        console.error(error);

        // Here, you know the review exists, so any error is unexpected
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