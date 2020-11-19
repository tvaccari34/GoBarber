export default interface ICacheProvider {
    save(key: string, value: string): Promise<void>;
    invalidate(key: string): Promise<void>;
    recover(key: string): Promise<string | null>;
}