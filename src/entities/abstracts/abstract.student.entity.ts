import { AccountType } from "../../types/account.type";
import { StudentType } from "../../types/student.type";
import { Action } from "../../types/utils.type";
import Student from "../interfaces/interface.student.entity";

abstract class AbstractStudent implements Student {
    public id: number | null;
    public username: string | null;
    public school: { id?: string | undefined; name?: string | undefined; } & { to_be?: Action | undefined; };
    public points: number;

    constructor(data: StudentType) {
        this.id = ('id' in data) ? data.id : null; 
        this.username = data.username ? data.username : null;
        this.points = data.points;
        this.school = data.school;
    }
}

export default AbstractStudent;
