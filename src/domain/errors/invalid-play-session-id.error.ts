export class InvalidPlaySessionIdError extends Error {
  constructor(id: string) {
    super(`Play session ID "${id}" is invalid`)
    this.name = 'InvalidPlaySessionIdError'
  }
}
