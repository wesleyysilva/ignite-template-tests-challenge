import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";


let usersRepositoryInMemory: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate", () => {

  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory);
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("should be able to authenticate an user", async () => {
    const user: ICreateUserDTO = {
      name: "wesley",
      email: "wesleyysilva@yahoo.com.br",
      password: "bil",
    };

    await createUserUseCase.execute(user);

    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(result).toHaveProperty("token");
  });

  it("should not be able authenticate an user not exists", () => {

    expect(async () => {
      const result = await authenticateUserUseCase.execute({
        email: "silva@gmail.com",
        password: "123456",
      });

    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not be able authenticate with incorrect password", () => {

    expect(async () => {
      const user: ICreateUserDTO = {
        name: "silva",
        email: "silva@yahoo.com",
        password: "bil",

      };
      await createUserUseCase.execute(user);

      await authenticateUserUseCase.execute({
        email: "silva@yahoo.com",
        password: "654321",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});