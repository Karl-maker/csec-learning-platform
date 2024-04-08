import { AccountType } from "../../types/account.type";
import { StudentType } from "../../types/student.type";
import { Action } from "../../types/utils.type";
import Student from "../interfaces/interface.student.entity";

abstract class AbstractStudent implements Student {
    public id: number | null;
    public username: string | null;
    public school: { id?: number | undefined; name?: string | undefined; } & { to_be?: Action | undefined; };
    public points?: number;
    public account_id: number;
    public grade: number;

    constructor(data: StudentType) {
        this.id = ('id' in data) ? data.id : null; 
        this.username = data.username ? data.username : null;
        this.points = data.points || undefined;
        this.school = data.school;
        this.account_id = data.account_id;
        this.grade = data.grade;
    }
}

export default AbstractStudent;
