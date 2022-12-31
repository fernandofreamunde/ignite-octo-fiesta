import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";

let connection : Connection;

describe('create User controller', () => {

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  it('should be able to create a User', async () => {
    
    const response = await request(app).post('/api/v1/users').send(
      {
        "name": "Diego Fernandes", 
        "email": "d.fernandoes@rocketseat.com",
        "password": "password"
      }
    )

    expect(response.status).toEqual(201);
  });

  it('should not be able to create a duplicated user', async () => {
    
    let response = await request(app).post('/api/v1/users').send(
      {
        "name": "Diego Fernandes", 
        "email": "admin@example.com",
        "password": "password"
      }
    )

    expect(response.status).toEqual(201);
    
    response = await request(app).post('/api/v1/users').send(
      {
        "name": "Diego Fernandes", 
        "email": "admin@example.com",
        "password": "password"
      }
    )

    expect(response.status).toEqual(400);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });
});
