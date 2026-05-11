import express from "express";
import createController from "@/controller/createController";
import getTodosController from "@/controller/getTodosController";
import updateController from "@/controller/updateController";
import deleteController from "@/controller/deleteController";

const TodoController = express.Router();

TodoController.use("/create", createController);
TodoController.use("/get", getTodosController);
TodoController.use("/update", updateController);
TodoController.use("/delete", deleteController);

export default TodoController;