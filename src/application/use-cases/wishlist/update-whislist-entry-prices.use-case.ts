import type {
  WishlistRepository,
  UpdateWishlistEntryPricesData,
} from '../../../domain/repositories/index.js'
import { WishlistEntity } from '../../../domain/entities/index.js'
import { InvalidGameIdError } from '../../../domain/errors/index.js'

interface UpdateWishlistEntryPricesUseCase {
  execute(
    id: string,
    data: UpdateWishlistEntryPricesData,
  ): Promise<WishlistEntity>
}

export class UpdateWishlistEntryPrices implements UpdateWishlistEntryPricesUseCase {
  constructor(private readonly wishlistRepository: WishlistRepository) {}
  public async execute(
    id: string,
    data: UpdateWishlistEntryPricesData,
  ): Promise<WishlistEntity> {
    if (!id.trim()) {
      throw new InvalidGameIdError(id)
    }

    const { targetDiscount, targetPrice } = data

    if (
      targetDiscount &&
      (targetDiscount < 0 ||
        !Number.isInteger(targetDiscount) ||
        targetDiscount === undefined)
    ) {
      throw new Error('Target discount amount is not valid')
    }

    if (
      targetPrice &&
      (targetPrice < 0 ||
        !Number.isInteger(targetPrice) ||
        targetPrice === undefined)
    ) {
      throw new Error('Target price amount is not valid')
    }

    await this.wishlistRepository.findById(id)

    return await this.wishlistRepository.update(id, {
      targetDiscount: targetDiscount ?? null,
      targetPrice: targetPrice ?? null,
    })
  }
}
