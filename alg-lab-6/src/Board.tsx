import React, { useEffect, useState } from "react";
import "./Board.css";
import { initialConfig } from "./solve";
import type { BoardConfig, SolutionPath } from "./types";

export function useBoardAnim(
  boardAnimInterval: number,
  solution: SolutionPath
): {
  boardConfig: BoardConfig;
  setBoardConfig: React.Dispatch<React.SetStateAction<BoardConfig>>;
} {
  const [boardConfig, setBoardConfig] = useState<BoardConfig>(initialConfig);

  useEffect(() => {
    let configIndex = 0;
    const interval = setInterval(() => {
      if (configIndex === solution.length) {
        clearInterval(interval);
        return;
      }
      setBoardConfig(solution[configIndex++]);
    }, boardAnimInterval);

    return () => {
      clearInterval(interval);
    };
  }, [boardAnimInterval, solution]);

  return { boardConfig, setBoardConfig };
}

export interface BoardProps {
  boardAnimInterval: number;
  boardConfig: BoardConfig;
}

const tileSize = 50;

export default function Board({ boardAnimInterval, boardConfig }: BoardProps) {
  return (
    <div
      className="board"
      style={{
        ["--tile-size" as any]: `${tileSize}px`,
        ["--interval" as any]: `${boardAnimInterval}ms`,
        width: tileSize * 3,
        height: tileSize * 3,
      }}
    >
      {boardConfig.map((config, index) => (
        <div
          className="tile"
          style={{
            ["--x" as any]: `${config.x * tileSize}px`,
            ["--y" as any]: `${config.y * tileSize}px`,
            width: tileSize,
            height: tileSize,
          }}
        >
          {index > 0 ? index : undefined}
        </div>
      ))}
    </div>
  );
}
