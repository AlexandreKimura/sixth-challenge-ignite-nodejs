
import { app } from '../../../../app';
import request from 'supertest';
import { Connection } from "typeorm";
import createConnection from '../../../../database'

let connection: Connection

describe("Create User Controller", () =>{

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase()
    await connection.close()
  })

  it("Should be able to create a new user", async () => {
    const response = await request(app).post("/api/v1/users").send({
      name: "alexandre",
      email: "alexandre@teste.com",
      password: "123456",
    });

    expect(response.status).toBe(201);
  })
})
