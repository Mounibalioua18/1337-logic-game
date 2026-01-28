
import { Direction, Level, CellType, CommandInstance } from './types';

export const CELL_COLORS = {
  [CellType.EMPTY]: 'bg-slate-900',
  [CellType.WALL]: 'bg-slate-800',
  [CellType.PATH]: 'bg-slate-700',
  [CellType.RED]: 'bg-red-500',
  [CellType.BLUE]: 'bg-blue-600',
  [CellType.GREEN]: 'bg-emerald-600',
  [CellType.STAR]: 'bg-slate-700',
  [CellType.GOAL]: 'bg-slate-700'
};

const createGrid = (rows: number, cols: number, data: string): string[][] => {
  const grid: string[][] = [];
  const chars = data.replace(/\s/g, '');
  if (chars.length !== rows * cols) {
    console.error(`Grid Error: Level expects ${rows * cols} chars, got ${chars.length}`);
  }
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
    functionLimits: [3, 0, 0, 0, 0],
    instructions: { en: "Warm up: Move forward 3 times.", fr: "Échauffement : Avancez 3 fois." },
    solutions: { F1: [{ action: 'FORWARD', condition: null }, { action: 'FORWARD', condition: null }, { action: 'FORWARD', condition: null }] }
  },
  {
    id: 2,
    grid: createGrid(6, 6, `
      WWWWWW
      WGGGGW
      WWWWGW
      WGGGGW
      WWWWWW
      WWWWWW
    `),
    start: [1, 1, Direction.RIGHT],
    stars: [[3, 1]],
    functionLimits: [8, 0, 0, 0, 0],
    instructions: { en: "The Z-Path requires careful turns.", fr: "Le chemin en Z nécessite des virages précis." },
    solutions: { F1: [{ action: 'FORWARD', condition: null }, { action: 'FORWARD', condition: null }, { action: 'FORWARD', condition: null }, { action: 'RIGHT', condition: null }, { action: 'FORWARD', condition: null }, { action: 'FORWARD', condition: null }, { action: 'RIGHT', condition: null }, { action: 'FORWARD', condition: null }] }
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
    functionLimits: [4, 0, 0, 0, 0],
    instructions: { en: "BLUE turns you RIGHT. Use F1 recursion.", fr: "BLEU vous fait tourner à DROITE." },
    solutions: { F1: [{ action: 'FORWARD', condition: null }, { action: 'RIGHT', condition: 'BLUE' }, { action: 'F1', condition: null }] }
  },
  {
    id: 4,
    grid: createGrid(6, 6, `
      WWWWWW
      WRGGGW
      WGWGWW
      WGGKGW
      WWWWWW
      WWWWWW
    `),
    start: [1, 1, Direction.RIGHT],
    stars: [[3, 3]],
    functionLimits: [6, 4, 0, 0, 0],
    instructions: { en: "RED=Right, GREEN=Left. Logic branching.", fr: "ROUGE=Droite, VERT=Gauche." },
    solutions: { F1: [{ action: 'FORWARD', condition: null }, { action: 'RIGHT', condition: 'RED' }, { action: 'LEFT', condition: 'GREEN' }, { action: 'F1', condition: null }] }
  },
  {
    id: 5,
    grid: createGrid(7, 7, `
      WWWWWWW
      WGGGGGW
      WWWWWGW
      WGGGGGW
      WGWWWWW
      WGGGGGW
      WWWWWWW
    `),
    start: [1, 1, Direction.RIGHT],
    stars: [[5, 5]],
    functionLimits: [4, 4, 0, 0, 0],
    instructions: { en: "Level 5 FIXED: Reach the end of the snake. Use F1 for 4 moves, then F2.", fr: "Niveau 5 CORRIGÉ : Atteignez la fin du serpent." },
    solutions: { 
      F1: [{ action: 'FORWARD', condition: null }, { action: 'FORWARD', condition: null }, { action: 'FORWARD', condition: null }, { action: 'FORWARD', condition: null }],
      F2: [{ action: 'F1', condition: null }, { action: 'RIGHT', condition: null }, { action: 'FORWARD', condition: null }, { action: 'FORWARD', condition: null }]
    }
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
    functionLimits: [3, 0, 0, 0, 0],
    instructions: { en: "Recursion: F1 must call F1 to complete the loop.", fr: "Récursion : F1 doit appeler F1." },
    solutions: { F1: [{ action: 'FORWARD', condition: null }, { action: 'RIGHT', condition: null }, { action: 'F1', condition: null }] }
  },
  {
    id: 7,
    grid: createGrid(8, 8, `
      WWWWWWWW
      WGBBBBGW
      WGBWWWBW
      WGBWGWGW
      WGBWGWGW
      WGBWWWBW
      WGBBBBGW
      WWWWWWWW
    `),
    start: [1, 1, Direction.RIGHT],
    stars: [[3, 4]],
    functionLimits: [5, 4, 0, 0, 0],
    instructions: { en: "Spiral inward. BLUE triggers movement.", fr: "Spirale vers l'intérieur." },
    solutions: {}
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
    functionLimits: [4, 4, 0, 0, 0],
    instructions: { en: "Efficiency test: 3 corners, one recursive function.", fr: "Test d'efficacité." },
    solutions: { F1: [{ action: 'FORWARD', condition: null }, { action: 'RIGHT', condition: 'BLUE' }, { action: 'F1', condition: null }] }
  },
  {
    id: 9,
    grid: createGrid(8, 8, `
      WWWWWWWW
      WGRGRGRW
      WGWGWGWG
      WGRGRGRW
      WGWGWGWG
      WGRGRGRW
      WWWWWWWW
      WWWWWWWW
    `),
    start: [1, 1, Direction.RIGHT],
    stars: [[5, 6]],
    functionLimits: [4, 4, 0, 0, 0],
    instructions: { en: "RED acts as a pattern trigger.", fr: "Le ROUGE sert de déclencheur." },
    solutions: { 
        F1: [{ action: 'FORWARD', condition: null }, { action: 'F2', condition: 'RED' }, { action: 'F1', condition: null }],
        F2: [{ action: 'RIGHT', condition: null }, { action: 'FORWARD', condition: null }, { action: 'RIGHT', condition: null }]
    }
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
      WGWBBBBWGW
      WGWWWWWWGW
      WGGGGGGGGW
      WWWWWWWWWW
    `),
    start: [1, 1, Direction.RIGHT],
    stars: [[6, 4]],
    functionLimits: [5, 5, 5, 0, 0],
    instructions: { en: "Fixed Level 10: Center path is now open and reachable.", fr: "Niveau 10 Corrigé : Le chemin central est ouvert." },
    solutions: {}
  },
  {
    id: 11,
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
    functionLimits: [8, 8, 8, 0, 0],
    instructions: { en: "The Maze: Color triggers are essential for pathfinding.", fr: "Le Labyrinthe." },
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
    functionLimits: [10, 10, 10, 10, 10],
    instructions: { en: "Sanctum: Use nested functions (F1 inside F2, etc).", fr: "Sanctuaire : Fonctions imbriquées." },
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
    instructions: { en: "Binary Split: Find the symmetry.", fr: "Séparation binaire." },
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
    functionLimits: [2, 0, 0, 0, 0],
    instructions: { en: "The 2-Slot Challenge: Pure recursion required.", fr: "Défi 2-Slots." },
    solutions: { F1: [{ action: 'FORWARD', condition: 'BLUE' }, { action: 'F1', condition: null }] }
  },
  {
    id: 15,
    grid: createGrid(10, 10, `
      WWWWWWWWWW
      WGGGGGGGGW
      WGRRRRRRGW
      WGRWWWWRGW
      WGRWGGWRGW
      WGRWGGWRGW
      WGRWWWWRGW
      WGRRRRRRGW
      WGGGGGGGGW
      WWWWWWWWWW
    `),
    start: [1, 1, Direction.RIGHT],
    stars: [[4, 4]],
    functionLimits: [12, 12, 12, 12, 12],
    instructions: { en: "The Cage: Three distinct color layers.", fr: "La Cage." },
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
    stars: [[1, 10], [10, 10], [10, 1]],
    functionLimits: [12, 12, 12, 0, 0],
    instructions: { en: "Cardinal Navigation: Reach the corners.", fr: "Navigation cardinale." },
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
    instructions: { en: "Onion Layers: Deep logical depth.", fr: "Couches d'oignon." },
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
    stars: [[1, 10], [10, 1], [4, 4]],
    functionLimits: [12, 12, 12, 12, 12],
    instructions: { en: "Square patterns.", fr: "Motifs carrés." },
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
    functionLimits: [10, 10, 10, 10, 10],
    instructions: { en: "Core Breach: High-speed recursion.", fr: "Brèche du noyau." },
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
    instructions: { en: "The Rainbow: Final complex maze.", fr: "L'arc-en-ciel." },
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
    functionLimits: [10, 10, 10, 10, 10],
    instructions: { en: "Open Desert: Find the optimal path.", fr: "Désert ouvert." },
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
    functionLimits: [6, 6, 6, 0, 0],
    instructions: { en: "The Grid: Recursive patterns only.", fr: "La grille." },
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
    functionLimits: [15, 15, 15, 15, 15],
    instructions: { en: "Ultimate Maze Layering.", fr: "Superposition ultime." },
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
    functionLimits: [12, 12, 12, 12, 12],
    instructions: { en: "Star Cluster Efficiency.", fr: "Efficacité en amas d'étoiles." },
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
    functionLimits: [10, 10, 10, 10, 10],
    instructions: { en: "The Final Gauntlet: Master of Logic.", fr: "Le Défi Final : Maître de la Logique." },
    solutions: {}
  }
];
