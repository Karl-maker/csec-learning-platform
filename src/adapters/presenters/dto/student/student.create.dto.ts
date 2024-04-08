interface CreateStudentDTO {
    username: string;
    school: {
        name?: string;
        id?: number;
    };
    grade: number;
}

export default CreateStudentDTO;
