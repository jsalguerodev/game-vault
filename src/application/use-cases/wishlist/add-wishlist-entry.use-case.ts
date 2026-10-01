import type { GameLikeData } from '../../../domain/types/index.js'
import type { WishlistPriority } from '../../../domain/entities/index.js'
import type {
  WishlistRepository,
  PlatformRepository,
} from '../../../domain/repositories/index.js'
import { WishlistEntity } from '../../../domain/entities/index.js'

interface AddWishlistEntryOptions extends GameLikeData {
  priority: WishlistPriority
  targetPrice?: number | null
  targetDiscount?: number | null
}

interface AddWishlistEntryUseCase {
  execute(options: AddWishlistEntryOptions): Promise<WishlistEntity>
}

export class AddWishlistEntry implements AddWishlistEntryUseCase {
  constructor(
    private readonly wishlistRepository: WishlistRepository,
    private readonly platformRepository: PlatformRepository,
  ) {}

  public async execute(
    options: AddWishlistEntryOptions,
  ): Promise<WishlistEntity> {
    const {
      title,
      platformId,
      format,
      developer,
      publisher,
      releaseYear,
      edition,
      genres,
      notes,
      priority,
      targetDiscount,
      targetPrice,
    } = options

    if (platformId && platformId === null) {
      await this.platformRepository.findById(platformId)
    }

    const wishlistEntry = new WishlistEntity({
      title: title,
      format: format,
      platformId: platformId ?? null,
      developer: developer ?? '',
      publisher: publisher ?? '',
      releaseYear: releaseYear ?? null,
      edition: edition ?? '',
      genres: genres ?? [],
      notes: notes ?? '',
      priority: priority ?? 'low',
      targetDiscount: targetDiscount ?? null,
      targetPrice: targetPrice ?? null,
    })

    return this.wishlistRepository.create(wishlistEntry)
  }
}
