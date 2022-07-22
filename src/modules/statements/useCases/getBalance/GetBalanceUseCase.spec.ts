import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { GetBalanceUseCase } from "./GetBalanceUseCase";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceError } from "./GetBalanceError";

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

let statementRepository: InMemoryStatementsRepository;
let userRepository: InMemoryUsersRepository;
let getBalance: GetBalanceUseCase;
let createUserUseCase: CreateUserUseCase;
let createStatement: CreateStatementUseCase;

describe("Create getBalance", () => {

  beforeEach(() => {
    statementRepository = new InMemoryStatementsRepository();
    userRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(userRepository);
    createStatement = new CreateStatementUseCase(userRepository, statementRepository);
    getBalance = new GetBalanceUseCase(statementRepository, userRepository);
  });

  it("should be able to execute balance of User", async () => {
    const user: ICreateUserDTO = {
      name: "wesley",
      email: "wesleyysilva@yahoo.com.br",
      password: "bil",
    };

    const userStatement = await createUserUseCase.execute(user);

    const statementDeposit: ICreateStatementDTO = {
      user_id: userStatement.id,
      type: OperationType.DEPOSIT,
      amount: Number(53.8),
      description: "Primerio Deposito"
    };

    const statementDeposit1: ICreateStatementDTO = {
      user_id: userStatement.id,
      type: OperationType.DEPOSIT,
      amount: Number(12.36),
      description: "Segundo Deposito"
    };

    const statementDeposit2: ICreateStatementDTO = {
      user_id: userStatement.id,
      type: OperationType.DEPOSIT,
      amount: Number(13.5),
      description: "Terceiro Deposito"
    };

    const statementWithdraw: ICreateStatementDTO = {
      user_id: userStatement.id,
      type: OperationType.WITHDRAW,
      amount: Number(25.75),
      description: "Primeiro Saque"
    };

    await createStatement.execute(statementDeposit);
    await createStatement.execute(statementDeposit1);
    await createStatement.execute(statementDeposit2);
    await createStatement.execute(statementWithdraw);

    const balance = await getBalance.execute({ user_id: userStatement.id });

    expect(balance).toHaveProperty("statement");
    expect(balance).toHaveProperty("balance");

    expect(balance.balance).toEqual(Number(53.91));
  });

  it("should not be able to balance if user not exists", async () => {
    expect(async () => {
      await getBalance.execute({ user_id: '987654321' });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});