import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository"
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase"
import { ICreateUserDTO } from "@modules/users/useCases/createUser/ICreateUserDTO"
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase"
import { GetBalanceUseCase } from "./GetBalanceUseCase"

let statementRepositoryInMemory: InMemoryStatementsRepository;
let usersRepositoryInMemory: InMemoryUsersRepository;
let getBalanceUseCase: GetBalanceUseCase;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("List Balance", () => {

  beforeAll(() => {
    statementRepositoryInMemory = new InMemoryStatementsRepository();
    usersRepositoryInMemory = new InMemoryUsersRepository();
    getBalanceUseCase = new GetBalanceUseCase(statementRepositoryInMemory, usersRepositoryInMemory);
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory, statementRepositoryInMemory);
  });

  it("Should not be able to list an user with incorrect ID" , async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: "Alexandre",
        email: "Alexandre@teste.com",
        password: "123456",
      };

      await createUserUseCase.execute(user);

      await getBalanceUseCase.execute({
        user_id: 'testFail',
      });
    })
  })

  it("Should be able to list all operations and total balance", async () => {

    const user: ICreateUserDTO = {
      name: "Alexandre",
      email: "Alexandre@teste.com",
      password: "123456",
    };

    const userBalance = await createUserUseCase.execute(user);

    await createStatementUseCase.execute({
      user_id: userBalance.id,
      amount: 100,
      description: "deposit",
      type: OperationType.DEPOSIT
    });

    await createStatementUseCase.execute({
      user_id: userBalance.id,
      amount: 50,
      description: "withdraw",
      type: OperationType.WITHDRAW
    });

    const balance = await getBalanceUseCase.execute({
      user_id: userBalance.id
    });

    expect(balance.balance).toEqual(50);
    expect(balance.statement.length).toEqual(2)
  })
})
