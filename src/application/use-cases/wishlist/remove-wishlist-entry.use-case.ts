import type { WishlistRepository } from '../../../domain/repositories/index.js'
import { InvalidPlaySessionIdError } from '../../../domain/errors/index.js'

interface RemoveWishlistEntryUseCase {
  execute(id: string): Promise<void>
}

export class RemoveWishlistEntry implements RemoveWishlistEntryUseCase {
  constructor(private readonly wishlistRepository: WishlistRepository) {}

  public async execute(id: string): Promise<void> {
    if (!id.trim()) {
      throw new InvalidPlaySessionIdError(id)
    }

    await this.wishlistRepository.delete(id)
  }
}
