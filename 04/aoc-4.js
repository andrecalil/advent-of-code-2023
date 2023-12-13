const challenge = 4;
const debug = true;

const input = `

`;

const cards = input
  .split("\n")
  .filter(Boolean)
  .map((card) => {
    const [id, numbers] = card.split(":");
    const [winning, cardNumbers] = numbers.trim().split("|");

    const result = {
      id: Number(id.trim().replace("Card ", "")),
      winning: winning.trim().split(" ").filter(Boolean).map(Number),
      cardNumbers: cardNumbers.trim().split(" ").filter(Boolean).map(Number),
      matches: [],
      cardIds: [],
      worth: 0,
      cardCount: 0,
    };

    result.matches = result.cardNumbers.filter((number) =>
      result.winning.includes(number)
    );

    const matchCount = result.matches.length;

    for (let i = 1; i <= matchCount; i++) {
      result.cardIds.push(result.id + i);
    }

    result.cardCount = result.cardIds.length + 1;

    result.worth = matchCount === 0 ? 0 : Math.pow(2, matchCount - 1);

    return result;
  });

const getCountForCard = (cardId) => {
  const card = cards.find((c) => c.id === cardId);
  if (!card) return 0;

  if (card.cardIds.length === 0) return 1;

  return card.cardIds.reduce((acc, id) => acc + getCountForCard(id), 1);
};

let totalCards = 0;

cards.forEach((card) => (totalCards += getCountForCard(card.id)));

if (debug) {
  for (const c of cards) {
    console.log(`Card ${c.id}:`);
    console.log(`\tWinning: ${c.winning.join(" ")}`);
    console.log(`\tNumbers: ${c.cardNumbers.join(" ")}`);
    console.log(`\tMatches: ${c.matches.join(" ")}`);
    console.log(`\tWorth: ${c.worth}`);
    console.log(`\tCard Ids: ${c.cardIds.join(" ")}`);
    console.log(`\tCard Count: ${c.cardCount}`);
  }
}

console.log(`Total Cards: ${totalCards}`);
console.log(cards.reduce((acc, c) => acc + c.worth, 0));
