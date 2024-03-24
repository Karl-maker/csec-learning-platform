export default function arrayToRecord<Data>(arr: Data[], key: string = 'id'): Record<string, Data> {
    return arr.reduce((record, obj) => {
        record[obj[key]] = obj;
        return record;
    }, {} as Record<string, Data>);
}