import type { BoardConfig, Mode, SolutionPath, SolveFn } from "./types";
import std from "tstl";

export const initialConfig: BoardConfig = [
  { x: 2, y: 2 },
  { x: 1, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 2 },
  { x: 2, y: 1 },
  { x: 2, y: 0 },
  { x: 1, y: 2 },
  { x: 1, y: 1 },
  { x: 0, y: 1 },
];

export const targetConfig: BoardConfig = [
  { x: 2, y: 2 },
  { x: 0, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: 2 },
  { x: 1, y: 0 },
  { x: 1, y: 1 },
  { x: 1, y: 2 },
  { x: 2, y: 0 },
  { x: 2, y: 1 },
];

const factors = (() => {
  const res = [1];
  for (let i = 1; i < 9; ++i) {
    res.push(res[i - 1] * i);
  }
  return res;
})();

function configHasher(config: BoardConfig): number {
  let hashCode = 0;
  const arrange: number[] = config.map((coordinate) => coordinate.x * 3 + coordinate.y);
  arrange.forEach((val, index) => {
    let lessValCnt = 0;
    for (let i = index + 1; i < arrange.length; ++i) {
      if (arrange[i] < arrange[index]) {
        lessValCnt++;
      }
    }
    hashCode += lessValCnt * factors[arrange.length - 1 - index];
  });
  return hashCode;
}

function isConfigEql(c1: BoardConfig, c2: BoardConfig): boolean {
  for (let i = 0; i < c1.length; ++i) {
    if (c1[i].x !== c2[i].x || c1[i].y !== c2[i].y) {
      return false;
    }
  }
  return true;
}

const directions = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
];

function getNextMove(config: BoardConfig): Array<BoardConfig> {
  const nextMove: Array<BoardConfig> = [];
  for (const dir of directions) {
    const nx = config[0].x + dir[0],
      ny = config[0].y + dir[1];
    if (nx >= 0 && nx < 3 && ny >= 0 && ny < 3) {
      const newConfig = config.map((coordinate, index) => {
        if (index === 0) {
          return { x: nx, y: ny };
        }
        if (coordinate.x === nx && coordinate.y === ny) {
          return { x: nx - dir[0], y: ny - dir[1] };
        }
        return coordinate;
      });
      nextMove.push(newConfig);
    }
  }
  return nextMove;
}

const bfs: SolveFn = async () => {
  const begTime = new Date().getTime();
  const solution: SolutionPath = [];

  const solutionVisitSet = new std.HashSet<BoardConfig>(configHasher, isConfigEql);
  const preSolution = new std.HashMap<BoardConfig, BoardConfig>(configHasher, isConfigEql);
  const solutionQueue = new std.Queue<BoardConfig>();
  solutionVisitSet.push(targetConfig);
  solutionQueue.push(targetConfig);

  let solved = false;
  while (!solved && !solutionQueue.empty()) {
    const front = solutionQueue.front();
    solutionQueue.pop();
    for (const config of getNextMove(front)) {
      if (!solutionVisitSet.count(config)) {
        solutionVisitSet.push(config);
        preSolution.push({ first: config, second: front });
        if (isConfigEql(config, initialConfig)) {
          solved = true;
          break;
        }
        solutionQueue.push(config);
      }
    }
  }

  if (!solved) {
    return {
      time: new Date().getTime() - begTime,
    };
  }

  let curConfig = initialConfig;
  solution.push(curConfig);
  while (!isConfigEql(curConfig, targetConfig)) {
    curConfig = preSolution.find(curConfig).second;
    solution.push(curConfig);
  }

  return {
    time: new Date().getTime() - begTime,
    solution,
  };
};

