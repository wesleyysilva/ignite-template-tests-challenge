import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";

import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

let statementRepository: InMemoryStatementsRepository;
let userRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let createStatement: CreateStatementUseCase;

let getStatmentOperation: GetStatementOperationUseCase;

describe("Create GetStatementOperation", () => {

  beforeEach(() => {
    statementRepository = new InMemoryStatementsRepository();
    userRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(userRepository);
    createStatement = new CreateStatementUseCase(userRepository, statementRepository);

    getStatmentOperation = new GetStatementOperationUseCase(userRepository, statementRepository);
  });

  it("should be able to get Statement Operation", async () => {
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
    const statement = await createStatement.execute(statementDeposit1);
    await createStatement.execute(statementDeposit2);
    await createStatement.execute(statementWithdraw);

    const operation = await getStatmentOperation.execute({
      user_id: userStatement.id,
      statement_id: statement.id
    });

    expect(operation).toHaveProperty("amount");
    expect(operation).toHaveProperty("type");

    expect(operation.amount).toEqual(12.36);
    expect(operation.type).toEqual(OperationType.DEPOSIT);
  });

  it("should not be able to getStatement when statement not exists", async () => {
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

      await createStatement.execute(statementDeposit);
      const statement = await createStatement.execute(statementDeposit1);
      await createStatement.execute(statementDeposit2);

      const operation = await getStatmentOperation.execute({
        user_id: userStatement.id,
        statement_id: statement.id
      });

      const newoperation = await getStatmentOperation.execute({
        user_id: userStatement.id,
        statement_id: "665554488999"
      });

    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });

  it("should not be able to getStatement when user not exists", async () => {
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

      await createStatement.execute(statementDeposit);
      const statement = await createStatement.execute(statementDeposit1);
      await createStatement.execute(statementDeposit2);

      const operation = await getStatmentOperation.execute({
        user_id: userStatement.id,
        statement_id: statement.id
      });

      const newoperation = await getStatmentOperation.execute({
        user_id: "65465648888",
        statement_id: statement.id
      });

    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

});