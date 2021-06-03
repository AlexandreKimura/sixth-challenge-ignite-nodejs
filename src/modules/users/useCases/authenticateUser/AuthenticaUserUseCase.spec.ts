import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { AppError } from "@shared/errors/AppError";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"

let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () => {

  beforeAll(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory);
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("Should be able to authenticate an user", async () => {
    const user: ICreateUserDTO ={
      name: "Alexandre",
      email: "Alexandre@teste.com",
      password: "123456",
    };

    await createUserUseCase.execute(user);

    const userAuthenticate = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(userAuthenticate).toHaveProperty("token");
  });

  it("Should not be able to authenticate an user with incorrect email or password", async () => {
    expect(async () => {
      const user: ICreateUserDTO ={
        name: "Alexandre1",
        email: "Alexandre1@teste.com",
        password: "123456",
      };

      await createUserUseCase.execute(user);

      await authenticateUserUseCase.execute({
        email: 'alexandre2@teste.com.br',
        password: user.password,
      });
    }).rejects.toBeInstanceOf(AppError)
  })

  it("Should not be able to authenticate an nonexistent user", async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: 'false@teste.com.br',
        password: '123456',
      });
    }).rejects.toBeInstanceOf(AppError)
  })
})
