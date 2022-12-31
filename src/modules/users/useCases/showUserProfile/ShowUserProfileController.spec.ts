import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";

let connection : Connection;

describe('Show User Profile Controller', () => {

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  it('should be able to show a User profile', async () => {
    
    let response = await request(app).post('/api/v1/users').send(
      {
        "name": "Diego Fernandes", 
        "email": "d.fernandoes@rocketseat.com",
        "password": "password"
      }
    )
    expect(response.status).toEqual(201);
    
    response = await request(app).post('/api/v1/sessions').send(
      {
        "email": "d.fernandoes@rocketseat.com",
        "password": "password"
      }
    )
    expect(response.status).toEqual(200);
    const { token } = response.body;
    
    response = await request(app).get('/api/v1/profile').set({
      Authorization: `Bearer ${token}`
    });
    
    expect(response.status).toEqual(200);
    
    expect(response.body.id).toBeDefined();
    expect(response.body.name).toEqual('Diego Fernandes');
    expect(response.body.email).toEqual('d.fernandoes@rocketseat.com');
    expect(response.body.created_at).toBeDefined();
    expect(response.body.updated_at).toBeDefined();    
  });

  it('should not be able to show a User profile to an Anonimous user', async () => {
    
    const response = await request(app).get('/api/v1/profile')

    expect(response.status).toEqual(401);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });
});
