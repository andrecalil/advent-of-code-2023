const challenge = 7;
const debug = true;

const cards = [
  {
    card: `A`,
    value: 14,
  },
  {
    card: "K",
    value: 13,
  },
  {
    card: `Q`,
    value: 12,
  },
  {
    card: "T",
    value: 10,
  },
  {
    card: `9`,
    value: 9,
  },
  {
    card: `8`,
    value: 8,
  },
  {
    card: `7`,
    value: 7,
  },
  {
    card: `6`,
    value: 6,
  },
  {
    card: `5`,
    value: 5,
  },
  {
    card: `4`,
    value: 4,
  },
  {
    card: `3`,
    value: 3,
  },
  {
    card: `2`,
    value: 2,
  },
  {
    card: `J`,
    value: 1,
  },
];

const groupCards = (cards) => {
  const groups = cards.reduce((acc, card) => {
    let group = acc.find((g) => g.card === card.card);
    if (!group) acc.push({ card: card.card, count: 1 });
    else group.count++;

    return acc;
  }, []);

  if (groups.length === 1) return groups;

  if (!cards.some((c) => c.card === "J")) return groups;

  const joker = groups.find((g) => g.card === "J");
  const jokerIndex = groups.indexOf(joker);

  groups.splice(jokerIndex, 1);

  groups.sort((a, b) => b.count - a.count)[0].count += joker.count;

  return groups;
};

const plays = [
  {
    play: `Five of a Kind`,
    value: 7,
    isPlay: (hand) => groupCards(hand.cards).some((g) => g.count === 5),
  },
  {
    play: `Four of a Kind`,
    value: 6,
    isPlay: (hand) => groupCards(hand.cards).some((g) => g.count === 4),
  },
  {
    play: `Full House`,
    value: 5,
    isPlay: (hand) => {
      const groups = groupCards(hand.cards);

      return (
        groups.some((g) => g.count === 3) && groups.some((g) => g.count === 2)
      );
    },
  },
  {
    play: `Three of a Kind`,
    value: 4,
    isPlay: (hand) => groupCards(hand.cards).some((g) => g.count === 3),
  },
  {
    play: `Two Pairs`,
    value: 3,
    isPlay: (hand) =>
      groupCards(hand.cards).filter((g) => g.count === 2).length === 2,
  },
  {
    play: `One Pair`,
    value: 2,
    isPlay: (hand) => groupCards(hand.cards).some((g) => g.count === 2),
  },
  {
    play: `High Card`,
    value: 1,
    isPlay: () => true,
  },
];

const setPlay = (hand) => {
  const play = plays.find((p) => p.isPlay(hand));
  hand.play = play.play;
  hand.playValue = play.value;
};

const untie = (a, b) => {
  if (!a.play) setPlay(a);
  if (!b.play) setPlay(b);

  if (a.playValue !== b.playValue) return b.playValue - a.playValue;

  let i = 0;
  while (a.cards[i].value === b.cards[i].value) {
    i++;
  }

  return b.cards[i].value - a.cards[i].value;
};

const hands = [];

require("fs")
  .readFileSync(`./07/aoc-7-${debug ? "test" : "run"}.txt`, "utf-8")
  .split("\n")
  .filter(Boolean)
  .forEach((line, index) => {
    const hand = {
      cards: [],
      play: "",
      playValue: 0,
      bid: 0,
      rank: 0,
      worth: 0,
    };

    const [cardSet, bid] = line.split(" ");

    for (const c of cardSet.trim()) {
      hand.cards.push(cards.find((card) => card.card === c));
    }

    setPlay(hand);
    hand.bid = Number(bid);

    hands.push(hand);
  });

hands
  .sort((a, b) => {
    if (a.playValue !== b.playValue) return b.playValue - a.playValue;

    return untie(a, b);
  })
  .forEach((h, i) => (h.rank = hands.length - i));

for (const h of hands) h.worth = h.bid * h.rank;

if (debug) {
  console.log("Hands");
  for (const h of hands) {
    console.log(
      `\t${h.rank} ${h.play} [${h.cards.map((c) => c.card).join(", ")}] ${
        h.bid
      } ${h.worth}`
    );
  }
}

console.log(hands.reduce((acc, h) => acc + h.worth, 0));
