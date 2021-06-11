import fs = require("fs");

const maxNumber = 1e6;
const dataNumberCount = 1e7;

let stringBuffer = "";
for (let i = 0; i < dataNumberCount; ++i) {
    stringBuffer += Math.ceil(Math.random() * maxNumber) + " ";
}

fs.writeFileSync("../website/randomData.txt", stringBuffer, { encoding: "utf-8" });

export = {
    maxNumber,
    dataNumberCount,
};
