import { app } from '../../../../app';
import request from 'supertest';
import { Connection } from 'typeorm';
import createConnection from '../../../../database'

let connection: Connection

describe("Create Statement Controller", () =>{

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase()
    await connection.close()
  })

  /*it("Should be able to create a new deposit", async () => {
    const response = await request(app).post("/api/v1/statements/deposit").send({

    })
  })*/

  it("teste", () => {

  })
})
