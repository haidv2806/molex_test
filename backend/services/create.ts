import { PoolClient } from "pg";
import { todoModel } from "@/model/todoModel";

type Input = Pick<todoModel, 'title' | 'content'>

export default async function create(todo: Input, pool: PoolClient): Promise<todoModel> {
    const query = `
        INSERT INTO todo (title, content)
        VALUES ($1, $2) 
        RETURNING *;
    `

    const result = await pool.query(query, [todo.title, todo.content])
    return result.rows[0];
}