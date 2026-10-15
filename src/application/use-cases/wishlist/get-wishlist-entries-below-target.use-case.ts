import type { WishlistEntity } from '../../../domain/entities/index.js'
import type { WishlistRepository } from '../../../domain/repositories/index.js'

interface GetWishlistEntriesBelowTargetUseCase {
  execute(
    targetType: 'price' | 'discount',
    target: number,
  ): Promise<WishlistEntity[]>
}

export class GetWishlistEntriesBelowTarget implements GetWishlistEntriesBelowTargetUseCase {
  constructor(private readonly wishlistRepository: WishlistRepository) {}
  public async execute(
    targetType: 'price' | 'discount',
    target: number,
  ): Promise<WishlistEntity[]> {
    if (target === undefined || Number.isNaN(target) || target < 0) {
      throw new Error('Target is no valid')
    }

    if (targetType === 'price') {
      return this.wishlistRepository.filter({ maxTargetPrice: target })
    } else {
      return this.wishlistRepository.filter({ maxTargetDiscount: target })
    }
  }
}
