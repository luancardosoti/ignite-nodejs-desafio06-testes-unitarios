import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let createUseCase: CreateUserUseCase;

describe("Create User Case", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("should be able to create a new user", async () => {
    const user = await createUseCase.execute({
      name: "Tester",
      email: "test@test.com",
      password: "123456",
    });

    expect(user).toHaveProperty("id");
  });

  it("should not be able to create a new user if exists an user with same email", async () => {
    const user = await createUseCase.execute({
      name: "Tester",
      email: "test@test.com",
      password: "123456",
    });

    expect(async () => {
      await createUseCase.execute({
        name: "Tester",
        email: user.email,
        password: "123456",
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
