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

- [x] Add wishlist entity
- [x] Add wishlist repository
- [x] Add wishlist editing when removing a platform
- [x] Add wishlist item
- [x] List wishlist items
- [x] Update priority
- [x] Update prices
- [x] Filter items below target (price or discount)
- [x] Remove wishlist item
- [x] Convert wishlist item into owned game

## Milestone 5: Reports

- [x] Collection summary
- [x] Platform report
- [x] Wishlist report
- [x] Playtime report
- [x] Completion report
- [x] Add aggregation tests

## Milestone 6: CLI Implementation

- [ ] Install and configure Commander.js
- [ ] Create CLI entry point
- [ ] Implement dependency composition for CLI commands
- [ ] Add platform commands
- [ ] Add game commands
- [ ] Add play-session commands
- [ ] Add wishlist commands
- [ ] Add report commands
- [ ] Implement interactive prompts where appropriate
- [ ] Add CLI input validation
- [ ] Add output formatters (tables, summaries, messages)
- [ ] Add centralized CLI error handling
- [ ] Configure executable gamevault command
- [ ] Manually test complete CLI workflows

## Milestone 7 (optional): IGDB Integration

- [ ] Research IGDB API and authentication
- [ ] Configure IGDB API credentials
- [ ] Create IGDB API client
- [ ] Create external game data types
- [ ] Implement game search through IGDB
- [ ] Retrieve game details
- [ ] Map IGDB data to GameVault
- [ ] Resolve platform references
- [ ] Add game using IGDB metadata
- [ ] Add wishlist item using IGDB metadata
- [ ] Handle API failures and missing data
- [ ] Add IGDB integration tests

## Milestone 8: Project Quality

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
