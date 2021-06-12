import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository"
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase"
import { ICreateUserDTO } from "@modules/users/useCases/createUser/ICreateUserDTO"
import { AppError } from "@shared/errors/AppError"
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase"
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase"

let getStatementOperationUseCase: GetStatementOperationUseCase
let statementRepositoryInMemory: InMemoryStatementsRepository
let usersRepositoryInMemory: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase
let createStatementUseCase: CreateStatementUseCase

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFERS = 'transfers',
}

describe("List a operation", () => {

  beforeAll(() => {
    statementRepositoryInMemory = new InMemoryStatementsRepository();
    usersRepositoryInMemory = new InMemoryUsersRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepositoryInMemory, statementRepositoryInMemory);
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory, statementRepositoryInMemory);
  })

  it("Should not be able to create a statement with incorrect ID" , async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: "Alexandre",
        email: "Alexandre@teste.com",
        password: "123456",
      };

      await createUserUseCase.execute(user);

      await getStatementOperationUseCase.execute({
        user_id: "fail",
        statement_id: '100',
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Should be able to list a operation by statement ID", async () => {
    const user: ICreateUserDTO = {
      name: "Alexandre",
      email: "Alexandre@teste.com",
      password: "123456",
    };

    const userCreated = await createUserUseCase.execute(user);

    const deposit = await createStatementUseCase.execute({
      user_id: userCreated.id,
      amount: 100,
      description: "deposit",
      type: OperationType.DEPOSIT
    });

    const statementOperation = await getStatementOperationUseCase.execute({
      user_id: userCreated.id,
      statement_id: deposit.id,
    });

    expect(statementOperation).toHaveProperty("id");
  });

  it("Should not be to list a operation by incorrect statement ID", async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: "Alexandre1",
        email: "Alexandre1@teste.com",
        password: "123456",
      };

      const userCreated = await createUserUseCase.execute(user);

      await createStatementUseCase.execute({
        user_id: userCreated.id,
        amount: 100,
        description: "deposit",
        type: OperationType.DEPOSIT
      });

      await getStatementOperationUseCase.execute({
        user_id: userCreated.id,
        statement_id: 'fakeStatement',
      });
    }).rejects.toBeInstanceOf(AppError);
  });
})
