import { hash } from "bcryptjs";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let usersRepositoryInMemory: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe("Authenticate User UseCase", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepositoryInMemory
    );
  });

  it("should be able to authenticate a user", async () => {
    const passwordHash = await hash("test", 8);

    const user = await usersRepositoryInMemory.create({
      name: "Tester",
      email: "test@test.com",
      password: passwordHash,
    });

    const data = await authenticateUserUseCase.execute({
      email: user.email,
      password: "test",
    });

    expect(data).toHaveProperty("user");
    expect(data).toHaveProperty("token");
  });

  it("should not be able to authenticate a user if email or password has incorrect", async () => {
    const passwordHash = await hash("test", 8);

    const user = await usersRepositoryInMemory.create({
      name: "Tester",
      email: "test@test.com",
      password: passwordHash,
    });

    expect(async () => {
      await authenticateUserUseCase.execute({
        email: user.email,
        password: "password-incorrect",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
