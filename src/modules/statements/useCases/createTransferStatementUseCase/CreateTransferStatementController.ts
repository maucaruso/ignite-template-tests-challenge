import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { CreateTransferStatementUseCase } from './CreateTransferStatementUseCase';

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = "transfer",
}

export class CreateTransferStatementController {
  async execute(request: Request, response: Response) {
    const { id: sender_id } = request.user;
    const { user_id: user_id } = request.params;
    const { amount, description } = request.body;

    const type = OperationType.TRANSFER;

    const createTransferStatement = container.resolve(CreateTransferStatementUseCase);

    const statement = await createTransferStatement.execute({
      user_id,
      type,
      amount,
      description,
      sender_id
    });

    return response.status(201).json(statement);
  }
}
