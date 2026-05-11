import create from "@/services/create";
import getTodos from "@/services/getTodos";
import update from "@/services/update";

class Todo {
    static create = create;
    static getTodos = getTodos;
    static update = update;
}

export default Todo;