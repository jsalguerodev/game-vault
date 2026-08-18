export class InvalidEntityIdError extends Error {
  constructor(id: string) {
    super(`Entity ID "${id}" is invalid`)
    this.name = 'InvalidEntityIdError'
  }
}
