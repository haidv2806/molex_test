import { expect } from "chai";
import sinon from "sinon";
import { PoolClient } from "pg";
import { pool } from "@middlewares/database";
import createTodo from "@/services/create";

describe("createTodo service", () => {
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

    it("should create a new todo and return it", async () => {
        const input = {
            title: "Test Todo",
            content: "This is a test content"
        };

        const result = await createTodo(input, client);

        expect(result).to.have.property("id");
        expect(result.title).to.equal(input.title);
        expect(result.content).to.equal(input.content);
        expect(result.completed).to.be.false;

        // Verify in DB
        const dbRes = await client.query("SELECT * FROM todo WHERE id = $1", [result.id]);
        expect(dbRes.rows.length).to.equal(1);
        expect(dbRes.rows[0].title).to.equal(input.title);
    });

    it("should throw an error if title is missing (DB constraint)", async () => {
        const input = {
            content: "Content only"
        } as any;

        try {
            await createTodo(input, client);
            expect.fail("Should have thrown DB error");
        } catch (err: any) {
            // Postgres error for null constraint violation
            expect(err).to.exist;
        }
    });
});
