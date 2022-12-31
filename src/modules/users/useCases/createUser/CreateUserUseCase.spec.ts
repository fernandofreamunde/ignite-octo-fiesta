import { AppError } from "../../../../shared/errors/AppError";
import { User } from "../../entities/User";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";

let userRepo: IUsersRepository;
let useCase: CreateUserUseCase;

describe("Create User Use Case", () => {
  beforeEach(() => {
    userRepo = new InMemoryUsersRepository();
    useCase = new CreateUserUseCase(userRepo);
  });

  it('Should allow to create a User', async () => {

    const name = 'Daniele Evangelista';
    const email = 'd.evangelista@rocketseat.com';
    const password = 'password';

    const user = await useCase.execute({ name, email, password });

    expect(user).toBeTruthy();
    expect(user).toBeInstanceOf(User);
    expect(user.name).toEqual(name);
    expect(user.email).toEqual(email);
  });

  it('Should not allow to create a duplicated User', async () => {

    expect( async () => {

      const name = 'Daniele Evangelista';
      const email = 'd.evangelista@rocketseat.com';
      const password = 'password';
      
      await useCase.execute({ name, email, password });
      await useCase.execute({ name, email, password });
      
    }).rejects.toBeInstanceOf(AppError)
  });
});
