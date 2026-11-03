// The "big" program: a leaderboard. Bug report: "the top 3 is wrong".
const players = [
  { name: 'An', score: 9 },
  { name: 'Binh', score: 100 },
  { name: 'Chi', score: 25 },
  { name: 'Dung', score: 8 },
];
function topThree(list) {
  const scores = list.map((p) => p.score);
  scores.sort();          // sort the scores…
  scores.reverse();       // …highest first
  return scores.slice(0, 3);
}
const best = topThree(players);
console.log('top 3 scores:', best);              // expected [100, 25, 9]
console.log('winner:', players.find((p) => p.score === best[0]).name);
