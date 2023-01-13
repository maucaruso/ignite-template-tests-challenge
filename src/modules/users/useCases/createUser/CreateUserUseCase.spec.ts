import { rejects } from "assert";
import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Create User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("Should be able to create a new user", async () => {
    const user = {
      "name": "username",
      "email": "username@test.com",
      "password": "password"
    }

    await createUserUseCase.execute(user);

    const createdUser = await inMemoryUsersRepository.findByEmail(user.email);

    expect(createdUser).toHaveProperty("id");
    expect(createdUser).toHaveProperty("email");
    expect(createdUser).toHaveProperty("name");
    expect(createdUser).toHaveProperty("password");
    expect(createdUser?.email).toBe(user.email);
    expect(createdUser?.name).toBe(user.name);
  });

  it("Should not be able to create a new user with an existing email", async () => {
    const user = {
      "name": "username",
      "email": "username@test.com",
      "password": "password"
    }

    expect(async () => {
      await createUserUseCase.execute(user);
      await createUserUseCase.execute(user);
    }).rejects.toBeInstanceOf(AppError);
  });
});
