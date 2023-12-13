if (!Array.prototype.last) {
  Array.prototype.last = function () {
    return this[this.length - 1];
  };
}

const challenge = 9;
const debug = false;

const historyLines = [];

require("fs")
  .readFileSync(
    `./${String(challenge).padStart(2, "0")}/aoc-${challenge}-${
      debug ? "test" : "run"
    }.txt`,
    "utf-8"
  )
  .split("\n")
  .filter(Boolean)
  .forEach((line, index) => {
    historyLines.push({
      id: index,
      line: line.split(" ").map((n) => Number(n.trim())),
      nextLine: null,
      previousLine: null,
    });
  });

const createDiffLine = (line) => {
  const diffLine = [];

  for (let i = 0; i < line.length - 1; i++) {
    const left = line[i];
    const right = line[i + 1];
    diffLine.push(right - left);
  }

  return diffLine;
};

const isLastLine = (line) => line.every((n) => n === 0);

const lastLines = [];

for (const line of historyLines) {
  let currentLine = line;

  while (true) {
    const newLine = createDiffLine(currentLine.line);

    if (isLastLine(newLine)) {
      lastLines.push(currentLine);
      break;
    } else {
      const newEntry = {
        id: currentLine.id + 1,
        line: newLine,
        nextLine: null,
        previousLine: currentLine,
      };

      currentLine.nextLine = newEntry;

      currentLine = newEntry;
    }
  }
}

for (const leaf of lastLines) {
  let node = leaf;

  while (node) {
    const previous = node.previousLine;
    const next = node.nextLine;

    node.fwd = node.line.last() + (next?.fwd ?? next?.line.last() ?? 0);
    node.bwd = node.line[0] - (next?.bwd ?? next?.line[0] ?? 0);

    node = previous;
  }
}

// for (const q of queues) {
//   let node = q.last;

//   let toProjectForwards = 0;
//   let toProjectBackwards = 0;

//   while (node.previous) {
//     toProjectForwards += node.line[node.line.length - 1];
//     toProjectBackwards += (node.nextLine?.line[0] ?? 0) - node.line[0];

//     node = node.previous;
//   }

//   node.projectedForwards = node.line[node.line.length - 1] + toProjectForwards;
//   node.projectedBackwards = toProjectBackwards + node.line[0];
// }

if (debug) {
  let depth = 0;
  const printLine = (l) => {
    console.log(`${"\t".repeat(depth)}${l.id}: ${l.line}`);
    console.log(`${"\t".repeat(depth)}${l.bwd} .. ${l.fwd}`);

    depth++;

    if (l.nextLine) {
      printLine(l.nextLine);
    }
  };

  for (const line of historyLines) {
    depth = 0;
    printLine(line);
  }

  //for (const q of queues) console.log(q.first.id, q.last.line);
}

console.log(
  "Projected next sum:",
  historyLines.reduce((acc, l) => acc + l.fwd, 0)
);
console.log(
  "Projected previous sum:",
  historyLines.reduce((acc, l) => acc + l.bwd, 0)
);
