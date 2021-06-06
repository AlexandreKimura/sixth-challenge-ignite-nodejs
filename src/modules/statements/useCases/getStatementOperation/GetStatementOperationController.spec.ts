import { app } from '../../../../app';
import request from 'supertest';
import { Connection } from 'typeorm';
import createConnection from '../../../../database'
import { v4 as uuidV4 } from "uuid";
import { hash } from 'bcryptjs';

let connection: Connection

describe("Get Statement Operation Controller", () =>{

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuidV4();
    const password = await hash("admin", 8);

    await connection.query(
      `INSERT INTO USERS(id, name, email, password, created_at, updated_at)
      values('${id}', 'alexandre', 'alexandre15@teste.com.br', '${password}', 'now()', 'now()')
    `)
  });

  afterAll(async () => {
    await connection.close()
  });

  it("Should be able to create a new deposit", async () => {

    const response = await request(app).post("/api/v1/sessions").send({
      email: "alexandre15@teste.com.br",
      password: "admin",
    });

    const { token } = response.body;

    const deposit = await request(app)
    .post("/api/v1/statements/deposit")
    .send({
      amount: 100,
      description: "Deposit test"
    })
    .set({
      Authorization: `Bearer ${token}`
    });

    const statement = await request(app)
    .get(`/api/v1/statements/${deposit.body.id}`)
    .set({
      Authorization: `Bearer ${token}`
    });

    expect(statement.status).toBe(200);
    expect(statement.body).toHaveProperty("id");
  });
})
