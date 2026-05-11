import express from "express";
import Joi from "joi";
import joiValidate from "@middlewares/joiValidate";
import Todo from "@services/_todo";
import { withTransaction } from "@middlewares/withTransaction";

const deleteController = express.Router();

const joiParams = Joi.object({
    id: Joi.number().integer().positive().required(),
});

deleteController.delete("/:id",
    joiValidate(joiParams, "params"),
    async (req, res) => {
        const id = Number(req.params.id);

        const result = await withTransaction(async (pool) => {
            return await Todo.delete({ id }, pool);
        });

        return res.status(200).json({
            success: true,
            message: "Deleted successfully",
            data: result,
        });
    }
);

export default deleteController;
