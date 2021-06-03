import { User } from "@modules/users/entities/User";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository"
import { AppError } from "@shared/errors/AppError";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO"
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase"

let showUserProfileUseCase: ShowUserProfileUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Show user's profile", () => {

  beforeAll(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepositoryInMemory);
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  })

  it("Should be able to list an authenticate user by ID", async () => {
    const user: ICreateUserDTO = {
      name: "Alexandre",
      email: "Alexandre@teste.com",
      password: "123456",
    };

    const userCreated = await createUserUseCase.execute(user);

    const listUser = await showUserProfileUseCase.execute(userCreated.id);

    expect(listUser).toBeInstanceOf(User);
  });

  it("Should not be able to list an user by incorrect ID", async () => {
    expect(async () => {
       await showUserProfileUseCase.execute('incorrect');
    }).rejects.toBeInstanceOf(AppError)
  });
})
