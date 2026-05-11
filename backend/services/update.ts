import { PoolClient } from "pg";
import { todoModel } from "@/model/todoModel";
import { AppError } from "@/middlewares/AppError";

type Input = {
    id: todoModel["id"];
    title?: todoModel["title"];
    content?: todoModel["content"];
    completed?: todoModel["completed"];
};

export default async function update(input: Input, pool: PoolClient): Promise<todoModel> {
    const { id, title, content, completed } = input;

    const fields: string[] = [];
    const params: any[] = [];

    if (title !== undefined) {
        params.push(title);
        fields.push(`title = $${params.length}`);
    }

    if (content !== undefined) {
        params.push(content);
        fields.push(`content = $${params.length}`);
    }

    if (completed !== undefined) {
        params.push(completed);
        fields.push(`completed = $${params.length}`);
    }

    params.push(id);
    const idIndex = params.length;

    const query = `
        UPDATE todo
        SET ${fields.join(", ")}
        WHERE id = $${idIndex}
        RETURNING *;
    `;

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
        throw new AppError("Không tìm thấy todo", 404);
    }

    return result.rows[0];
}
