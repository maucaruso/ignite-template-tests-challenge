import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;

describe("Create a new Statement", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  });

  it("should create a new deposit statement", async () => {
    const user = {
      "name": "username",
      "email": "username@test.com",
      "password": "password"
    }

    const createdUser = await createUserUseCase.execute(user);

    if (createdUser?.id) {
      const operation = {
        user_id: createdUser.id,
        type: OperationType.DEPOSIT,
        amount: 100,
        description: "test deposit"
      }

      const response = await createStatementUseCase.execute(operation);

      expect(response).toHaveProperty("id");
      expect(response).toHaveProperty("user_id");
      expect(response).toHaveProperty("type");
      expect(response).toHaveProperty("amount");
      expect(response).toHaveProperty("description");
    }
  });

  it("should create a new withdraw statement", async () => {
    const user = {
      "name": "username",
      "email": "username@test.com",
      "password": "password"
    }

    const createdUser = await createUserUseCase.execute(user);

    if (createdUser?.id) {
      const deposit = {
        user_id: createdUser.id,
        type: OperationType.DEPOSIT,
        amount: 100,
        description: "test deposit"
      }

      await createStatementUseCase.execute(deposit);

      const withdraw = {
        user_id: createdUser.id,
        type: OperationType.WITHDRAW,
        amount: 100,
        description: "test withdraw"
      }

      const response = await createStatementUseCase.execute(withdraw);

      expect(response).toHaveProperty("id");
      expect(response).toHaveProperty("user_id");
      expect(response).toHaveProperty("type");
      expect(response).toHaveProperty("amount");
      expect(response).toHaveProperty("description");
    }
  });

  it("should not be able to create a new withdraw statement if account hasn't enought balance", async () => {
    const user = {
      "name": "username",
      "email": "username@test.com",
      "password": "password"
    }

    const createdUser = await createUserUseCase.execute(user);

    if (createdUser?.id) {
      const withdraw = {
        user_id: createdUser.id,
        type: OperationType.WITHDRAW,
        amount: 100,
        description: "test withdraw"
      }

      expect(async () => {
        await createStatementUseCase.execute(withdraw);
      }).rejects.toBeInstanceOf(AppError);
    }
  });
});
