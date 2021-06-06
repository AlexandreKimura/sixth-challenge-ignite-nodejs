import { app } from '../../../../app';
import request from 'supertest';
import { Connection } from 'typeorm';
import createConnection from '../../../../database'
import { v4 as uuidV4 } from "uuid";
import { hash } from 'bcryptjs';

let connection: Connection

describe("Get Balance Controller", () =>{

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuidV4();
    const password = await hash("admin", 8);

    await connection.query(
      `INSERT INTO USERS(id, name, email, password, created_at, updated_at)
      values('${id}', 'alexandre', 'alexandre14@teste.com.br', '${password}', 'now()', 'now()')
    `)
  });

  afterAll(async () => {
    await connection.close()
  });

  it("Should be able to get balance by user", async () => {

    const response = await request(app).post("/api/v1/sessions").send({
      email: "alexandre14@teste.com.br",
      password: "admin",
    });

    const { token } = response.body;

    await request(app)
    .post("/api/v1/statements/deposit")
    .send({
      amount: 100,
      description: "Deposit test"
    })
    .set({
      Authorization: `Bearer ${token}`
    });

    await request(app)
    .post("/api/v1/statements/withdraw")
    .send({
      amount: 50,
      description: "Withdraw test"
    })
    .set({
      Authorization: `Bearer ${token}`
    });

    const history = await request(app)
    .get("/api/v1/statements/balance")
    .set({
      Authorization: `Bearer ${token}`
    });

    expect(history.status).toBe(200);
    expect(history.body.balance).toEqual(50);
  });
})
