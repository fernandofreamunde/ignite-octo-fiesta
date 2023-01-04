import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateStatementUseCase } from './CreateStatementUseCase';
import { OperationType } from '../../enums/OperationType';

export class CreateStatementController {
  async execute(request: Request, response: Response) {
    const { id: user_id } = request.user;
    const { amount, description } = request.body;
    const { receiver, operation } = request.params;
    let receiver_id = null;

    if (receiver) {
      receiver_id = receiver;
    }

    const type = operation as OperationType;

    const createStatement = container.resolve(CreateStatementUseCase);
    
    const statement = await createStatement.execute({
      user_id,
      type,
      receiver_id,
      amount,
      description
    });

    return response.status(201).json(statement);
  }
}
