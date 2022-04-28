import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

import { CreateStatementError } from "./CreateStatementError";

let usersRepository: InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

describe("Create Statement", () => {
  beforeEach(() => {
    statementsRepository = new InMemoryStatementsRepository();
    usersRepository = new InMemoryUsersRepository();
    createStatementUseCase = new CreateStatementUseCase(
      usersRepository,
      statementsRepository
    );
  });

  it("shold not be able to create a new statement if user not exist", async () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: "user_fake",
        type: OperationType.DEPOSIT,
        amount: 100,
        description: "Initial deposit",
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("shold be able to create a new deposit statement", async () => {
    const user = await usersRepository.create({
      name: "Tester",
      email: "test@test.com",
      password: "test",
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "Initial deposit",
    });

    expect(statement).toHaveProperty("id");
    expect(statement.amount).toEqual(100);
    expect(statement.type).toEqual(OperationType.DEPOSIT);
  });

  it("shold be able to create a new withdraw statement if sufficient funds", async () => {
    const user = await usersRepository.create({
      name: "Tester",
      email: "test@test.com",
      password: "test",
    });

    await createStatementUseCase.execute({
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      amount: 4500,
      description: "Initial deposit",
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id as string,
      type: OperationType.WITHDRAW,
      amount: 1500,
      description: "first withdraw",
    });

    expect(statement).toHaveProperty("id");
    expect(statement.amount).toEqual(1500);
    expect(statement.type).toEqual(OperationType.WITHDRAW);
  });

  it("shold not be able to create a new withdraw statement if insufficient funds", async () => {
    const user = await usersRepository.create({
      name: "Tester",
      email: "test@test.com",
      password: "test",
    });

    await createStatementUseCase.execute({
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "Initial deposit",
    });

    expect(async () => {
      await createStatementUseCase.execute({
        user_id: user.id as string,
        type: OperationType.WITHDRAW,
        amount: 1000,
        description: "first withdraw",
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
});
