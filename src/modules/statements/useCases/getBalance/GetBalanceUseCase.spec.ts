import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let getBalanceUseCase: GetBalanceUseCase;
let usersRepository: InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository;

describe("Get Balance", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      statementsRepository,
      usersRepository
    );
  });

  it("should not be able to get balance if user not exist", () => {
    expect(async () => {
      await getBalanceUseCase.execute({
        user_id: "not-exist-user-id",
      });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });

  it("should be able to get balance", async () => {
    const user = await usersRepository.create({
      name: "Tester",
      email: "test@test.com",
      password: "test",
    });

    const statement = await statementsRepository.create({
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      amount: 101,
      description: "Initial deposit",
    });

    const data = await getBalanceUseCase.execute({
      user_id: user.id as string,
    });

    expect(data).toHaveProperty("balance");
    expect(data).toHaveProperty("statement");
    expect(data.statement.length).toEqual(1);
    expect(data.balance).toEqual(statement.amount);
  });
});
