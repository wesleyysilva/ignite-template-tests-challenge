import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { CreateUserError } from "./CreateUserError";
import { ICreateUserDTO } from "./ICreateUserDTO";

let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User", () => {

  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("should be able to create an user", async () => {
    const user: ICreateUserDTO = {
      name: "wesley",
      email: "wesleyysilva@yahoo.com.br",
      password: "bil",
    };

    const result = await createUserUseCase.execute(user);

    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("name");
    expect(result).toHaveProperty("email");
    expect(result).toHaveProperty("password");
  });

  it("should not be able to create an duplicated user", async () => {
    expect(async () => {

      const user: ICreateUserDTO = {
        name: "wesley",
        email: "wesleyysilva@yahoo.com.br",
        password: "bil",
      };

      await createUserUseCase.execute(user);
      await createUserUseCase.execute(user);

    }).rejects.toBeInstanceOf(CreateUserError);
  });
});