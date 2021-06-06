import { app } from '../../../../app';
import request from 'supertest';
import { Connection } from 'typeorm';
import createConnection from '../../../../database'
import { v4 as uuidV4 } from "uuid";
import { hash } from 'bcryptjs';

let connection: Connection

describe("Create Statement Controller", () =>{

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuidV4();
    const password = await hash("admin", 8);

    await connection.query(
      `INSERT INTO USERS(id, name, email, password, created_at, updated_at)
      values('${id}', 'alexandre', 'alexandre13@teste.com.br', '${password}', 'now()', 'now()')
    `)
  });

  afterAll(async () => {
    await connection.close()
  });

  it("Should be able to create a new deposit", async () => {

    const response = await request(app).post("/api/v1/sessions").send({
      email: "alexandre13@teste.com.br",
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

    expect(deposit.status).toBe(201);
    expect(deposit.body).toHaveProperty("id");
  });

  it("Should be able to create a new withdraw", async () => {

    const response = await request(app).post("/api/v1/sessions").send({
      email: "alexandre13@teste.com.br",
      password: "admin",
    });

    const { token } = response.body;

    const withdraw = await request(app)
    .post("/api/v1/statements/withdraw")
    .send({
      amount: 50,
      description: "Withdraw test"
    })
    .set({
      Authorization: `Bearer ${token}`
    });

    expect(withdraw.status).toBe(201);
    expect(withdraw.body).toHaveProperty("id");
  });

  it("Should not be able to create a new withdraw with insufficent founds", async () => {

    const response = await request(app).post("/api/v1/sessions").send({
      email: "alexandre13@teste.com.br",
      password: "admin",
    });

    const { token } = response.body;

    const withdraw = await request(app)
    .post("/api/v1/statements/withdraw")
    .send({
      amount: 700,
      description: "Withdraw test"
    })
    .set({
      Authorization: `Bearer ${token}`
    });

    expect(withdraw.status).toBe(400)
  })
})
