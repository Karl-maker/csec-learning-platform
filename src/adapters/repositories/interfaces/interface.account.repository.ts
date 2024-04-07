import Account from "../../../entities/interfaces/interface.account.entity";
import IRepository from "./interface.repository";

export default interface AccountRepository<Model> extends IRepository<Account> {
    database: Model;
    findById: (id: number) => Promise<Account | null>;
}