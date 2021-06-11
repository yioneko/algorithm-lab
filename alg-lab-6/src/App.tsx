import { useState } from "react";
import "./App.css";
import Board, { useBoardAnim } from "./Board";
import { ModeSelect } from "./ModeSelect";
import { initialConfig, solveFns } from "./solve";
import type { Mode, SolutionPath } from "./types";

interface AppProps {
  boardAnimInterval?: number;
}

export default function App(props: AppProps) {
  const { boardAnimInterval = 300 } = props;
  const [solution, setSolution] = useState<SolutionPath>([]);
  const [mode, setMode] = useState<Mode>("bfs");

  const [timeCost, setTimeCost] = useState<number>(NaN);
  const [msg, setMsg] = useState("Solution");

  const { boardConfig, setBoardConfig } = useBoardAnim(boardAnimInterval, solution);

  return (
    <div className="8-puzzle-app">
      <header><h2>Solution for 8-Puzzle problem</h2></header>
      <div className="grid">
        <div className="grid-left">
          <Board boardConfig={boardConfig} boardAnimInterval={boardAnimInterval} />
          <div className="btn-group">
            <button
              onClick={() => {
                setBoardConfig(initialConfig);
              }}
            >
              Initialization
            </button>
            <button
              onClick={async () => {
                const { time, solution } = await solveFns[mode]();
                setTimeCost(time);
                solution ? setSolution(solution) : setMsg("Solution not found");
              }}
            >
              Run
            </button>
          </div>
        </div>
        <div className="grid-right">
          <ModeSelect
            mode={mode}
            onModeChange={(e) => {
              setMode(e.target.value as Mode);
            }}
          />
          <h4>{msg}</h4>
          <div>Time(s): {timeCost / 1000}</div>
          <div>Step: {solution.length}</div>
        </div>
      </div>
    </div>
  );
}
