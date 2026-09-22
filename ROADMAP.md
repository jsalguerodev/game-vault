# GameVault Roadmap

## Status Legend

```text
[ ] Not started
[~] In progress
[x] Completed
```

## Milestone 1: Database Foundation

- [x] Initialize Node.js project
- [x] Configure TypeScript
- [x] Configure ESLint
- ~~[ ] Configure Prettier~~
- [x] Add `.env.template`
- [x] Add Docker Compose
- [x] Connect to MongoDB
- [x] Create Platform entity
- [x] Create Game entity
- [x] Create repository interfaces
- [x] Create Mongoose models
- [x] Implement initial repositories
- [x] Add seed script
- [x] Add database-clear script

## Milestone 2: Collection Management

- [x] Add platform
- [x] List platforms
- [x] Search platforms
- [x] Filter platforms
- [x] Update platform
- [x] Remove platform
- [x] Add game
- [x] List games
- [x] Search games
- [x] Filter games
- [x] Update game
- [x] Remove game
- [x] Enforce duplicate index
- [x] Add friendly duplicate error

## Milestone 3: Play Tracking

- [x] Add play-session entity
- [x] Add play-session repository
- [x] Record play session
- [x] Update total playtime
- [x] Update last-played date
- [x] Update game status ~~Change game status~~
- [x] Update completion date ~~Store Update completion date~~
- [x] Remove play session
- [x] Test multi-write consistency
- [x] ~~Add transaction support if needed~~ No needed as of yet

## Milestone 4: Wishlist

- [ ] Add wishlist entity
- [ ] Add wishlist repository
- [ ] Add wishlist item
- [ ] List wishlist items
- [ ] Update priority
- [ ] Update prices
- [ ] Filter items below target price
- [ ] Remove wishlist item
- [ ] Convert wishlist item into owned game

## Milestone 5: Reports

- [ ] Collection summary
- [ ] Platform report
- [ ] Spending report
- [ ] Playtime report
- [ ] Completion report
- [ ] Add aggregation tests

## Milestone 6: Project Quality

- [ ] Unit test suite
- [ ] Integration test suite
- [ ] CLI error handling
- [ ] GitHub Actions
- [ ] Architecture diagram
- [ ] Terminal screenshots
- [ ] Example reports
- [ ] Final README review
- [ ] License
- [ ] Version 1 release

## First Vertical Slice

- [ ] Connect to MongoDB
- [ ] Create platform
- [ ] Create game
- [ ] List games
- [ ] Record play session
- [ ] Verify updated total playtime
- [ ] Add integration test for the workflow

## Future Ideas

- [ ] REST API
- [ ] Web frontend
- [ ] Steam import
- [ ] RAWG or IGDB integration
- [ ] Cover images
- [ ] Achievement tracking
- [ ] DLC tracking
- [ ] CSV export
- [ ] JSON export
- [ ] Statistics dashboard
- [ ] Cloud deployment
