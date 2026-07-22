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
- [ ] Configure ESLint
- [ ] Configure Prettier
- [x] Add `.env.template`
- [x] Add Docker Compose
- [x] Connect to MongoDB
- [x] Create Platform entity
- [x] Create Game entity
- [ ] Create repository interfaces
- [x] Create Mongoose models
- [ ] Implement initial repositories
- [ ] Add seed script
- [ ] Add database-clear script

## Milestone 2: Collection Management

- [ ] Add platform
- [ ] List platforms
- [ ] Update platform
- [ ] Add game
- [ ] List games
- [ ] Search games
- [ ] Filter games
- [ ] Update game
- [ ] Remove game
- [ ] Enforce duplicate index
- [ ] Add friendly duplicate error

## Milestone 3: Play Tracking

- [ ] Add play-session entity
- [ ] Add play-session repository
- [ ] Record play session
- [ ] Update total playtime
- [ ] Update last-played date
- [ ] Change game status
- [ ] Store completion date
- [ ] Test multi-write consistency
- [ ] Add transaction support if needed

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
