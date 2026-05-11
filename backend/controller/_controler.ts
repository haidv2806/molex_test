import express from "express";
import createController from "@/controller/createController";
import getTodosController from "@/controller/getTodosController";
import updateController from "@/controller/updateController";

const TodoController = express.Router();

TodoController.use("/create", createController);
TodoController.use("/get", getTodosController);
TodoController.use("/update", updateController);

export default TodoController;