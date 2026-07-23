export class PlatformNotFoundError extends Error {
  constructor(id: string) {
    super(`Platform with id "${id}" was not found.`)

    this.name = "PlatformNotFoundError"
  }
}