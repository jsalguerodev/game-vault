import type {
  WishlistRepository,
  GameRepository,
} from '../../../domain/repositories/index.js'
import { InvalidWishlistEntryIdError } from '../../../domain/errors/index.js'
import { GameEntity } from '../../../domain/entities/index.js'

interface ConvertWishlistEntryToGameUseCase {
  execute(id: string): Promise<GameEntity>
}

export class ConvertWishlistEntryToGame implements ConvertWishlistEntryToGameUseCase {
  constructor(
    private readonly wishlistRepository: WishlistRepository,
    private readonly gameRepository: GameRepository,
  ) {}

  public async execute(id: string): Promise<GameEntity> {
    if (!id.trim()) {
      throw new InvalidWishlistEntryIdError(id)
    }

    const wishlistEntry = await this.wishlistRepository.findById(id)

    const gameEntity = new GameEntity({
      title: wishlistEntry.title,
      platformId: wishlistEntry.platformId,
      format: wishlistEntry.format,
      developer: wishlistEntry.developer,
      publisher: wishlistEntry.publisher,
      releaseYear: wishlistEntry.releaseYear,
      edition: wishlistEntry.edition,
      genres: wishlistEntry.genres,
      notes: wishlistEntry.notes,
      status: 'cataloged',
      completedAt: null,
    })

    const newGame = await this.gameRepository.create(gameEntity)

    await this.wishlistRepository.delete(id)

    return newGame
  }
}
