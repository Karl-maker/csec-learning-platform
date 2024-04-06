import { AccountType } from "../../types/account.type";
import AbstractAccount from "../abstracts/abstract.account.entity";
import Account from "../interfaces/interface.account.entity";
/**
 * @desc Entity type for Account
 */

export default class GeneralAccount extends AbstractAccount implements Account {
    constructor(data: AccountType) {
        super(data)
    }
}
