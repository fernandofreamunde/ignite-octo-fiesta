import { AppError } from "../../../../shared/errors/AppError";
import { User } from "../../entities/User";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let userRepo: IUsersRepository;
let useCase: ShowUserProfileUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Show User Profile Use Case", () => {
  beforeEach(() => {
    userRepo = new InMemoryUsersRepository();
    useCase = new ShowUserProfileUseCase(userRepo);
    createUserUseCase = new CreateUserUseCase(userRepo);
  });

  it('Should allow to show User profile', async () => {

    expect( async () => {
      const profile = await useCase.execute('fake-user-id');
      
    }).rejects.toBeInstanceOf(AppError)

  });

  it('Should allow to show User profile', async () => {

    const name = 'Daniele Evangelista';
    const email = 'd.evangelista@rocketseat.com';
    const password = 'password';

    const user = await createUserUseCase.execute({ name, email, password });
    const profile = await useCase.execute(user.id as string);

    expect(profile).toBeTruthy();
    expect(profile).toBeInstanceOf(User);
    expect(profile.name).toEqual(name);
    expect(profile.email).toEqual(email);
  });
});
