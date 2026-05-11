import express from "express";
import Joi from "joi";
import joiValidate from "@middlewares/joiValidate";
import Todo from "@services/_todo";
import { withTransaction } from "@middlewares/withTransaction";

const updateController = express.Router();

const joiParams = Joi.object({
    id: Joi.number().integer().positive().required(),
});

const joiBody = Joi.object({
    title: Joi.string().min(1).max(50).optional(),
    content: Joi.string().min(1).max(255).optional(),
    completed: Joi.boolean().optional(),
}).min(1);

updateController.patch("/:id",
    joiValidate(joiParams, "params"),
    joiValidate(joiBody, "body"),
    async (req, res) => {
        const id = Number(req.params.id);
        const { title, content, completed } = req.body;

        const result = await withTransaction(async (pool) => {
            return await Todo.update({ id, title, content, completed }, pool);
        });

        return res.status(200).json({
            success: true,
            message: "Updated successfully",
            data: result,
        });
    }
);

export default updateController;
