import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { ICreateStatementDTO } from "./ICreateStatementDTO";

@injectable()
export class CreateStatementUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({received_id, user_id, type, amount, description }: ICreateStatementDTO) {
    const user = await this.usersRepository.findById(user_id);
    const user_received = await this.usersRepository.findById(received_id);

    if(!user) {
      throw new CreateStatementError.UserNotFound();
    }

    if(user_received && !user_received) {
      throw new CreateStatementError.UserNotFound();
    }

    if(type === 'withdraw' || type === 'transfers') {
      const { balance } = await this.statementsRepository.getUserBalance({ user_id });

      if (balance < amount) {
        throw new CreateStatementError.InsufficientFunds();
      }
    }
    try{
      const statementOperation = await this.statementsRepository.create({
        received_id,
        user_id,
        type,
        amount,
        description
      });

      return statementOperation;
    }catch(e) {
      console.log(e);
    }
  }
}
