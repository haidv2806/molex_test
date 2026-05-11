import express from "express";
import createController from "@/controller/createController";

const TodoController = express.Router();

TodoController.use("/create", createController);

export default TodoController;