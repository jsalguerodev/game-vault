export const platformSeedData = [
  {
    name: 'Playstation 4',
    manufacturer: 'Sony',
    type: 'console',
    releaseYear: 2013
  },
  {
    name: 'Playstation 5',
    manufacturer: 'Sony',
    type: 'console',
    releaseYear: 2020
  },
  {
    name: 'Switch',
    manufacturer: 'Nintendo',
    type: 'console',
    releaseYear: 2017
  },
  {
    name: 'Switch 2',
    manufacturer: 'Nintendo',
    type: 'console',
    releaseYear: 2025
  },
  {
    name: 'Xbox One',
    manufacturer: 'Microsoft',
    type: 'console',
    releaseYear: 2013
  },
  {
    name: 'Xbox Series',
    manufacturer: 'Microsoft',
    type: 'console',
    releaseYear: 2020
  },
  {
    name: 'Steam',
    manufacturer: 'Valve',
    type: 'pc-storefront',
    releaseYear: 2003
  },
]

export const gameSeedData = [
  // Nintendo Switch
  {
    title: 'The Legend of Zelda: Breath of the Wild',
    platformName: 'Switch',
    format: 'physical',
    releaseYear: 2017,
    genres: ['Action', 'Adventure']
  },
  {
    title: 'Super Mario Odyssey',
    platformName: 'Switch',
    format: 'physical',
    releaseYear: 2017
  },
  {
    title: 'Animal Crossing: New Horizons',
    platformName: 'Switch',
    format: 'digital',
    genres: ['Simulation'],
    notes: 'Purchased from the Nintendo eShop'
  },

  // Nintendo Switch 2
  {
    title: 'Mario Kart World',
    platformName: 'Switch 2',
    format: 'physical',
    releaseYear: 2025,
    genres: ['Racing']
  },
  {
    title: 'Donkey Kong Bananza',
    platformName: 'Switch 2',
    format: 'digital',
    releaseYear: 2025
  },
  {
    title: 'Kirby Air Riders',
    platformName: 'Switch 2',
    format: 'physical',
    edition: 'Standard Edition',
    notes: 'Includes original case'
  },

  // PlayStation 4
  {
    title: 'Bloodborne',
    platformName: 'Playstation 4',
    format: 'physical',
    releaseYear: 2015,
    genres: ['Action RPG']
  },
  {
    title: 'God of War',
    platformName: 'Playstation 4',
    format: 'digital',
    releaseYear: 2018,
    edition: 'Digital Deluxe Edition'
  },
  {
    title: 'The Last of Us Part II',
    platformName: 'Playstation 4',
    format: 'physical',
    notes: 'Pre-owned copy'
  },

  // PlayStation 5
  {
    title: "Demon's Souls",
    platformName: 'Playstation 5',
    format: 'physical',
    releaseYear: 2020,
    genres: ['Action RPG']
  },
  {
    title: 'Ratchet & Clank: Rift Apart',
    platformName: 'Playstation 5',
    format: 'digital',
    releaseYear: 2021
  },
  {
    title: 'Final Fantasy VII Rebirth',
    platformName: 'Playstation 5',
    format: 'physical',
    edition: 'Deluxe Edition',
    genres: ['RPG', 'Action'],
    notes: 'Steelbook included'
  },

  // Xbox One
  {
    title: 'Sunset Overdrive',
    platformName: 'Xbox One',
    format: 'digital',
    releaseYear: 2014,
    genres: ['Action', 'Adventure']
  },
  {
    title: 'Quantum Break',
    platformName: 'Xbox One',
    format: 'physical',
    releaseYear: 2016
  },
  {
    title: 'Ryse: Son of Rome',
    platformName: 'Xbox One',
    format: 'physical',
    notes: 'Day One Edition'
  },

  // Xbox Series
  {
    title: 'Starfield',
    platformName: 'Xbox Series',
    format: 'digital',
    releaseYear: 2023,
    genres: ['RPG', 'Science Fiction']
  },
  {
    title: 'Forza Motorsport',
    platformName: 'Xbox Series',
    format: 'physical',
    releaseYear: 2023
  },
  {
    title: 'Senua\’s Saga: Hellblade II',
    platformName: 'Xbox Series',
    format: 'digital',
    genres: ['Action', 'Adventure'],
    notes: 'Installed through Game Pass'
  },

  // Steam
  {
    title: 'Half-Life: Alyx',
    platformName: 'Steam',
    format: 'digital',
    releaseYear: 2020,
    genres: ['VR', 'Action']
  },
  {
    title: 'Baldur\’s Gate 3',
    platformName: 'Steam',
    format: 'digital',
    releaseYear: 2023,
    edition: 'Digital Deluxe Edition'
  },
  {
    title: 'Hades II',
    platformName: 'Steam',
    format: 'digital',
    notes: 'Purchased during early access'
  }
];