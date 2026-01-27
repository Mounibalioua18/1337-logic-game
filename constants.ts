
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
    instructions: { en: "Move forward to collect the star.", fr: "Avancez pour collecter l'étoile." },
    solutions: { F1: [{ action: 'FORWARD', condition: null }, { action: 'FORWARD', condition: null }, { action: 'FORWARD', condition: null }] }
  },
  {
    id: 2,
    grid: createGrid(6, 6, `
      WWWWWW
      WWWWWW
      WGGGGW
      WWWWWW
      WWWWWW
      WWWWWW
    `),
    start: [2, 4, Direction.LEFT],
    stars: [[2, 1]],
    functionLimits: [5, 0, 0, 0, 0],
    instructions: { en: "The direction matters.", fr: "La direction est importante." },
    solutions: { F1: [{ action: 'FORWARD', condition: null }, { action: 'FORWARD', condition: null }, { action: 'FORWARD', condition: null }] }
  },
  {
    id: 3,
    grid: createGrid(6, 6, `
      WWWWWW
      WGWWWW
      WGWWWW
      WGGGGW
      WWWWWW
      WWWWWW
    `),
    start: [1, 1, Direction.DOWN],
    stars: [[3, 4]],
    functionLimits: [8, 0, 0, 0, 0],
    instructions: { en: "Turn left to follow the path.", fr: "Tournez à gauche pour suivre le chemin." },
    solutions: { F1: [{ action: 'FORWARD', condition: null }, { action: 'FORWARD', condition: null }, { action: 'LEFT', condition: null }, { action: 'FORWARD', condition: null }, { action: 'FORWARD', condition: null }, { action: 'FORWARD', condition: null }] }
  },
  {
    id: 4,
    grid: createGrid(6, 6, `
      WWWWWW
      WGBGGW
      WGWGWW
      WGWGWW
      WWWWWW
      WWWWWW
    `),
    start: [1, 1, Direction.RIGHT],
    stars: [[3, 3]],
    functionLimits: [8, 8, 0, 0, 0],
    instructions: { en: "Blue logic: if on blue, turn right.", fr: "Logique bleue : si sur bleu, tournez à droite." },
    solutions: { 
      F1: [{ action: 'FORWARD', condition: null }, { action: 'RIGHT', condition: 'BLUE' }, { action: 'FORWARD', condition: null }, { action: 'FORWARD', condition: null }, { action: 'FORWARD', condition: null }]
    }
  },
  {
    id: 5,
    grid: createGrid(6, 6, `
      WWWWWW
      WGGGGW
      WWWWGW
      WGGGGW
      WGWWWW
      WGGGGW
    `),
    start: [1, 1, Direction.RIGHT],
    stars: [[5, 4]],
    functionLimits: [20, 0, 0, 0, 0],
    instructions: { en: "Snake path requires 17 steps. Limit increased to 20.", fr: "Le chemin en serpent nécessite 17 étapes. Limite augmentée à 20." },
    solutions: { F1: [
      { action: 'FORWARD', condition: null }, { action: 'FORWARD', condition: null }, { action: 'FORWARD', condition: null }, 
      { action: 'RIGHT', condition: null }, { action: 'FORWARD', condition: null }, { action: 'FORWARD', condition: null }, 
      { action: 'RIGHT', condition: null }, { action: 'FORWARD', condition: null }, { action: 'FORWARD', condition: null }, { action: 'FORWARD', condition: null }, 
      { action: 'LEFT', condition: null }, { action: 'FORWARD', condition: null }, { action: 'FORWARD', condition: null }, 
      { action: 'LEFT', condition: null }, { action: 'FORWARD', condition: null }, { action: 'FORWARD', condition: null }, { action: 'FORWARD', condition: null }
    ] }
  },
  {
    id: 6,
    grid: createGrid(7, 7, `
      WWWWWWW
      WGGGGGW
      WGWWWGW
      WGWGGGW
      WGWWWWW
      WGGGGGW
      WWWWWWW
    `),
    start: [1, 1, Direction.RIGHT],
    stars: [[5, 4]],
    functionLimits: [12, 12, 0, 0, 0],
    instructions: { en: "Helper functions are key.", fr: "Les fonctions d'aide sont la clé." },
    solutions: { 
      F1: [{ action: 'FORWARD', condition: null }, { action: 'FORWARD', condition: null }, { action: 'FORWARD', condition: null }, { action: 'FORWARD', condition: null }, { action: 'RIGHT', condition: null }, { action: 'FORWARD', condition: null }, { action: 'FORWARD', condition: null }, { action: 'RIGHT', condition: null }, { action: 'FORWARD', condition: null }, { action: 'FORWARD', condition: null }, { action: 'LEFT', condition: null }, { action: 'FORWARD', condition: null }],
      F2: [{ action: 'FORWARD', condition: null }, { action: 'FORWARD', condition: null }, { action: 'LEFT', condition: null }, { action: 'FORWARD', condition: null }]
    }
  },
  {
    id: 7,
    grid: createGrid(7, 7, `
      WWWWWWW
      WBBBBBW
      WGWGWWW
      WGWGWWW
      WGWGGGW
      WGWGWWW
      WGGGGGW
    `),
    start: [1, 1, Direction.RIGHT],
    stars: [[6, 4]],
    functionLimits: [10, 10, 0, 0, 0],
    instructions: { en: "While on Blue, move forward.", fr: "Tant que sur le Bleu, avancez." },
    solutions: { 
      F1: [{ action: 'FORWARD', condition: 'BLUE' }, { action: 'RIGHT', condition: null }, { action: 'F2', condition: null }],
      F2: [{ action: 'FORWARD', condition: null }, { action: 'FORWARD', condition: null }, { action: 'FORWARD', condition: null }, { action: 'FORWARD', condition: null }, { action: 'RIGHT', condition: null }, { action: 'FORWARD', condition: null }, { action: 'FORWARD', condition: null }, { action: 'FORWARD', condition: null }]
    }
  },
  {
    id: 8,
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
    functionLimits: [10, 0, 0, 0, 0],
    instructions: { en: "Recursion: Use F1 to call itself.", fr: "Récursion : utilisez F1 pour s'appeler elle-même." },
    solutions: { F1: [{ action: 'FORWARD', condition: null }, { action: 'RIGHT', condition: null }, { action: 'F1', condition: null }] }
  },
  {
    id: 9,
    grid: createGrid(8, 8, `
      WWWWWWWW
      WGGGGGGW
      WGWBBWGW
      WGBWWBGW
      WGBWWBGW
      WGWBBWGW
      WGGGGGGW
      WWWWWWWW
    `),
    start: [1, 1, Direction.RIGHT],
    stars: [[1, 6], [6, 6], [6, 1]],
    functionLimits: [10, 10, 0, 0, 0],
    instructions: { en: "Conditional recursion.", fr: "Récursion conditionnelle." },
    solutions: { 
      F1: [{ action: 'FORWARD', condition: null }, { action: 'F2', condition: 'BLUE' }, { action: 'F1', condition: null }], 
      F2: [{ action: 'RIGHT', condition: null }, { action: 'FORWARD', condition: null }] 
    }
  },
  {
    id: 10,
    grid: createGrid(10, 10, `
      WWWWWWWWWW
      WGGGGGGGGW
      WGWWWWWWGW
      WGWGGGGWGW
      WGWGWWGWGW
      WGWGWWGWGW
      WGWGGGGWGW
      WGWWWWWWGW
      WGGGGGGGGW
      WWWWWWWWWW
    `),
    start: [1, 1, Direction.RIGHT],
    stars: [[4, 4]],
    functionLimits: [12, 12, 0, 0, 0],
    instructions: { en: "Spirals are recursive.", fr: "Les spirales sont récursives." },
    solutions: { 
      F1: [{ action: 'FORWARD', condition: null }, { action: 'F1', condition: null }],
      F2: [{ action: 'F1', condition: null }, { action: 'RIGHT', condition: null }, { action: 'F2', condition: null }]
    }
  },
  {
    id: 11,
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
    functionLimits: [12, 12, 0, 0, 0],
    instructions: { en: "Zig-zag using Red.", fr: "Zig-zag avec le Rouge." },
    solutions: { 
      F1: [{ action: 'FORWARD', condition: null }, { action: 'F2', condition: 'RED' }, { action: 'F1', condition: null }],
      F2: [{ action: 'RIGHT', condition: null }, { action: 'FORWARD', condition: null }]
    }
  },
  {
    id: 12,
    grid: createGrid(8, 8, `
      WWWWWWWW
      WGWWWWWW
      WGWWWWWW
      WGBBBBGW
      WWWWWWGW
      WWWWWWGW
      WWWWWWGW
      WWWWWWWW
    `),
    start: [1, 1, Direction.DOWN],
    stars: [[6, 6]],
    functionLimits: [12, 12, 0, 0, 0],
    instructions: { en: "Step by step logic.", fr: "Logique étape par étape." },
    solutions: { 
      F1: [{ action: 'FORWARD', condition: null }, { action: 'F2', condition: 'BLUE' }, { action: 'F1', condition: null }],
      F2: [{ action: 'LEFT', condition: null }, { action: 'FORWARD', condition: null }]
    }
  },
  {
    id: 13,
    grid: createGrid(8, 8, `
      WWWWWWWW
      WGGGGGGW
      WGWWWWGW
      WGGGGGGW
      WGWWWWGW
      WGGGGGGW
      WWWWWWWW
      WWWWWWWW
    `),
    start: [1, 1, Direction.RIGHT],
    stars: [[5, 1]],
    functionLimits: [15, 15, 15, 0, 0],
    instructions: { en: "Nested logic levels.", fr: "Niveaux de logique imbriqués." },
    solutions: { 
      F1: [{ action: 'FORWARD', condition: null }, { action: 'F1', condition: null }],
      F2: [{ action: 'F1', condition: null }, { action: 'RIGHT', condition: null }, { action: 'F1', condition: null }, { action: 'RIGHT', condition: null }]
    }
  },
  {
    id: 14,
    grid: createGrid(10, 10, `
      WWWWWWWWWW
      WGGGGGGGGW
      WGWBBBBWGW
      WGWBBBBWGW
      WGWBBBBWGW
      WGWBBBBWGW
      WGWBBBBWGW
      WGWWWWWWGW
      WGGGGGGGGW
      WWWWWWWWWW
    `),
    start: [1, 1, Direction.RIGHT],
    stars: [[1, 8], [8, 8], [8, 1]],
    functionLimits: [15, 15, 0, 0, 0],
    instructions: { en: "Navigate the perimeter.", fr: "Naviguez sur le périmètre." },
    solutions: { 
      F1: [{ action: 'FORWARD', condition: null }, { action: 'RIGHT', condition: 'BLUE' }, { action: 'F1', condition: null }] 
    }
  },
  {
    id: 15,
    grid: createGrid(10, 10, `
      WWWWWWWWWW
      WKKKKKKKKW
      WKWWWWWWKW
      WKWGGGGWKW
      WKWGKKGWKW
      WKWGKKGWKW
      WKWGGGGWKW
      WKWWWWWWKW
      WKKKKKKKKW
      WWWWWWWWWW
    `),
    start: [1, 1, Direction.RIGHT],
    stars: [[4, 4], [4, 5], [5, 4], [5, 5]],
    functionLimits: [15, 15, 15, 0, 0],
    instructions: { en: "Green triggers everywhere.", fr: "Déclencheurs verts partout." },
    solutions: { 
      F1: [{ action: 'FORWARD', condition: null }, { action: 'RIGHT', condition: 'GREEN' }, { action: 'F1', condition: null }] 
    }
  },
  {
    id: 16,
    grid: createGrid(6, 6, `
      WWWWWW
      WGGGGW
      WGBBBW
      WGGGGW
      WWWWWW
      WWWWWW
    `),
    start: [1, 1, Direction.RIGHT],
    stars: [[3, 1]],
    functionLimits: [20, 0, 0, 0, 0],
    instructions: { en: "A long detour.", fr: "Un long détour." },
    solutions: { F1: [{ action: 'FORWARD', condition: null }, { action: 'FORWARD', condition: null }, { action: 'FORWARD', condition: null }, { action: 'RIGHT', condition: null }, { action: 'FORWARD', condition: null }, { action: 'FORWARD', condition: null }, { action: 'RIGHT', condition: null }, { action: 'FORWARD', condition: null }, { action: 'FORWARD', condition: null }, { action: 'FORWARD', condition: null }] }
  },
  {
    id: 17,
    grid: createGrid(10, 10, `
      WWWWWWWWWW
      WGGGGGGGGW
      WGWBBBBWGW
      WGBWWWWBGW
      WGBWGGWBGW
      WGBWGGWBGW
      WGBWWWWBGW
      WGWBBBBWGW
      WGGGGGGGGW
      WWWWWWWWWW
    `),
    start: [1, 1, Direction.RIGHT],
    stars: [[4, 4], [4, 5], [5, 4], [5, 5]],
    functionLimits: [20, 20, 20, 0, 0],
    instructions: { en: "Complex maze logic.", fr: "Logique de labyrinthe complexe." },
    solutions: {
        F1: [{action: 'FORWARD', condition: null}, {action: 'F1', condition: null}],
        F2: [{action: 'F1', condition: null}, {action: 'RIGHT', condition: 'BLUE'}, {action: 'F2', condition: null}]
    }
  },
  {
    id: 18,
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
    functionLimits: [25, 25, 25, 25, 25],
    instructions: { en: "Deep nested conditions.", fr: "Conditions imbriquées profondes." },
    solutions: {
        F1: [{action: 'FORWARD', condition: null}, {action: 'RIGHT', condition: 'BLUE'}, {action: 'RIGHT', condition: 'RED'}, {action: 'F1', condition: null}]
    }
  },
  {
    id: 19,
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
    stars: [[1, 6], [6, 6], [6, 1]],
    functionLimits: [20, 20, 0, 0, 0],
    instructions: { en: "Border traversal logic.", fr: "Logique de traversée de bordure." },
    solutions: {
        F1: [{action: 'FORWARD', condition: null}, {action: 'RIGHT', condition: 'BLUE'}, {action: 'F1', condition: null}]
    }
  },
  {
    id: 20,
    grid: createGrid(12, 12, `
      WWWWWWWWWWWW
      WGGGGGGGGGGW
      WGWBBBBBBWGW
      WGWBBBBBBWGW
      WGWBBBBBBWGW
      WGWBBBBBBWGW
      WGWBBBBBBWGW
      WGWBBBBBBWGW
      WGWBBBBBBWGW
      WGWBBBBBBWGW
      WGGGGGGGGGGW
      WWWWWWWWWWWW
    `),
    start: [1, 1, Direction.RIGHT],
    stars: [[5, 5], [6, 6]],
    functionLimits: [25, 25, 25, 25, 25],
    instructions: { en: "Master of conditional loops.", fr: "Maître des boucles conditionnelles." },
    solutions: {
        F1: [{action: 'FORWARD', condition: null}, {action: 'F1', condition: null}],
        F2: [{action: 'F1', condition: null}, {action: 'RIGHT', condition: 'BLUE'}, {action: 'F2', condition: null}]
    }
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
    functionLimits: [30, 30, 30, 30, 30],
    instructions: { en: "Efficiency challenge.", fr: "Défi d'efficacité." },
    solutions: {}
  },
  {
    id: 22,
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
    functionLimits: [20, 20, 20, 20, 20],
    instructions: { en: "Checkered patterns.", fr: "Motifs en damier." },
    solutions: {
        F1: [{action: 'FORWARD', condition: null}, {action: 'RIGHT', condition: 'RED'}, {action: 'F1', condition: null}]
    }
  },
  {
    id: 23,
    grid: createGrid(12, 12, `
      WWWWWWWWWWWW
      WGGGGGGGGGGW
      WGWBBBBBBWGW
      WGWBRRRRRBWGW
      WGWBRWGGWRBWGW
      WGWBRWGGWRBWGW
      WGWBRRRRRBWGW
      WGWBBBBBBWGW
      WGGGGGGGGGGW
      WWWWWWWWWWWW
      WWWWWWWWWWWW
      WWWWWWWWWWWW
    `),
    start: [1, 1, Direction.RIGHT],
    stars: [[5, 5]],
    functionLimits: [25, 25, 25, 25, 25],
    instructions: { en: "Reach the inner sanctuary.", fr: "Atteignez le sanctuaire intérieur." },
    solutions: {}
  },
  {
    id: 24,
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
    functionLimits: [30, 30, 30, 30, 30],
    instructions: { en: "The Penultimate Challenge.", fr: "Le défi pénultième." },
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
      WWWWWWWWWWWWWWA
    `),
    start: [1, 1, Direction.RIGHT],
    stars: [[7, 7]],
    functionLimits: [40, 40, 40, 40, 40],
    instructions: { en: "Final Test: Ultimate Logic.", fr: "Test Final : Logique Ultime." },
    solutions: {}
  }
];
