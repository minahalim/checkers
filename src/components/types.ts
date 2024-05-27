export interface IStone {
  canMove?: boolean;
  color: string;
  markStone?: () => void;
  currentPlayer?: string;
  stonePlayer?: string;
}

export interface IBoardSquare {
  darkCell: boolean;
  hasPlayer: string | null;
}

export interface ISquare {
  darkCell: boolean;
  hasPlayer: string | null;
  x: number;
  y: number;
  markStone: () => void;
  dropStone: (x: number, y: number) => void;
  stoneLocation: number[];
  currentPlayer: string;
  isValidMove: boolean;
  isValidJump: boolean;
}

export enum Player {
  Player1 = 'green',
  Player2 = 'red'
}

export const ItemTypes = {
  STONE: 'stone'
};
