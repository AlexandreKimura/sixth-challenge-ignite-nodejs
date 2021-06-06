import { app } from '../../../../app';
import request from 'supertest';
import { Connection } from 'typeorm';
import createConnection from '../../../../database'
import { v4 as uuidV4 } from "uuid";
import { hash } from 'bcryptjs';

let connection: Connection

describe("Show Profile User Controller", () =>{

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuidV4();
    const password = await hash("admin", 8);

    await connection.query(
      `INSERT INTO USERS(id, name, email, password, created_at, updated_at)
      values('${id}', 'alexandre', 'alexandre12@teste.com.br', '${password}', 'now()', 'now()')
    `)
  });

  afterAll(async () => {
    await connection.close()
  });

  it("Should be able to show an user profile", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: "alexandre12@teste.com.br",
      password: "admin",
    });

    const { token } = response.body;

    const userProfile = await request(app)
    .get("/api/v1/profile")
    .set({
        Authorization: `Bearer ${token}`
    });

    expect(userProfile.body).toHaveProperty("id")
    expect(userProfile.status).toBe(200);
  })
})
