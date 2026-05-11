import { expect } from "chai";
import sinon from "sinon";
import { PoolClient } from "pg";
import { pool } from "@middlewares/database";
import { AppError } from "@middlewares/AppError";

import deleteTodo from "@/services/deleteTodo";

describe("deleteTodo", () => {
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

    it("should return the deleted todo when found", async () => {
        const res = await client.query(
            "INSERT INTO todo (title, content) VALUES ($1, $2) RETURNING id",
            ["Test title", "Test content"]
        );
        const seededId = res.rows[0].id;

        const result = await deleteTodo({ id: seededId }, client);

        expect(result.id).to.equal(seededId);
        expect(result.title).to.equal("Test title");
        expect(result.content).to.equal("Test content");

        const verifyRes = await client.query("SELECT * FROM todo WHERE id = $1", [seededId]);
        expect(verifyRes.rows.length).to.equal(0);
    });

    it("should throw AppError 404 when not found", async () => {
        try {
            await deleteTodo({ id: 999999 }, client);
            expect.fail("Should have thrown");
        } catch (err) {
            expect(err).to.be.instanceOf(AppError);
            expect((err as AppError).statusCode).to.equal(404);
            expect((err as AppError).message).to.equal("Không tìm thấy todo");
        }
    });
});
