const challenge = 5;
const debug = true;

const lines = require("fs")
  .readFileSync(
    `./${String(challenge).padStart(2, "0")}/aoc-${challenge}-${
      debug ? "test" : "run"
    }.txt`,
    "utf-8"
  )
  .split("\n")
  .filter(Boolean);

const seeds = [];

const maps = [
  { index: 0, name: "SEED_TO_SOIL", pairs: [] },
  { index: 1, name: "SOIL_TO_FERTILIZER", pairs: [] },
  { index: 2, name: "FERTILIZER_TO_WATER", pairs: [] },
  { index: 3, name: "WATER_TO_LIGHT", pairs: [] },
  { index: 4, name: "LIGHT_TO_TEMPERATURE", pairs: [] },
  { index: 5, name: "TEMPERATURE_TO_HUMIDITY", pairs: [] },
  { index: 6, name: "HUMIDITY_TO_LOCATION", pairs: [] },
];
let currentMap = maps[0];

const sections = [
  "seed-to-soil map:",
  "soil-to-fertilizer map:",
  "fertilizer-to-water map:",
  "water-to-light map:",
  "light-to-temperature map:",
  "temperature-to-humidity map:",
  "humidity-to-location map:",
];

for (const l of lines) {
  if (l.startsWith("seeds:")) {
    const seedsArray = l
      .split(":")[1]
      .trim()
      .split(" ")
      .map((s) => Number(s.trim()));

    for (let i = 0; i < seedsArray.length; i++) {
      if (i % 2 === 0) {
        seeds.push({
          seedStart: seedsArray[i],
          seedRange: seedsArray[i + 1],
          soil: 0,
          fertilizer: 0,
          water: 0,
          light: 0,
          temperature: 0,
          humidity: 0,
          location: 0,
        });
      }
    }
  } else if (sections.includes(l.trim())) {
    currentMap = maps.find((m) => m.index === sections.indexOf(l.trim()));
  } else if (!isNaN(Number(l.trim()[0]))) {
    const values = l
      .trim()
      .split(" ")
      .map((n) => Number(n.trim()));
    const [destinationRangeStart, sourceRangeStart, rangeLength] = values;

    currentMap.pairs.push([
      sourceRangeStart,
      destinationRangeStart,
      rangeLength,
    ]);
  }
}

let closestSeed = null;

const processSeed = (seed) => {
  for (let m = 0; m < maps.length; m++) {
    const map = maps[m];

    let from = "";
    let to = "";

    switch (m) {
      case 0:
        from = "seed";
        to = "soil";
        break;
      case 1:
        from = "soil";
        to = "fertilizer";
        break;
      case 2:
        from = "fertilizer";
        to = "water";
        break;
      case 3:
        from = "water";
        to = "light";
        break;
      case 4:
        from = "light";
        to = "temperature";
        break;
      case 5:
        from = "temperature";
        to = "humidity";
        break;
      case 6:
        from = "humidity";
        to = "location";
        break;
      default:
        break;
    }

    const fromValue = seed[from];
    const mapped = map.pairs.find(
      (p) => p[0] <= fromValue && p[0] + p[2] - 1 >= fromValue
    );

    seed[to] = mapped ? mapped[1] + (fromValue - mapped[0]) : fromValue;

    if (m === 6) {
      if (closestSeed === null) {
        closestSeed = seed;
      } else {
        if (closestSeed.location > seed.location) {
          closestSeed = seed;
        }
      }
    }
  }

  return seed;
};

let location = Number.MAX_VALUE;
for (const seed of seeds) {
  for (let i = 0; i < seed.seedRange; i++) {
    const _loc = processSeed({ ...seed, seed: seed.seedStart + i });
    if (_loc < location) {
      console.log(_loc);
      location = _loc;
    }
  }
}

if (debug) {
  console.log(`Seeds:`);
  for (const seed of seeds) {
    console.log(
      `\t${seed.seedStart} -> ${seed.seedStart + seed.seedRange - 1} (${
        seed.seedRange
      })`
    );
  }
  console.log();
  console.log("Maps:");

  for (const map of maps) {
    console.log(`\t${map.name}:`);

    for (let i = 0; i < map.pairs.length; i++) {
      console.log(`\t\t${map.pairs[i][0]} -> ${map.pairs[i][1]}`);
    }
    console.log();
  }

  console.log("Closest Seed:");
  console.log(
    `\t\t${closestSeed.seed}(${closestSeed.seedStart}) -> ${closestSeed.soil} -> ${closestSeed.fertilizer} -> ${closestSeed.water} -> ${closestSeed.light} -> ${closestSeed.temperature} -> ${closestSeed.humidity} -> ${closestSeed.location}`
  );
}

console.log(closestSeed);
