const challenge = 8;
const debug = true;

let steps = [];
const elements = new Map();
const initialKeys = [];

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
    if (index === 0) {
      steps = line.split("");
    } else {
      const [name, value] = line.split("=");
      const key = name.trim();
      const isFirst = key.endsWith("A");

      if (isFirst) {
        initialKeys.push(key);
      }

      const element = {
        name: key,
        isLast: key.endsWith("Z"),
        isFirst: isFirst,
        left: null,
        right: null,
      };

      value
        .trim()
        .replaceAll("(", "")
        .replaceAll(")", "")
        .split(",")
        .forEach((v, i) => {
          if (i === 0) {
            element.left = v.trim();
          } else {
            element.right = v.trim();
          }
        });

      elements.set(key, element);
    }
  });

const finishedKeys = new Map();
let rounds = 0;

while (finishedKeys.size < initialKeys.length) {
  finishedKeys.clear();

  for (const startKey of initialKeys) {
    const startingElement = elements.get(startKey);
    rounds = 0;

    while (!startingElement.continueFrom?.isLast) {
      for (const s of steps) {
        const current = startingElement.continueFrom || startingElement;
        const isLeft = s === "L";
        const goTo = isLeft ? current.left : current.right;

        startingElement.continueFrom = { ...elements.get(goTo) };
      }

      rounds += 1;

      if (startingElement.continueFrom.isLast)
        finishedKeys.set(startKey, rounds);
    }
  }
}

// while (finishedKeys.size < initialKeys.length) {
//   finishedKeys.clear();

//   for (const startKey of initialKeys) {
//     const startingElement = elements.get(startKey);

//     for (const s of steps) {
//       const current = startingElement.continueFrom || startingElement;
//       const isLeft = s === "L";
//       const goTo = isLeft ? current.left : current.right;

//       startingElement.continueFrom = { ...elements.get(goTo) };
//     }

//     if (initialKeys.includes(startingElement.continueFrom.name)) {
//       loopKeys.set(startKey, true);
//       console.log(loopKeys);
//     }

//     if (startingElement.continueFrom.isLast) finishedKeys.set(startKey, true);

//     rounds += 1;
//   }
// }

if (debug) {
  console.log(`Steps: ${steps.join(", ")}`);

  console.log("Elements:");
  for (const [key, value] of elements) {
    console.log(
      `\t${key}  = (${value.left}, ${value.right}) ${
        value.isFirst ? "<<<" : value.isLast ? ">>>" : ""
      }`
    );
  }

  console.log("Steps per starting point:");
  console.log(finishedKeys);
}

let longestPath = 0;

for (const [, value] of finishedKeys) {
  if (value > longestPath) {
    longestPath = value;
  }
}

const findGCD = (a, b) => (b === 0 ? a : findGCD(b, a % b));

const findLCM = (a, b) => (a * b) / findGCD(a, b);

const findLCMFromArray = (numbers) => {
  let lcm = numbers[0];

  for (let i = 1; i < numbers.length; i++) lcm = findLCM(lcm, numbers[i]);

  return lcm;
};

const lcmResult = findLCMFromArray(Array.from(finishedKeys.values()));

console.log(lcmResult * steps.length);
