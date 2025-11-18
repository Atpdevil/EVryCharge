export function recommendBestCharger(chargers) {
  if (!chargers || chargers.length === 0) return null;

  return chargers
    .map((c) => {
      const distanceScore = c.distance > 0 ? (1 / c.distance) * 50 : 50;

      const statusScore =
        c.status === "Available" ? 30 : c.status === "Busy" ? 10 : -10;

      const fastScore = c.fast ? 10 : 0;

      const cheapScore = c.price <= 12 ? 10 : c.price <= 15 ? 5 : 0;

      return {
        ...c,
        score: distanceScore + statusScore + fastScore + cheapScore,
      };
    })
    .sort((a, b) => b.score - a.score)[0];
}
