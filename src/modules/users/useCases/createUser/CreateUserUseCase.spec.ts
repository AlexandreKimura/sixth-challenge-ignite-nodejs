import { AppError } from "@shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;

describe("Create User", () => {

  beforeAll(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  })

  it("Should be able to create a new user", async () => {
    const user = await createUserUseCase.execute({
      name: "Alexandre Teste",
      email: "alexandre@teste.com.br",
      password: "123456"
    });

    expect(user).toHaveProperty("id")
  });

  it("Should not be able to create a new user with the same email", () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "Alexandre Teste",
        email: "alexandre@teste.com.br",
        password: "123456"
      });

      await createUserUseCase.execute({
        name: "Alexandre Teste",
        email: "alexandre@teste.com.br",
        password: "123456"
      });
    }).rejects.toBeInstanceOf(AppError);
  })
})
