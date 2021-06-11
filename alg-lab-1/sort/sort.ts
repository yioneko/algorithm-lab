// import { maxNumber } from './random';
import random = require("./random");
import perfHooks = require("perf_hooks");
import fs = require("fs");
const { maxNumber, dataNumberCount } = random;
const { performance } = perfHooks;

function swap(arr: Array<number>, i: number, j: number): void {
    const temp = arr[j];
    arr[j] = arr[i];
    arr[i] = temp;
}

function bubbleSort(arr: Array<number>): Array<number> {
    for (let i = 0; i < arr.length; ++i) {
        for (let j = 0; j < arr.length; ++j) {
            if (arr[j] > arr[j + 1]) {
                swap(arr, j, j + 1);
            }
        }
    }

    return arr;
}

function insertionSort(arr: Array<number>): Array<number> {
    for (let i = 0; i < arr.length; ++i) {
        for (let j = i - 1; j >= 0; --j) {
            if (arr[j + 1] < arr[j]) {
                swap(arr, j, j + 1);
            }
        }
    }

    return arr;
}

function selectionSort(arr: Array<number>): Array<number> {
    for (let i = 0; i < arr.length; ++i) {
        for (let j = i + 1; j < arr.length; ++j) {
            if (arr[j] < arr[i]) {
                swap(arr, i, j);
            }
        }
    }

    return arr;
}

function bucketSort(arr: Array<number>): Array<number> {
    const bucketCount = Math.ceil(Math.min(arr.length / 4, 1e5));
    const numberGap = maxNumber / (bucketCount - 1);
    const buckets: Array<Array<number>> = Array.from(
        new Array(bucketCount),
        () => []
    );
    for (let i = 0; i < arr.length; ++i) {
        const bucket = buckets[Math.floor(arr[i] / numberGap)];
        bucket.push(arr[i]);
        for (
            let j = bucket.length - 1;
            j >= 1 && bucket[j - 1] > bucket[j];
            --j
        ) {
            swap(bucket, j, j - 1);
        }
    }

    const ans: number[] = [];
    for (let i = 0; i < bucketCount; ++i) {
        ans.push(...buckets[i]);
    }

    return ans;
}

function heapSort(arr: Array<number>): Array<number> {
    arr.unshift(0);
    const ans: number[] = [];

    function pushDown(i: number) {
        const lower = arr[i * 2]
            ? arr[i * 2 + 1]
                ? arr[i * 2] < arr[i * 2 + 1]
                    ? i * 2
                    : i * 2 + 1
                : i * 2
            : -1;
        if (lower !== -1 && arr[i] > arr[lower]) {
            swap(arr, i, lower);
            pushDown(lower);
        }
    }

    function delFirst() {
        ans.push(arr[1]);
        swap(arr, 1, arr.length - 1);
        arr.pop();
        pushDown(1);
    }

    for (let i = arr.length / 2 - 1; i >= 1; --i) {
        let cur = i;
        while (cur != 0 && arr[cur] < arr[cur >> 1]) {
            swap(arr, cur, cur >> 1);
            cur >>= 1;
        }
        pushDown(cur);
    }

    while (arr.length !== 1) {
        delFirst();
    }

    return ans;
}

function quickSort(arr: Array<number>): Array<number> {
    function innerQuickSort(l: number, r: number): void {
        // console.log(l, r);
        if (l >= r) return;
        const pivot = (l + r) >> 1,
            pivotValue = arr[pivot];
        swap(arr, pivot, r);
        let lp = l,
            rp = r - 1;
        while (lp < rp) {
            while (lp < r && arr[lp] < pivotValue) ++lp;
            while (rp > l && arr[rp] >= pivotValue) --rp;
            swap(arr, lp, rp);
        }
        swap(arr, lp, rp);
        if (arr[lp] >= arr[r]) swap(arr, lp, r);
        innerQuickSort(l, rp);
        innerQuickSort(rp + 1, r);
    }

    innerQuickSort(0, arr.length - 1);
    return arr;
}

function testSort(): void {
    const arr = [
        78,
        16,
        45,
        89,
        130,
        8778,
        114,
        652,
        0,
        166,
        26,
        35,
        626,
        7744,
        30,
        78,
        130,
        5589,
        1131,
    ];
    console.log("bubble sort", bubbleSort([...arr]));
    console.log("insertion sort", insertionSort([...arr]));
    console.log("selection sort", selectionSort([...arr]));
    console.log("bucket sort", bucketSort([...arr]));
    console.log("heap sort", heapSort([...arr]));
    console.log("quick sort", quickSort([...arr]));
}

// testSort();

type data = Array<{ x: number; y: number }>;

function executeSort(
    sort: (arr: Array<number>) => Array<number>,
    arr: Array<number>
): number {
    const start = performance.now();
    sort(arr);
    const end = performance.now();
    const cost = end - start;
    return cost;
}

const sorts: Record<string, (arr: Array<number>) => Array<number>> = {
    "Bubble sort": bubbleSort,
    "Insertion sort": insertionSort,
    "Selection sort": selectionSort,
    "Bucket sort": bucketSort,
    "Heap sort": heapSort,
    "Quick sort": quickSort,
};

function extract<T extends object, K extends keyof T>(src: T, ...props: Array<K>): Pick<T, K> {
    const ret = Object.create(null);
    for (const k of props) {
        ret[k] = src[k];
    }
    return ret;
}

function writeBenchmarkData(
    maxDataAmount: number,
    step: number,
    fileName: string,
    testSorts: typeof sorts
): void {
    const rawData = fs
        .readFileSync("../website/randomData.txt", "utf-8")
        .split(" ");
    const data: Array<number> = rawData.map((numStr) => parseInt(numStr));
    const benchmarkResult: Record<string, data> = {};
    for (const label of Object.keys(testSorts)) {
        benchmarkResult[label] = [];
    }
    for (let amount = step; amount <= maxDataAmount; amount += step) {
        for (const [label, sort] of Object.entries(testSorts)) {
            console.log(`${label}: ${amount} elements`);
            benchmarkResult[label].push({
                x: amount,
                y: executeSort(sort, data.slice(0, amount)),
            });
        }
    }
    fs.writeFileSync(
        `../website/${fileName}`,
        JSON.stringify(benchmarkResult),
        {
            encoding: "utf-8",
        }
    );
}

writeBenchmarkData(1e5, 1e3, "benchmarkDataAll.json", sorts);
writeBenchmarkData(
    dataNumberCount,
    1e5,
    "benchmarkDataPartial.json",
    extract(sorts, "Bucket sort", "Heap sort", "Quick sort")
);
