import { WishlistEntity } from '../../../domain/entities/index.js'
import type { WishlistRepository } from '../../../domain/repositories/index.js'

interface ListWishlistEntriesUseCase {
  execute(): Promise<WishlistEntity[]>
}

export class ListWishlistEntries implements ListWishlistEntriesUseCase {
  constructor(private readonly wishlistRepository: WishlistRepository) {}

  public async execute(): Promise<WishlistEntity[]> {
    return await this.wishlistRepository.findAll()
  }
}
