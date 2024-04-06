import { Action } from "../../types/utils.type";

interface Account {
    id: number | null;
    email: string;
    password: string;
    first_name: string | null;
    last_name: string | null;
}

export default Account;