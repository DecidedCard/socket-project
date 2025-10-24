export enum Player {
  Black = "black",
  White = "white",
}

export type Cell = Player | null;

export interface Room {
  id: number;
  check: boolean;
  created_at: string;
}
