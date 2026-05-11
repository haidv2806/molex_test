import create from "@/services/create";
import getTodos from "@/services/getTodos";

class Todo {
    static create = create;
    static getTodos = getTodos;
}

export default Todo;