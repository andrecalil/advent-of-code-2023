const challenge = 6;
const debug = true;

const races = [];

require("fs")
  .readFileSync(`./06/aoc-6-${debug ? "test" : "run"}.txt`, "utf-8")
  .split("\n")
  .filter(Boolean)
  .forEach((line, index) => {
    if (line.startsWith("Time")) {
      races.push({
        time: Number(line.split(":")[1].replaceAll(" ", "")),
        distance: 0,
        outcomes: [],
        odds: 0,
      });
    } else if (line.startsWith("Distance")) {
      races[index - 1].distance = Number(
        line.split(":")[1].replaceAll(" ", "")
      );
    }
  });

races.forEach((race) => {
  for (let hold = 0; hold <= race.time; hold++) {
    const distance = (race.time - hold) * hold;
    race.outcomes.push(distance);

    if (distance > race.distance) race.odds++;
  }
});

console.log(races.reduce((acc, r) => acc * r.odds, 1));
