import { AppError } from "../../../../shared/errors/AppError";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let userRepo: IUsersRepository;
let statementRepo: IStatementsRepository;
let useCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Create Statement Use Case", () => {
  beforeEach(() => {
    userRepo = new InMemoryUsersRepository();
    statementRepo = new InMemoryStatementsRepository();
    useCase = new CreateStatementUseCase(userRepo, statementRepo);
    createUserUseCase = new CreateUserUseCase(userRepo);
  });

  it('Shouldnt allow to Create Statement for an unexisting User', async () => {

    expect( async () => {
      await useCase.execute({
        user_id: 'non-existing-user-id', 
        type: OperationType.DEPOSIT, 
        amount: 10, 
        description: 'Lorem Ispum'
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('Shouldnt allow to withdraw With Unsufficient funds', async () => {

    const name = 'Daniele Evangelista';
    const email = 'd.evangelista@rocketseat.com';
    const password = 'password';
    const user = await createUserUseCase.execute({ name, email, password });

    expect( async () => {
      await useCase.execute({
        user_id: user.id as string, 
        type: OperationType.WITHDRAW, 
        amount: 10, 
        description: 'Lorem Ispum'
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('Should allow to deposit funds', async () => {

    const name = 'Daniele Evangelista';
    const email = 'd.evangelista@rocketseat.com';
    const password = 'password';
    const user = await createUserUseCase.execute({ name, email, password });

    const depositStatement = await useCase.execute({
      user_id: user.id as string, 
      type: OperationType.DEPOSIT, 
      amount: 50, 
      description: 'Lorem Ispum'
    });

    expect(depositStatement.id).toBeDefined();
    expect(depositStatement.user_id).toEqual(user.id);
    expect(depositStatement.type).toEqual(OperationType.DEPOSIT);
    expect(depositStatement.amount).toEqual(50);
    expect(depositStatement.description).toEqual('Lorem Ispum');

  });

  it('Should allow to withdrawl funds', async () => {

    const name = 'Daniele Evangelista';
    const email = 'd.evangelista@rocketseat.com';
    const password = 'password';
    const user = await createUserUseCase.execute({ name, email, password });

    await useCase.execute({
      user_id: user.id as string, 
      type: OperationType.DEPOSIT, 
      amount: 50, 
      description: 'Lorem Ispum'
    });

    const withdrawlStatement = await useCase.execute({
      user_id: user.id as string, 
      type: OperationType.WITHDRAW, 
      amount: 25, 
      description: 'pizza night'
    });

    expect(withdrawlStatement.id).toBeDefined();
    expect(withdrawlStatement.user_id).toEqual(user.id);
    expect(withdrawlStatement.type).toEqual(OperationType.WITHDRAW);
    expect(withdrawlStatement.amount).toEqual(25);
    expect(withdrawlStatement.description).toEqual('pizza night');
  });

});
