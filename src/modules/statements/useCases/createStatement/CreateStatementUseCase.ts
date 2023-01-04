import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { ICreateStatementDTO } from "./ICreateStatementDTO";
import { AppError } from "../../../../shared/errors/AppError";

@injectable()
export class CreateStatementUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ) { }

  async execute({ user_id, type, receiver_id, amount, description }: ICreateStatementDTO) {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new CreateStatementError.UserNotFound();
    }

    if (type === 'withdraw') {
      const { balance } = await this.statementsRepository.getUserBalance({ user_id });

      if (balance < amount) {
        throw new CreateStatementError.InsufficientFunds()
      }
    }

    if (type === 'transfer') {
      const { balance } = await this.statementsRepository.getUserBalance({ user_id });

      if (balance < amount) {
        throw new CreateStatementError.InsufficientFunds()
      }

      if (!receiver_id) {
        throw new AppError('A receiver must be specified.', 400)
      }

      if (receiver_id === user_id) {
        throw new AppError('You cannot transfer to yourself.', 400)
      }

      const receiver = this.usersRepository.findById(receiver_id);

      if (!receiver) {
        throw new AppError('Receiver not found.', 404)
      }

      await this.statementsRepository.create({
        user_id: receiver_id,
        type,
        sender_id: user_id,
        receiver_id: null,
        amount,
        description
      });

      // make the value negative
      amount = -1 * amount
    }

    const statementOperation = await this.statementsRepository.create({
      user_id,
      type,
      receiver_id,
      amount,
      description
    });

    return statementOperation;
  }
}
