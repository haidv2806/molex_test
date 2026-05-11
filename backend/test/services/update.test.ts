import { expect } from "chai";
import sinon from "sinon";
import { PoolClient } from "pg";
import { pool } from "@middlewares/database";
import { AppError } from "@middlewares/AppError";
import updateTodo from "@/services/update";

describe("updateTodo service", () => {
    let client: PoolClient;

    beforeEach(async () => {
        client = await pool.connect();
        await client.query("BEGIN");
    });

    afterEach(async () => {
        await client.query("ROLLBACK");
        client.release();
        sinon.restore();
    });

    it("should update a todo title and content", async () => {
        const seed = await client.query(
            "INSERT INTO todo (title, content) VALUES ($1, $2) RETURNING id",
            ["Old Title", "Old Content"]
        );
        const id = seed.rows[0].id;

        const result = await updateTodo({ id, title: "New Title", content: "New Content" }, client);

        expect(result.title).to.equal("New Title");
        expect(result.content).to.equal("New Content");
    });

    it("should update only completed status", async () => {
        const seed = await client.query(
            "INSERT INTO todo (title, content, completed) VALUES ($1, $2, $3) RETURNING id",
            ["Title", "Content", false]
        );
        const id = seed.rows[0].id;

        const result = await updateTodo({ id, completed: true }, client);

        expect(result.completed).to.be.true;
        expect(result.title).to.equal("Title"); // Should stay the same
    });

    it("should throw AppError 404 if todo not found", async () => {
        try {
            await updateTodo({ id: 999999, title: "Fail" }, client);
            expect.fail("Should have thrown 404");
        } catch (err: any) {
            expect(err).to.be.instanceOf(AppError);
            expect(err.statusCode).to.equal(404);
        }
    });
});
