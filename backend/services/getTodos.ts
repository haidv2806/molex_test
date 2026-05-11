import { PoolClient } from "pg";
import { todoModel } from "@/model/todoModel";
import {
    PaginationMetadata,
    PaginationQueryMetadata
} from "@/types/pagination";

type Input = PaginationQueryMetadata & {
    title?: todoModel["title"];
    completed?: todoModel["completed"];
};

type Response = {
    data: todoModel[];
    pagination: PaginationMetadata;
};

export default async function getTodos(
    input: Input,
    pool: PoolClient
): Promise<Response> {
    const {
        page = 1,
        limit = 10,
        unlimited = false,
        title,
        completed
    } = input;

    const params: any[] = [];
    const conditions: string[] = [];

    if (title) {
        params.push(`%${title}%`);
        conditions.push(`title ILIKE $${params.length}`);
    }

    if (completed !== undefined) {
        params.push(completed);
        conditions.push(`completed = $${params.length}`);
    }

    const whereClause =
        conditions.length > 0
            ? `WHERE ${conditions.join(" AND ")}`
            : "";

    // COUNT
    const countQuery = `
        SELECT COUNT(*)::int AS total_items
        FROM todo
        ${whereClause};
    `;

    const countResult = await pool.query(countQuery, params);

    const totalItems: number = countResult.rows[0].total_items;

    // MAIN QUERY
    let query = `
        SELECT *
        FROM todo
        ${whereClause}
        ORDER BY created_at DESC
    `;

    if (!unlimited) {
        params.push(limit);
        const limitIndex = params.length;

        params.push((page - 1) * limit);
        const offsetIndex = params.length;

        query += `
            LIMIT $${limitIndex}
            OFFSET $${offsetIndex}
        `;
    }

    query += ";";

    const result = await pool.query(query, params);

    return {
        data: result.rows,
        pagination: {
            current_page: page,
            total_pages: unlimited
                ? 1
                : Math.ceil(totalItems / limit),
            total_items: totalItems
        }
    };
}