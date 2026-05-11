import { expect } from "chai";
import request from "supertest";
import sinon from "sinon";
import { PoolClient } from "pg";
import { app } from "@/index";
import { pool } from "@middlewares/database";
import * as withTransModule from "@middlewares/withTransaction";

describe("Todo Controllers", () => {
    let client: PoolClient;

    beforeEach(async () => {
        client = await pool.connect();
        await client.query("BEGIN");

        // Stub withTransaction to use our client and NOT commit
        sinon.stub(withTransModule, "withTransaction").callsFake(async (callback) => {
            return await callback(client as any);
        });
    });

    afterEach(async () => {
        await client.query("ROLLBACK");
        client.release();
        sinon.restore();
    });

    describe("POST /todos", () => {
        it("should create a todo and return 200", async () => {
            const res = await request(app)
                .post("/todos")
                .send({
                    title: "Controller Test",
                    content: "Testing from controller"
                });

            expect(res.status).to.equal(200);
            expect(res.body.success).to.be.true;
            expect(res.body.data.title).to.equal("Controller Test");
        });

        it("should return 400 for invalid data", async () => {
            const res = await request(app)
                .post("/todos")
                .send({
                    title: "" // Too short
                });

            expect(res.status).to.equal(400);
            expect(res.body.message).to.equal("Dữ liệu không hợp lệ");
        });
    });

    describe("GET /todos", () => {
        it("should get todos list", async () => {
            await client.query("INSERT INTO todo (title, content) VALUES ($1, $2)", ["List test", "content"]);
            
            const res = await request(app).get("/todos");

            expect(res.status).to.equal(200);
            expect(res.body.data).to.be.an("array");
            expect(res.body.data.some((t: any) => t.title === "List test")).to.be.true;
        });
    });

    describe("PUT /todos/:id", () => {
        it("should update a todo", async () => {
            const seed = await client.query("INSERT INTO todo (title, content) VALUES ($1, $2) RETURNING id", ["To Update", "Old"]);
            const id = seed.rows[0].id;

            const res = await request(app)
                .put(`/todos/${id}`)
                .send({ title: "Updated Title" });

            expect(res.status).to.equal(200);
            expect(res.body.data.title).to.equal("Updated Title");
        });
    });

    describe("DELETE /todos/:id", () => {
        it("should delete a todo", async () => {
            const seed = await client.query("INSERT INTO todo (title, content) VALUES ($1, $2) RETURNING id", ["To Delete", "Bye"]);
            const id = seed.rows[0].id;

            const res = await request(app).delete(`/todos/${id}`);

            expect(res.status).to.equal(200);
            expect(res.body.message).to.equal("Xoá thành công");
        });

        it("should return 404 for non-existent id", async () => {
            const res = await request(app).delete("/todos/999999");
            expect(res.status).to.equal(404);
        });
    });
});
