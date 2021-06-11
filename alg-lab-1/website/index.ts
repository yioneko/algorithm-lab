import { Chart } from "chart.js";
import dataAll from "./benchmarkDataAll.json";
import dataPartial from "./benchmarkDataPartial.json";

const canvasAllData = document.querySelector(".chart-all-data") as HTMLCanvasElement;
const ctxAllData = canvasAllData.getContext("2d") as CanvasRenderingContext2D;

const canvasPartialData = document.querySelector(".chart-partial-data") as HTMLCanvasElement;
const ctxPartialData = canvasPartialData.getContext("2d") as CanvasRenderingContext2D;

const dataDefaultConfig = {
  showLine: true,
  fill: false,
  borderWidth: 1.5,
  pointRadius: 1,
};
const colors: Record<string, string> = {
  "Bubble sort": "rgb(14, 227, 36)",
  "Insertion sort": "rgb(44, 95, 205)",
  "Selection sort": "rgb(73, 102, 21)",
  "Bucket sort": "rgb(215, 181, 119)",
  "Heap sort": "rgb(173, 104, 228)",
  "Quick sort": "rgb(93, 5, 43)",
};

function createChart(dataFile: any, ctx: CanvasRenderingContext2D): void {
  const datasets = [];
  for (const [label, data] of Object.entries(dataFile)) {
    datasets.push({
      label,
      data: data as { x: number; y: number }[],
      borderColor: [colors[label]],
      ...dataDefaultConfig,
    });
  }

  new Chart(ctx, {
    type: "scatter",
    data: {
      datasets,
    },
    options: {
      scales: {
        xAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: "Elements",
              fontSize: 16,
              fontStyle: "bold",
            },
          },
        ],
        yAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: "Time (milliseconds)",
              fontSize: 16,
              fontStyle: "bold",
            },
          },
        ],
      },
    },
  });
}

createChart(dataAll, ctxAllData);
createChart(dataPartial, ctxPartialData);
