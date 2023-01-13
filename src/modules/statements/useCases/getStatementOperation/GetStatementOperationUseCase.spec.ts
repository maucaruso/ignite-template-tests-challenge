import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Show Statement", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  });

  it("should be able to show a statement by it's id", async () => {
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

      const statement = await createStatementUseCase.execute(operation);

      if (statement?.id) {
        const response = await getStatementOperationUseCase.execute({ user_id: createdUser.id, statement_id: statement.id });

        expect(response).toHaveProperty("id");
        expect(response).toHaveProperty("user_id");
        expect(response).toHaveProperty("type");
        expect(response).toHaveProperty("amount");
        expect(response).toHaveProperty("description");
      }
    }
  });

  it("should not be able to show an unexisting statement", async () => {
    const user = {
      "name": "username",
      "email": "username@test.com",
      "password": "password"
    }

    const createdUser = await createUserUseCase.execute(user);

    expect(async () => {
      if (createdUser?.id) {
        await getStatementOperationUseCase.execute({ user_id: createdUser.id, statement_id: "test_id" });
      }
    }).rejects.toBeInstanceOf(AppError);

  });
});
