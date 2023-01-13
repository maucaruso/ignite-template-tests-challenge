import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show User Profile", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
  });

  it ("Should be able to show a user profile by user id", async () => {
    const user = {
      "name": "username",
      "email": "username@test.com",
      "password": "password"
    }

    await createUserUseCase.execute(user);

    const createdUser = await inMemoryUsersRepository.findByEmail(user.email);

    if (createdUser?.id) {
      const response = await showUserProfileUseCase.execute(createdUser.id);
      expect(response.id).toBe(createdUser.id);
    }
  });
});
