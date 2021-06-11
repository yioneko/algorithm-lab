export interface Coordinate {
  x: number;
  y: number;
}

export type BoardConfig = Array<Coordinate>;
export type SolutionPath = Array<BoardConfig>;

export type Mode = "dfs" | "bfs" | "bestfs" | "bab";
export type SolveFn = () => Promise<{ time: number; solution?: SolutionPath }>;
