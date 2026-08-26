export class DuplicatePlatformError extends Error {
  constructor() {
    super('A platform with that name and manufacturer already exists')
    this.name = 'DuplicatePlatformError'
  }
}
