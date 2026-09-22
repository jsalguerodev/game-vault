export class PlaySessionNotFoundError extends Error {
  constructor(id: string) {
    super(`Play session with id ${id} was not found.`)

    this.name = 'PlaySessionNotFoundError'
  }
}
