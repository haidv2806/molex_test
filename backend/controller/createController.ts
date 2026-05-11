import express from "express";
import Joi from "joi";
import joiValidate from "@middlewares/joiValidate";
import Todo from "@services/_todo";
import { withTransaction } from "@middlewares/withTransaction";

const createController = express.Router();

const joiBody = Joi.object({
    title: Joi.string()
        .min(1)
        .max(50)
        .required(),
    content: Joi.string()
        .min(1)
        .max(255)
        .required(),
})


createController.post("",
    joiValidate(joiBody, 'body'),
    async (req, res) => {
        const { title, content } = req.body

        const result = await withTransaction(async (pool) => {
            return await Todo.create({ title, content }, pool);
        });

        return res.status(200).json({
            success: true,
            message: "Thêm mới thành công",
            data: result
        });
    }
);

export default createController;