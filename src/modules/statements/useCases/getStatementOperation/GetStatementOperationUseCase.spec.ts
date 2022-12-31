import { AppError } from "../../../../shared/errors/AppError";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let userRepo: IUsersRepository;
let statementRepo: IStatementsRepository;
let useCase: GetStatementOperationUseCase;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Get Statement Operation Use Case", () => {
  beforeEach(() => {
    userRepo = new InMemoryUsersRepository();
    statementRepo = new InMemoryStatementsRepository();
    useCase = new GetStatementOperationUseCase(userRepo, statementRepo);
    createUserUseCase = new CreateUserUseCase(userRepo);
    createStatementUseCase = new CreateStatementUseCase(userRepo, statementRepo);
  });

  it('Shouldnt allow to Get Statement Operation for an unexisting User', async () => {

    expect( async () => {
      await useCase.execute({
        user_id: 'non-existing-user-id', 
        statement_id:'non-existing-statement-id'
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('Shouldnt allow to Get Statement Operation with unexisting statement id', async () => {

    const name = 'Daniele Evangelista';
    const email = 'd.evangelista@rocketseat.com';
    const password = 'password';
    const user = await createUserUseCase.execute({ name, email, password });

    expect( async () => {
      await useCase.execute({
        user_id: user.id as string, 
        statement_id:'non-existing-statement-id'
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('Should allow to Get Statement', async () => {

    const name = 'Daniele Evangelista';
    const email = 'd.evangelista@rocketseat.com';
    const password = 'password';
    const user = await createUserUseCase.execute({ name, email, password });

    const operation = await createStatementUseCase.execute({
      user_id: user.id as string, 
      type: OperationType.DEPOSIT, 
      amount: 50, 
      description: 'Lorem Ispum'
    });

    const statement = await useCase.execute({
      user_id: user.id as string, 
      statement_id: operation.id as string
    });

    expect(statement.user_id).toEqual(user.id);
    expect(statement.type).toEqual(OperationType.DEPOSIT);
    expect(statement.amount).toEqual(50);
    expect(statement.description).toEqual('Lorem Ispum');
  });
});
