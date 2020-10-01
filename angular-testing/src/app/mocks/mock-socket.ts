export class MockSocket {
    emit(action, data) {
        console.log('MockSocket.emit: action', action, ', data', data);
    }
}

export function mockIO(): any {
    return new MockSocket();
}