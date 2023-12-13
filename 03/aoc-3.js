const challenge = 3;
const debug = true;

const input = `

`;

const lines = input.trim().split("\n").filter(Boolean);

const numbers = [];
const symbols = [];

for (let l = 0; l < lines.length; l++) {
  const line = lines[l];
  let number = "";
  let coordinates = [];

  for (let c = 0; c < line.length; c++) {
    const char = line[c];

    if (!isNaN(char)) {
      number += "" + char;
      coordinates.push({
        x: c,
        y: l,
      });

      if (number.length > 0 && c === line.length - 1) {
        numbers.push({
          number: Number(number),
          coordinates: [...coordinates],
        });

        coordinates = [];
        number = "";
      }
    } else {
      if (char !== ".") {
        symbols.push({
          gear: char === "*",
          symbol: char,
          x: c,
          y: l,
        });
      }

      if (number.length > 0) {
        numbers.push({
          number: Number(number),
          coordinates: [...coordinates],
        });

        coordinates = [];
        number = "";
      }
    }
  }
}

const boundaries = [
  { x: -1, y: -1 },
  { x: 0, y: -1 },
  { x: 1, y: -1 },
  { x: 0, y: 1 },
  { x: -1, y: 1 },
  { x: 1, y: 1 },
  { x: 1, y: 0 },
  { x: -1, y: 0 },
];

for (const n of numbers) {
  for (const s of symbols) {
    for (const b of boundaries) {
      const boundaryX = s.x + b.x;
      const boundaryY = s.y + b.y;

      if (boundaryX < 0 || boundaryY < 0) continue;

      if (n.coordinates.some((c) => c.x === boundaryX && c.y === boundaryY)) {
        n.valid = true;
        break;
      }
    }

    if (n.valid) break;
  }
}

for (const g of symbols.filter((s) => s.gear)) {
  const gearBoundaries = boundaries.map((b) => `${b.x + g.x}-${b.y + g.y}`);

  const closeNumbers = numbers.filter(
    (n) =>
      n.valid &&
      n.coordinates.some((c) => gearBoundaries.includes(`${c.x}-${c.y}`))
  );

  if (closeNumbers.length === 2) {
    g.valid = true;
    g.ratio = closeNumbers[0].number * closeNumbers[1].number;
  }
}

if (debug) {
  for (const n of numbers) {
    console.log(`${n.number} ${n.valid ? "<<" : ""}`);
    for (const c of n.coordinates) {
      console.log(`\t[${c.x},${c.y}]`);
    }
  }

  for (const s of symbols) {
    console.log(
      `${s.symbol}: [${s.x}, ${s.y}] ${s.gear ? "Gear" : ""} ${
        s.valid ? "<<" : ""
      }`
    );
  }
}

console.log(
  numbers.filter((n) => n.valid).reduce((total, n) => total + n.number, 0)
);

console.log(
  symbols.filter((g) => g.valid).reduce((total, g) => total + g.ratio, 0)
);
