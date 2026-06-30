export const ANIMALS = [
  'Fox', 'Panda', 'Tiger', 'Wolf', 'Eagle', 'Owl', 'Dolphin', 'Bear',
  'Falcon', 'Lynx', 'Phoenix', 'Raven', 'Shark', 'Hawk', 'Lion', 'Leopard',
  'Cheetah', 'Panther', 'Jaguar', 'Cobra', 'Crane', 'Coyote', 'Crow',
  'Deer', 'Dragon', 'Elk', 'Fox', 'Gibbon', 'Giraffe', 'Goat',
  'Gorilla', 'Horse', 'Hummingbird', 'Hyena', 'Ibex', 'Jackal', 'Kangaroo',
  'Koala', 'Kudu', 'Lemur', 'Leopard', 'Lynx', 'Mantis', 'Moose',
  'Nightingale', 'Octopus', 'Orca', 'Otter', 'Owl', 'Panther', 'Parrot',
  'Peacock', 'Pelican', 'Penguin', 'Puma', 'Python', 'Quail', 'Rabbit',
  'Ram', 'Raven', 'Rhinoceros', 'Robin', 'Salamander', 'Seahorse', 'Seal',
  'Shark', 'Skunk', 'Sparrow', 'Swan', 'Tiger', 'Toucan', 'Turtle',
  'Viper', 'Vulture', 'Walrus', 'Weasel', 'Whale', 'Wolf', 'Wolverine',
  'Wombat', 'Woodpecker', 'Yak', 'Zebra', 'Zorilla',
];

export const ADJECTIVES = [
  'Anonymous', 'Silent', 'Quiet', 'Mystic', 'Shadow', 'Cosmic', 'Neon',
  'Crimson', 'Azure', 'Emerald', 'Golden', 'Silver', 'Bronze', 'Cobalt',
  'Jade', 'Ruby', 'Sapphire', 'Amber', 'Ivory', 'Onyx', 'Pearl',
  'Stealth', 'Phantom', 'Ghost', 'Spirit', 'Crystal', 'Thunder', 'Storm',
  'Blaze', 'Frost', 'Glacier', 'Solar', 'Lunar', 'Comet', 'Nova',
  'Super', 'Ultra', 'Hyper', 'Cyber', 'Pixel', 'Digital', 'Echo',
  'Radar', 'Laser', 'Quantum', 'Neural', 'Solar', 'Stellar', 'Cosmic',
];

export const MESSAGE_TTL_MINUTES = 10;
export const MAX_MESSAGE_LENGTH = 1000;
export const MAX_DISPLAY_NAME_LENGTH = 30;
export const MESSAGES_PER_PAGE = 50;

export const RATE_LIMITS = {
  MESSAGE_SEND: { windowMs: 60_000, max: 30 },
  TYPING: { windowMs: 1000, max: 5 },
  JOIN_ROOM: { windowMs: 10_000, max: 5 },
  REPORT: { windowMs: 60_000, max: 3 },
} as const;
