import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { ICreateStatementDTO } from "./ICreateStatementDTO";
import { CreateStatementError } from "./CreateStatementError";
import { AppError } from "../../../../shared/errors/AppError";
enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}


let statementRepository: InMemoryStatementsRepository;
let userRepository: InMemoryUsersRepository;
let createStatement: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Create Statement", () => {

  beforeEach(() => {
    statementRepository = new InMemoryStatementsRepository();
    userRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(userRepository);
    createStatement = new CreateStatementUseCase(userRepository, statementRepository);
  });

  it("should be able to create statement", async () => {
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

    const statementWithdraw: ICreateStatementDTO = {
      user_id: userStatement.id,
      type: OperationType.WITHDRAW,
      amount: Number(5.33),
      description: "Primerio Saque"
    };
    const result = await createStatement.execute(statementDeposit);

    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("user_id");
    expect(result).toHaveProperty("type");
    expect(result).toHaveProperty("amount");

    const resultWithdraw = await createStatement.execute(statementWithdraw);

    expect(resultWithdraw).toHaveProperty("id");
    expect(resultWithdraw).toHaveProperty("user_id");
    expect(resultWithdraw).toHaveProperty("type");
    expect(resultWithdraw).toHaveProperty("amount");
  });

  it("should not be able to withdraw with amount <= 0", async () => {
    expect(async () => {

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

      await createStatement.execute(statementDeposit);

      const statementWithdraw: ICreateStatementDTO = {
        user_id: userStatement.id,
        type: OperationType.WITHDRAW,
        amount: Number(25.33),
        description: "Primerio Saque"
      };

      await createStatement.execute(statementWithdraw);
      await createStatement.execute(statementWithdraw);
      await createStatement.execute(statementWithdraw);

    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });

  it("should not be able create statement if user not exists.  ", async () => {
    expect(async () => {
      const statementDeposit: ICreateStatementDTO = {
        user_id: '33355888',
        type: OperationType.WITHDRAW,
        amount: Number(53.8),
        description: "Primerio Saque"
      };

      await createStatement.execute(statementDeposit);

    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

});