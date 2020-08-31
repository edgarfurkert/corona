export class MockSocket {
  emit(action, data) {
  }
  addEventListener(l) {

  }
  removeEventListener(l) {

  }
}

export function mockIO(): any {
    return new MockSocket();
}