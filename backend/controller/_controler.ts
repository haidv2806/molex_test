import express from "express";
import createController from "@/controller/createController";
import getTodosController from "@/controller/getTodosController";

const TodoController = express.Router();

TodoController.use("/create", createController);
TodoController.use("/get", getTodosController);

export default TodoController;