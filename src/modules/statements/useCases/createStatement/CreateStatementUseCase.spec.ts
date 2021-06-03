import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository"
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase"
import { ICreateUserDTO } from "@modules/users/useCases/createUser/ICreateUserDTO"
import { AppError } from "@shared/errors/AppError"
import { CreateStatementUseCase } from "./CreateStatementUseCase"

let createStatementUseCase: CreateStatementUseCase
let statementRepositoryInMemory: InMemoryStatementsRepository
let usersRepositoryInMemory: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Create Deposits Or Withdraws", () => {

  beforeAll(() => {
    statementRepositoryInMemory = new InMemoryStatementsRepository();
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory, statementRepositoryInMemory);
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  })

  it("Should not be able to create a statement with incorrect ID" , async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: "Alexandre",
        email: "Alexandre@teste.com",
        password: "123456",
      };

      await createUserUseCase.execute(user);

      await createStatementUseCase.execute({
        user_id: "fail",
        amount: 100,
        description: "test",
        type: OperationType.DEPOSIT
      });
    }).rejects.toBeInstanceOf(AppError);
  })

  it("Should be able to create a deposit", async () => {
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

    expect(deposit).toHaveProperty("id");
  });

  it("Should be able to create a withdraw", async () => {
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

    const withdraw = await createStatementUseCase.execute({
      user_id: userCreated.id,
      amount: 50,
      description: "withdraw",
      type: OperationType.WITHDRAW
    });

    expect(withdraw).toHaveProperty("id");
  });

  it("Should not be able to create a withdraw with insufficient funds", async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: "Alexandre2",
        email: "Alexandre2@teste.com",
        password: "123456",
      };

      const userCreated = await createUserUseCase.execute(user);

      await createStatementUseCase.execute({
        user_id: userCreated.id,
        amount: 100,
        description: "deposit",
        type: OperationType.DEPOSIT
      });

      await createStatementUseCase.execute({
        user_id: userCreated.id,
        amount: 150,
        description: "withdraw",
        type: OperationType.WITHDRAW
      });
    }).rejects.toBeInstanceOf(AppError);
  });
})
