import type {
  WishlistEntity,
  WishlistPriority,
} from '../../domain/entities/index.js'
import type {
  GameLikeUpdateData,
  GameLikeSearchCriteriaData,
} from '../types/index.js'
export interface UpdateWishlistEntryData extends GameLikeUpdateData {
  priority: WishlistPriority
  targetPrice?: number | null
  targetDiscount?: number | null
}
export interface WishlistRespositorySearchCriteria extends GameLikeSearchCriteriaData {
  platformIds?: string[]
}

export interface WishlistRepository {
  create(wishlistEntry: WishlistEntity): Promise<WishlistEntity>
  update(id: string, data: UpdateWishlistEntryData): Promise<WishlistEntity>
  delete(id: string): Promise<void>
  findAll(): Promise<WishlistEntity[]>
  findById(id: string): Promise<WishlistEntity>
  search(criteria: WishlistRespositorySearchCriteria): Promise<WishlistEntity[]>
  replacePlatformReference(
    currentPlatformId: string,
    newPlatformId: string | null,
  ): Promise<number>
}
