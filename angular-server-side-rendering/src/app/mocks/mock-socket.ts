class MockSocket {
  emit(action, data) { }
}

export function mockIO(): any {
    return new MockSocket();
}