import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository"
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase"
import { ICreateUserDTO } from "@modules/users/useCases/createUser/ICreateUserDTO"
import { AppError } from "@shared/errors/AppError"
import { CreateStatementError } from "./CreateStatementError"
import { CreateStatementUseCase } from "./CreateStatementUseCase"

let createStatementUseCase: CreateStatementUseCase
let statementRepositoryInMemory: InMemoryStatementsRepository
let usersRepositoryInMemory: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFERS = 'transfers',
}

describe("Create Deposits, Withdraws and Transfers", () => {

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

  it("Should be able to create a transfer", async () => {
    const user: ICreateUserDTO = {
      name: "Alexandre3",
      email: "Alexandre3@teste.com",
      password: "123456",
    };

    const user_receiver: ICreateUserDTO = {
      name: "Alexandre4",
      email: "Alexandre4@teste.com",
      password: "123456",
    };

    const userSender = await createUserUseCase.execute(user);
    const userReceiver = await createUserUseCase.execute(user_receiver);

    await createStatementUseCase.execute({
      user_id: userSender.id,
      amount: 100,
      description: "deposit",
      type: OperationType.DEPOSIT
    });

    const transfer = await createStatementUseCase.execute({
      received_id: userReceiver.id,
      user_id: userSender.id,
      amount: 100,
      description: "transfer",
      type: OperationType.TRANSFERS,
    });

    expect(transfer).toHaveProperty("id");
  });

  it("Should not be able to create a transfer with insufficient founds", async () => {
    const user: ICreateUserDTO = {
      name: "Alexandre5",
      email: "Alexandre5@teste.com",
      password: "123456",
    };

    const user_receiver: ICreateUserDTO = {
      name: "Alexandre6",
      email: "Alexandre6@teste.com",
      password: "123456",
    };

    const userSender = await createUserUseCase.execute(user);
    const userReceiver = await createUserUseCase.execute(user_receiver);

    await createStatementUseCase.execute({
      user_id: userSender.id,
      amount: 100,
      description: "deposit",
      type: OperationType.DEPOSIT
    });

    expect(async () => {
      await createStatementUseCase.execute({
        received_id: userReceiver.id,
        user_id: userSender.id,
        amount: 110,
        description: "transfer",
        type: OperationType.TRANSFERS,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

})
