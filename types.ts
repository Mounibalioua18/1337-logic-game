
export enum CellType {
  EMPTY = '.',
  WALL = 'W',
  PATH = 'G',
  RED = 'R',
  BLUE = 'B',
  GREEN = 'K', // Using K for green condition to avoid confusion with G (path)
  STAR = 'S',
  GOAL = 'Y'
}

export enum Direction {
  UP = 0,
  RIGHT = 1,
  DOWN = 2,
  LEFT = 3
}

export type ActionType = 'FORWARD' | 'LEFT' | 'RIGHT' | 'F1' | 'F2' | 'F3' | 'F4' | 'F5';
export type ConditionType = 'RED' | 'BLUE' | 'GREEN' | null;

export interface CommandInstance {
  action: ActionType;
  condition: ConditionType;
}

export interface Level {
  id: number;
  grid: string[][];
  start: [number, number, Direction];
  stars: [number, number][];
  functionLimits: number[]; // slots for F1, F2, F3, F4, F5
  instructions: { en: string; fr: string };
  solutions: Record<string, CommandInstance[]>;
}

export interface ExecutionState {
  pos: [number, number];
  dir: Direction;
  collectedStars: Set<string>;
  history: CommandInstance[];
  status: 'IDLE' | 'RUNNING' | 'WON';
}
