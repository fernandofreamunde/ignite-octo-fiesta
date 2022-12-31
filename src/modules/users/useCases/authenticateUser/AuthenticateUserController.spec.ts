import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";

let connection : Connection;

describe('Authenticate User Controller', () => {

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  it('should not be able to Authenticate User without account', async () => {
    
    const response = await request(app).post('/api/v1/sessions').send(
      {
        "email": "d.fernandoes@rocketseat.com",
        "password": "password"
      }
    )

    expect(response.status).toEqual(401);
  });

  it('should be able to Authenticate User', async () => {
    
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
    
    expect(response.body.token).toBeDefined();
    expect(response.body.user.name).toEqual('Diego Fernandes');
    expect(response.body.user.email).toEqual('d.fernandoes@rocketseat.com');   
  });

  it('should not be able to Authenticate User with bad password', async () => {
    
    let response = await request(app).post('/api/v1/sessions').send(
      {
        "email": "d.fernandoes@rocketseat.com",
        "password": "bad-password"
      }
    )

    expect(response.status).toEqual(401);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });
});
