import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let getBalanceUseCase: GetBalanceUseCase;

describe("Get User Account Balance", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository);
  });

  it("should return the user balance", async () => {
    const user = {
      "name": "username",
      "email": "username@test.com",
      "password": "password"
    }

    await createUserUseCase.execute(user);
    const createdUser = await inMemoryUsersRepository.findByEmail(user.email);

    if (createdUser?.id) {
      const response = await getBalanceUseCase.execute({ user_id: createdUser.id });

      expect(response).toHaveProperty("statement");
      expect(response).toHaveProperty("balance");
    }
  });
});
