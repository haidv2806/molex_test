import express from "express";
import Joi from "joi";
import joiValidate from "@middlewares/joiValidate";
import Todo from "@services/_todo";
import { withTransaction } from "@middlewares/withTransaction";

const getTodosController = express.Router();

const joiQuery = Joi.object({
    title: Joi.string()
        .min(1)
        .max(50)
        .optional(),
    completed: Joi.boolean().optional(),
    page: Joi.number().optional(),
    limit: Joi.number().optional(),
})

getTodosController.get("",
    joiValidate(joiQuery, 'query'),
    async (req, res) => {
        const title = req.query.title as string | undefined;
        const completed = req.query.completed !== undefined
            ? req.query.completed === "true"
            : undefined;
        const page = req.query.page ? Number(req.query.page) : undefined;
        const limit = req.query.limit ? Number(req.query.limit) : undefined;

        const result = await withTransaction(async (pool) => {
            return await Todo.get({
                title,
                completed,
                page,
                limit
            }, pool);
        });

        return res.status(200).json({
            success: true,
            message: "Fetched successfully",
            data: result.data,
            pagination: result.pagination
        });
    });

export default getTodosController;
