/**
 * Game entity — represents a playable game on the /games page.
 * Technology field is intentionally flexible to support any stack
 * (HTML5 Canvas, React, TypeScript, WebGL, Unity WebGL...).
 */

export type GameCategory = 'Arcade' | 'Puzzle' | 'Casual' | 'Strategy' | 'Card' | 'Classic';
export type GameDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface Game {
  id: string;
  title: string;
  slug: string;
  /** Short teaser shown on the card */
  shortDescription: string;
  /** Full description shown on the detail page */
  description: string;
  /** How to play instructions */
  howToPlay: string;
  thumbnail: string;
  /** Background shown inside the game iframe/canvas area */
  previewImage: string;
  category: GameCategory;
  /** Tags shown as small badges */
  tags: string[];
  /** Tech stack used to build the game */
  technologies: string[];
  difficulty: GameDifficulty;
  /** Average time to complete one round / session */
  playTime: string;
  /** Whether the game is playable right now or still in development */
  isPlayable: boolean;
  /** Show on homepage featured section */
  isFeatured: boolean;
  isNew: boolean;
  releaseDate: string;
  highScore?: number;
  /** Which React component renders this game (for gameType: 'react') */
  componentName: string;
  /** 'react' = embedded React component, 'iframe' = standalone HTML game */
  gameType?: 'react' | 'iframe';
  /** Path to the HTML file for gameType: 'iframe' (relative to /public) */
  iframeSrc?: string;
}

/** Mock data — replace or extend with API calls later */
export const GAMES_DATA: Game[] = [
  {
    id: 'snake-game',
    title: 'Snake Game',
    slug: 'snake-game',
    shortDescription: 'Classic snake game built with HTML5 Canvas.',
    description:
      'Eat the food to grow your snake. Avoid crashing into walls and your own tail. Each food gives you +1 score. The game speeds up as you grow longer.',
    howToPlay:
      'Use Arrow Keys or WASD to move. Press P to pause. Reach the highest score possible before crashing.',
    thumbnail: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=600&q=80',
    previewImage: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=1200&q=80',
    category: 'Arcade',
    tags: ['Canvas', 'Retro'],
    technologies: ['HTML5 Canvas', 'TypeScript', 'CSS3'],
    difficulty: 'Easy',
    playTime: '5-10 min',
    isPlayable: true,
    isFeatured: true,
    isNew: false,
    releaseDate: '2026-01-15',
    highScore: 47,
    componentName: 'SnakeGame',
  },
  {
    id: 'memory-card',
    title: 'Memory Card',
    slug: 'memory-card',
    shortDescription: 'Match pairs of cards to win. Test your memory!',
    description:
      'Flip cards to find matching pairs. There are 8 pairs (16 cards) shuffled randomly each round. Find all pairs in the fewest moves possible.',
    howToPlay:
      'Click a card to flip it. Click another card to try to match. If they match, they stay face-up. If not, they flip back. Find all pairs to win.',
    thumbnail: 'https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?w=600&q=80',
    previewImage: 'https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?w=1200&q=80',
    category: 'Puzzle',
    tags: ['Animation', 'Logic'],
    technologies: ['React', 'Framer Motion', 'TypeScript'],
    difficulty: 'Medium',
    playTime: '3-8 min',
    isPlayable: true,
    isFeatured: true,
    isNew: true,
    releaseDate: '2026-05-01',
    highScore: 12,
    componentName: 'MemoryCardGame',
  },
  {
    id: 'tic-tac-toe',
    title: 'Tic Tac Toe',
    slug: 'tic-tac-toe',
    shortDescription: 'Classic X vs O with AI opponent.',
    description:
      'Challenge the computer in this classic game. Get three in a row — horizontally, vertically, or diagonally — to win. The AI uses minimax algorithm for unbeatable gameplay.',
    howToPlay:
      'Click any cell to place your X. The AI responds with O. Try to get three in a row before the AI does. If neither player can, it is a draw.',
    thumbnail: 'https://images.unsplash.com/photo-1603729363753-d95eb02a9f38?w=600&q=80',
    previewImage: 'https://images.unsplash.com/photo-1603729363753-d95eb02a9f38?w=1200&q=80',
    category: 'Strategy',
    tags: ['AI', 'Classic'],
    technologies: ['React', 'TypeScript', 'Minimax AI'],
    difficulty: 'Medium',
    playTime: '2-5 min',
    isPlayable: true,
    isFeatured: false,
    isNew: false,
    releaseDate: '2026-02-20',
    highScore: 0,
    componentName: 'TicTacToeGame',
  },
  {
    id: 'tetris-clone',
    title: 'Block Breaker',
    slug: 'block-breaker',
    shortDescription: 'Stack falling blocks to clear lines.',
    description:
      'A Tetris-inspired puzzle game. Rotate and place falling blocks to complete full horizontal lines. Completed lines disappear and earn you points.',
    howToPlay:
      'Arrow keys to move and rotate blocks. Down arrow drops faster. Complete full rows to clear them and score points.',
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&q=80',
    previewImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&q=80',
    category: 'Arcade',
    tags: ['Retro', 'Endless'],
    technologies: ['HTML5 Canvas', 'TypeScript'],
    difficulty: 'Hard',
    playTime: '10-30 min',
    isPlayable: false,
    isFeatured: false,
    isNew: false,
    releaseDate: '2026-06-01',
    componentName: '',
  },
  {
    id: 'sudoku',
    title: 'Sudoku',
    slug: 'sudoku',
    shortDescription: 'Fill the 9x9 grid so every row, column, and 3x3 box has digits 1-9.',
    description:
      'A classic number puzzle. Fill each row, column, and 3x3 subgrid with digits 1 through 9, without repeating any number in the same row, column, or box.',
    howToPlay:
      'Click a cell to select it, then click a number 1-9 to fill it. Click pencil mode to add notes. Use the eraser to clear.',
    thumbnail: 'https://images.unsplash.com/photo-1564865878688-9a244444042a?w=600&q=80',
    previewImage: 'https://images.unsplash.com/photo-1564865878688-9a244444042a?w=1200&q=80',
    category: 'Puzzle',
    tags: ['Logic', 'Numbers'],
    technologies: ['React', 'TypeScript'],
    difficulty: 'Hard',
    playTime: '10-30 min',
    isPlayable: false,
    isFeatured: false,
    isNew: false,
    releaseDate: '2026-07-01',
    componentName: '',
  },
];
