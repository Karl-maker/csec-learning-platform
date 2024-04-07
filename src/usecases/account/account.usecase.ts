import CreateAccountDTO from "../../adapters/presenters/dto/account/account.create.dto";
import AccountRepository from "../../adapters/repositories/interfaces/interface.account.repository";
import GeneralAccount from "../../entities/concretes/general.account.entity";
import Account from "../../entities/interfaces/interface.account.entity";
import { CreateUseCaseResponse } from "../../types/usecase.type";

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

    async create(data: CreateAccountDTO) : Promise<CreateUseCaseResponse<Account>> {
        const account = new GeneralAccount({
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            password: data.password,
            id: null
        })

        try {
            const result = await this.accountRepository.save(account);
            return {
                data: result,
                success: true,
                message: 'Account Created Successfully'
            }
        } catch(err) {
            throw err;
        }

    }
}