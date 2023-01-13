import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Authenticate User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUsersRepository
    );
  });

  it("Should be able to authenticate and generate a Token to an existing user", async () => {
    const user = {
      "name": "username",
      "email": "username@test.com",
      "password": "password"
    }

    await createUserUseCase.execute(user);

    const response = await authenticateUserUseCase.execute({ email: user.email, password: user.password});

    expect(response).toHaveProperty("token");
  });

  it("Should not be able to authenticate and generate a Token to an unexisting user", () => {
    expect(async () => {
      await authenticateUserUseCase.execute({ email: "notexistuser@test.com", password: "password"});
    }).rejects.toBeInstanceOf(AppError);
  });
});
