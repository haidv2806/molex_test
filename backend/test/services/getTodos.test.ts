import { expect } from "chai";
import sinon from "sinon";
import { PoolClient } from "pg";
import { pool } from "@middlewares/database";
import getTodos from "@/services/getTodos";

describe("getTodos service", () => {
    let client: PoolClient;

    beforeEach(async () => {
        client = await pool.connect();
        await client.query("BEGIN");

        // Seed data
        await client.query(
            "INSERT INTO todo (title, content, completed) VALUES ($1, $2, $3), ($4, $5, $6)",
            ["Todo 1", "Content 1", false, "Todo 2", "Content 2", true]
        );
    });

    afterEach(async () => {
        await client.query("ROLLBACK");
        client.release();
        sinon.restore();
    });

    it("should return all todos with pagination", async () => {
        const result = await getTodos({ page: 1, limit: 10 }, client);

        expect(result.data).to.be.an("array");
        expect(result.data.length).to.be.at.least(2);
        expect(result.pagination).to.have.property("total_items");
        expect(result.pagination.current_page).to.equal(1);
    });

    it("should filter todos by title", async () => {
        const result = await getTodos({ title: "Todo 1", page: 1, limit: 10 }, client);

        expect(result.data.every(t => t.title.includes("Todo 1"))).to.be.true;
        expect(result.data.length).to.equal(1);
    });

    it("should filter todos by completed status", async () => {
        const result = await getTodos({ completed: true, page: 1, limit: 10 }, client);

        expect(result.data.every(t => t.completed === true)).to.be.true;
    });

    it("should handle unlimited results", async () => {
        const result = await getTodos({ unlimited: true } as any, client);
        expect(result.pagination.total_pages).to.equal(1);
    });
});
