import { AppError } from "../../../../shared/errors/AppError";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let userRepo: IUsersRepository;
let statementRepo: IStatementsRepository;
let useCase: GetBalanceUseCase;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Get Balance Use Case", () => {
  beforeEach(() => {
    userRepo = new InMemoryUsersRepository();
    statementRepo = new InMemoryStatementsRepository();
    useCase = new GetBalanceUseCase(statementRepo, userRepo);
    createUserUseCase = new CreateUserUseCase(userRepo);
    createStatementUseCase = new CreateStatementUseCase(userRepo, statementRepo);
  });

  it('Shouldnt allow to Get Balance for an unexisting User', async () => {

    expect( async () => {
      await useCase.execute({
        user_id: 'non-existing-user-id'
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('Should allow to Get 0 Balance', async () => {

    const name = 'Daniele Evangelista';
    const email = 'd.evangelista@rocketseat.com';
    const password = 'password';
    const user = await createUserUseCase.execute({ name, email, password });

    const balance = await useCase.execute({
      user_id: user.id as string, 
    });

    expect(balance.statement.length).toEqual(0);
    expect(balance.balance).toEqual(0);
  });

  it('Should allow to Get 50 Balance', async () => {

    const name = 'Daniele Evangelista';
    const email = 'd.evangelista@rocketseat.com';
    const password = 'password';
    const user = await createUserUseCase.execute({ name, email, password });

    await createStatementUseCase.execute({
      user_id: user.id as string, 
      type: OperationType.DEPOSIT, 
      amount: 50, 
      description: 'Lorem Ispum'
    });

    const balance = await useCase.execute({
      user_id: user.id as string, 
    });

    expect(balance.statement.length).toEqual(1);
    expect(balance.balance).toEqual(50);

  });

  it('Should allow to Get 250 Balance', async () => {

    const name = 'Daniele Evangelista';
    const email = 'd.evangelista@rocketseat.com';
    const password = 'password';
    const user = await createUserUseCase.execute({ name, email, password });

    await createStatementUseCase.execute({
      user_id: user.id as string, 
      type: OperationType.DEPOSIT, 
      amount: 500, 
      description: 'Pay Check'
    });

    await createStatementUseCase.execute({
      user_id: user.id as string, 
      type: OperationType.WITHDRAW, 
      amount: 200, 
      description: 'Ignite'
    });

    await createStatementUseCase.execute({
      user_id: user.id as string, 
      type: OperationType.WITHDRAW, 
      amount: 50, 
      description: 'Beer'
    });

    const balance = await useCase.execute({
      user_id: user.id as string, 
    });

    expect(balance.statement.length).toEqual(3);
    expect(balance.balance).toEqual(250);
  });
});
