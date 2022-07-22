import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "../authenticateUser/AuthenticateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";

let usersRepositoryInMemory: InMemoryUsersRepository;
let authenticateUser: AuthenticateUserUseCase;
let showUserProfile: ShowUserProfileUseCase;

let createUserUseCase: CreateUserUseCase;

describe("Create User", () => {

	beforeEach(() => {
		usersRepositoryInMemory = new InMemoryUsersRepository();
		authenticateUser = new AuthenticateUserUseCase(usersRepositoryInMemory);
		createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);

		showUserProfile = new ShowUserProfileUseCase(usersRepositoryInMemory);
	});

	it("should be able to show a profile with user_id valid.", async () => {

		const user: ICreateUserDTO = {
			name: "wesley",
			email: "wesleyysilva@yahoo.com.br",
			password: "bil",
		};

		await createUserUseCase.execute(user);

		const result = await authenticateUser.execute({
			email: user.email,
			password: user.password,
		});

		const userProfile = await showUserProfile.execute(result.user.id);

		expect(result).toHaveProperty("token");
		expect(userProfile).toHaveProperty("id");
		expect(userProfile).toHaveProperty("email");
		expect(userProfile).toHaveProperty("name");

	});

	it("should not be able to show profile with user_id invalid", async () => {
		expect(async () => {

			await showUserProfile.execute("jj");

		}).rejects.toBeInstanceOf(ShowUserProfileError);
	});
});