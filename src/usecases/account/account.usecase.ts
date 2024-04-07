import AccountRepository from "../../adapters/repositories/interfaces/interface.account.repository";
import Account from "../../entities/interfaces/interface.account.entity";

export default class AccountUseCase {
    private accountRepository: AccountRepository<any>;

    constructor(accountRepository: AccountRepository<any>) {
        this.accountRepository = accountRepository; 
    }
    
    async login(unique_identifier: string, password: string) : Promise<Account | null> {
        return null;
    }

    async findById(id: number) : Promise<Account | null> {
        const result = await this.accountRepository.findById(id);
        return result;
    }
}