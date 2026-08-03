export class InvalidPlatformIdError extends Error {
  constructor(id: string) {
    super(`Platform ID "${id}" is invalid`)
    this.name = 'InvalidPlatformIdError'
  }
}
