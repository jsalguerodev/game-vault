export class WishlistEntryNotFoundError extends Error {
  constructor(id: string) {
    super(`Game with id "${id}" was not found.`)

    this.name = 'WishlistEntryNotFoundError'
  }
}
