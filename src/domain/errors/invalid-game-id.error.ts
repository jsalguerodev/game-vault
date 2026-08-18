export class InvalidGameIdError extends Error {
  constructor(id: string) {
    super(`Game ID "${id}" is invalid`)
    this.name = 'InvalidGameIdError'
  }
}
