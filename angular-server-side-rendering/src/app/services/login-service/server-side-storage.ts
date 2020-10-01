export class ServerSideStorage {

    static data: any = {};

    setItem(key: string, value: string) {
        ServerSideStorage.data[key] = value;
    }

    removeItem(key: string) {
        delete ServerSideStorage.data[key];
    }

    getItem(key: string) {
       return ServerSideStorage.data[key];
    }
}
