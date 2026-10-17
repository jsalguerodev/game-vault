import type { WishlistPriority } from '../../../domain/entities/index.js'
import type { WishlistRepository } from '../../../domain/repositories/index.js'
import { WishlistEntity } from '../../../domain/entities/index.js'
import { InvalidWishlistEntryIdError } from '../../../domain/errors/index.js'

interface UpdateWishlistEntryPriorityUseCase {
  execute(id: string, priority: WishlistPriority): Promise<WishlistEntity>
}

export class UpdateWishlistEntryPriority implements UpdateWishlistEntryPriorityUseCase {
  constructor(private readonly wishlistRepository: WishlistRepository) {}
  public async execute(
    id: string,
    priority: WishlistPriority,
  ): Promise<WishlistEntity> {
    if (!id.trim()) {
      throw new InvalidWishlistEntryIdError(id)
    }

    await this.wishlistRepository.findById(id)

    return this.wishlistRepository.update(id, { priority: priority })
  }
}
