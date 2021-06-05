import { app } from '../../../../app';
import request from 'supertest';
import { Connection } from 'typeorm';
import createConnection from '../../../../database'
import { v4 as uuidV4 } from "uuid";
import { hash } from 'bcryptjs';

let connection: Connection

describe("Authenticate User Controller", () =>{

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuidV4();
    const password = await hash("admin", 8);

    await connection.query(
      `INSERT INTO USERS(id, name, email, password, created_at, updated_at)
      values('${id}', 'alexandre', 'alexandre@teste.com.br', '${password}', 'now()', 'now()')
    `)
  });

  afterAll(async () => {
    await connection.dropDatabase()
    await connection.close()
  })

  it("Should be able to authenticate an user", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: "alexandre@teste.com.br",
      password: "admin",
    });

    const { token } = response.body;

    expect(response.status).toBe(200);
    expect(token).toBeTruthy();
  })
})
