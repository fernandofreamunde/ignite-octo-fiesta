import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;
let id: string;

describe('Get Statement Operation Controller', () => {

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  it('should be able to read a statement', async () => {
    
    let response = await request(app).post('/api/v1/users').send(
      {
        "name": "Fernando Andrade", 
        "email": "f.andrade@rocketseat.com",
        "password": "password"
      }
    )
    expect(response.status).toEqual(201);
    
    response = await request(app).post('/api/v1/sessions').send(
      {
        "email": "f.andrade@rocketseat.com",
        "password": "password"
      }
    )
    expect(response.status).toEqual(200);
    const { token } = response.body;
    
    response = await request(app).post('/api/v1/statements/deposit').send(
      {
        "amount": 250,
        "description": "pay check"
      }
    ).set({
      Authorization: `Bearer ${token}`
    });
    expect(response.status).toEqual(201);
    
    response = await request(app).post('/api/v1/statements/deposit').send(
      {
        "amount": 250,
        "description": "pay check"
      }
    ).set({
      Authorization: `Bearer ${token}`
    });
    expect(response.status).toEqual(201);
    id = response.body.id;

    response = await request(app).get(`/api/v1/statements/${id}`).set({
      Authorization: `Bearer ${token}`
    })

    expect(response.status).toEqual(200);
  });

  it('should not allow Anonimous user to get Satatement', async () => {
    
    const response = await request(app).get(`/api/v1/statements/${id}`);

    expect(response.status).toEqual(401);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });
});
