import express from "express";
import createController from "@/controller/createController";
import getTodosController from "@/controller/getTodosController";
import updateController from "@/controller/updateController";
import deleteController from "@/controller/deleteController";

const TodoController = express.Router();

TodoController.use("/", createController);
TodoController.use("/", getTodosController);
TodoController.use("/", updateController);
TodoController.use("/", deleteController);

export default TodoController;