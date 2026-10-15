import { WishlistEntity } from '../../../domain/entities/index.js'
import type { WishlistRepository } from '../../../domain/repositories/index.js'

interface GetWishlistEntriesUseCase {
  execute(): Promise<WishlistEntity[]>
}

export class GetWishlistEntries implements GetWishlistEntriesUseCase {
  constructor(private readonly wishlistRepository: WishlistRepository) {}

  public async execute(): Promise<WishlistEntity[]> {
    return await this.wishlistRepository.findAll()
  }
}
