import { AccountType } from "../../types/account.type";
import Account from "../interfaces/interface.account.entity";

abstract class AbstractAccount implements Account {
    public id: number | null;
    public email: string;
    public password: string;
    public first_name: string | null;
    public last_name: string | null;

    constructor(data: AccountType) {
        this.id = ('id' in data) ? data.id : null; 
        this.email = data.email;
        this.password = data.password;
        this.first_name = data.first_name;
        this.last_name = data.last_name;
    }
}

export default AbstractAccount;
