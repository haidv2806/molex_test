import create from "@/services/create";
import getTodos from "@/services/getTodos";
import update from "@/services/update";
import deleteTodo from "@/services/deleteTodo";

class Todo {
    static create = create;
    static get = getTodos;
    static update = update;
    static delete = deleteTodo;
}

export default Todo;