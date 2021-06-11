import React from "react";
import type { Mode } from "./types";

interface ModeSelectProps {
  mode: Mode;
  onModeChange: React.ChangeEventHandler<HTMLInputElement>;
}

export function ModeSelect({ mode, onModeChange }: ModeSelectProps) {
  return (
    <div className="radio-group" onChange={onModeChange}>
      {[
        ["bfs", "BFS"],
        ["dfs", "DFS"],
        ["bestfs", "Best first search"],
        ["bab", "Branch and bound"],
      ].map((radioInfo) => (
        <div>
          <input
            type="radio"
            checked={mode === radioInfo[0]}
            name="mode"
            value={radioInfo[0]}
            id={radioInfo[0]}
          />
          <label htmlFor={radioInfo[0]}>{radioInfo[1]}</label>
        </div>
      ))}
    </div>
  );
}
