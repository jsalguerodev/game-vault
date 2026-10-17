export class InvalidWishlistEntryIdError extends Error {
  constructor(id: string) {
    super(`Wishlist entry ID "${id}" is invalid`)
    this.name = 'InvalidWishlistEntryIdError'
  }
}
