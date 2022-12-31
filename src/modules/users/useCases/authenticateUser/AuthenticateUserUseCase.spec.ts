import { AppError } from "../../../../shared/errors/AppError";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let userRepo: IUsersRepository;
let useCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User Use Case", () => {
  beforeEach(() => {
    userRepo = new InMemoryUsersRepository();
    useCase = new AuthenticateUserUseCase(userRepo);
    createUserUseCase = new CreateUserUseCase(userRepo);
  });

  it('Should allow to Authenticate an unexisting User', async () => {

    const email = 'd.evangelista@rocketseat.com';
    const password = 'password';
    expect( async () => {
      await useCase.execute({ email, password });
    }).rejects.toBeInstanceOf(AppError)

  });

  it('Should allow to Authenticate a User with a bad Password', async () => {

    const name = 'Daniele Evangelista';
    const email = 'd.evangelista@rocketseat.com';
    const password = 'password';
    await createUserUseCase.execute({ name, email, password });

    expect( async () => {
      await useCase.execute({ email, password: 'bad-password' });
    }).rejects.toBeInstanceOf(AppError)

  });

  it('Should allow to Authenticate User', async () => {

    const name = 'Daniele Evangelista';
    const email = 'd.evangelista@rocketseat.com';
    const password = 'password';

    await createUserUseCase.execute({ name, email, password });
    const response = await useCase.execute({ email, password });
  
    expect(response).toBeTruthy();
    expect(response.user.id).toBeTruthy();
    expect(response.user.name).toEqual(name);
    expect(response.user.email).toEqual(email);
    expect(response.token).toBeTruthy();
  });
});
