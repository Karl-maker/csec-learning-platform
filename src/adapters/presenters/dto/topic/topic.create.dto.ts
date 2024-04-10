interface CreateTopicDTO {
    name: string;
    description: string;
    courses: {
        id: number;
    }[];
}

export default CreateTopicDTO;