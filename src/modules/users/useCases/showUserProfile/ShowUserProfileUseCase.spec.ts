import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let usersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show User Profile UseCase", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository);
  });

  it("should be able to get a user profile", async () => {
    const user = await usersRepository.create({
      name: "Tester",
      email: "test@test.com",
      password: "123456",
    });

    const userProfile = await showUserProfileUseCase.execute(user.id as string);

    expect(userProfile).toHaveProperty("id");
  });

  it("should not be able to get a user profile if user not exists", async () => {
    expect(async () => {
      await showUserProfileUseCase.execute("user-non-existent");
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
