const challenge = 2;
const debug = true;

const input = `

`;

const games = input
  .split("\n")
  .filter(Boolean)
  .map((game) => {
    const [name, rounds] = game.split(":");
    return {
      id: Number(name.replace("Game ", "").trim()),
      rounds: rounds
        .trim()
        .split(";")
        .map((round) => {
          const colorBySet = round.trim().split(",");

          const colors = colorBySet.map((colorCount) => {
            const countAndColor = colorCount.trim().split(" ");
            return {
              count: Number(countAndColor[0]),
              color: countAndColor[1],
            };
          });

          return { colors };
        }),
    };
  });

//PREPARATION
for (const game of games) {
  game.totals = game.rounds
    .map((r) => r.colors)
    .reduce((acc, draw) => {
      for (const pick of draw) {
        const match = acc.find((c) => c.color === pick.color);

        if (match)
          match.count = pick.count > match.count ? pick.count : match.count;
        else acc.push({ ...pick });
      }

      return acc;
    }, []);

  game.power = game.totals.reduce((acc, color) => acc * color.count, 1);
}

//DEBUG
// for (const game of games) {
//   console.log(`Game ${game.id}:`);

//   for (const round of game.rounds) {
//     console.log(`\tRound:`);

//     for (const color of round.colors) {
//       console.log(`\t\t${color.count} ${color.color}`);
//     }
//   }

//   console.log(`\tColors:`);

//   for (const color of game.totals) {
//     console.log(`\t\t${color.count} ${color.color}`);
//   }

//   console.log(`\tPower: ${game.power}`);

//   console.log("--------------------------------------------------");
// }

const test = [
  {
    color: "red",
    count: 12,
  },
  {
    color: "green",
    count: 13,
  },
  {
    color: "blue",
    count: 14,
  },
];

const availableGames = games.filter((game) => {
  return test.every((test) => {
    const match = game.totals.find((g) => g.color === test.color);
    return match && match.count <= test.count;
  });
});

console.log(
  "Available games:",
  availableGames.reduce((acc, game) => acc + game.id, 0)
);
console.log(
  "Total power:",
  games.reduce((acc, game) => acc + game.power, 0)
);
