
import { Direction, Level, CellType, CommandInstance } from './types';

export const CELL_COLORS = {
  [CellType.EMPTY]: 'bg-slate-100',
  [CellType.WALL]: 'bg-slate-200',
  [CellType.PATH]: 'bg-emerald-400',
  [CellType.RED]: 'bg-red-500',
  [CellType.BLUE]: 'bg-blue-500',
  [CellType.GREEN]: 'bg-emerald-600',
  [CellType.STAR]: 'bg-emerald-400',
  [CellType.GOAL]: 'bg-emerald-400'
};

const createGrid = (rows: number, cols: number, data: string): string[][] => {
  const grid: string[][] = [];
  const chars = data.replace(/\s/g, '');
  for (let r = 0; r < rows; r++) {
    grid.push(chars.slice(r * cols, (r + 1) * cols).split(''));
  }
  return grid;
};

export const LEVELS: Level[] = [
  {
    id: 1,
    grid: createGrid(6, 6, `
      WWWWWW
      WGGGGW
      WWWWWW
      WWWWWW
      WWWWWW
      WWWWWW
    `),
    start: [1, 1, Direction.RIGHT],
    stars: [[1, 4]],
    functionLimits: [5, 0, 0, 0, 0],
    instructions: { en: "Warm up: Move forward.", fr: "Échauffement : Avancez." },
    solutions: { F1: [{ action: 'FORWARD', condition: null }, { action: 'FORWARD', condition: null }, { action: 'FORWARD', condition: null }] }
  },
  {
    id: 2,
    grid: createGrid(6, 6, `
      WWWWWW
      WGGGGW
      WGWGWW
      WGGGGW
      WWWWWW
      WWWWWW
    `),
    start: [1, 1, Direction.RIGHT],
    stars: [[3, 1]],
    functionLimits: [10, 0, 0, 0, 0],
    instructions: { en: "Zig and zag.", fr: "Ziguez et zaguez." },
    solutions: { F1: [{ action: 'FORWARD', condition: null }, { action: 'FORWARD', condition: null }, { action: 'FORWARD', condition: null }, { action: 'RIGHT', condition: null }, { action: 'FORWARD', condition: null }, { action: 'FORWARD', condition: null }, { action: 'RIGHT', condition: null }, { action: 'FORWARD', condition: null }, { action: 'FORWARD', condition: null }, { action: 'FORWARD', condition: null }] }
  },
  {
    id: 3,
    grid: createGrid(6, 6, `
      WWWWWW
      WGBGGW
      WGWGWW
      WGGGGW
      WWWWWW
      WWWWWW
    `),
    start: [1, 1, Direction.RIGHT],
    stars: [[3, 1]],
    functionLimits: [5, 0, 0, 0, 0],
    instructions: { en: "Use BLUE to turn right automatically.", fr: "Utilisez le BLEU pour tourner à droite automatiquement." },
    solutions: { F1: [{ action: 'FORWARD', condition: null }, { action: 'RIGHT', condition: 'BLUE' }, { action: 'FORWARD', condition: null }, { action: 'RIGHT', condition: 'BLUE' }, { action: 'FORWARD', condition: null }] }
  },
  {
    id: 4,
    grid: createGrid(6, 6, `
      WWWWWW
      WRGGGW
      WGWGWW
      WGKGGW
      WWWWWW
      WWWWWW
    `),
    start: [1, 1, Direction.RIGHT],
    stars: [[3, 3]],
    functionLimits: [6, 0, 0, 0, 0],
    instructions: { en: "Red for Right, Green for Left.", fr: "Rouge pour Droite, Vert pour Gauche." },
    solutions: { F1: [{ action: 'FORWARD', condition: null }, { action: 'RIGHT', condition: 'RED' }, { action: 'LEFT', condition: 'GREEN' }] }
  },
  {
    id: 5,
    grid: createGrid(7, 7, `
      WWWWWWW
      WGGGGGW
      WWWWWWW
      WGGGGGW
      WWWWWWW
      WGGGGGW
      WWWWWWW
    `),
    start: [1, 1, Direction.RIGHT],
    stars: [[5, 5]],
    functionLimits: [15, 0, 0, 0, 0],
    instructions: { en: "The Snake. No logic slots for every move, use functions?", fr: "Le Serpent. Pas de slots pour chaque move, utilisez les fonctions ?" },
    solutions: {}
  },
  {
    id: 6,
    grid: createGrid(8, 8, `
      WWWWWWWW
      WGGGGGGW
      WGWWWWGW
      WGWWWWGW
      WGWWWWGW
      WGWWWWGW
      WGGGGGGW
      WWWWWWWW
    `),
    start: [1, 1, Direction.RIGHT],
    stars: [[6, 1]],
    functionLimits: [4, 0, 0, 0, 0],
    instructions: { en: "Recursive Square: F1 calling itself.", fr: "Carré récursif : F1 s'appelant elle-même." },
    solutions: { F1: [{ action: 'FORWARD', condition: null }, { action: 'RIGHT', condition: null }, { action: 'F1', condition: null }] }
  },
  {
    id: 7,
    grid: createGrid(8, 8, `
      WWWWWWWW
      WGGGGGGW
      WGBBBBGW
      WGBBBBGW
      WGBBBBGW
      WGBBBBGW
      WGGGGGGW
      WWWWWWWW
    `),
    start: [1, 1, Direction.RIGHT],
    stars: [[1, 6], [6, 6]],
    functionLimits: [5, 0, 0, 0, 0],
    instructions: { en: "While on Blue, keep going.", fr: "Tant que sur le Bleu, continuez." },
    solutions: { F1: [{ action: 'FORWARD', condition: 'BLUE' }, { action: 'FORWARD', condition: null }, { action: 'RIGHT', condition: null }, { action: 'F1', condition: null }] }
  },
  {
    id: 8,
    grid: createGrid(9, 9, `
      WWWWWWWWW
      WGGGGGGGW
      WGWBBBWGW
      WGWBBBWGW
      WGWBBBWGW
      WGWBBBWGW
      WGWBBBWGW
      WGGGGGGGW
      WWWWWWWWW
    `),
    start: [1, 1, Direction.RIGHT],
    stars: [[1, 7], [7, 7], [7, 1]],
    functionLimits: [5, 5, 0, 0, 0],
    instructions: { en: "Double Recursion.", fr: "Double Récursion." },
    solutions: {}
  },
  {
    id: 9,
    grid: createGrid(10, 10, `
      WWWWWWWWWW
      WGRGRGRGRW
      WGWGWGWGWW
      WGRGRGRGRW
      WGWGWGWGWW
      WGRGRGRGRW
      WGWGWGWGWW
      WGRGRGRGRW
      WGWGWGWGWW
      WWWWWWWWWW
    `),
    start: [1, 1, Direction.RIGHT],
    stars: [[7, 7]],
    functionLimits: [5, 5, 0, 0, 0],
    instructions: { en: "Pattern Master.", fr: "Maître des motifs." },
    solutions: {}
  },
  {
    id: 10,
    grid: createGrid(10, 10, `
      WWWWWWWWWW
      WGGGGGGGGW
      WGWWWWWWGW
      WGWBBBBWGW
      WGWBBBBWGW
      WGWBBBBWGW
      WGWGGGGWGW
      WGWWWWWWGW
      WGGGGGGGGW
      WWWWWWWWWW
    `),
    start: [1, 1, Direction.RIGHT],
    stars: [[5, 4]],
    functionLimits: [8, 8, 8, 0, 0],
    instructions: { en: "Fixed Maze. Use helper functions to navigate the blue corridor.", fr: "Labyrinthe corrigé. Utilisez les fonctions d'aide pour naviguer dans le couloir bleu." },
    solutions: {}
  },
  {
    id: 11,
    grid: createGrid(10, 10, `
      WWWWWWWWWW
      WGRBKRBKGW
      WGWGWGWGWW
      WGRBKRBKGW
      WGWGWGWGWW
      WGRBKRBKGW
      WGWGWGWGWW
      WGRBKRBKGW
      WGGGGGGGGW
      WWWWWWWWWW
    `),
    start: [1, 1, Direction.RIGHT],
    stars: [[8, 8]],
    functionLimits: [10, 10, 10, 10, 10],
    instructions: { en: "Multi-color triggers.", fr: "Déclencheurs multicolores." },
    solutions: {}
  },
  {
    id: 12,
    grid: createGrid(12, 12, `
      WWWWWWWWWWWW
      WGGGGGGGGGGW
      WGWBBBBBBWGW
      WGWBWWWWWBWGW
      WGWBRRRRRBWGW
      WGWBRWWWRBWGW
      WGWBRWGGWRBWGW
      WGWBRRRRRBWGW
      WGWBWWWWWBWGW
      WGWBBBBBBWGW
      WGGGGGGGGGGW
      WWWWWWWWWWWW
    `),
    start: [1, 1, Direction.RIGHT],
    stars: [[6, 6]],
    functionLimits: [12, 12, 12, 12, 12],
    instructions: { en: "Inner Sanctuary.", fr: "Sanctuaire Intérieur." },
    solutions: {}
  },
  {
    id: 13,
    grid: createGrid(10, 10, `
      WWWWWWWWWW
      WGGGGGGGGW
      WGWBBBBWGW
      WGBWWWBWGW
      WGBWGWGWGW
      WGBWGWGWGW
      WGBWWWWWGW
      WGWBBBBWGW
      WGGGGGGGGW
      WWWWWWWWWW
    `),
    start: [1, 1, Direction.RIGHT],
    stars: [[4, 4], [4, 6]],
    functionLimits: [10, 10, 10, 0, 0],
    instructions: { en: "The Eye.", fr: "L'Œil." },
    solutions: {}
  },
  {
    id: 14,
    grid: createGrid(10, 10, `
      WWWWWWWWWW
      WGGGGGGGGW
      WBBBBBBBBW
      WBBBBBBBBW
      WBBBBBBBBW
      WBBBBBBBBW
      WBBBBBBBBW
      WBBBBBBBBW
      WBBBBBBBBW
      WWWWWWWWWW
    `),
    start: [1, 1, Direction.RIGHT],
    stars: [[8, 8]],
    functionLimits: [4, 0, 0, 0, 0],
    instructions: { en: "Minimalism. Use the blue field wisely.", fr: "Minimalisme. Utilisez le champ bleu avec sagesse." },
    solutions: {}
  },
  {
    id: 15,
    grid: createGrid(12, 12, `
      WWWWWWWWWWWW
      WGGGGGGGGGGW
      WGBBBBBBBBGW
      WGBWWWWWWWBW
      WGBWGGGGGGKW
      WGBWGWKKKKKW
      WGBWGWKWWWWW
      WGBWGWKWWWWW
      WGBWGGKWWWWW
      WGBBBBKWWWWW
      WGGGGGGWWWWW
      WWWWWWWWWWWW
    `),
    start: [1, 1, Direction.RIGHT],
    stars: [[8, 5]],
    functionLimits: [12, 12, 12, 12, 12],
    instructions: { en: "The Labyrinth.", fr: "Le Labyrinthe." },
    solutions: {}
  },
  {
    id: 16,
    grid: createGrid(12, 12, `
      WWWWWWWWWWWW
      WGGGGGGGGGGW
      WGGWWWWWWGGW
      WGGWWWWWWGGW
      WGGWWWWWWGGW
      WGGWWWWWWGGW
      WGGWWWWWWGGW
      WGGWWWWWWGGW
      WGGWWWWWWGGW
      WGGWWWWWWGGW
      WGGGGGGGGGGW
      WWWWWWWWWWWW
    `),
    start: [1, 1, Direction.RIGHT],
    stars: [[5, 1], [5, 10], [1, 5], [10, 5]],
    functionLimits: [8, 8, 8, 0, 0],
    instructions: { en: "The Compass.", fr: "La Boussole." },
    solutions: {}
  },
  {
    id: 17,
    grid: createGrid(14, 14, `
      WWWWWWWWWWWWWW
      WGGGGGGGGGGGGW
      WGWBBBBBBBBWGW
      WGWBWWWWWWWBWGW
      WGWBRRRRRRRBWGW
      WGWBRWWWWWRBWGW
      WGWBRWGGGGWRBWGW
      WGWBRWGGGGWRBWGW
      WGWBRWWWWWRBWGW
      WGWBRRRRRRRBWGW
      WGWBWWWWWWWBWGW
      WGWBBBBBBBBWGW
      WGGGGGGGGGGGGW
      WWWWWWWWWWWWWW
    `),
    start: [1, 1, Direction.RIGHT],
    stars: [[6, 6], [7, 7]],
    functionLimits: [15, 15, 15, 15, 15],
    instructions: { en: "Onion Layers.", fr: "Couches d'Oignon." },
    solutions: {}
  },
  {
    id: 18,
    grid: createGrid(12, 12, `
      WWWWWWWWWWWW
      WGGGGGGGGGGW
      WGWWWWWWWWGW
      WGWBBBBBBWGW
      WGWGWWWWGWGW
      WGWGWWWWGWGW
      WGWGWWWWGWGW
      WGWGWWWWGWGW
      WGWBBBBBBWGW
      WGWWWWWWWWGW
      WGGGGGGGGGGW
      WWWWWWWWWWWW
    `),
    start: [1, 1, Direction.RIGHT],
    stars: [[1, 10], [10, 10], [10, 1], [4, 4]],
    functionLimits: [10, 10, 10, 10, 10],
    instructions: { en: "Nested Squares.", fr: "Carrés Imbriqués." },
    solutions: {}
  },
  {
    id: 19,
    grid: createGrid(10, 10, `
      WWWWWWWWWW
      WGGGGGGGGW
      WGWWWWWWGW
      WGWBBBBWGW
      WGWBRRRWGW
      WGWBRRRWGW
      WGWBBBBWGW
      WGWWWWWWGW
      WGGGGGGGGW
      WWWWWWWWWW
    `),
    start: [1, 1, Direction.RIGHT],
    stars: [[4, 4], [5, 5]],
    functionLimits: [8, 8, 8, 8, 8],
    instructions: { en: "Core Breach.", fr: "Brèche du Noyau." },
    solutions: {}
  },
  {
    id: 20,
    grid: createGrid(12, 12, `
      WWWWWWWWWWWW
      WGGGGGGGGGGW
      WGWBBBBBBWGW
      WGWBRRRRRBWGW
      WGWBRWKKKRBWGW
      WGWBRWKGGKRBWGW
      WGWBRWKKKRBWGW
      WGWBRRRRRBWGW
      WGWBBBBBBWGW
      WGWWWWWWWWGW
      WGGGGGGGGGGW
      WWWWWWWWWWWW
    `),
    start: [1, 1, Direction.RIGHT],
    stars: [[5, 6]],
    functionLimits: [15, 15, 15, 15, 15],
    instructions: { en: "The Rainbow Spiral.", fr: "La Spirale Arc-en-ciel." },
    solutions: {}
  },
  {
    id: 21,
    grid: createGrid(10, 10, `
      WWWWWWWWWW
      WGGGGGGGGW
      WGGGGGGGGW
      WGGGGGGGGW
      WGGGGGGGGW
      WGGGGGGGGW
      WGGGGGGGGW
      WGGGGGGGGW
      WGGGGGGGGW
      WWWWWWWWWW
    `),
    start: [1, 1, Direction.RIGHT],
    stars: [[1, 8], [8, 8], [8, 1], [4, 4]],
    functionLimits: [15, 15, 15, 15, 15],
    instructions: { en: "Open Field Efficiency.", fr: "Efficacité en champ libre." },
    solutions: {}
  },
  {
    id: 22,
    grid: createGrid(12, 12, `
      WWWWWWWWWWWW
      WGRGRGRGRGRW
      WGWGWGWGWGWW
      WGRGRGRGRGRW
      WGWGWGWGWGWW
      WGRGRGRGRGRW
      WGWGWGWGWGWW
      WGRGRGRGRGRW
      WGWGWGWGWGWW
      WGRGRGRGRGRW
      WGGGGGGGGGGW
      WWWWWWWWWWWW
    `),
    start: [1, 1, Direction.RIGHT],
    stars: [[10, 10]],
    functionLimits: [10, 10, 10, 0, 0],
    instructions: { en: "The Grid. Recursion is your only hope.", fr: "La Grille. La récursion est votre seul espoir." },
    solutions: {}
  },
  {
    id: 23,
    grid: createGrid(15, 15, `
      WWWWWWWWWWWWWWW
      WGGGGGGGGGGGGGW
      WGWBBBBBBBBBBWGW
      WGWBRRRRRRRRRBWGW
      WGWBRWKKKKKKWRBWGW
      WGWBRWKWGGGGWRBWGW
      WGWBRWKWGWBBWRBWGW
      WGWBRWKWGWSBWRBWGW
      WGWBRWKWGWBBWRBWGW
      WGWBRWKWGGGGWRBWGW
      WGWBRWKKKKKKWRBWGW
      WGWBRRRRRRRRRBWGW
      WGWBBBBBBBBBBWGW
      WGGGGGGGGGGGGGW
      WWWWWWWWWWWWWWW
    `),
    start: [1, 1, Direction.RIGHT],
    stars: [[7, 7]],
    functionLimits: [20, 20, 20, 20, 20],
    instructions: { en: "Deep Recursion.", fr: "Récursion Profonde." },
    solutions: {}
  },
  {
    id: 24,
    grid: createGrid(15, 15, `
      WWWWWWWWWWWWWWW
      WGGGGGGGGGGGGGW
      WGGGGGGGGGGGGGW
      WGGGGGGGGGGGGGW
      WGGGGGGGGGGGGGW
      WGGGGGGGGGGGGGW
      WGGGGGGGGGGGGGW
      WGGGGGGGGGGGGGW
      WGGGGGGGGGGGGGW
      WGGGGGGGGGGGGGW
      WGGGGGGGGGGGGGW
      WGGGGGGGGGGGGGW
      WGGGGGGGGGGGGGW
      WGGGGGGGGGGGGGW
      WWWWWWWWWWWWWWW
    `),
    start: [1, 1, Direction.RIGHT],
    stars: [[7, 7], [1, 1], [1, 13], [13, 1], [13, 13]],
    functionLimits: [10, 10, 10, 10, 10],
    instructions: { en: "The Star of Stars.", fr: "L'Étoile des Étoiles." },
    solutions: {}
  },
  {
    id: 25,
    grid: createGrid(15, 15, `
      WWWWWWWWWWWWWWW
      WGGGGGGGGGGGGGW
      WGWBBBBBBBBBBWGW
      WGWBRRRRRRRRRBWGW
      WGWBRWGGGGGGWRBWGW
      WGWBRWGWWWWWWRBWGW
      WGWBRWGWBBBBWRBWGW
      WGWBRWGWBRRBWRBWGW
      WGWBRWGWBBBBWRBWGW
      WGWBRWGWWWWWWRBWGW
      WGWBRWGGGGGGWRBWGW
      WGWBRRRRRRRRRBWGW
      WGWBBBBBBBBBBWGW
      WGGGGGGGGGGGGGW
      WWWWWWWWWWWWWWW
    `),
    start: [1, 1, Direction.RIGHT],
    stars: [[7, 7]],
    functionLimits: [15, 15, 15, 15, 15],
    instructions: { en: "The Final Logic Test.", fr: "Le Test de Logique Final." },
    solutions: {}
  }
];
