export default interface IRepository<T> {
    save: (entity: T) => Promise<T>;
}