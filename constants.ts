
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
    instructions: { en: "Warm up: Standard movement.", fr: "Échauffement : Mouvement standard." },
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
    instructions: { en: "Navigate the 'Z' path.", fr: "Naviguez sur le chemin en 'Z'." },
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
    instructions: { en: "Blue = Conditional Right Turn.", fr: "Bleu = Virage à droite conditionnel." },
    solutions: { F1: [{ action: 'FORWARD', condition: null }, { action: 'RIGHT', condition: 'BLUE' }, { action: 'F1', condition: null }] }
  },
  {
    id: 4,
    grid: createGrid(7, 7, `
      WWWWWWW
      WGGGGGW
      WGWGWWW
      WGGGGGW
      WWWWGWW
      WGGGGGW
      WWWWWWW
    `),
    start: [1, 1, Direction.RIGHT],
    stars: [[5, 1]],
    functionLimits: [5, 5, 0, 0, 0],
    instructions: { en: "Function calls: Use F2 to modularize logic.", fr: "Appels de fonctions : Utilisez F2 pour modulariser la logique." },
    solutions: { 
      F1: [{ action: 'FORWARD', condition: null }, { action: 'FORWARD', condition: null }, { action: 'F2', condition: null }],
      F2: [{ action: 'RIGHT', condition: null }, { action: 'FORWARD', condition: null }, { action: 'FORWARD', condition: null }, { action: 'RIGHT', condition: null }, { action: 'F1', condition: null }]
    }
  },
  {
    id: 5,
    grid: createGrid(7, 7, `
      WWWWWWW
      WGGGGGW
      WWWWWG W
      WGGGGGW
      W GWWWWW
      WGGGGGW
      WWWWWWW
    `),
    start: [1, 1, Direction.RIGHT],
    stars: [[5, 5]],
    functionLimits: [4, 4, 0, 0, 0],
    instructions: { en: "The Snake: FORCE FIXED. Use recursion (F1 calling itself) to save slots.", fr: "Le Serpent : CORRIGÉ. Utilisez la récursion (F1 s'appelant elle-même) pour économiser des slots." },
    solutions: { 
      F1: [{ action: 'FORWARD', condition: null }, { action: 'F1', condition: null }, { action: 'F2', condition: null }],
      F2: [{ action: 'RIGHT', condition: null }, { action: 'FORWARD', condition: null }, { action: 'FORWARD', condition: null }, { action: 'RIGHT', condition: null }]
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
    instructions: { en: "Recursion loop: F1 calls F1.", fr: "Boucle de récursion : F1 appelle F1." },
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
    stars: [[4, 4]],
    functionLimits: [5, 5, 0, 0, 0],
    instructions: { en: "Spiral inward using color triggers.", fr: "Spirale vers l'intérieur en utilisant des déclencheurs de couleur." },
    solutions: {
        F1: [{ action: 'FORWARD', condition: null }, { action: 'F2', condition: 'BLUE' }, { action: 'F1', condition: null }],
        F2: [{ action: 'RIGHT', condition: null }, { action: 'FORWARD', condition: null }]
    }
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
    instructions: { en: "Collect all corner stars efficiently.", fr: "Collectez toutes les étoiles de coin efficacement." },
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
    instructions: { en: "Zig-Zag using RED as a logic gate.", fr: "Zig-Zag en utilisant le ROUGE comme porte logique." },
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
      WGWGWWGWGW
      WGWGWWGWGW
      WGWGGGGWGW
      WGWWWWWWGW
      WGGGGGGGGW
      WWWWWWWWWW
    `),
    start: [1, 1, Direction.RIGHT],
    stars: [[4, 4]],
    functionLimits: [5, 5, 5, 0, 0],
    instructions: { en: "Fixed Maze 10: The star is reachable through the center corridor.", fr: "Labyrinthe 10 Corrigé : L'étoile est accessible via le couloir central." },
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
    functionLimits: [6, 6, 6, 0, 0],
    instructions: { en: "The Maze of Minotaur. Blue and Green are your markers.", fr: "Le labyrinthe du Minotaure. Le Bleu et le Vert sont vos repères." },
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
    functionLimits: [8, 8, 8, 8, 8],
    instructions: { en: "Inner Sanctuary: Deep nesting required.", fr: "Sanctuaire Intérieur : Imbrication profonde requise." },
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
    instructions: { en: "Binary Decision: Two stars, one path.", fr: "Décision binaire : Deux étoiles, un chemin." },
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
    instructions: { en: "Impossible Efficiency: 2 slots only.", fr: "Efficacité Impossible : 2 slots seulement." },
    solutions: { F1: [{ action: 'FORWARD', condition: 'BLUE' }, { action: 'F1', condition: null }] }
  },
  {
    id: 15,
    grid: createGrid(10, 10, `
      WWWWWWWWWW
      WGGGGGGGGW
      WGRRRRRRGW
      WGRWWWWREW
      WGRWGGWREW
      WGRWGGWREW
      WGRWWWWREW
      WGRRRRRRGW
      WGGGGGGGGW
      WWWWWWWWWW
    `),
    start: [1, 1, Direction.RIGHT],
    stars: [[4, 4]],
    functionLimits: [8, 8, 8, 8, 8],
    instructions: { en: "Multi-layered recursion.", fr: "Récursion multi-couches." },
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
    functionLimits: [10, 10, 10, 0, 0],
    instructions: { en: "Compass Points.", fr: "Points Cardinaux." },
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
    functionLimits: [12, 12, 12, 12, 12],
    instructions: { en: "The Onion: Layers of conditional logic.", fr: "L'Oignon : Couches de logique conditionnelle." },
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
    instructions: { en: "Square-in-Square Logic.", fr: "Logique Carré dans Carré." },
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
    functionLimits: [8, 8, 8, 8, 8],
    instructions: { en: "Open Field Optimization.", fr: "Optimisation en champ libre." },
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
    functionLimits: [4, 4, 4, 0, 0],
    instructions: { en: "The Recursive Grid.", fr: "La grille récursive." },
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
    functionLimits: [12, 12, 12, 12, 12],
    instructions: { en: "Recursive Depth Charge.", fr: "Charge de profondeur récursive." },
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
    functionLimits: [8, 8, 8, 8, 8],
    instructions: { en: "The Star Constellation.", fr: "La Constellation d'Étoiles." },
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
    functionLimits: [8, 8, 8, 8, 8],
    instructions: { en: "The Final Gauntlet.", fr: "Le Défi Final." },
    solutions: {}
  }
];
