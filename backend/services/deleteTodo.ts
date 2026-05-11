import { PoolClient } from "pg";
import { todoModel } from "@/model/todoModel";
import { AppError } from "@/middlewares/AppError";

type Input = {
    id: todoModel["id"];
};

export default async function deleteTodo(input: Input, pool: PoolClient): Promise<todoModel> {
    const { id } = input;

    const query = `
        DELETE FROM todo
        WHERE id = $1
        RETURNING *;
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
        throw new AppError("Todo not found", 404);
    }

    return result.rows[0];
}
