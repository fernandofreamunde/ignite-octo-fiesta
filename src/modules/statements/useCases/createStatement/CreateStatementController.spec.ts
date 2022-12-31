import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";

let connection : Connection;

describe('Create Statement Controller', () => {

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  it('should not allow Anonimous user to create Satatement', async () => {
    
    const response = await request(app).post('/api/v1/statements/deposit').send(
      {
        "amount": "2500",
        "description": "pay check"
      }
    )

    expect(response.status).toEqual(401);
  });

  it('should be able to create a Statement', async () => {
    
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
  });

  it('should not be Able to Withdraw more than balance', async () => {
    
    let response = await request(app).post('/api/v1/sessions').send(
      {
        "email": "f.andrade@rocketseat.com",
        "password": "password"
      }
    )
    expect(response.status).toEqual(200);
    const { token } = response.body;
        
    response = await request(app).post('/api/v1/statements/withdraw').send(
      {
        "amount": 500,
        "description": "Pizza"
      }
    ).set({
      Authorization: `Bearer ${token}`
    });
    
    expect(response.status).toEqual(400);
    expect(response.body.message).toEqual('Insufficient funds');
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });
});