const dfs: SolveFn = async () => {
  const begTime = new Date().getTime();
  const solution: SolutionPath = Array.of(initialConfig);
  const solutionVisitSet = new std.HashSet<BoardConfig>(configHasher, isConfigEql);

  solutionVisitSet.push(initialConfig);
  solution.push(initialConfig);

  const innerDfs = (curConfig: BoardConfig): boolean => {
    if (isConfigEql(curConfig, targetConfig)) {
      return true;
    }
    // prevent overflow of stack
    if (solution.length >= 200) {
      return false;
    }
    for (const config of getNextMove(curConfig)) {
      if (!solutionVisitSet.count(config)) {
        solution.push(config);
        solutionVisitSet.push(config);
        if (innerDfs(config)) {
          return true;
        }
        solution.pop();
      }
    }

    return false;
  };

  if (innerDfs(initialConfig)) {
    return {
      time: new Date().getTime() - begTime,
      solution,
    };
  }

  return {
    time: new Date().getTime() - begTime,
  };
};

function estimateCost(config: BoardConfig, target: BoardConfig): number {
  let res = 0;
  for (let i = 1; i < config.length; ++i) {
    res += Math.abs(config[i].x - target[i].x) + Math.abs(config[i].y - target[i].y);
  }
  return res;
}

const bestFirst: SolveFn = async () => {
  const begTime = new Date().getTime();
  const solution: SolutionPath = Array.of(initialConfig);
  const solutionVisitSet = new std.HashSet<BoardConfig>(configHasher, isConfigEql);

  solutionVisitSet.push(initialConfig);
  solution.push(initialConfig);

  const innerDfs = (curConfig: BoardConfig): boolean => {
    if (isConfigEql(curConfig, targetConfig)) {
      return true;
    }
    for (const config of getNextMove(curConfig).sort(
      (a, b) => estimateCost(a, targetConfig) - estimateCost(b, targetConfig)
    )) {
      if (!solutionVisitSet.count(config)) {
        solution.push(config);
        solutionVisitSet.push(config);
        if (innerDfs(config)) {
          return true;
        }
        solution.pop();
      }
    }

    return false;
  };

  if (innerDfs(initialConfig)) {
    return {
      time: new Date().getTime() - begTime,
      solution,
    };
  }

  return {
    time: new Date().getTime() - begTime,
  };
};

const branchAndBound: SolveFn = async () => {
  const begTime = new Date().getTime();
  const solution: SolutionPath = [];

  interface ConfigWithVal {
    config: BoardConfig;
    g: number;
    f: number;
  }
  const solutionQueue = new std.PriorityQueue<ConfigWithVal>((a, b) => a.f > b.f);
  const preSolution = new std.HashMap<ConfigWithVal, ConfigWithVal>();

  const initialConfigWithVal: ConfigWithVal = {
    config: targetConfig,
    g: 0,
    f: estimateCost(targetConfig, initialConfig),
  };
  solutionQueue.push(initialConfigWithVal);

  let solved = false;
  while (!solved && !solutionQueue.empty()) {
    const top = solutionQueue.top();
    solutionQueue.pop();
    for (const config of getNextMove(top.config)) {
      const newConfigWithVal = {
        config,
        g: top.g + 1,
        f: top.g + 1 + estimateCost(config, initialConfig),
      };
      preSolution.push({ first: newConfigWithVal, second: top });
      if (isConfigEql(config, initialConfig)) {
        solved = true;

        let curConfig = newConfigWithVal;
        solution.push(initialConfig);
        while (!isConfigEql(curConfig.config, targetConfig)) {
          curConfig = preSolution.find(curConfig).second;
          solution.push(curConfig.config);
        }
        break;
      }
      solutionQueue.push(newConfigWithVal);
    }
  }

  if (!solved) {
    return {
      time: new Date().getTime() - begTime,
    };
  }

  return {
    time: new Date().getTime() - begTime,
    solution,
  };
};

export const solveFns: Record<Mode, SolveFn> = {
  bfs: bfs,
  dfs: dfs,
  bestfs: bestFirst,
  bab: branchAndBound,
};
